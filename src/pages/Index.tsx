import { Shield, Eye, Brain, Radio, Server, Users, Lock, ChevronRight, Scan, Activity, MapPin, AlertTriangle, Search, Crosshair, Download, Calendar, Layers } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import GodsEyeTracker from "@/components/GodsEyeTracker";
import PredictiveEngine from "@/components/PredictiveEngine";
import OsintDashboard from "@/components/OsintDashboard";
import FaceRecognition from "@/components/FaceRecognition";
import LiveTracker from "@/components/LiveTracker";
import GlobalTrackingMap from "@/components/GlobalTrackingMap";
import { toast } from "sonner";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const handleDownloadSpec = () => {
  const specContent = `
NEXUS VEIL — SPEC SHEET
========================
Unified Threat Intelligence Platform
AI-Orchestrated Surveillance & Predictive Security

CORE MODULES
─────────────
1. God's Eye — Multi-feed surveillance fusion with live watch-list matching
2. Live GPS Tracker — Real-time device tracking via shareable links
3. Face Recognition — Biometric scanning with confidence scoring
4. OSINT Toolkit — Open-source intelligence for host/domain/email recon
5. Predictive Engine — Graph-based threat forecasting

ARCHITECTURE
─────────────
• Edge Layer: AI cameras, drones, IoT sensors, local watch-list cache
• Cloud Core: Predictive models, cross-site correlation, historical graph DB
• Command Center: Live heatmaps, alert triage, guard dispatch, audit trail

PERFORMANCE
─────────────
• Face Match Latency: < 10 seconds
• Edge Response Time: < 50ms
• Prediction Accuracy: 70%+
• Agent Pipeline: 3-Tier (Detection → Triage → Response)

COMPLIANCE
─────────────
• GDPR/CCPA-style frameworks
• Edge-level anonymization after 72h
• Multi-key approval for high-risk actions
• Full audit trail on every action

© ${new Date().getFullYear()} Nexus Veil — All rights reserved.
  `.trim();

  const blob = new Blob([specContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "NexusVeil_SpecSheet.txt";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Spec sheet downloaded!");
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
    <div className="container mx-auto flex h-14 items-center justify-between px-6">
      <div className="flex items-center gap-2.5">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-base font-bold tracking-wider uppercase">Nexus Veil</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">
        <button onClick={() => scrollTo("tracking-matrix")} className="hover:text-primary transition-colors">Matrix</button>
        <button onClick={() => scrollTo("live-tracker")} className="hover:text-primary transition-colors">Tracker</button>
        <button onClick={() => scrollTo("face-rec")} className="hover:text-primary transition-colors">Face Rec</button>
        <button onClick={() => scrollTo("osint")} className="hover:text-primary transition-colors">OSINT</button>
        <button onClick={() => scrollTo("architecture")} className="hover:text-primary transition-colors">Architecture</button>
      </div>
      <button
        onClick={() => scrollTo("live-tracker")}
        className="px-4 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        Launch
      </button>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-14">
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
    </div>
    <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono tracking-wider mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
        PSIM + AI FUSION PLATFORM
      </div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-5">
        <span className="text-glow text-primary">Nexus Veil</span>
        <br />
        <span className="text-foreground text-3xl md:text-4xl">Unified Threat Intelligence</span>
      </h1>
      <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
        AI-orchestrated surveillance, predictive risk mapping, and real-time GPS tracking — fused into one command layer.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => scrollTo("live-tracker")}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all box-glow flex items-center justify-center gap-2 text-sm"
        >
          Deploy Nexus Veil <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => scrollTo("architecture")}
          className="px-6 py-3 border border-border text-foreground font-semibold rounded-md hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Layers className="h-4 w-4" /> View Architecture
        </button>
      </div>
    </div>
    <div className="absolute inset-0 scanline pointer-events-none opacity-30" />
  </section>
);

const capabilities = [
  {
    icon: Eye,
    title: "Watch-List Matching",
    description: "Face, gait, and silhouette recognition across feeds. Edge-AI flagging in under 10 seconds.",
    stats: "<10s",
    statsLabel: "Match Latency",
  },
  {
    icon: Brain,
    title: "Predictive Risk Mapping",
    description: "Graph-based analytics on incidents and patrol logs. Forecasts intrusion windows and anomalies.",
    stats: "70%+",
    statsLabel: "Accuracy",
  },
  {
    icon: Radio,
    title: "Agentic Orchestration",
    description: "Detection, Triage, and Response agents run in the background. Executes only when authorized.",
    stats: "3-Tier",
    statsLabel: "Pipeline",
  },
  {
    icon: Server,
    title: "Edge-to-Cloud",
    description: "Edge AI handles low-latency decisions. Cloud core aggregates data for multi-site clients.",
    stats: "<50ms",
    statsLabel: "Edge Response",
  },
];

