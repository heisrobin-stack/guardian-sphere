import { Shield, Eye, Brain, Radio, Server, Users, Lock, ChevronRight, Scan, Activity, MapPin, AlertTriangle, Search } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import godsEyeMap from "@/assets/gods-eye-map.jpg";
import GodsEyeTracker from "@/components/GodsEyeTracker";
import PredictiveEngine from "@/components/PredictiveEngine";
import OsintDashboard from "@/components/OsintDashboard";
import FaceRecognition from "@/components/FaceRecognition";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
    <div className="container mx-auto flex h-16 items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Shield className="h-7 w-7 text-primary" />
          <div className="absolute inset-0 blur-sm bg-primary/30 rounded-full" />
        </div>
        <span className="text-lg font-bold tracking-wider uppercase">Nexus Veil</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#capabilities" className="hover:text-primary transition-colors">Capabilities</a>
        <a href="#gods-eye" className="hover:text-primary transition-colors">God's Eye</a>
        <a href="#osint" className="hover:text-primary transition-colors">OSINT Tools</a>
        <a href="#architecture" className="hover:text-primary transition-colors">Architecture</a>
      </div>
      <button className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
        Request Demo
      </button>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
    </div>
    <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
      <div className="animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono tracking-wider mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
          NEXT-GEN PSIM + AI FUSION
        </div>
      </div>
      <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-up-delay-1">
        <span className="text-glow text-primary">Nexus Veil</span>
        <br />
        <span className="text-foreground">Unified Threat</span>
        <br />
        <span className="text-muted-foreground">Intelligence Platform</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up-delay-2 leading-relaxed">
        AI-orchestrated surveillance, predictive risk mapping, and agentic response — 
        fused into a single command layer for private security operations.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
        <button className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all box-glow flex items-center justify-center gap-2">
          Deploy Nexus Veil <ChevronRight className="h-4 w-4" />
        </button>
        <button className="px-8 py-3.5 border border-border text-foreground font-semibold rounded-md hover:border-primary/50 hover:bg-primary/5 transition-all">
          View Architecture
        </button>
      </div>
    </div>
    {/* Scanline effect */}
    <div className="absolute inset-0 scanline pointer-events-none opacity-50" />
  </section>
);

const capabilities = [
  {
    icon: Eye,
    title: "Multi-Modal Watch-List Matching",
    description: "Face, gait, and silhouette recognition across CCTV, bodycams, and drone feeds. Device and badge correlation with edge-AI flagging in under 10 seconds.",
    stats: "<10s",
    statsLabel: "Match Latency",
  },
  {
    icon: Brain,
    title: "Predictive Risk & Hotspot Mapping",
    description: "Graph-based analytics on historical incidents, patrol logs, and access patterns. Forecasts intrusion windows, weak-zone exposure, and behavioral anomalies.",
    stats: "70%+",
    statsLabel: "Prediction Accuracy",
  },
  {
    icon: Radio,
    title: "Agentic Orchestration",
    description: "Detection, Triage, and Response agents run in the background while humans stay in the loop. Prepares camera presets, door-lock sequences, and guard-routing — executes only when authorized.",
    stats: "3-Tier",
    statsLabel: "Agent Pipeline",
  },
  {
    icon: Server,
    title: "Edge-to-Cloud Architecture",
    description: "Edge AI on cameras, drones, and access controllers handles low-latency decisions. Cloud core aggregates data and maintains a centralized watch-list hub for multi-site clients.",
    stats: "< 50ms",
    statsLabel: "Edge Response",
  },
];

