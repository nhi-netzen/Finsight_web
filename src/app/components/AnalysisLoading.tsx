import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";

const loadingTranslations = {
  en: {
    phases: [
      "Extracting financial data streams...",
      "Activating neural network layers...",
      "Calculating confidence scores...",
      "Generating analytical insights...",
      "Finalizing results...",
    ],
    cnnTitle: "CNN Neural Network Analysis",
    fuzzyTitle: "Fuzzy-CNN Hybrid Analysis",
    cnnSubtitle: "Deep Learning Pattern Recognition",
    fuzzySubtitle: "Hybrid Fuzzy Logic + Neural Network",
    liveSignal: "LIVE MODEL SIGNAL",
    cnnProcessing: "Convolutional Layer Processing",
    fuzzyProcessing: "Fuzzy Membership Evaluation",
    pleaseWait: "Processing Deep Learning Models... Please wait.",
    progress: "Analysis Progress",
    features: "Features",
    layers: "Layers",
    accuracy: "Accuracy",
  },
  vi: {
    phases: [
      "Trích xuất luồng dữ liệu tài chính...",
      "Kích hoạt các lớp mạng nơ-ron...",
      "Tính toán điểm tin cậy...",
      "Tạo thông tin phân tích...",
      "Hoàn thiện kết quả...",
    ],
    cnnTitle: "Phân tích Mạng Nơ-ron CNN",
    fuzzyTitle: "Phân tích Hybrid Fuzzy-CNN",
    cnnSubtitle: "Nhận dạng Mẫu Deep Learning",
    fuzzySubtitle: "Logic Mờ Hybrid + Mạng Nơ-ron",
    liveSignal: "TÍN HIỆU MÔ HÌNH TRỰC TIẾP",
    cnnProcessing: "Xử lý Lớp Tích chập",
    fuzzyProcessing: "Đánh giá Tư cách Thành viên Mờ",
    pleaseWait: "Đang xử lý mô hình Deep Learning... Vui lòng chờ.",
    progress: "Tiến độ Phân tích",
    features: "Đặc trưng",
    layers: "Lớp",
    accuracy: "Độ chính xác",
  },
};

function buildWavePath(width: number, height: number, amplitude: number, frequency: number, phase: number): string {
  const points: string[] = [];
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = height / 2 + Math.sin((i / steps) * frequency * Math.PI * 2 + phase) * amplitude;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}

function AnimatedWave() {
  const [phase, setPhase] = useState(0);
  const W = 800;
  const H = 120;

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      setPhase(elapsed * 1.4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const wave1 = buildWavePath(W, H, 28, 2.5, phase);
  const wave2 = buildWavePath(W, H, 18, 3.2, phase * 1.3 + 1.2);
  const wave3 = buildWavePath(W, H, 10, 4.5, phase * 0.8 + 2.4);
  const fillPath = wave1 + ` L${W},${H} L0,${H} Z`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: W }}>
      <defs>
        <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C00000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C00000" stopOpacity="0.0" />
        </linearGradient>
        <filter id="waveGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={fillPath} fill="url(#waveFill)" />
      <path d={wave3} fill="none" stroke="#C00000" strokeWidth="1" strokeOpacity="0.25" filter="url(#waveGlow)" />
      <path d={wave2} fill="none" stroke="#FF3B3B" strokeWidth="1.5" strokeOpacity="0.45" filter="url(#waveGlow)" />
      <path d={wave1} fill="none" stroke="#FF3B3B" strokeWidth="2.5" strokeOpacity="0.9" filter="url(#waveGlow)" />
    </svg>
  );
}