const CapabilitiesSection = () => (
  <section id="capabilities" className="py-20 relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">Core Capabilities</p>
        <h2 className="text-3xl md:text-4xl font-bold">Four Pillars of Protection</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {capabilities.map((cap, i) => (
          <div key={i} className="p-5 rounded-lg border border-border bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded bg-primary/10 border border-primary/20">
                <cap.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-primary">{cap.stats}</div>
                <div className="text-[10px] text-muted-foreground">{cap.statsLabel}</div>
              </div>
            </div>
            <h3 className="text-sm font-bold mb-1.5">{cap.title}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">{cap.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* Global Tracking Matrix — Interactive world map with live target nodes */
const TrackingMatrixSection = () => (
  <section id="tracking-matrix" className="py-20 border-t border-border relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">Global Tracking Matrix</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Real-Time Target Acquisition</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Zoom in and out on the world map to locate tracked targets. Each node represents a device being monitored in real-time.
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <GlobalTrackingMap />
      </div>
    </div>
  </section>
);

const GodsEyeSection = () => (
  <section id="gods-eye" className="py-20 border-t border-border relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">God's Eye Module</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Surveillance Fusion Interface</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Multi-feed surveillance with live watch-list matching, radar tracking, and camera orchestration.
        </p>
      </div>
      <div className="rounded-lg border border-border overflow-hidden box-glow max-w-5xl mx-auto">
        <GodsEyeTracker />
      </div>
    </div>
  </section>
);

const PredictiveSection = () => (
  <section className="py-20 border-t border-border relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">Predictive Intelligence</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Threat Prediction Engine</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Graph-based analytics forecast intrusion windows and behavioral anomalies before they happen.
        </p>
      </div>
      <PredictiveEngine />
    </div>
  </section>
);

/* Face Recognition Section */
const FaceRecSection = () => (
  <section id="face-rec" className="py-20 border-t border-border relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">Biometric Module</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Face Recognition</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Upload an image or use your camera for real-time face detection and identity scoring.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <FaceRecognition />
      </div>
    </div>
  </section>
);

const OsintSection = () => (
  <section id="osint" className="py-20 border-t border-border relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">Intelligence Toolkit</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">OSINT & Recon Tools</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Host discovery, domain analysis, email reconnaissance — all within one command layer.
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <OsintDashboard />
      </div>
    </div>
  </section>
);

const LiveTrackerSection = () => (
  <section id="live-tracker" className="py-20 border-t border-border relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">GPS Tracking Module</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Live Device Tracker</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Generate tracking links and send them to any device. See real-time location, speed, and movement history.
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <LiveTracker />
      </div>
    </div>
  </section>
);

const ArchitectureSection = () => (
  <section id="architecture" className="py-20 border-y border-border relative overflow-hidden">
    <div className="absolute inset-0 grid-pattern opacity-15" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">System Architecture</p>
        <h2 className="text-3xl md:text-4xl font-bold">Edge → Cloud → Command</h2>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          {
            layer: "01",
            title: "Edge Layer",
            subtitle: "On-Device Intelligence",
            items: ["AI cameras & drones", "Access controllers", "IoT sensors", "Local watch-list cache"],
          },
          {
            layer: "02",
            title: "Cloud Core",
            subtitle: "Aggregation & Analytics",
            items: ["Predictive models", "Cross-site correlation", "Watch-list hub", "Historical graph DB"],
          },
          {
            layer: "03",
            title: "Command Center",
            subtitle: "Human-in-the-Loop",
            items: ["Live heatmaps", "Alert triage dashboard", "Guard mobile dispatch", "Compliance audit trail"],
          },
        ].map((tier, i) => (
          <div key={i} className="relative group">
            <div className="p-6 rounded-lg border border-border bg-card/30 backdrop-blur-sm h-full hover:border-primary/30 transition-all">
              <div className="font-mono text-primary/30 text-5xl font-black mb-3">{tier.layer}</div>
              <h3 className="text-lg font-bold mb-1">{tier.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{tier.subtitle}</p>
              <ul className="space-y-2">
                {tier.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {i < 2 && (
              <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ChevronRight className="h-5 w-5 text-primary/30" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20 relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6 text-center max-w-2xl">
      <Shield className="h-10 w-10 text-primary mx-auto mb-5 text-glow" />
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Deploy?</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
        Whether you're securing campuses, critical infrastructure, or high-net-worth residences — Nexus Veil adapts.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => scrollTo("live-tracker")}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all box-glow flex items-center justify-center gap-2 text-sm"
        >
          <Calendar className="h-4 w-4" /> Schedule a Pilot
        </button>
        <button
          onClick={handleDownloadSpec}
          className="px-6 py-3 border border-border text-foreground font-semibold rounded-md hover:border-primary/50 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Download className="h-4 w-4" /> Download Spec Sheet
        </button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold tracking-wider uppercase">Nexus Veil</span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Nexus Veil — AI-Orchestrated Protection. All rights reserved.
      </p>
    </div>
  </footer>
);

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <CapabilitiesSection />
    <TrackingMatrixSection />
    <LiveTrackerSection />
    <GodsEyeSection />
    <PredictiveSection />
    <FaceRecSection />
    <OsintSection />
    <ArchitectureSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
