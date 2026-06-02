// src/components/ui/Logo.tsx — NOVA EduTrack
// Nouveau logo : hexagone avec graduation cap

interface LogoProps {
  variant?: "full" | "icon" | "pdf";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { icon: 30, fontSize: 16, total: 120 },
  md: { icon: 38, fontSize: 20, total: 150 },
  lg: { icon: 46, fontSize: 25, total: 180 },
};

export default function Logo({
  variant = "full",
  theme = "light",
  size = "md",
  className = "",
}: LogoProps) {
  const s = SIZES[size];
  const i = s.icon;
  const textColor = theme === "dark" ? "white" : "#1a2e1a";

  const EduIcon = () => (
    <svg width={i} height={i} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16a34a"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      {/* Fond hexagone arrondi */}
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)"/>
      {/* Chapeau de graduation simplifié */}
      <path d="M20 10 L32 16 L20 22 L8 16 Z" fill="white" fillOpacity="0.95"/>
      <rect x="30" y="16" width="2" height="10" rx="1" fill="white" fillOpacity="0.7"/>
      <circle cx="31" cy="27" r="2" fill="white" fillOpacity="0.7"/>
      {/* Trait sous chapeau */}
      <path d="M13 19 L13 25 C13 25 16 29 20 29 C24 29 27 25 27 25 L27 19" 
            stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  if (variant === "icon") {
    return <span className={className}><EduIcon /></span>;
  }

  if (variant === "pdf") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <EduIcon />
        <div>
          <p className="font-bold text-slate-900 leading-none" style={{ fontSize: 18, letterSpacing: "-0.02em" }}>
            EduTrack
          </p>
          <p className="text-slate-400 leading-none mt-1" style={{ fontSize: 11 }}>
            Système de Gestion Scolaire
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <EduIcon />
      <div>
        <p className="font-extrabold leading-none tracking-tight"
          style={{ fontSize: s.fontSize, color: textColor, letterSpacing: "-0.025em" }}>
          EduTrack
        </p>
        {size === "lg" && (
          <p className="leading-none mt-0.5" style={{ fontSize: 11, color: theme === "dark" ? "rgba(255,255,255,0.5)" : "#6b7280" }}>
            Gestion Scolaire
          </p>
        )}
      </div>
    </div>
  );
}