function HeartbeatLine() {
  const [offset, setOffset] = useState(0);
  const W = 700;
  const H = 80;
  const mid = H / 2;

  const pattern = [
    `M0,${mid}`, `L60,${mid}`, `L75,${mid - 5}`, `L85,${mid - 35}`,
    `L95,${mid + 20}`, `L105,${mid - 12}`, `L115,${mid}`, `L200,${mid}`,
    `L215,${mid - 3}`, `L225,${mid - 28}`, `L235,${mid + 16}`,
    `L245,${mid - 8}`, `L255,${mid}`, `L350,${mid}`, `L365,${mid - 5}`,
    `L375,${mid - 38}`, `L385,${mid + 22}`, `L395,${mid - 14}`,
    `L405,${mid}`, `L500,${mid}`, `L515,${mid - 4}`, `L525,${mid - 30}`,
    `L535,${mid + 18}`, `L545,${mid - 10}`, `L555,${mid}`, `L700,${mid}`,
  ].join(" ");

  useEffect(() => {
    let raf: number;
    let last: number | null = null;
    const tick = (ts: number) => {
      if (!last) last = ts;
      const delta = ts - last;
      last = ts;
      setOffset((prev) => (prev + delta * 0.08) % W);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ maxWidth: W }}>
      <defs>
        <linearGradient id="ekgGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C00000" stopOpacity="0" />
          <stop offset="30%" stopColor="#FF3B3B" stopOpacity="1" />
          <stop offset="70%" stopColor="#FF3B3B" stopOpacity="1" />
          <stop offset="100%" stopColor="#C00000" stopOpacity="0" />
        </linearGradient>
        <filter id="ekgGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="ekgClip">
          <rect x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>
      <g clipPath="url(#ekgClip)">
        {[-1, 0, 1].map((rep) => (
          <path
            key={rep}
            d={pattern.replace(/L(\d+),/g, (_, n) => `L${parseInt(n) + rep * W},`).replace(/M(\d+),/, (_, n) => `M${parseInt(n) + rep * W},`)}
            fill="none"
            stroke="url(#ekgGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#ekgGlow)"
            transform={`translate(${-offset}, 0)`}
          />
        ))}
      </g>
    </svg>
  );
}

const PHASE_PROGRESS = [20, 45, 72, 91, 100];

