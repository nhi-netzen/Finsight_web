import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Activity, TrendingUp, CheckCircle, Download,
  Share2, Loader2, Info, ChevronDown, ChevronUp,
} from "lucide-react";
import { FinancialRiskChart } from "./FinancialRiskChart";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { PremiumLogo } from "./PremiumLogo";

const TICKER_CHART_MAP: Record<string, number> = { STK: 0, PLX: 1, MCP: 2 };
function resolveChartIndex(ticker: string): number {
  const key = ticker.toUpperCase();
  if (TICKER_CHART_MAP[key] !== undefined) return TICKER_CHART_MAP[key];
  return ticker.toUpperCase().split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
}

const fuzzyTranslations = {
  en: {
    title: "Fuzzy-CNN Hybrid Analysis Results",
    analyzedBy: "Analyzed by",
    share: "Share",
    hybridClassification: "Fuzzy Logic + CNN Hybrid Classification",
    hybridScore: "Hybrid Score",
    hybridConf: "Hybrid Confidence",
    fuzzyClassification: "Fuzzy Classification",
    membershipScore: "Membership Score",
    stabilityScore: "Stability Score",
    riskLevel: "Risk Level",
    vsCnn: "+2.5% vs CNN",
    vsStab: "+3.6 vs CNN",
    veryLow: "Very Low",
    excellent: "Excellent",
    vizFramework: "VISUALIZATION FRAMEWORK",
    analysisComplete: "Fuzzy-CNN Analysis complete",
    generatingPdf: "Generating PDF...",
    exportPdf: "Export PDF Report",
    moreInfo: "More Information",
    detailedAnalysis: "Fuzzy-CNN Hybrid — Detailed Analysis",
    hybridArch: "Hybrid Architecture",
    archItems: [
      "Mamdani fuzzy inference engine (3 membership functions)",
      "12 convolutional layers with batch normalization",
      "Fuzzy rule base: 27 linguistic rules",
      "Centroid defuzzification method",
    ],
    advantages: "Hybrid Advantages",
    advItems: [
      "96.7% confidence vs 94.2% (CNN only) — 2.5% improvement",
      "Better handling of uncertain or ambiguous financial data",
      "Improved stability score: 92.1 vs 88.5 (CNN only)",
      "Fuzzy logic captures expert knowledge and linguistic variables",
    ],
  },
  vi: {
    title: "Kết quả Phân tích Hybrid Fuzzy-CNN",
    analyzedBy: "Phân tích bởi",
    share: "Chia sẻ",
    hybridClassification: "Phân loại Hybrid Logic Mờ + CNN",
    hybridScore: "Điểm Hybrid",
    hybridConf: "Độ tin cậy Hybrid",
    fuzzyClassification: "Phân loại Mờ",
    membershipScore: "Điểm Tư cách Thành viên",
    stabilityScore: "Điểm Ổn định",
    riskLevel: "Mức Rủi ro",
    vsCnn: "+2.5% so với CNN",
    vsStab: "+3.6 so với CNN",
    veryLow: "Rất Thấp",
    excellent: "Xuất sắc",
    vizFramework: "KHUNG TRỰC QUAN HÓA",
    analysisComplete: "Phân tích Fuzzy-CNN hoàn tất",
    generatingPdf: "Đang tạo PDF...",
    exportPdf: "Xuất Báo cáo PDF",
    moreInfo: "Thêm Thông tin",
    detailedAnalysis: "Hybrid Fuzzy-CNN — Phân tích Chi tiết",
    hybridArch: "Kiến trúc Hybrid",
    archItems: [
      "Bộ suy luận mờ Mamdani (3 hàm tư cách thành viên)",
      "12 lớp tích chập với chuẩn hóa batch",
      "Cơ sở luật mờ: 27 luật ngôn ngữ",
      "Phương pháp giải mờ trọng tâm",
    ],
    advantages: "Ưu điểm Hybrid",
    advItems: [
      "96.7% độ tin cậy so với 94.2% (chỉ CNN) — cải thiện 2.5%",
      "Xử lý tốt hơn dữ liệu tài chính không chắc chắn hoặc mơ hồ",
      "Điểm ổn định cải thiện: 92.1 so với 88.5 (chỉ CNN)",
      "Logic mờ nắm bắt kiến thức chuyên gia và biến ngôn ngữ",
    ],
  },
};

interface FuzzyCNNResultsPageProps {
  language: "en" | "vi";
}

