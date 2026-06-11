import { motion } from "motion/react";

interface PremiumLogoProps {
  size?: number;
  variant?: "full" | "symbol";
  animated?: boolean;
}

export function PremiumLogo({ size = 40, variant = "symbol", animated = false }: PremiumLogoProps) {
  const LogoSymbol = () => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C00000" />
          <stop offset="100%" stopColor="#FF3B3B" />
        </linearGradient>
      </defs>
      {/* F */}
      <path
        d="M 25 20 L 50 20 L 50 30 L 35 30 L 35 40 L 48 40 L 48 50 L 35 50 L 35 80"
        stroke="url(#logoGradient)" strokeWidth="6"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* S */}
      <path
        d="M 75 25 C 75 22 72 20 68 20 C 64 20 60 22 60 28 C 60 34 64 36 68 38 C 72 40 76 42 76 48 C 76 54 72 56 68 56 C 64 56 60 54 60 50"
        stroke="url(#logoGradient)" strokeWidth="6"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Growth line */}
      <motion.path
        d="M 15 85 L 30 75 L 45 78 L 60 65 L 75 68 L 85 55"
        stroke="url(#logoGradient)" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {[15, 30, 45, 60, 75, 85].map((x, i) => (
        <motion.circle
          key={i} cx={x} cy={[85, 75, 78, 65, 68, 55][i]} r="2.5" fill="url(#logoGradient)"
          initial={animated ? { scale: 0 } : {}}
          animate={animated ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: animated ? 0.5 + i * 0.1 : 0 }}
        />
      ))}
    </svg>
  );

  if (variant === "symbol") return <LogoSymbol />;

  return (
    <div className="flex items-center gap-3">
      <LogoSymbol />
      <div>
        <div
          className="font-bold tracking-tight"
          style={{
            fontSize: size * 0.4,
            background: "linear-gradient(135deg, #C00000 0%, #FF3B3B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          FinSight AI
        </div>
        <div className="text-gray-500" style={{ fontSize: size * 0.2 }}>Enterprise</div>
      </div>
    </div>
  );
}
