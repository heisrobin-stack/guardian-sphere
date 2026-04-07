import { useState, useEffect } from "react";
import { Crosshair, Signal, Wifi, MapPin, Users, Clock, Fingerprint, ScanLine } from "lucide-react";

const targets = [
  { id: "TGT-001", name: "Subject Alpha", status: "TRACKING", confidence: 94, location: "Sector 7-G", lastSeen: "2s ago" },
  { id: "TGT-002", name: "Subject Bravo", status: "IDENTIFIED", confidence: 87, location: "Sector 3-A", lastSeen: "14s ago" },
  { id: "TGT-003", name: "Subject Charlie", status: "LOST", confidence: 62, location: "Last: Sector 9-D", lastSeen: "4m ago" },
  { id: "TGT-004", name: "Subject Delta", status: "TRACKING", confidence: 91, location: "Sector 1-B", lastSeen: "1s ago" },
];

const feeds = [
  { id: "CAM-017", location: "North Gate", type: "PTZ", status: "LIVE" },
  { id: "CAM-042", location: "Parking B", type: "Fixed", status: "LIVE" },
  { id: "DRN-003", location: "Perimeter E", type: "Drone", status: "LIVE" },
  { id: "CAM-091", location: "Lobby Main", type: "Fisheye", status: "RECORDING" },
];

const StatusDot = ({ status }: { status: string }) => {
  const color = status === "TRACKING" ? "bg-primary" : status === "IDENTIFIED" ? "bg-warning" : "bg-destructive";
  return (
    <span className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
    </span>
  );
};

const GodsEyeTracker = () => {
  const [activeTarget, setActiveTarget] = useState(0);
  const [scanAngle, setScanAngle] = useState(0);
  const [systemTime, setSystemTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle((prev) => (prev + 1) % 360);
      setSystemTime(new Date().toISOString().replace("T", " ").slice(0, 19));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTarget((prev) => (prev + 1) % targets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* System status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Signal className="h-3 w-3 text-primary" />
            NEXUS VEIL v4.2.1
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi className="h-3 w-3 text-success" />
            ALL NODES ONLINE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>{systemTime} UTC</span>
          <span className="text-primary">■ GOD'S EYE ACTIVE</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Main tracking display */}
        <div className="lg:col-span-2 relative aspect-[16/9] bg-card/30 border-r border-border overflow-hidden">
          {/* Radar sweep */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Concentric circles */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-primary/10"
                  style={{
                    width: `${i * 25}%`,
                    height: `${i * 25}%`,
                    top: `${50 - i * 12.5}%`,
                    left: `${50 - i * 12.5}%`,
                  }}
                />
              ))}
              {/* Crosshairs */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-primary/10" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-primary/10" />
              {/* Sweep line */}
              <div
                className="absolute top-1/2 left-1/2 h-px w-1/2 origin-left bg-gradient-to-r from-primary/60 to-transparent"
                style={{ transform: `rotate(${scanAngle}deg)` }}
              />
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary animate-pulse-glow" />
              
              {/* Target blips */}
              {targets.map((t, i) => {
                const angle = (i * 90 + 30) * (Math.PI / 180);
                const radius = 30 + i * 15;
                const x = 50 + Math.cos(angle) * radius;
                const y = 50 + Math.sin(angle) * radius;
                return (
                  <div
                    key={t.id}
                    className={`absolute w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeTarget ? "bg-primary scale-150 box-glow" : "bg-primary/50"
                    }`}
                    style={{ top: `${y}%`, left: `${x}%`, transform: "translate(-50%, -50%)" }}
                  />
                );
              })}
            </div>
          </div>

          {/* Overlay info */}
          <div className="absolute top-4 left-4 font-mono text-xs space-y-1">
            <div className="text-primary flex items-center gap-1.5">
              <Crosshair className="h-3 w-3" /> GLOBAL TRACKING MATRIX
            </div>
            <div className="text-muted-foreground">Active Targets: {targets.filter(t => t.status === "TRACKING").length}</div>
            <div className="text-muted-foreground">Scan Radius: 2.4km</div>
          </div>

          {/* Active target card */}
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded border border-primary/30 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary/10 border border-primary/20">
                  <ScanLine className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-xs text-primary">{targets[activeTarget].id}</div>
                  <div className="text-sm font-semibold">{targets[activeTarget].name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <StatusDot status={targets[activeTarget].status} />
                  <span className="font-mono text-xs text-primary">{targets[activeTarget].status}</span>
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  Confidence: {targets[activeTarget].confidence}%
                </div>
              </div>
            </div>
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        </div>

        {/* Right panel */}
        <div className="flex flex-col">
          {/* Target list */}
          <div className="border-b border-border">
            <div className="px-4 py-2 border-b border-border bg-card/50">
              <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3 w-3" /> WATCH LIST — {targets.length} SUBJECTS
              </span>
            </div>
            <div className="divide-y divide-border">
              {targets.map((t, i) => (
                <div
                  key={t.id}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    i === activeTarget ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-card/50 border-l-2 border-l-transparent"
                  }`}
                  onClick={() => setActiveTarget(i)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                    <div className="flex items-center gap-1.5">
                      <StatusDot status={t.status} />
                      <span className="font-mono text-[10px]">{t.status}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" /> {t.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {t.lastSeen}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera feeds */}
          <div>
            <div className="px-4 py-2 border-b border-border bg-card/50">
              <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                <Fingerprint className="h-3 w-3" /> LIVE FEEDS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              {feeds.map((f) => (
                <div key={f.id} className="bg-card/30 p-3 relative group">
                  <div className="aspect-video bg-background/50 rounded-sm mb-2 flex items-center justify-center overflow-hidden relative">
                    <div className="grid-pattern opacity-20 absolute inset-0" />
                    <span className="font-mono text-[9px] text-muted-foreground">{f.type.toUpperCase()}</span>
                    <div className="absolute top-1 right-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive animate-pulse" />
                      <span className="font-mono text-[8px] text-destructive">{f.status}</span>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">{f.id}</div>
                  <div className="text-[11px]">{f.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GodsEyeTracker;
