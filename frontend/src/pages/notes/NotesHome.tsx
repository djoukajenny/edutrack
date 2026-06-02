// src/pages/notes/NotesHome.tsx — EduTrack — Palette vert forêt
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList, Edit, BarChart2, FileText, Award,
  BookOpen, ArrowRight, ChevronRight,
} from "lucide-react";
import { getUser } from "../../service/auth";

export default function NotesHome() {
  const navigate  = useNavigate();
  const user      = getUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isEnseignant = user?.role === "enseignant";
  const isParent     = user?.role === "parent";

  const ACTIONS = [
    {
      label: "Saisir des notes",
      desc:  "Entrer les notes des élèves par épreuve",
      icon:  Edit,
      path:  "/notes/saisie",
      accent: "#22c55e",
      bg:    "rgba(34,197,94,0.06)",
      border: "rgba(34,197,94,0.2)",
      roles: ["root","admin","directeur","enseignant"],
    },
    {
      label: "Voir le classement",
      desc:  "Classement des élèves par classe et trimestre",
      icon:  BarChart2,
      path:  "/notes/classement",
      accent: "#16a34a",
      bg:    "rgba(22,163,74,0.06)",
      border: "rgba(22,163,74,0.2)",
      roles: ["root","admin","directeur","enseignant","parent"],
    },
    {
      label: "Bulletins de notes",
      desc:  "Générer et consulter les bulletins trimestriels",
      icon:  FileText,
      path:  "/notes/bulletin",
      accent: "#15803d",
      bg:    "rgba(21,128,61,0.06)",
      border: "rgba(21,128,61,0.2)",
      roles: ["root","admin","directeur","enseignant","parent"],
    },
    {
      label: "Moyennes & Résultats",
      desc:  "Consulter les moyennes générales",
      icon:  Award,
      path:  "/notes/classement",
      accent: "#166534",
      bg:    "rgba(22,101,52,0.06)",
      border: "rgba(22,101,52,0.2)",
      roles: ["root","admin","directeur","enseignant","parent"],
    },
  ].filter(a => a.roles.includes(user?.role ?? ""));

  const INFO_CARDS = [
    { label: "Notes sur 20", desc: "Système de notation",     icon: "📝" },
    { label: "Coefficients", desc: "Pondération par matière", icon: "⚖️" },
    { label: "Bulletins PDF", desc: "Génération automatique", icon: "📄" },
    { label: "Classements",  desc: "Par classe et trimestre", icon: "🏆" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

      {/* ── Bannière vert forêt ── */}
      <div className={`rounded-2xl px-6 py-5 relative overflow-hidden transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        style={{ background: "linear-gradient(135deg, #0d2118 0%, #1a4731 60%, #0d2118 100%)", boxShadow: "0 4px 20px rgba(13,33,24,0.3)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at right, rgba(34,197,94,0.12) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Évaluation scolaire</p>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Notes & Évaluations</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isEnseignant ? "Gérez les notes de vos élèves" :
             isParent     ? "Consultez les résultats de votre enfant" :
             "Gestion complète des évaluations et bulletins"}
          </p>
        </div>
      </div>

      {/* ── Actions principales — cartes sobres avec accent vert ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <button key={action.path} onClick={() => navigate(action.path)}
            className="group flex items-center gap-4 bg-white rounded-2xl p-5 border text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: action.border,
              boxShadow: "0 1px 6px rgba(13,33,24,0.06)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px rgba(13,33,24,0.1), 0 0 0 1px ${action.accent}33`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 6px rgba(13,33,24,0.06)"; }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{ background: action.bg }}>
              <action.icon className="w-6 h-6" style={{ color: action.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 text-sm">{action.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* ── Info cards ── */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Fonctionnalités du module</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INFO_CARDS.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100"
              style={{ boxShadow: "0 1px 6px rgba(13,33,24,0.06)" }}>
              <div className="text-2xl mb-2">{card.icon}</div>
              <p className="font-bold text-sm text-slate-900">{card.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Raccourcis enseignant ── */}
      {isEnseignant && (
        <div className="bg-white rounded-2xl border border-emerald-100 p-5"
          style={{ boxShadow: "0 1px 6px rgba(13,33,24,0.06)" }}>
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" /> Raccourcis enseignant
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Saisir notes", path: "/notes/saisie",      icon: Edit },
              { label: "Classement",  path: "/notes/classement",   icon: BarChart2 },
              { label: "Bulletins",   path: "/notes/bulletin",     icon: FileText },
            ].map(item => (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all active:scale-[0.97]">
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