const CapabilitiesSection = () => (
  <section id="capabilities" className="py-28 relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">Core Capabilities</p>
        <h2 className="text-4xl md:text-5xl font-bold">Four Pillars of Protection</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {capabilities.map((cap, i) => (
          <div key={i} className="group p-8 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-glow transition-all duration-300 hover:border-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="relative">
              <div className="flex items-start justify-between mb-5">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <cap.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-primary">{cap.stats}</div>
                  <div className="text-xs text-muted-foreground">{cap.statsLabel}</div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{cap.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ArchitectureSection = () => (
  <section id="architecture" className="py-28 border-y border-border relative overflow-hidden">
    <div className="absolute inset-0 grid-pattern opacity-20" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">System Architecture</p>
        <h2 className="text-4xl md:text-5xl font-bold">Edge → Cloud → Command</h2>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          {
            layer: "01",
            title: "Edge Layer",
            subtitle: "On-Device Intelligence",
            items: ["AI cameras & drones", "Access controllers", "IoT sensors", "Local watch-list cache"],
            color: "primary",
          },
          {
            layer: "02",
            title: "Cloud Core",
            subtitle: "Aggregation & Analytics",
            items: ["Predictive models", "Cross-site correlation", "Watch-list hub", "Historical graph DB"],
            color: "primary",
          },
          {
            layer: "03",
            title: "Command Center",
            subtitle: "Human-in-the-Loop",
            items: ["Live heatmaps", "Alert triage dashboard", "Guard mobile dispatch", "Compliance audit trail"],
            color: "primary",
          },
        ].map((tier, i) => (
          <div key={i} className="relative group">
            <div className="p-8 rounded-lg border border-border bg-card/30 backdrop-blur-sm h-full hover:border-primary/30 transition-all">
              <div className="font-mono text-primary/40 text-6xl font-black mb-4">{tier.layer}</div>
              <h3 className="text-xl font-bold mb-1">{tier.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{tier.subtitle}</p>
              <ul className="space-y-3">
                {tier.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {i < 2 && (
              <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ChevronRight className="h-6 w-6 text-primary/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const deploymentFeatures = [
  { icon: Scan, title: "Perimeter & Access Control", description: "AI cameras at gates, parking lots, and rooftops with watch-list integration." },
  { icon: Activity, title: "Command Center Dashboard", description: "Live heatmaps, centralized search, and policy-driven alert tiers." },
  { icon: MapPin, title: "Dynamic Patrol Routing", description: "Guards receive mobile alerts with recommended routes adjusted in real-time." },
  { icon: Users, title: "Accept / Escalate Workflows", description: "Simple human-in-the-loop actions replace raw AI autonomy." },
  { icon: Lock, title: "Privacy Guardrails", description: "Edge anonymization, 72h face-blur, multi-key approval, and full audit logs." },
  { icon: AlertTriangle, title: "Tiered Response Protocols", description: "From remote monitor alerts to onsite guard dispatch — policy-compliant and traceable." },
];

const DeploymentSection = () => (
  <section id="deployment" className="py-28 relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">Deployment</p>
        <h2 className="text-4xl md:text-5xl font-bold">How Agencies Deploy It</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {deploymentFeatures.map((feat, i) => (
          <div key={i} className="p-6 rounded-lg border border-border bg-card/30 hover:border-primary/20 transition-all group">
            <feat.icon className="h-5 w-5 text-primary mb-4" />
            <h3 className="font-semibold mb-2 text-sm">{feat.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ComplianceSection = () => (
  <section id="compliance" className="py-28 border-t border-border">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">Compliance</p>
      <h2 className="text-4xl md:text-5xl font-bold mb-6">Built Within Legal Boundaries</h2>
      <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
        Nexus Veil operates inside GDPR/CCPA-style frameworks with consent-based and perimeter-only tracking. 
        Every action is logged, auditable, and policy-governed.
      </p>
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { label: "Data Anonymization", detail: "Edge-level face redaction after 72h" },
          { label: "Multi-Key Approval", detail: "High-risk actions require dual authorization" },
          { label: "Full Audit Trail", detail: "Every detection, alert, and response is logged" },
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-lg border border-border bg-card/30">
            <div className="text-sm font-semibold text-primary mb-2">{item.label}</div>
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-28 relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="absolute inset-0 grid-pattern opacity-10" />
    <div className="relative container mx-auto px-6 text-center max-w-3xl">
      <Shield className="h-12 w-12 text-primary mx-auto mb-6 text-glow" />
      <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Deploy Your Veil?</h2>
      <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
        Whether you're securing corporate campuses, critical infrastructure, or high-net-worth residences — 
        Nexus Veil adapts to your operational profile.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all box-glow flex items-center justify-center gap-2">
          Schedule a Pilot <ChevronRight className="h-4 w-4" />
        </button>
        <button className="px-8 py-3.5 border border-border text-foreground font-semibold rounded-md hover:border-primary/50 transition-all">
          Download Spec Sheet
        </button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <span className="text-sm font-bold tracking-wider uppercase">Nexus Veil</span>
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nexus Veil — AI-Orchestrated Protection Layer. All rights reserved.
      </p>
    </div>
  </footer>
);

const GodsEyeSection = () => (
  <section id="gods-eye" className="py-28 border-t border-border relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">God's Eye Module</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Real-Time Target Acquisition</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Multi-feed surveillance fusion with live watch-list matching, radar tracking, and camera orchestration — 
          inspired by next-gen threat intelligence systems.
        </p>
      </div>
      
      {/* Global map */}
      <div className="relative rounded-lg overflow-hidden border border-border mb-8">
        <img src={godsEyeMap} alt="Global surveillance network" className="w-full opacity-60" loading="lazy" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        <div className="absolute bottom-6 left-6 font-mono text-xs text-primary">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            196 ACTIVE NODES
          </div>
          <div className="text-muted-foreground">Global Coverage • 14 Countries • 38 Sites</div>
        </div>
      </div>

      {/* Tracker interface */}
      <div className="rounded-lg border border-border overflow-hidden box-glow">
        <GodsEyeTracker />
      </div>
    </div>
  </section>
);

const PredictiveSection = () => (
  <section className="py-28 border-t border-border relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">Predictive Intelligence</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Threat Prediction Engine</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Graph-based analytics forecast intrusion windows and behavioral anomalies before they happen.
        </p>
      </div>
      <PredictiveEngine />
    </div>
  </section>
);

const OsintSection = () => (
  <section id="osint" className="py-28 border-t border-border relative">
    <div className="absolute inset-0 gradient-mesh" />
    <div className="relative container mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">Intelligence Toolkit</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">OSINT & Recon Tools</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Integrated open-source intelligence tools for host discovery, domain analysis, 
          email reconnaissance, and anonymous operations — all within one command layer.
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <OsintDashboard />
      </div>
    </div>
  </section>
);

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <CapabilitiesSection />
    <GodsEyeSection />
    <PredictiveSection />
    <OsintSection />
    <ArchitectureSection />
    <DeploymentSection />
    <ComplianceSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