export function AnalysisLoading({ language = "en" }: { language?: "en" | "vi" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const analysisType = searchParams.get("type") || "cnn";
  const company = searchParams.get("company") || "STK";
  const lt = loadingTranslations[language];
  const PHASES = lt.phases.map((label, i) => ({ label, progress: PHASE_PROGRESS[i] }));
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const isCNN = analysisType === "cnn";

  useEffect(() => {
    const timings = [900, 1800, 2700, 3600, 4400];
    const timeouts = timings.map((t, i) => setTimeout(() => setPhaseIdx(i), t));
    const navTimeout = setTimeout(() => {
      navigate(isCNN ? `/analysis/cnn?company=${company}` : `/analysis/fuzzy-cnn?company=${company}`);
    }, 5200);
    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(navTimeout);
    };
  }, [navigate, isCNN]);

  useEffect(() => {
    const target = PHASES[phaseIdx]?.progress ?? 100;
    const step = () => {
      setDisplayProgress((prev) => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.5) return target;
        return prev + diff * 0.1;
      });
    };
    const id = setInterval(step, 30);
    return () => clearInterval(id);
  }, [phaseIdx]);

  const currentPhase = PHASES[phaseIdx];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0B0B0B", fontFamily: "Inter, sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(192,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(192,0,0,0.05) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(192,0,0,0.08) 0%, transparent 65%)" }} />
      {[...Array(24)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: i % 4 === 0 ? 4 : 2, height: i % 4 === 0 ? 4 : 2, background: i % 2 === 0 ? "#C00000" : "#FF3B3B", left: `${(i * 41 + 7) % 100}%`, top: `${(i * 57 + 13) % 100}%`, opacity: 0.3 }}
          animate={{ y: [0, -60, 0], x: [0, (i % 2 === 0 ? 15 : -15), 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.22 }} />
      ))}
      <motion.div className="relative z-10 w-full max-w-2xl mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
        <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(17,17,17,0.85)", backdropFilter: "blur(40px)", border: "1px solid rgba(192,0,0,0.2)", boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset" }}>
          <div className="h-1" style={{ background: "linear-gradient(90deg, #C00000 0%, #FF3B3B 50%, #C00000 100%)" }} />
          <div className="px-10 py-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #C00000, #FF3B3B)" }}
                    animate={{ scale: [1, 1.08, 1], boxShadow: ["0 4px 16px rgba(192,0,0,0.4)", "0 8px 28px rgba(192,0,0,0.65)", "0 4px 16px rgba(192,0,0,0.4)"] }}
                    transition={{ duration: 1.8, repeat: Infinity }}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isCNN ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      )}
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="text-white font-bold" style={{ fontSize: 18 }}>{isCNN ? lt.cnnTitle : lt.fuzzyTitle}</h2>
                    <p style={{ color: "#6B7280", fontSize: 13 }}>{isCNN ? lt.cnnSubtitle : lt.fuzzySubtitle}</p>
                  </div>
                </div>
              </div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#C00000" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.div>
            </div>
            <div className="rounded-2xl overflow-hidden mb-6 relative" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(192,0,0,0.15)" }}>
              <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: "rgba(192,0,0,0.1)" }}>
                <div className="flex items-center gap-2">
                  <motion.div className="w-2 h-2 rounded-full" style={{ background: "#FF3B3B" }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  <span style={{ color: "#9CA3AF", fontSize: 12 }}>{lt.liveSignal}</span>
                </div>
                <span style={{ color: "#4B5563", fontSize: 11 }}>{isCNN ? lt.cnnProcessing : lt.fuzzyProcessing}</span>
              </div>
              <div className="py-4 px-4"><AnimatedWave /></div>
            </div>
            <div className="mb-6 overflow-hidden" style={{ height: 80 }}><HeartbeatLine /></div>
            <div className="text-center mb-6">
              <motion.p key={phaseIdx} className="font-medium"
                style={{ color: "#FF3B3B", fontSize: 16, letterSpacing: "0.01em" }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: [0, 1, 1, 0.7] }}
                transition={{ duration: 0.9 }}>
                {currentPhase?.label}
              </motion.p>
              <motion.p className="mt-1" style={{ color: "#6B7280", fontSize: 13 }}
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                {lt.pleaseWait}
              </motion.p>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: "#6B7280", fontSize: 12 }}>{lt.progress}</span>
                <span className="font-semibold" style={{ color: "#FF3B3B", fontSize: 13 }}>{Math.round(displayProgress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div className="h-full rounded-full relative overflow-hidden"
                  style={{ background: "linear-gradient(90deg, #C00000 0%, #FF3B3B 100%)", width: `${displayProgress}%` }}
                  transition={{ duration: 0.3 }}>
                  <motion.div className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                    animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity }} />
                </motion.div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {PHASES.map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <motion.div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: i <= phaseIdx ? "rgba(192,0,0,0.2)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${i <= phaseIdx ? "#C00000" : "rgba(255,255,255,0.1)"}`, color: i <= phaseIdx ? "#FF3B3B" : "#4B5563" }}
                    animate={i === phaseIdx ? { scale: [1, 1.12, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}>
                    {i < phaseIdx ? (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      </svg>
                    ) : i + 1}
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: lt.features, value: "13" },
                { label: lt.layers, value: isCNN ? "8" : "12" },
                { label: lt.accuracy, value: isCNN ? "94.2%" : "96.7%" },
              ].map((stat) => (
                <motion.div key={stat.label} className="rounded-xl p-3 text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 0.5 }}>
                  <div style={{ color: "#6B7280", fontSize: 11 }}>{stat.label}</div>
                  <div className="font-bold mt-1" style={{ color: "#FFFFFF", fontSize: 18 }}>{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}