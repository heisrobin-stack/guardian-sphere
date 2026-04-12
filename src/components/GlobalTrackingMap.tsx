import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";

interface TrackedTarget {
  id: string;
  name: string;
  session_code: string;
  is_active: boolean;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  last_seen: string;
}

const MapController = ({ targets }: { targets: TrackedTarget[] }) => {
  const map = useMap();
  useEffect(() => {
    if (targets.length > 0) {
      const bounds = targets.map((t) => [t.latitude, t.longitude] as [number, number]);
      if (bounds.length === 1) {
        map.setView(bounds[0], 10);
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    }
  }, [targets, map]);
  return null;
};

const GlobalTrackingMap = () => {
  const [targets, setTargets] = useState<TrackedTarget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTargets = async () => {
    // Get all active sessions with their latest ping
    const { data: sessions } = await supabase
      .from("tracking_sessions")
      .select("id, name, session_code, is_active");

    if (!sessions || sessions.length === 0) {
      setLoading(false);
      return;
    }

    const tracked: TrackedTarget[] = [];

    for (const session of sessions) {
      const { data: ping } = await supabase
        .from("location_pings")
        .select("latitude, longitude, accuracy, speed, created_at")
        .eq("session_id", session.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ping) {
        tracked.push({
          id: session.id,
          name: session.name,
          session_code: session.session_code,
          is_active: session.is_active,
          latitude: ping.latitude,
          longitude: ping.longitude,
          accuracy: ping.accuracy,
          speed: ping.speed,
          last_seen: ping.created_at,
        });
      }
    }

    setTargets(tracked);
    setLoading(false);
  };

  useEffect(() => {
    fetchTargets();

    // Subscribe to new pings for real-time updates
    const channel = supabase
      .channel("global-pings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "location_pings" },
        (payload) => {
          const p = payload.new as any;
          setTargets((prev) => {
            const idx = prev.findIndex((t) => t.id === p.session_id);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = {
                ...updated[idx],
                latitude: p.latitude,
                longitude: p.longitude,
                accuracy: p.accuracy,
                speed: p.speed,
                last_seen: p.created_at,
              };
              return updated;
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeCount = useMemo(() => targets.filter((t) => t.is_active).length, [targets]);

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {activeCount} ACTIVE {activeCount === 1 ? "TARGET" : "TARGETS"}
          </span>
          <span className="text-muted-foreground">
            {targets.length} TOTAL TRACKED
          </span>
        </div>
        <button
          onClick={fetchTargets}
          className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
        >
          REFRESH
        </button>
      </div>

      {/* Map */}
      <div className="rounded-lg border border-border overflow-hidden relative" style={{ height: 450 }}>
        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80">
            <span className="text-sm text-muted-foreground animate-pulse font-mono">LOADING GRID...</span>
          </div>
        )}
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%", background: "hsl(220 20% 7%)" }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {targets.length > 0 && <MapController targets={targets} />}
          {targets.map((t) => (
            <CircleMarker
              key={t.id}
              center={[t.latitude, t.longitude]}
              radius={t.is_active ? 8 : 5}
              pathOptions={{
                color: t.is_active ? "hsl(185 80% 50%)" : "hsl(215 15% 55%)",
                fillColor: t.is_active ? "hsl(185 80% 50%)" : "hsl(215 15% 55%)",
                fillOpacity: t.is_active ? 0.6 : 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-xs space-y-1 min-w-[140px]" style={{ color: "#ddd", background: "transparent" }}>
                  <div className="font-bold text-sm" style={{ color: "hsl(185,80%,50%)" }}>{t.name}</div>
                  <div>Code: <span className="font-mono">{t.session_code}</span></div>
                  <div>Status: {t.is_active ? "🟢 Active" : "⚪ Inactive"}</div>
                  <div>Coords: {t.latitude.toFixed(4)}, {t.longitude.toFixed(4)}</div>
                  {t.speed !== null && <div>Speed: {(t.speed * 3.6).toFixed(1)} km/h</div>}
                  <div>Last seen: {new Date(t.last_seen).toLocaleTimeString()}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Overlay corners for tactical look */}
        <div className="absolute top-2 left-2 z-[500] pointer-events-none">
          <div className="w-4 h-4 border-t-2 border-l-2 border-primary/50" />
        </div>
        <div className="absolute top-2 right-2 z-[500] pointer-events-none">
          <div className="w-4 h-4 border-t-2 border-r-2 border-primary/50" />
        </div>
        <div className="absolute bottom-2 left-2 z-[500] pointer-events-none">
          <div className="w-4 h-4 border-b-2 border-l-2 border-primary/50" />
        </div>
        <div className="absolute bottom-2 right-2 z-[500] pointer-events-none">
          <div className="w-4 h-4 border-b-2 border-r-2 border-primary/50" />
        </div>
      </div>
    </div>
  );
};

export default GlobalTrackingMap;
