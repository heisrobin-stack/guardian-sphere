import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, MapPin, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

const Track = () => {
  const { code } = useParams<{ code: string }>();
  const [status, setStatus] = useState<"loading" | "requesting" | "tracking" | "error" | "inactive">("loading");
  const [error, setError] = useState("");
  const [pingCount, setPingCount] = useState(0);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setError("No tracking code provided.");
      return;
    }

    // Look up session
    const init = async () => {
      const { data, error: fetchErr } = await supabase
        .from("tracking_sessions")
        .select("id, is_active, name")
        .eq("session_code", code)
        .maybeSingle();

      if (fetchErr || !data) {
        setStatus("error");
        setError("Invalid tracking link.");
        return;
      }

      if (!data.is_active) {
        setStatus("inactive");
        return;
      }

      sessionIdRef.current = data.id;
      setStatus("requesting");
      requestLocation();
    };

    init();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [code]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported by this browser.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        setStatus("tracking");
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        setLastCoords({ lat: latitude, lng: longitude });

        await supabase.from("location_pings").insert({
          session_id: sessionIdRef.current!,
          latitude,
          longitude,
          accuracy,
          speed,
          heading,
          user_agent: navigator.userAgent,
        });

        setPingCount((c) => c + 1);
      },
      (err) => {
        setStatus("error");
        setError(
          err.code === 1
            ? "Location permission denied. Please allow location access."
            : `Geolocation error: ${err.message}`
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-wider uppercase">Nexus Veil</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">SECURE LOCATION SERVICE</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-8">
          {status === "loading" && (
            <div className="text-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Connecting to session...</p>
            </div>
          )}

          {status === "requesting" && (
            <div className="text-center">
              <MapPin className="h-10 w-10 text-primary animate-pulse mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-2">Location Access Required</p>
              <p className="text-sm text-muted-foreground">
                Please allow location access when prompted by your browser.
              </p>
            </div>
          )}

          {status === "tracking" && (
            <div className="text-center">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-2">Location Sharing Active</p>
              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-sm border-b border-border pb-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-500 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="flex justify-between text-sm border-b border-border pb-2">
                  <span className="text-muted-foreground">Pings Sent</span>
                  <span className="font-mono text-foreground">{pingCount}</span>
                </div>
                {lastCoords && (
                  <div className="flex justify-between text-sm border-b border-border pb-2">
                    <span className="text-muted-foreground">Last Position</span>
                    <span className="font-mono text-xs text-foreground">
                      {lastCoords.lat.toFixed(5)}, {lastCoords.lng.toFixed(5)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Your location is being shared securely. Close this tab to stop.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-2">Error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {status === "inactive" && (
            <div className="text-center">
              <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <p className="text-foreground font-semibold mb-2">Session Inactive</p>
              <p className="text-sm text-muted-foreground">This tracking session has been deactivated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;
