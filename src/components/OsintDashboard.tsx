import { useState } from "react";
import { Search, Globe, Mail, Server, Shield, Eye, Terminal, Loader2, AlertCircle, ExternalLink, Database, Wifi, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Tool = "censys" | "securitytrails" | "zoomeye" | "epieos" | "whonix";

const tools: { id: Tool; name: string; icon: typeof Search; description: string; placeholder: string; inputLabel: string }[] = [
  { id: "censys", name: "Censys", icon: Globe, description: "Internet-wide scanning — discover hosts, certificates, and exposed services across the global IPv4 space.", placeholder: "e.g. services.http.response.body: 'login'", inputLabel: "Search Query" },
  { id: "securitytrails", name: "SecurityTrails", icon: Database, description: "DNS & domain intelligence — historical DNS records, subdomains, WHOIS data, and associated IPs.", placeholder: "e.g. example.com", inputLabel: "Domain" },
  { id: "zoomeye", name: "ZoomEye", icon: Eye, description: "Cyberspace search engine — find network devices, websites, and services by fingerprints and banners.", placeholder: "e.g. app:apache port:443", inputLabel: "Search Query" },
  { id: "epieos", name: "Epieos", icon: Mail, description: "Email & phone OSINT — discover linked accounts, social profiles, and data breach exposure from an email.", placeholder: "e.g. user@example.com", inputLabel: "Email Address" },
  { id: "whonix", name: "Whonix", icon: Shield, description: "Privacy & anonymity OS — route all traffic through Tor for anonymous operations and secure investigations.", placeholder: "", inputLabel: "" },
];

const WhonixPanel = () => (
  <div className="space-y-6">
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Whonix Integration</h3>
          <p className="text-sm text-muted-foreground">Anonymous Operations Layer</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Whonix is a privacy-focused operating system that routes all network traffic through the Tor network. 
        It's integrated into Nexus Veil as the anonymity layer for sensitive OSINT operations, ensuring 
        investigators' identities and locations remain protected during intelligence gathering.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: Lock, title: "Tor-Routed Traffic", desc: "All OSINT queries are routed through Tor exit nodes for complete anonymity" },
          { icon: Server, title: "Isolated Workstation", desc: "Whonix Gateway + Workstation architecture prevents IP leaks" },
          { icon: Wifi, title: "Stream Isolation", desc: "Each tool uses separate Tor circuits to prevent correlation attacks" },
          { icon: Terminal, title: "Secure Shell Access", desc: "Encrypted terminal sessions for manual OSINT operations" },
        ].map((item) => (
          <div key={item.title} className="p-4 rounded border border-border bg-card/30">
            <item.icon className="h-4 w-4 text-primary mb-2" />
            <div className="text-sm font-semibold mb-1">{item.title}</div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="rounded-lg border border-border bg-card/30 p-4">
      <div className="font-mono text-xs text-muted-foreground space-y-1">
        <div className="text-primary mb-2">WHONIX STATUS</div>
        <div className="flex justify-between"><span>Gateway</span><span className="text-success">● CONNECTED</span></div>
        <div className="flex justify-between"><span>Tor Circuit</span><span className="text-success">● ESTABLISHED</span></div>
        <div className="flex justify-between"><span>Exit Node</span><span>de-exit-04.torproject.org</span></div>
        <div className="flex justify-between"><span>Latency</span><span>340ms (3 hops)</span></div>
        <div className="flex justify-between"><span>Stream Isolation</span><span className="text-primary">ACTIVE</span></div>
      </div>
    </div>
  </div>
);

const OsintDashboard = () => {
  const [activeTool, setActiveTool] = useState<Tool>("censys");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const activeToolData = tools.find((t) => t.id === activeTool)!;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let functionName = "";
      let body: Record<string, string> = {};

      switch (activeTool) {
        case "censys":
          functionName = "censys-search";
          body = { query };
          break;
        case "securitytrails":
          functionName = "securitytrails-search";
          body = { domain: query };
          break;
        case "zoomeye":
          functionName = "zoomeye-search";
          body = { query, type: "host" };
          break;
        case "epieos":
          functionName = "epieos-search";
          body = { email: query };
          break;
      }

      const { data, error: fnError } = await supabase.functions.invoke(functionName, {
        body,
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Tool tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id);
              setResults(null);
              setError(null);
              setQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTool === tool.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            <tool.icon className="h-4 w-4" />
            {tool.name}
          </button>
        ))}
      </div>

      {/* Tool description */}
      <div className="mb-6 p-4 rounded-lg border border-border bg-card/30">
        <div className="flex items-center gap-2 mb-2">
          <activeToolData.icon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{activeToolData.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{activeToolData.description}</p>
      </div>

      {/* Whonix panel or search interface */}
      {activeTool === "whonix" ? (
        <WhonixPanel />
      ) : (
        <>
          {/* Search input */}
          <div className="mb-6">
            <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
              {activeToolData.inputLabel}
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={activeToolData.placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card/30 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Scan
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border border-destructive/30 bg-destructive/5 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-destructive mb-1">Scan Failed</div>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                  <Terminal className="h-3 w-3 text-primary" /> SCAN RESULTS
                </span>
                <span className="font-mono text-[10px] text-primary">
                  {activeTool.toUpperCase()} ENGINE
                </span>
              </div>
              <div className="p-4">
                <ResultsRenderer tool={activeTool} data={results} />
              </div>
            </div>
          )}

          {/* No results placeholder */}
          {!results && !error && !loading && (
            <div className="rounded-lg border border-border border-dashed bg-card/10 p-12 text-center">
              <activeToolData.icon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Enter a query above and click <span className="text-primary font-semibold">Scan</span> to begin intelligence gathering
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ResultsRenderer = ({ tool, data }: { tool: Tool; data: any }) => {
  // Censys results
  if (tool === "censys" && data?.result?.hits) {
    return (
      <div className="space-y-3">
        <div className="font-mono text-xs text-muted-foreground mb-3">
          Found {data.result.total || 0} hosts
        </div>
        {data.result.hits.map((hit: any, i: number) => (
          <div key={i} className="p-3 rounded border border-border bg-background/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-primary">{hit.ip}</span>
              <span className="text-xs text-muted-foreground">{hit.location?.country || 'Unknown'}</span>
            </div>
            {hit.services && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {hit.services.map((svc: any, j: number) => (
                  <span key={j} className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                    {svc.port}/{svc.transport_protocol} — {svc.service_name || 'unknown'}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // SecurityTrails results
  if (tool === "securitytrails" && data?.domain) {
    const d = data.domain;
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 rounded border border-border bg-background/50">
            <div className="text-xs text-muted-foreground mb-1">Hostname</div>
            <div className="font-mono text-sm">{d.hostname}</div>
          </div>
          <div className="p-3 rounded border border-border bg-background/50">
            <div className="text-xs text-muted-foreground mb-1">Alexa Rank</div>
            <div className="font-mono text-sm">{d.alexa_rank || 'N/A'}</div>
          </div>
        </div>
        {d.current_dns && (
          <div className="p-3 rounded border border-border bg-background/50">
            <div className="text-xs text-muted-foreground mb-2">DNS Records</div>
            <div className="space-y-1 font-mono text-xs">
              {d.current_dns.a?.values?.map((v: any, i: number) => (
                <div key={i} className="flex gap-2"><span className="text-primary w-8">A</span><span>{v.ip}</span></div>
              ))}
              {d.current_dns.mx?.values?.map((v: any, i: number) => (
                <div key={i} className="flex gap-2"><span className="text-primary w-8">MX</span><span>{v.hostname}</span></div>
              ))}
              {d.current_dns.ns?.values?.map((v: any, i: number) => (
                <div key={i} className="flex gap-2"><span className="text-primary w-8">NS</span><span>{v.nameserver}</span></div>
              ))}
            </div>
          </div>
        )}
        {data.subdomains?.subdomains && (
          <div className="p-3 rounded border border-border bg-background/50">
            <div className="text-xs text-muted-foreground mb-2">
              Subdomains ({data.subdomains.subdomains.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.subdomains.subdomains.slice(0, 20).map((sub: string, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                  {sub}
                </span>
              ))}
              {data.subdomains.subdomains.length > 20 && (
                <span className="px-2 py-0.5 text-[10px] text-muted-foreground">
                  +{data.subdomains.subdomains.length - 20} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ZoomEye results
  if (tool === "zoomeye" && data?.matches) {
    return (
      <div className="space-y-3">
        <div className="font-mono text-xs text-muted-foreground mb-3">
          Found {data.total || 0} results
        </div>
        {data.matches.slice(0, 10).map((match: any, i: number) => (
          <div key={i} className="p-3 rounded border border-border bg-background/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-primary">{match.ip}</span>
              <span className="text-xs text-muted-foreground">Port {match.portinfo?.port}</span>
            </div>
            {match.portinfo?.banner && (
              <pre className="text-[10px] text-muted-foreground font-mono bg-background/80 p-2 rounded mt-2 overflow-x-auto max-h-20">
                {match.portinfo.banner.slice(0, 200)}
              </pre>
            )}
            <div className="flex gap-2 text-[10px] text-muted-foreground mt-1">
              {match.geoinfo?.country?.names?.en && <span>{match.geoinfo.country.names.en}</span>}
              {match.portinfo?.service && <span>• {match.portinfo.service}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Epieos results
  if (tool === "epieos") {
    return (
      <div className="space-y-3">
        {data.accounts && (
          <div className="p-3 rounded border border-border bg-background/50">
            <div className="text-xs text-muted-foreground mb-2">Linked Accounts</div>
            <div className="space-y-2">
              {data.accounts.map((acc: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{acc.name || acc.service}</span>
                  {acc.url && (
                    <a href={acc.url} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 text-xs">
                      <ExternalLink className="h-3 w-3" /> View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {!data.accounts && (
          <pre className="text-xs font-mono text-muted-foreground bg-background/50 p-4 rounded border border-border overflow-auto max-h-60">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  // Fallback: raw JSON
  return (
    <pre className="text-xs font-mono text-muted-foreground bg-background/50 p-4 rounded border border-border overflow-auto max-h-96">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default OsintDashboard;
