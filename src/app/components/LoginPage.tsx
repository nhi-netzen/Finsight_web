import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, User, CheckCircle2, Loader2, Globe, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { PremiumLogo } from "./PremiumLogo";
import { useUser } from "../contexts/UserContext";

interface LoginPageProps {
  onLogin: () => void;
  language: "en" | "vi";
  onLanguageChange: (lang: "en" | "vi") => void;
}

// Từ điển dịch thuật tối giản (đã bỏ phần mạng xã hội)
const translations = {
  en: {
    welcome: "Welcome to Financial",
    welcomeBold: "Intelligence Portal",
    subtitle: "Enterprise-grade AI-powered financial analysis platform for Vietnamese markets",
    username: "Username",
    password: "Password",
    email: "Email Address",
    fullName: "Full Name",
    remember: "Remember me",
    forgot: "Forgot password?",
    signin: "Login",
    authenticating: "Authenticating...",
    register: "Don't have an account?",
    registerLink: "Register",
    security: "Enterprise-grade security · 256-bit SSL",
    tagline: "Intelligent Financial Analysis",
    taglineSub: "Powered by Deep Learning & AI",
    backToLogin: "Back to login",
    createAccount: "Create Account",
    joinUs: "Join the Future",
    resetTitle: "Reset Password",
    resetSub: "Enter your email and we'll send you recovery instructions.",
    sendLink: "Send Recovery Link",
    processing: "Processing..."
  },
  vi: {
    welcome: "Chào mừng đến",
    welcomeBold: "Cổng Thông Tin Tài Chính",
    subtitle: "Nền tảng phân tích tài chính AI cấp doanh nghiệp cho thị trường Việt Nam",
    username: "Tên đăng nhập",
    password: "Mật khẩu",
    email: "Địa chỉ Email",
    fullName: "Họ và Tên",
    remember: "Ghi nhớ đăng nhập",
    forgot: "Quên mật khẩu?",
    signin: "Đăng nhập",
    authenticating: "Đang xác thực...",
    register: "Chưa có tài khoản?",
    registerLink: "Đăng ký ngay",
    security: "Bảo mật cấp doanh nghiệp · SSL 256-bit",
    tagline: "Phân Tích Tài Chính Thông Minh",
    taglineSub: "Được cung cấp bởi Deep Learning & AI",
    backToLogin: "Quay lại đăng nhập",
    createAccount: "Tạo tài khoản mới",
    joinUs: "Tham gia cùng chúng tôi",
    resetTitle: "Khôi Phục Mật Khẩu",
    resetSub: "Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn lấy lại mật khẩu.",
    sendLink: "Gửi liên kết khôi phục",
    processing: "Đang xử lý..."
  },
};

const candlestickData = [
  { open: 120, close: 145, high: 155, low: 115, x: 40 },
  { open: 145, close: 132, high: 150, low: 125, x: 90 },
  { open: 132, close: 168, high: 175, low: 128, x: 140 },
  { open: 168, close: 155, high: 172, low: 148, x: 190 },
  { open: 155, close: 178, high: 185, low: 150, x: 240 },
  { open: 178, close: 162, high: 182, low: 158, x: 290 },
  { open: 162, close: 195, high: 200, low: 158, x: 340 },
  { open: 195, close: 188, high: 202, low: 182, x: 390 },
  { open: 188, close: 215, high: 222, low: 184, x: 440 },
  { open: 215, close: 198, high: 220, low: 192, x: 490 },
  { open: 198, close: 228, high: 235, low: 194, x: 540 },
  { open: 228, close: 242, high: 248, low: 222, x: 590 },
];

function CandlestickViz() {
  const svgHeight = 300;
  const minVal = 100, maxVal = 260;
  const range = maxVal - minVal;
  const candleWidth = 28;
  const scaleY = (val: number) => svgHeight - ((val - minVal) / range) * svgHeight;

  return (
    <svg width="660" height={svgHeight} viewBox={`0 0 660 ${svgHeight}`} className="opacity-90">
      <defs>
        <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C00000" stopOpacity="1" />
          <stop offset="100%" stopColor="#FF3B3B" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="bearGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C00000" stopOpacity="0.3" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {[0.25, 0.5, 0.75].map((frac, i) => (
        <line key={i} x1="0" y1={svgHeight * frac} x2="660" y2={svgHeight * frac}
          stroke="rgba(192,0,0,0.15)" strokeWidth="1" strokeDasharray="4 6" />
      ))}
      {candlestickData.map((candle, i) => {
        const isBull = candle.close > candle.open;
        const bodyTop = Math.min(scaleY(candle.open), scaleY(candle.close));
        const bodyHeight = Math.abs(scaleY(candle.open) - scaleY(candle.close));
        return (
          <motion.g key={i}
            initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{ transformOrigin: `${candle.x}px ${svgHeight / 2}px` }}
          >
            <line x1={candle.x} y1={scaleY(candle.high)} x2={candle.x} y2={scaleY(candle.low)}
              stroke={isBull ? "#FF3B3B" : "#C00000"} strokeWidth="1.5" filter="url(#glow)" />
            <rect x={candle.x - candleWidth / 2} y={bodyTop}
              width={candleWidth} height={Math.max(bodyHeight, 2)}
              fill={isBull ? "url(#bullGrad)" : "url(#bearGrad)"}
              stroke={isBull ? "#FF3B3B" : "#C00000"} strokeWidth="1" rx="2" filter="url(#glow)" />
          </motion.g>
        );
      })}
    </svg>
  );
}

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  placeholder?: string;
}

