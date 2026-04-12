import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
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

interface LatestPing {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  created_at: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getThemeColor = (variableName: string, fallback: string) => {
  if (typeof window === "undefined") return fallback;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  return value ? `hsl(${value})` : fallback;
};

const createPopupContent = (target: TrackedTarget, primaryColor: string) => {
  const speedMarkup =
    target.speed !== null
      ? `<div>Speed: ${(target.speed * 3.6).toFixed(1)} km/h</div>`
      : "";

  return `
    <div style="min-width: 156px; font-size: 12px; line-height: 1.5; color: hsl(200 20% 92%);">
      <div style="font-weight: 700; font-size: 14px; color: ${primaryColor}; margin-bottom: 4px;">
        ${escapeHtml(target.name)}
      </div>
      <div>Code: <span style="font-family: monospace;">${escapeHtml(target.session_code)}</span></div>
      <div>Status: ${target.is_active ? "🟢 Active" : "⚪ Inactive"}</div>
      <div>Coords: ${target.latitude.toFixed(4)}, ${target.longitude.toFixed(4)}</div>
      ${speedMarkup}
      <div>Last seen: ${new Date(target.last_seen).toLocaleTimeString()}</div>
    </div>
  `;
};

const GlobalTrackingMap = () => {
  const [targets, setTargets] = useState<TrackedTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const fetchTargets = useCallback(async () => {
    setLoading(true);

    const { data: sessions } = await supabase
      .from("tracking_sessions")
      .select("id, name, session_code, is_active");

    if (!sessions?.length) {
      setTargets([]);
      setLoading(false);
      return;
    }

    const latestPings = await Promise.all(
      sessions.map(async (session) => {
        const { data: ping } = await supabase
          .from("location_pings")
          .select("latitude, longitude, accuracy, speed, created_at")
          .eq("session_id", session.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle<LatestPing>();

        return ping
          ? {
              id: session.id,
              name: session.name,
              session_code: session.session_code,
              is_active: session.is_active,
              latitude: ping.latitude,
              longitude: ping.longitude,
              accuracy: ping.accuracy,
              speed: ping.speed,
              last_seen: ping.created_at,
            }
          : null;
      })
    );

    setTargets(latestPings.filter((target): target is TrackedTarget => Boolean(target)));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: true,
      zoomControl: true,
    }).setView([20, 0], 2);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      markerLayerRef.current?.clearLayers();
      markerLayerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    fetchTargets();

    const channel = supabase
      .channel("global-pings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "location_pings" },
        (payload) => {
          const ping = payload.new as {
            session_id: string;
            latitude: number;
            longitude: number;
            accuracy: number | null;
            speed: number | null;
            created_at: string;
          };

          let didUpdateExistingTarget = false;

          setTargets((previousTargets) => {
            const nextTargets = previousTargets.map((target) => {
              if (target.id !== ping.session_id) return target;
              didUpdateExistingTarget = true;
              return {
                ...target,
                latitude: ping.latitude,
                longitude: ping.longitude,
                accuracy: ping.accuracy,
                speed: ping.speed,
                last_seen: ping.created_at,
              };
            });

            return nextTargets;
          });

          if (!didUpdateExistingTarget) {
            void fetchTargets();
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchTargets]);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!map || !markerLayer) return;

    const primaryColor = getThemeColor("--primary", "hsl(185 80% 50%)");
    const mutedColor = getThemeColor("--muted-foreground", "hsl(215 15% 55%)");

    markerLayer.clearLayers();

    targets.forEach((target) => {
      const marker = L.circleMarker([target.latitude, target.longitude], {
        color: target.is_active ? primaryColor : mutedColor,
        fillColor: target.is_active ? primaryColor : mutedColor,
        fillOpacity: target.is_active ? 0.55 : 0.28,
        radius: target.is_active ? 8 : 5,
        weight: 2,
      });

      marker.bindPopup(createPopupContent(target, primaryColor), {
        autoPan: true,
        closeButton: true,
      });

      marker.addTo(markerLayer);
    });

    if (targets.length === 1) {
      map.setView([targets[0].latitude, targets[0].longitude], 10);
    } else if (targets.length > 1) {
      const bounds = L.latLngBounds(
        targets.map((target) => [target.latitude, target.longitude] as [number, number])
      );

      if (bounds.isValid()) {
        map.fitBounds(bounds, { maxZoom: 12, padding: [48, 48] });
      }
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [targets]);

  const activeCount = useMemo(
    () => targets.filter((target) => target.is_active).length,
    [targets]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {activeCount} ACTIVE {activeCount === 1 ? "TARGET" : "TARGETS"}
          </span>
          <span className="text-muted-foreground">{targets.length} TOTAL TRACKED</span>
        </div>
        <button
          onClick={() => void fetchTargets()}
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          REFRESH
        </button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-border h-[450px]">
        <div ref={mapContainerRef} className="h-full w-full bg-background" />

        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80">
            <span className="font-mono text-sm text-muted-foreground animate-pulse">
              LOADING GRID...
            </span>
          </div>
        )}

        {!loading && targets.length === 0 && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="text-center">
              <p className="font-mono text-sm text-muted-foreground">NO LIVE TARGETS YET</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Create a tracking session and open the link on a device to populate the map.
              </p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute left-2 top-2 z-[500]">
          <div className="h-4 w-4 border-l-2 border-t-2 border-primary/50" />
        </div>
        <div className="pointer-events-none absolute right-2 top-2 z-[500]">
          <div className="h-4 w-4 border-r-2 border-t-2 border-primary/50" />
        </div>
        <div className="pointer-events-none absolute bottom-2 left-2 z-[500]">
          <div className="h-4 w-4 border-b-2 border-l-2 border-primary/50" />
        </div>
        <div className="pointer-events-none absolute bottom-2 right-2 z-[500]">
          <div className="h-4 w-4 border-b-2 border-r-2 border-primary/50" />
        </div>
      </div>
    </div>
  );
};

export default GlobalTrackingMap;
