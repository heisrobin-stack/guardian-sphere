import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Upload, User, ScanFace, AlertTriangle, CheckCircle, XCircle, Loader2, X, ZoomIn } from "lucide-react";

type DetectedFace = {
  id: string;
  confidence: number;
  bbox: { x: number; y: number; w: number; h: number };
  match: {
    name: string;
    status: "known" | "unknown" | "watchlist";
    lastSeen?: string;
  } | null;
};

type ScanResult = {
  faces: DetectedFace[];
  timestamp: string;
  processingTime: number;
};

const statusConfig = {
  known: { label: "Known", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30", icon: CheckCircle },
  unknown: { label: "Unknown", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", icon: User },
  watchlist: { label: "Watch-List", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: AlertTriangle },
};

const generateMockResult = (): ScanResult => {
  const faceCount = Math.floor(Math.random() * 3) + 1;
  const names = ["John Doe", "Jane Smith", "Unknown Subject", "Carlos Reyes", "Ama Mensah"];
  const statuses: ("known" | "unknown" | "watchlist")[] = ["known", "unknown", "watchlist"];

  const faces: DetectedFace[] = Array.from({ length: faceCount }, (_, i) => {
    const isMatch = Math.random() > 0.3;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `face-${Date.now()}-${i}`,
      confidence: Math.round((0.7 + Math.random() * 0.29) * 100) / 100,
      bbox: {
        x: 15 + Math.random() * 50,
        y: 10 + Math.random() * 40,
        w: 12 + Math.random() * 15,
        h: 15 + Math.random() * 20,
      },
      match: isMatch
        ? {
            name: names[Math.floor(Math.random() * names.length)],
            status,
            lastSeen: status !== "unknown" ? `${Math.floor(Math.random() * 48) + 1}h ago` : undefined,
          }
        : null,
    };
  });

  return {
    faces,
    timestamp: new Date().toISOString(),
    processingTime: Math.round(Math.random() * 800 + 200),
  };
};

const FaceRecognition = () => {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResult(null);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
      setCameraStream(stream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("Could not access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setCameraActive(false);
  }, [cameraStream]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const url = canvas.toDataURL("image/jpeg");
    setImageUrl(url);
    stopCamera();
    setResult(null);
  };

  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraStream]);

  const runScan = async () => {
    if (!imageUrl) return;
    setScanning(true);
    setResult(null);
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
    setResult(generateMockResult());
    setScanning(false);
  };

  const clearAll = () => {
    setImageUrl(null);
    setResult(null);
    stopCamera();
  };

  return (
    <div className="w-full space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2">
        {(["upload", "camera"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              if (m === "upload") stopCamera();
              setResult(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {m === "upload" ? <Upload className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            {m === "upload" ? "Upload Image" : "Live Camera"}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
        {mode === "upload" && !imageUrl && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-12 flex flex-col items-center gap-4 text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
          >
            <div className="p-4 rounded-full border-2 border-dashed border-muted-foreground/30">
              <Upload className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="font-medium">Drop an image or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — max 10MB</p>
            </div>
          </button>
        )}

        {mode === "camera" && !imageUrl && (
          <div className="relative">
            {cameraActive ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[400px] object-contain bg-black"
                />
                {/* Scan overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border border-primary/40 rounded-lg" />
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                </div>
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                  <button
                    onClick={captureFrame}
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    <ScanFace className="h-4 w-4" /> Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2.5 border border-border bg-background/80 rounded-lg hover:bg-background transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={startCamera}
                className="w-full p-12 flex flex-col items-center gap-4 text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
              >
                <div className="p-4 rounded-full border-2 border-dashed border-muted-foreground/30">
                  <Camera className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Start Camera Feed</p>
                  <p className="text-xs text-muted-foreground mt-1">Uses your device camera for live face detection</p>
                </div>
              </button>
            )}
          </div>
        )}

        {/* Preview captured/uploaded image */}
        {imageUrl && (
          <div className="relative group">
            <img src={imageUrl} alt="Scan target" className="w-full max-h-[400px] object-contain bg-black/50" />
            {/* Overlay bounding boxes if result */}
            {result && (
              <div className="absolute inset-0">
                {result.faces.map((face) => (
                  <div
                    key={face.id}
                    className="absolute border-2 rounded"
                    style={{
                      left: `${face.bbox.x}%`,
                      top: `${face.bbox.y}%`,
                      width: `${face.bbox.w}%`,
                      height: `${face.bbox.h}%`,
                      borderColor: face.match
                        ? face.match.status === "watchlist"
                          ? "#f87171"
                          : face.match.status === "known"
                          ? "#4ade80"
                          : "#facc15"
                        : "#94a3b8",
                    }}
                  >
                    <div
                      className="absolute -top-5 left-0 px-1.5 py-0.5 text-[9px] font-mono rounded whitespace-nowrap"
                      style={{
                        backgroundColor: face.match
                          ? face.match.status === "watchlist"
                            ? "rgba(248,113,113,0.2)"
                            : face.match.status === "known"
                            ? "rgba(74,222,128,0.2)"
                            : "rgba(250,204,21,0.2)"
                          : "rgba(148,163,184,0.2)",
                        color: face.match
                          ? face.match.status === "watchlist"
                            ? "#f87171"
                            : face.match.status === "known"
                            ? "#4ade80"
                            : "#facc15"
                          : "#94a3b8",
                      }}
                    >
                      {(face.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Scanning overlay */}
            {scanning && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <ScanFace className="h-12 w-12 text-primary animate-pulse" />
                  <div className="font-mono text-sm text-primary">Analyzing faces…</div>
                </div>
              </div>
            )}
            {/* Clear button */}
            <button
              onClick={clearAll}
              className="absolute top-3 right-3 p-2 rounded-lg bg-background/80 border border-border hover:bg-background transition-all opacity-0 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </div>

      {/* Action button */}
      {imageUrl && !scanning && (
        <button
          onClick={runScan}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          <ScanFace className="h-5 w-5" />
          {result ? "Re-Scan" : "Run Face Recognition"}
        </button>
      )}

      {scanning && (
        <div className="flex items-center justify-center gap-3 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="font-mono">Processing biometric data…</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/30 font-mono text-xs text-muted-foreground">
            <span>
              <ScanFace className="h-3.5 w-3.5 inline mr-1.5 text-primary" />
              {result.faces.length} face{result.faces.length !== 1 ? "s" : ""} detected
            </span>
            <span>{result.processingTime}ms</span>
          </div>

          {/* Face cards */}
          {result.faces.map((face, i) => {
            const status = face.match?.status || "unknown";
            const cfg = statusConfig[status];
            const StatusIcon = cfg.icon;

            return (
              <div key={face.id} className={`rounded-lg border p-4 ${cfg.bg}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-card/50 border border-border`}>
                      <StatusIcon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{face.match?.name || `Subject ${i + 1}`}</div>
                      <div className={`text-xs font-mono ${cfg.color}`}>{cfg.label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono">{(face.confidence * 100).toFixed(1)}%</div>
                    <div className="text-[10px] text-muted-foreground">confidence</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2 rounded bg-card/30 border border-border">
                    <div className="text-muted-foreground mb-0.5">Position</div>
                    <div className="font-mono">{face.bbox.x.toFixed(0)}, {face.bbox.y.toFixed(0)}</div>
                  </div>
                  <div className="p-2 rounded bg-card/30 border border-border">
                    <div className="text-muted-foreground mb-0.5">Size</div>
                    <div className="font-mono">{face.bbox.w.toFixed(0)}×{face.bbox.h.toFixed(0)}</div>
                  </div>
                  <div className="p-2 rounded bg-card/30 border border-border">
                    <div className="text-muted-foreground mb-0.5">Last Seen</div>
                    <div className="font-mono">{face.match?.lastSeen || "—"}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
