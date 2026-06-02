// AppLayout.tsx — EduTrack SGS
// Layout vertical : Sidebar gauche + contenu à droite

import { useState, useEffect } from "react";
import { authFetch } from "../../service/auth";
import { useLocation } from "react-router-dom";
import Sidebar from "../../pages/composants/sidebar";
import { Menu, Bell } from "lucide-react";
import NotificationBell from "../../pages/composants/NotificationBell";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

// Map path → id de navigation
const PATH_TO_NAV: Record<string, string> = {
  "/dashboard": "dashboard",
  "/eleves": "eleves",
  "/enseignants": "enseignants",
  "/notes": "notes",
  "/inscriptions": "inscriptions",
  "/classes": "classes",
  "/cours": "cours",
  "/salles": "salles",
  "/annees": "annees",
  "/emploi-du-temps": "emploi-du-temps",
  "/scolarites": "scolarites",
  "/finance": "finance",
  "/paiements/stats": "stats",
  "/communication": "communication",
  "/bibliotheque": "bibliotheque",
  "/admin/utilisateurs": "utilisateurs",
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [annees, setAnnees] = useState<{ idAnnee: number; libelle: string }[]>([]);
  const [selectedAnnee, setSelectedAnnee] = useState<string>("");

  const activeNav = PATH_TO_NAV[location.pathname] ?? "dashboard";

  useEffect(() => {
    authFetch(`${API}/annees`)
      .then(r => r.json())
      .then((data: any) => {
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setAnnees(list);
        if (list.length > 0) setSelectedAnnee(String(list[list.length - 1].idAnnee));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f4f7f4", fontFamily: "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNav={() => {}}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Barre supérieure mobile + année académique */}
        <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-stone-100 shrink-0" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-4">
            {/* Hamburger mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Sélecteur d'année */}
            {annees.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-medium hidden sm:block">Année :</span>
                <select
                  value={selectedAnnee}
                  onChange={e => setSelectedAnnee(e.target.value)}
                  className="text-sm font-semibold text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                >
                  {annees.map(a => (
                    <option key={a.idAnnee} value={String(a.idAnnee)}>
                      {a.libelle}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Cloche notifications */}
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>

        {/* Zone de contenu scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