function FloatingInput({ id, label, type = "text", value, onChange, icon, rightSlot, placeholder }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <span style={{ color: focused ? "#FF3B3B" : "#6B7280" }}>{icon}</span>
      </div>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ""}
        className="w-full pl-12 pr-12 pt-5 pb-2 rounded-xl outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "#C00000" : "rgba(255,255,255,0.1)"}`,
          color: "#FFFFFF", fontSize: 14,
          boxShadow: focused ? "0 0 0 3px rgba(192,0,0,0.15)" : "none",
        }}
      />
      <label htmlFor={id}
        className="absolute left-12 pointer-events-none transition-all duration-200"
        style={{
          top: floated ? "8px" : "50%",
          transform: floated ? "none" : "translateY(-50%)",
          fontSize: floated ? 10 : 14,
          color: focused ? "#FF3B3B" : floated ? "#9CA3AF" : "#6B7280",
        }}
      >
        {label}
      </label>
      {rightSlot && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  );
}

export function LoginPage({ onLogin, language, onLanguageChange }: LoginPageProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const { setUser } = useUser();

  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showNotification = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showNotification(language === "vi" ? "Vui lòng nhập đủ thông tin!" : "Please fill in all fields!", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(language === "vi" ? "Đăng nhập thành công!" : "Success!", "success");
        setUser({ name: data.user.name, email: data.user.email });
        setTimeout(() => { onLogin(); navigate("/dashboard"); }, 1000);
      } else {
        showNotification(data.detail, "error");
      }
    } catch {
      showNotification(language === "vi" ? "Lỗi kết nối máy chủ!" : "Server error!", "error");
    } finally { setIsLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !email || !fullName) {
      showNotification(language === "vi" ? "Vui lòng điền mọi thông tin!" : "Please complete the form!", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, full_name: fullName }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message, "success");
        setTimeout(() => { setView("login"); }, 1500);
      } else {
        showNotification(data.detail, "error");
      }
    } catch {
      showNotification(language === "vi" ? "Lỗi kết nối máy chủ!" : "Server connection failed!", "error");
    } finally { setIsLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showNotification(language === "vi" ? "Vui lòng nhập Email!" : "Please enter your email!", "error");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      showNotification(data.message, "success");
    } catch {
      showNotification("Error", "error");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden" style={{ background: "#0B0B0B", fontFamily: "Inter, sans-serif" }}>
      
      {/* 🔴 TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl"
            style={{
              background: toast.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              borderColor: toast.type === "success" ? "#10B981" : "#FF3B3B",
              boxShadow: toast.type === "success" ? "0 0 20px rgba(16,185,129,0.2)" : "0 0 20px rgba(255,59,59,0.2)"
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-sm font-medium text-white">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex items-center gap-1 rounded-lg px-3 py-2 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Globe className="w-4 h-4" style={{ color: "#9CA3AF" }} />
          <select value={language} onChange={(e) => onLanguageChange(e.target.value as "en" | "vi")}
            className="bg-transparent outline-none cursor-pointer text-sm" style={{ color: "#E5E7EB" }}>
            <option value="en" style={{ background: "#171717" }}>EN</option>
            <option value="vi" style={{ background: "#171717" }}>VI</option>
          </select>
        </div>
      </div>

      {/* LEFT SIDE — HERO & CHARTS */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B0B0B 0%, #120000 40%, #1A0505 70%, #0B0B0B 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(192,0,0,0.18) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(192,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(192,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }} />
        
        <div className="relative z-10 p-10 pt-12">
          <div className="flex items-center gap-3 mb-6">
            <PremiumLogo size={44} variant="symbol" animated={false} />
            <div>
              <div className="text-white text-xl font-bold tracking-wide">FinSight AI</div>
              <div className="text-xs tracking-widest" style={{ color: "#C00000" }}>FINANCIAL INTELLIGENCE</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: "#FFFFFF" }}>{t.tagline}</h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>{t.taglineSub}</p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8">
          <div className="rounded-2xl p-6 w-full"
            style={{ background: "rgba(23,23,23,0.4)", backdropFilter: "blur(12px)", border: "1px solid rgba(192,0,0,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-white text-sm font-semibold">VN-Index · Live</div>
                <div className="text-xs" style={{ color: "#6B7280" }}>Vietnam Stock Exchange</div>
              </div>
              <div className="text-right">
                <div className="font-bold" style={{ color: "#FF3B3B", fontSize: 20 }}>1,284.72</div>
                <div className="text-xs" style={{ color: "#10B981" }}>▲ +12.45 (+0.98%)</div>
              </div>
            </div>
            <div className="overflow-hidden"><CandlestickViz /></div>
          </div>
        </div>

        <div className="relative z-10 px-10 pb-10 flex gap-6">
          {[{ label: "Companies", value: "222+" }, { label: "AI Accuracy", value: "96.7%" }, { label: "Fiscal Years", value: "2021–2025" }].map((stat) => (
            <div key={stat.label}>
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-xs" style={{ color: "#6B7280" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE — AUTHENTICATION FORMS */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative" style={{ background: "#0B0B0B" }}>
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(192,0,0,0.04), transparent)" }} />
        
        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            
            {/* 1️⃣ LOGIN FORM */}
            {view === "login" && (
              <motion.div key="login-form" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}>
                <div className="mb-8">
                  <h1 className="text-white mb-2" style={{ fontSize: 28, fontWeight: 700 }}>
                    {t.welcome}{" "}
                    <span style={{ background: "linear-gradient(90deg, #C00000, #FF3B3B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {t.welcomeBold}
                    </span>
                  </h1>
                  <p style={{ color: "#6B7280", fontSize: 13 }}>{t.subtitle}</p>
                </div>

                <div className="rounded-2xl p-8" style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <form onSubmit={handleLogin} className="space-y-5">
                    <FloatingInput id="username" label={t.username} value={username} onChange={setUsername} placeholder="admin" icon={<User className="w-5 h-5" />} />
                    <FloatingInput id="password" label={t.password} type={showPass ? "text" : "password"} value={password} onChange={setPassword} placeholder="••••••••" icon={<Lock className="w-5 h-5" />} rightSlot={
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ color: "#6B7280" }}>{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                    } />
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
                        <div className="w-4 h-4 rounded flex items-center justify-center transition-all" style={{ background: rememberMe ? "#C00000" : "transparent", border: `1.5px solid ${rememberMe ? "#C00000" : "rgba(255,255,255,0.2)"}` }}>
                          {rememberMe && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span style={{ color: "#9CA3AF", fontSize: 13 }}>{t.remember}</span>
                      </label>
                      <button type="button" onClick={() => setView("forgot")} style={{ color: "#FF3B3B", fontSize: 13 }}>{t.forgot}</button>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-700 to-red-500 shadow-lg transition-all hover:opacity-90">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t.signin}
                    </button>
                    
                    <p className="text-center text-sm mt-5" style={{ color: "#6B7280" }}>
                      {t.register}{" "}
                      <button type="button" onClick={() => setView("register")} className="font-semibold text-red-500 hover:underline">{t.registerLink}</button>
                    </p>
                  </form>
                </div>
              </motion.div>
            )}

            {/* 2️⃣ REGISTER FORM */}
            {view === "register" && (
              <motion.div key="register-form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <div className="mb-8">
                  <button onClick={() => setView("login")} className="flex items-center gap-2 text-sm mb-4 text-gray-400 hover:text-white transition-all">
                    <ArrowLeft className="w-4 h-4" /> {t.backToLogin}
                  </button>
                  <h1 className="text-white text-3xl font-bold mb-2">{t.createAccount}</h1>
                  <p style={{ color: "#6B7280", fontSize: 13 }}>{t.joinUs}</p>
                </div>

                <div className="rounded-2xl p-8" style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <form onSubmit={handleRegister} className="space-y-5">
                    <FloatingInput id="reg-fullname" label={t.fullName} value={fullName} onChange={setFullName} icon={<User className="w-5 h-5" />} />
                    <FloatingInput id="reg-email" label={t.email} type="email" value={email} onChange={setEmail} icon={<Mail className="w-5 h-5" />} />
                    <FloatingInput id="reg-user" label={t.username} value={username} onChange={setUsername} icon={<User className="w-5 h-5" />} />
                    <FloatingInput id="reg-pass" label={t.password} type="password" value={password} onChange={setPassword} icon={<Lock className="w-5 h-5" />} />

                    <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-700 to-red-500 shadow-lg transition-all hover:opacity-90">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t.registerLink}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* 3️⃣ FORGOT PASSWORD FORM */}
            {view === "forgot" && (
              <motion.div key="forgot-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="mb-8">
                  <button onClick={() => setView("login")} className="flex items-center gap-2 text-sm mb-4 text-gray-400 hover:text-white transition-all">
                    <ArrowLeft className="w-4 h-4" /> {t.backToLogin}
                  </button>
                  <h1 className="text-white text-3xl font-bold mb-2">{t.resetTitle}</h1>
                  <p style={{ color: "#6B7280", fontSize: 13 }}>{t.resetSub}</p>
                </div>

                <div className="rounded-2xl p-8" style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <FloatingInput id="forgot-email" label={t.email} type="email" value={email} onChange={setEmail} icon={<Mail className="w-5 h-5" />} />

                    <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-700 to-red-500 shadow-lg transition-all hover:opacity-90">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t.sendLink}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}