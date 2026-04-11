import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Plus, Copy, Trash2, Radio, Clock, Navigation, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface TrackingSession {
  id: string;
  session_code: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface LocationPing {
  id: string;
  session_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  created_at: string;
}

const LiveTracker = () => {
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [pings, setPings] = useState<LocationPing[]>([]);
  const [newName, setNewName] = useState("Target");
  const [loading, setLoading] = useState(true);

  const baseUrl = window.location.origin;

  const fetchSessions = useCallback(async () => {
    const { data } = await supabase
      .from("tracking_sessions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSessions(data);
    setLoading(false);
  }, []);

  const fetchPings = useCallback(async (sessionId: string) => {
    const { data } = await supabase
      .from("location_pings")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setPings(data);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (!selectedSession) return;
    fetchPings(selectedSession);

    const channel = supabase
      .channel(`pings-${selectedSession}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "location_pings", filter: `session_id=eq.${selectedSession}` },
        (payload) => {
          setPings((prev) => [payload.new as LocationPing, ...prev].slice(0, 100));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedSession, fetchPings]);

  const createSession = async () => {
    const { data, error } = await supabase
      .from("tracking_sessions")
      .insert({ name: newName || "Target" })
      .select()
      .single();
    if (error) { toast.error("Failed to create session"); return; }
    setSessions((prev) => [data, ...prev]);
    setSelectedSession(data.id);
    toast.success("Tracking session created!");
    setNewName("Target");
  };

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`${baseUrl}/track/${code}`);
    toast.success("Tracking link copied to clipboard!");
  };

  const deleteSession = async (id: string) => {
    await supabase.from("tracking_sessions").delete().eq("id", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (selectedSession === id) { setSelectedSession(null); setPings([]); }
    toast.success("Session deleted");
  };

  const selectedData = sessions.find((s) => s.id === selectedSession);
  const latestPing = pings[0];

  return (
    <div className="space-y-6">
      {/* Create new session */}
      <div className="flex gap-3">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Target name..."
          className="bg-background/50 border-border"
        />
        <button
          onClick={createSession}
          className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> New Session
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sessions list */}
        <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-muted-foreground text-sm text-center py-8">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No tracking sessions yet. Create one above.</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSession(s.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSession === s.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card/30 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm truncate">{s.name}</span>
                  <div className="flex items-center gap-1">
                    {s.is_active && (
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-muted-foreground font-mono">{s.session_code}</code>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyLink(s.session_code); }}
                    className="p-1 hover:text-primary transition-colors"
                    title="Copy tracking link"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                    className="p-1 hover:text-destructive transition-colors ml-auto"
                    title="Delete session"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map / Location display */}
        <div className="lg:col-span-2">
          {!selectedSession ? (
            <div className="h-[500px] rounded-lg border border-border bg-card/20 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Select a session to view live tracking</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Session info bar */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/30">
                <div>
                  <h3 className="font-bold">{selectedData?.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">Session: {selectedData?.session_code}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyLink(selectedData?.session_code || "")}
                    className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="h-3 w-3" /> Copy Link
                  </button>
                  {latestPing && (
                    <a
                      href={`https://www.google.com/maps?q=${latestPing.latitude},${latestPing.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="h-3 w-3" /> Open in Maps
                    </a>
                  )}
                </div>
              </div>

              {/* Live map embed */}
              {latestPing ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <iframe
                    title="Live Location"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${latestPing.longitude - 0.005},${latestPing.latitude - 0.005},${latestPing.longitude + 0.005},${latestPing.latitude + 0.005}&layer=mapnik&marker=${latestPing.latitude},${latestPing.longitude}`}
                  />
                </div>
              ) : (
                <div className="h-[350px] rounded-lg border border-border bg-card/20 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Radio className="h-8 w-8 mx-auto mb-3 animate-pulse opacity-50" />
                    <p className="text-sm">Waiting for location data...</p>
                    <p className="text-xs mt-1">Send the tracking link to start receiving pings</p>
                  </div>
                </div>
              )}

              {/* Recent pings */}
              <div className="rounded-lg border border-border bg-card/30 p-4">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Location History ({pings.length} pings)
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {pings.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No location pings yet.</p>
                  ) : (
                    pings.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2">
                          <Navigation className="h-3 w-3 text-primary" />
                          <span className="font-mono">
                            {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          {p.speed !== null && <span>{(p.speed * 3.6).toFixed(1)} km/h</span>}
                          {p.accuracy !== null && <span>±{p.accuracy.toFixed(0)}m</span>}
                          <span>{new Date(p.created_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTracker;
