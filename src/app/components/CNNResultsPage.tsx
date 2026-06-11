import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Brain, TrendingUp, CheckCircle, Download,
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

const cnnTranslations = {
  en: {
    title: "CNN Analysis Results",
    analyzedBy: "Analyzed by",
    share: "Share",
    cnnClassification: "CNN Neural Network Classification",
    healthScore: "Health Score",
    cnnConfidence: "CNN Confidence",
    classProb: "Classification Probability",
    healthIndex: "Financial Health Index",
    riskScore: "AI Risk Score",
    low: "Low",
    vizFramework: "VISUALIZATION FRAMEWORK",
    analysisComplete: "CNN Analysis complete",
    generatingPdf: "Generating PDF...",
    exportPdf: "Export PDF Report",
    moreInfo: "More Information",
    detailedAnalysis: "CNN Model — Detailed Analysis",
    modelArch: "Model Architecture",
    archItems: [
      "8 convolutional layers with ReLU activation",
      "13 financial features as input vector",
      "Dropout regularization (rate: 0.3)",
      "Softmax output layer (3 classes)",
    ],
    recommendations: "AI Recommendations",
    recItems: [
      "Maintain strong profitability margins above industry average",
      "Excellent cash flow management — sustain current efficiency",
      "Low bankruptcy risk — suitable for long-term investment",
    ],
  },
  vi: {
    title: "Kết quả Phân tích CNN",
    analyzedBy: "Phân tích bởi",
    share: "Chia sẻ",
    cnnClassification: "Phân loại Mạng Nơ-ron CNN",
    healthScore: "Điểm Sức khỏe",
    cnnConfidence: "Độ tin cậy CNN",
    classProb: "Xác suất Phân loại",
    healthIndex: "Chỉ số Sức khỏe Tài chính",
    riskScore: "Điểm Rủi ro AI",
    low: "Thấp",
    vizFramework: "KHUNG TRỰC QUAN HÓA",
    analysisComplete: "Phân tích CNN hoàn tất",
    generatingPdf: "Đang tạo PDF...",
    exportPdf: "Xuất Báo cáo PDF",
    moreInfo: "Thêm Thông tin",
    detailedAnalysis: "Mô hình CNN — Phân tích Chi tiết",
    modelArch: "Kiến trúc Mô hình",
    archItems: [
      "8 lớp tích chập với kích hoạt ReLU",
      "13 đặc trưng tài chính làm vector đầu vào",
      "Chính quy hóa Dropout (tỷ lệ: 0.3)",
      "Lớp đầu ra Softmax (3 lớp phân loại)",
    ],
    recommendations: "Khuyến nghị AI",
    recItems: [
      "Duy trì biên lợi nhuận mạnh trên mức trung bình ngành",
      "Quản lý dòng tiền xuất sắc — duy trì hiệu quả hiện tại",
      "Rủi ro phá sản thấp — phù hợp đầu tư dài hạn",
    ],
  },
};

interface CNNResultsPageProps {
  language: "en" | "vi";
}

export function CNNResultsPage({ language }: CNNResultsPageProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isExporting, setIsExporting] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [searchParams] = useSearchParams();
  const ct = cnnTranslations[language];

  const COMPANY_CODE = searchParams.get("company") || "STK";
  const chartIndex = resolveChartIndex(COMPANY_CODE);
  const SELECTED_YEAR = "{{SELECTED_YEAR}}";
  const PREDICTION_RESULT = "{{PREDICTION_RESULT}}";
  const CNN_ACCURACY = "{{CNN_ACCURACY}}";
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
                <h1 className="text-white font-bold" style={{ fontSize: 18 }}>{ct.title}</h1>
                <Brain className="w-4 h-4" style={{ color: "#FF3B3B" }} />
              </div>
              <p style={{ color: "#6B7280", fontSize: 13 }}>
                {COMPANY_CODE} · {SELECTED_YEAR} · {ct.analyzedBy} {USER_NAME}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all"
            style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Share2 className="w-4 h-4" />
            {ct.share}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div className="rounded-2xl p-8 mb-8"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.04) 100%)", border: "1px solid rgba(16,185,129,0.25)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #10B981, #34D399)" }}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white mb-1" style={{ fontSize: 26, fontWeight: 700 }}>{PREDICTION_RESULT}</h2>
                <p style={{ color: "#9CA3AF", fontSize: 13 }}>{ct.cnnClassification} · {COMPANY_CODE} {SELECTED_YEAR}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold" style={{ color: "#10B981", fontSize: 32 }}>88%</div>
              <div style={{ color: "#6B7280", fontSize: 12 }}>{ct.healthScore}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: ct.cnnConfidence, value: `${CNN_ACCURACY}%` },
              { label: ct.classProb, value: "91.8%" },
              { label: ct.healthIndex, value: "88.5" },
              { label: ct.riskScore, value: ct.low, highlight: true },
            ].map((m) => (
              <div key={m.label} className="rounded-xl p-4"
                style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>{m.label}</div>
                <div className="font-bold" style={{ fontSize: 22, color: m.highlight ? "#10B981" : "#FFFFFF" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span style={{ color: "#4B5563", fontSize: 12, letterSpacing: "0.08em" }}>{ct.vizFramework}</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <FinancialRiskChart
            modelType="cnn"
            chartIndex={chartIndex}
            companyCode={COMPANY_CODE}
            year={SELECTED_YEAR}
          />
        </motion.div>

        <motion.div className="mt-6 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4"
          style={{ background: "rgba(17,17,17,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(192,0,0,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex-1 hidden sm:block">
            <p style={{ color: "#6B7280", fontSize: 13 }}>{ct.analysisComplete} · {COMPANY_CODE} {SELECTED_YEAR}</p>
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
                    <span>{ct.generatingPdf}</span>
                    <motion.div className="absolute bottom-0 left-0 h-0.5 bg-white/30" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3 }} />
                  </motion.div>
                ) : (
                  <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{ct.exportPdf}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl flex items-center justify-center gap-2"
              style={{ background: showMoreInfo ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)", color: showMoreInfo ? "#60A5FA" : "#9CA3AF", border: `1px solid ${showMoreInfo ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`, fontSize: 14, fontWeight: 500, minWidth: 180 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Info className="w-4 h-4" />
              <span>{ct.moreInfo}</span>
              {showMoreInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showMoreInfo && (
            <motion.div className="mt-4 rounded-2xl p-6 overflow-hidden"
              style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}
              initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: "#3B82F6" }} />
                {ct.detailedAnalysis}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3 text-sm">{ct.modelArch}</h4>
                  <ul className="space-y-2" style={{ color: "#9CA3AF", fontSize: 13 }}>
                    {ct.archItems.map((item) => (
                      <li key={item} className="flex gap-2"><span style={{ color: "#FF3B3B" }}>▸</span> {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-3 text-sm">{ct.recommendations}</h4>
                  <ul className="space-y-2">
                    {ct.recItems.map((rec) => (
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