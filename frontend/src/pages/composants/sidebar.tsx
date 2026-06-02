// sidebar.tsx — EduTrack SGS
// Sidebar verticale gauche — thème vert/ardoise

import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  CreditCard, GraduationCap, LogOut, ChevronDown,
  X, BarChart2, UserCircle, Settings, ChevronRight,
  Building2, Calendar, Home, Clock, MessageSquare, Shield,
} from "lucide-react";

import Logo from "../../components/ui/Logo";
import { useState } from "react";
import { useAuth } from "../../service/auth";
import { useNavigate } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  section?: string;
  path?: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard",     label: "Tableau de bord",        icon: LayoutDashboard, section: "principal", path: "/dashboard",          roles: ["root","admin","directeur","fondateur","enseignant","parent"] },
  { id: "eleves",        label: "Élèves",                 icon: Users,           section: "gestion",   path: "/eleves",             roles: ["root","admin","directeur"] },
  { id: "enseignants",   label: "Enseignants",            icon: GraduationCap,   section: "gestion",   path: "/enseignants",        roles: ["root","admin","directeur"] },
  { id: "notes",         label: "Notes & Évaluations",   icon: ClipboardList,   section: "gestion",   path: "/notes",              roles: ["root","admin","directeur","enseignant","parent"] },
  { id: "inscriptions",  label: "Inscriptions",           icon: BookOpen,        section: "gestion",   path: "/inscriptions",       roles: ["root","admin","directeur"] },
  { id: "classes",       label: "Classes & cycles",       icon: Building2,       section: "gestion",   path: "/classes",            roles: ["root","admin","directeur"] },
  { id: "cours",         label: "Cours & matières",       icon: BookOpen,        section: "gestion",   path: "/cours",              roles: ["root","admin","directeur"] },
  { id: "salles",        label: "Salles de classe",       icon: Home,            section: "gestion",   path: "/salles",             roles: ["root","admin","directeur"] },
  { id: "annees",        label: "Années académiques",     icon: Calendar,        section: "gestion",   path: "/annees",             roles: ["root","admin"] },
  { id: "emploi-du-temps", label: "Emploi du temps",     icon: Clock,           section: "gestion",   path: "/emploi-du-temps",   roles: ["root","admin","directeur","enseignant"] },
  { id: "scolarites",    label: "Scolarités",             icon: CreditCard,      section: "finances",  path: "/scolarites",         roles: ["root","admin","fondateur"] },
  { id: "finance",       label: "Paiements",              icon: CreditCard,      section: "finances",  path: "/finance",            roles: ["root","admin","directeur","fondateur"] },
  { id: "stats",         label: "Statistiques",           icon: BarChart2,       section: "finances",  path: "/paiements/stats",    roles: ["root","admin","directeur","fondateur"] },
  { id: "communication", label: "Communication",          icon: MessageSquare,   section: "outils",    path: "/communication",      roles: ["root","admin","directeur","fondateur"] },
  { id: "bibliotheque",  label: "Bibliothèque",           icon: BookOpen,        section: "outils",    path: "/bibliotheque",       roles: ["root","admin","directeur","enseignant","parent"] },
  { id: "utilisateurs",  label: "Utilisateurs",           icon: Shield,          section: "admin",     path: "/admin/utilisateurs", roles: ["root","admin"] },
];

const SECTIONS: Record<string, string> = {
  principal: "Accueil",
  gestion: "Gestion scolaire",
  finances: "Finances",
  outils: "Outils",
  admin: "Administration",
};

interface SidebarProps {
  activeNav: string;
  onNav: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

const ROLE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  root:       { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
  admin:      { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
  directeur:  { bg: "#f5f3ff", text: "#7c3aed", dot: "#8b5cf6" },
  fondateur:  { bg: "#fffbeb", text: "#d97706", dot: "#f59e0b" },
  enseignant: { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
  parent:     { bg: "#fdf2f8", text: "#db2777", dot: "#ec4899" },
};

function getInitials(name?: string): string {
  if (!name) return "ET";
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNav, open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userRole = user?.role ?? "";
  const userFullname = user?.name ?? "Utilisateur";
  const roleStyle = ROLE_COLORS[userRole] ?? { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" };

  const filtered = NAV_ITEMS.filter(item => !item.roles || item.roles.includes(userRole));

  const sectionOrder = ["principal", "gestion", "finances", "outils", "admin"];
  const grouped = sectionOrder
    .map(sec => ({ key: sec, items: filtered.filter(i => i.section === sec) }))
    .filter(g => g.items.length > 0);

  const handleNav = (item: NavItem) => {
    onNav(item.id);
    if (item.path) navigate(item.path);
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        w-[260px]
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:relative
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
        style={{
          background: "linear-gradient(180deg, #0d2118 0%, #111d16 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>

        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, #22c55e 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-between px-5 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Logo variant="full" theme="dark" size="sm" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {grouped.map(({ key, items }) => (
            <div key={key}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                {SECTIONS[key]}
              </p>
              <div className="space-y-0.5">
                {items.map(item => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-150"
                      style={{
                        background: isActive ? "rgba(34,197,94,0.18)" : "transparent",
                        color: isActive ? "#4ade80" : "rgba(255,255,255,0.55)",
                        borderLeft: isActive ? "2px solid #22c55e" : "2px solid transparent",
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? "#4ade80" : "rgba(255,255,255,0.35)" }} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: isActive ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.12)", color: isActive ? "#4ade80" : "rgba(255,255,255,0.6)" }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Pied de page */}
        <div className="relative z-10 p-3 border-t space-y-1"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>

          {/* Mon profil */}
          <button
            onClick={() => { navigate("/mon-profil"); onClose(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            <UserCircle className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
            <span>Mon profil</span>
          </button>

          {/* Utilisateur connecté */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.05)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}>
                {getInitials(userFullname)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold truncate leading-tight" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {userFullname}
                </p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {user?.username}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
                style={{ color: "rgba(255,255,255,0.3)" }} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl overflow-hidden z-20"
                  style={{
                    background: "#1a2e1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
                  }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Connecté en tant que</p>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: roleStyle.bg, color: roleStyle.text }}>
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => { logout(); navigate("/login"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors"
                    style={{ color: "#f87171" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
