import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Shield, BarChart3, Zap, Target, Radio } from "lucide-react";

const threatData = [
  { zone: "North Perimeter", level: 82, trend: "up", incidents: 3 },
  { zone: "East Wing", level: 45, trend: "down", incidents: 1 },
  { zone: "Parking Structure B", level: 91, trend: "up", incidents: 5 },
  { zone: "Main Lobby", level: 23, trend: "down", incidents: 0 },
  { zone: "Server Room", level: 67, trend: "up", incidents: 2 },
  { zone: "Rooftop Access", level: 78, trend: "up", incidents: 4 },
];

const ThreatBar = ({ level, animated }: { level: number; animated: boolean }) => {
  const color = level > 80 ? "bg-destructive" : level > 60 ? "bg-warning" : level > 40 ? "bg-primary" : "bg-success";
  return (
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: animated ? `${level}%` : "0%" }}
      />
    </div>
  );
};

const PredictiveEngine = () => {
  const [animated, setAnimated] = useState(false);
  const [prediction, setPrediction] = useState({ time: "02:00 - 03:00", zone: "Parking B", probability: 73 });

  useEffect(() => {
    setAnimated(true);
    const interval = setInterval(() => {
      setPrediction((prev) => ({
        ...prev,
        probability: Math.min(99, Math.max(60, prev.probability + Math.floor(Math.random() * 5 - 2))),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Threat heatmap */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-3 w-3 text-primary" /> THREAT LEVEL BY ZONE
            </span>
            <span className="font-mono text-[10px] text-primary animate-pulse-glow">● LIVE ANALYSIS</span>
          </div>
          <div className="p-4 space-y-4">
            {threatData.map((zone) => (
              <div key={zone.zone} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{zone.zone}</span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-muted-foreground">{zone.incidents} incidents</span>
                    <span className={`flex items-center gap-1 ${zone.level > 70 ? "text-destructive" : "text-muted-foreground"}`}>
                      {zone.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {zone.level}%
                    </span>
                  </div>
                </div>
                <ThreatBar level={zone.level} animated={animated} />
              </div>
            ))}
          </div>
        </div>

        {/* Prediction panel */}
        <div className="space-y-4">
          {/* Next predicted event */}
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="font-mono text-xs text-warning">NEXT PREDICTED EVENT</span>
            </div>
            <div className="text-3xl font-bold font-mono text-warning mb-1">{prediction.probability}%</div>
            <div className="text-sm text-muted-foreground mb-3">Probability of attempted tailgating</div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Window</span>
                <span>{prediction.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zone</span>
                <span>{prediction.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model</span>
                <span className="text-primary">GraphNet v3</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, label: "Protected", value: "14", sub: "sites" },
              { icon: Target, label: "Active", value: "6", sub: "threats" },
              { icon: Radio, label: "Agents", value: "3", sub: "online" },
              { icon: Zap, label: "Response", value: "8s", sub: "avg" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card/30 p-3 text-center">
                <stat.icon className="h-4 w-4 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold font-mono">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveEngine;