export function FuzzyCNNResultsPage({ language }: FuzzyCNNResultsPageProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isExporting, setIsExporting] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [searchParams] = useSearchParams();
  const ft = fuzzyTranslations[language];

  const COMPANY_CODE = searchParams.get("company") || "STK";
  const chartIndex = resolveChartIndex(COMPANY_CODE);
  const SELECTED_YEAR = "{{SELECTED_YEAR}}";
  const PREDICTION_RESULT = "{{PREDICTION_RESULT}}";
  const FUZZY_CNN_ACCURACY = "{{FUZZY_CNN_ACCURACY}}";
  const USER_NAME = user?.name || "{{USER_NAME}}";

  const handleExportPDF = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0B0B0B", fontFamily: "Inter, sans-serif" }}>
      <div className="sticky top-0 z-30 border-b" style={{ background: "#111111", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PremiumLogo size={28} variant="symbol" animated={false}  />
            <button onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-bold" style={{ fontSize: 18 }}>{ft.title}</h1>
                <Activity className="w-4 h-4" style={{ color: "#FF3B3B" }} />
              </div>
              <p style={{ color: "#6B7280", fontSize: 13 }}>
                {COMPANY_CODE} · {SELECTED_YEAR} · {ft.analyzedBy} {USER_NAME}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all"
            style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Share2 className="w-4 h-4" />
            {ft.share}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div className="rounded-2xl p-8 mb-8"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.06) 100%)", border: "1px solid rgba(16,185,129,0.25)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #10B981, #3B82F6)" }}>
                <Activity className="w-8 h-8 text-white" />
                <motion.div className="absolute inset-0 rounded-2xl"
                  style={{ border: "2px solid rgba(255,255,255,0.4)" }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }} />
              </div>
              <div>
                <h2 className="text-white mb-1" style={{ fontSize: 26, fontWeight: 700 }}>{PREDICTION_RESULT}</h2>
                <p style={{ color: "#9CA3AF", fontSize: 13 }}>{ft.hybridClassification} · {COMPANY_CODE} {SELECTED_YEAR}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold" style={{ color: "#10B981", fontSize: 32 }}>92%</div>
              <div style={{ color: "#6B7280", fontSize: 12 }}>{ft.hybridScore}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: ft.hybridConf, value: `${FUZZY_CNN_ACCURACY}%`, sub: ft.vsCnn },
              { label: ft.fuzzyClassification, value: "0.94", sub: ft.membershipScore },
              { label: ft.stabilityScore, value: "92.1", sub: ft.vsStab },
              { label: ft.riskLevel, value: ft.veryLow, highlight: true, sub: ft.excellent },
            ].map((m) => (
              <div key={m.label} className="rounded-xl p-4"
                style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>{m.label}</div>
                <div className="font-bold" style={{ fontSize: 22, color: m.highlight ? "#10B981" : "#FFFFFF" }}>{m.value}</div>
                {m.sub && <div style={{ color: "#10B981", fontSize: 11 }}>{m.sub}</div>}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span style={{ color: "#4B5563", fontSize: 12, letterSpacing: "0.08em" }}>{ft.vizFramework}</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <FinancialRiskChart
            modelType="fuzzy-cnn"
            chartIndex={chartIndex}
            companyCode={COMPANY_CODE}
            year={SELECTED_YEAR}
          />
        </motion.div>

        <motion.div className="mt-6 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4"
          style={{ background: "rgba(17,17,17,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(192,0,0,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex-1 hidden sm:block">
            <p style={{ color: "#6B7280", fontSize: 13 }}>{ft.analysisComplete} · {COMPANY_CODE} {SELECTED_YEAR}</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button onClick={handleExportPDF} disabled={isExporting}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden"
              style={{ background: isExporting ? "rgba(192,0,0,0.4)" : "linear-gradient(135deg, #C00000, #FF3B3B)", color: "#FFFFFF", fontSize: 14, fontWeight: 600, boxShadow: isExporting ? "none" : "0 6px 20px rgba(192,0,0,0.35)", minWidth: 180 }}
              whileHover={!isExporting ? { scale: 1.02, boxShadow: "0 8px 28px rgba(192,0,0,0.5)" } : {}}
              whileTap={!isExporting ? { scale: 0.98 } : {}}>
              <AnimatePresence mode="wait">
                {isExporting ? (
                  <motion.div key="exporting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{ft.generatingPdf}</span>
                    <motion.div className="absolute bottom-0 left-0 h-0.5 bg-white/30" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3 }} />
                  </motion.div>
                ) : (
                  <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{ft.exportPdf}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl flex items-center justify-center gap-2"
              style={{ background: showMoreInfo ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", color: showMoreInfo ? "#10B981" : "#9CA3AF", border: `1px solid ${showMoreInfo ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.1)"}`, fontSize: 14, fontWeight: 500, minWidth: 180 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Info className="w-4 h-4" />
              <span>{ft.moreInfo}</span>
              {showMoreInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showMoreInfo && (
            <motion.div className="mt-4 rounded-2xl p-6 overflow-hidden"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
              initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: "#10B981" }} />
                {ft.detailedAnalysis}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3 text-sm">{ft.hybridArch}</h4>
                  <ul className="space-y-2" style={{ color: "#9CA3AF", fontSize: 13 }}>
                    {ft.archItems.map((item) => (
                      <li key={item} className="flex gap-2"><span style={{ color: "#10B981" }}>▸</span> {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-3 text-sm">{ft.advantages}</h4>
                  <ul className="space-y-2">
                    {ft.advItems.map((rec) => (
                      <li key={rec} className="flex items-start gap-2" style={{ fontSize: 13 }}>
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
                        <span style={{ color: "#D1D5DB" }}>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
