import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, AlertCircle, BookOpen, Users, TrendingUp, Award } from "lucide-react";
import { useAuth } from "../service/auth";

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const ROLE_REDIRECTS: Record<string, string> = {
  root:       "/dashboard",
  admin:      "/dashboard",
  directeur:  "/dashboard",
  fondateur:  "/finance",
  enseignant: "/dashboard-enseignant",
  parent:     "/dashboard-parent",
};

const STATS = [
  { icon: Users,     value: "1 200+", label: "Élèves suivis" },
  { icon: BookOpen,  value: "48",     label: "Classes actives" },
  { icon: TrendingUp,value: "98%",    label: "Taux de réussite" },
  { icon: Award,     value: "15 ans", label: "D'expérience" },
];

function EduLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="lgLogin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16a34a"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#lgLogin)"/>
      <path d="M20 10 L32 16 L20 22 L8 16 Z" fill="white" fillOpacity="0.95"/>
      <rect x="30" y="16" width="2" height="10" rx="1" fill="white" fillOpacity="0.7"/>
      <circle cx="31" cy="27" r="2" fill="white" fillOpacity="0.7"/>
      <path d="M13 19 L13 25 C13 25 16 29 20 29 C24 29 27 25 27 25 L27 19"
            stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    defaultValues: { username: "", password: "", remember: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setApiError(null);
    try {
      const result = await login(data.username, data.password);
      const role = result?.user?.role ?? "admin";
      navigate(ROLE_REDIRECTS[role] ?? "/dashboard", { replace: true });
    } catch {
      setApiError("Identifiants incorrects. Vérifiez vos informations.");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Panneau gauche — décoratif */}
      <div className="hidden lg:flex flex-col w-[45%] relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0d2118 0%, #1a4731 50%, #0d2118 100%)" }}>
        {/* Grille de fond */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #22c55e 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}/>
        {/* Cercles décoratifs */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)" }}/>
        <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }}/>

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <EduLogo size={46} />
            <div>
              <p className="text-white font-extrabold text-xl tracking-tight">EduTrack</p>
              <p className="text-green-400/70 text-xs font-medium">Gestion Scolaire</p>
            </div>
          </div>

          {/* Titre central */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Plateforme éducative
            </p>
            <h1 className="text-white font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(32px, 3vw, 48px)", letterSpacing: "-0.03em" }}>
              Gérez votre<br/>
              <span style={{ color: "#4ade80" }}>établissement</span><br/>
              avec précision.
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-sm">
              Inscriptions, notes, finances, emplois du temps — 
              tout en un seul tableau de bord sécurisé.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pb-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label}
                className="rounded-2xl px-4 py-3 border"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-white/40 text-xs font-medium">{label}</span>
                </div>
                <p className="text-white font-bold text-lg leading-none">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-stone-50">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <EduLogo size={40} />
            <p className="font-extrabold text-xl text-stone-900 tracking-tight">EduTrack</p>
          </div>

          <div className="mb-8">
            <h2 className="text-stone-900 font-extrabold text-2xl mb-1 tracking-tight">Connexion</h2>
            <p className="text-stone-400 text-sm">Entrez vos identifiants pour accéder au tableau de bord</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nom d'utilisateur */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                placeholder="nom.utilisateur"
                {...register("username", { required: "Champ requis" })}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-stone-900 outline-none transition-all
                  placeholder:text-stone-300
                  ${errors.username
                    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-stone-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  }`}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Champ requis" })}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm bg-white text-stone-900 outline-none transition-all
                    placeholder:text-stone-300
                    ${errors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-stone-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Se souvenir de moi */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="w-4 h-4 rounded border-stone-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-stone-500">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Erreur API */}
            {apiError && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            )}

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              style={{ background: isSubmitting ? "#6b7280" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin"/>
                  Connexion en cours…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-stone-300">
            EduTrack © {new Date().getFullYear()} — Système de Gestion Scolaire
          </p>
        </div>
      </div>
    </div>
  );
}
