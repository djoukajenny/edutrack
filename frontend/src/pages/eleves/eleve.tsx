// src/pages/eleves/eleve.tsx — EduTrack — Palette vert forêt
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus, Search, Filter, Eye, Edit,
  Archive, ArchiveRestore, Trash2, Users, UserCheck,
} from "lucide-react";
import {
  getEleves, archiverEleve, reactiverEleve, deleteEleve,
  type Eleve, type ElevePaginate, type EleveFilters, getSexeLabel,
} from "../../service/eleve_service";

function avatarInitials(prenom?: string, nom?: string) {
  return `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase();
}

export default function ElevesList() {
  const navigate = useNavigate();
  const [eleves, setEleves]   = useState<ElevePaginate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [search, setSearch]   = useState("");
  const [actif, setActif]     = useState("");
  const [page, setPage]       = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchEleves = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getEleves({ page, search: search.trim() || undefined, actif: actif || undefined } as EleveFilters);
      setEleves(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger les élèves");
    } finally { setLoading(false); }
  }, [search, actif, page]);

  useEffect(() => { fetchEleves(); }, [fetchEleves]);

  const handleArchiver = async (matricule: number) => {
    if (!confirm("Archiver cet élève ?")) return;
    try { await archiverEleve(matricule); fetchEleves(); } catch (err: any) { alert(err.message); }
  };
  const handleReactiver = async (matricule: number) => {
    try { await reactiverEleve(matricule); fetchEleves(); } catch (err: any) { alert(err.message); }
  };
  const handleSupprimer = async (matricule: number) => {
    if (!confirm("⚠️ Supprimer définitivement cet élève ?")) return;
    try { await deleteEleve(matricule); fetchEleves(); } catch (err: any) { alert(err.message); }
  };

  const totalActifs   = eleves?.data.filter(e => e.actif).length ?? 0;
  const totalArchives = eleves?.data.filter(e => !e.actif).length ?? 0;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

      {/* ── Bannière vert forêt ── */}
      <div className={`rounded-2xl px-6 py-5 relative overflow-hidden transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        style={{ background: "linear-gradient(135deg, #0d2118 0%, #1a4731 60%, #0d2118 100%)", boxShadow: "0 4px 20px rgba(13,33,24,0.3)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at right, rgba(34,197,94,0.12) 0%, transparent 70%)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Gestion des élèves</p>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Élèves inscrits</h1>
            <p className="text-slate-400 text-sm mt-1">
              {eleves ? `${eleves.total} élève${eleves.total > 1 ? "s" : ""} au total` : "Chargement…"}
            </p>
          </div>
          <button onClick={() => navigate("/eleves/nouveau")}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-[0.97]"
            style={{ boxShadow: "0 2px 12px rgba(34,197,94,0.35)" }}>
            <UserPlus className="w-4 h-4" /> Nouvel élève
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total inscrits", value: eleves?.total ?? 0, icon: Users,     accent: "#22c55e", bg: "rgba(34,197,94,0.08)" },
          { label: "Actifs",         value: totalActifs,         icon: UserCheck, accent: "#16a34a", bg: "rgba(22,163,74,0.08)" },
          { label: "Archivés",       value: totalArchives,       icon: Archive,   accent: "#64748b", bg: "rgba(100,116,139,0.08)" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100"
            style={{ boxShadow: "0 1px 6px rgba(13,33,24,0.06)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.accent }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{s.value}</p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom, prénom ou matricule…"
            className="input pl-10" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select value={actif} onChange={e => { setActif(e.target.value); setPage(1); }}
            className="input pl-9 pr-8 appearance-none cursor-pointer min-w-[160px]">
            <option value="">Tous les statuts</option>
            <option value="1">Actifs</option>
            <option value="0">Archivés</option>
          </select>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* ── Tableau ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
        style={{ boxShadow: "0 1px 6px rgba(13,33,24,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr>
              {["Élève", "Matricule", "Naissance", "Sexe", "Statut", "Actions"].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="table-td"><div className="skeleton h-4 rounded w-3/4" /></td>
                  ))}
                </tr>
              ))
            ) : !eleves || eleves.data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-50">
                      <Users className="w-7 h-7 text-emerald-600" />
                    </div>
                    <p className="text-slate-500 font-medium">Aucun élève trouvé</p>
                    <button onClick={() => navigate("/eleves/nouveau")}
                      className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors">
                      <UserPlus className="w-4 h-4" /> Inscrire un élève
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              eleves.data.map((e: Eleve) => (
                <tr key={e.matricule}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  onClick={() => navigate(`/eleves/${e.matricule}`)}>
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-emerald-600">
                        {avatarInitials(e.prenom, e.nom)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{e.prenom} {e.nom}</p>
                        <p className="text-xs text-slate-400">{e.villeNaissance?.libelle || e.lieuNaissance}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{e.matricule}</span>
                  </td>
                  <td className="table-td text-sm text-slate-600">
                    {new Date(e.dateNaissance).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="table-td text-sm text-slate-600">{getSexeLabel(e.sexe)}</td>
                  <td className="table-td">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      e.actif
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${e.actif ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {e.actif ? "Actif" : "Archivé"}
                    </span>
                  </td>
                  <td className="table-td" onClick={ev => ev.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/eleves/${e.matricule}`)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate(`/eleves/${e.matricule}/modifier`)}
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      {e.actif ? (
                        <button onClick={() => handleArchiver(e.matricule)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors">
                          <Archive className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleReactiver(e.matricule)}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors">
                          <ArchiveRestore className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleSupprimer(e.matricule)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {eleves && eleves.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Page <span className="font-semibold text-slate-700">{eleves.current_page}</span> sur {eleves.last_page} · {eleves.total} résultats
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="btn-secondary py-2 px-4 disabled:opacity-40">Précédent</button>
            <button onClick={() => setPage(p => Math.min(eleves.last_page, p + 1))} disabled={page === eleves.last_page}
              className="btn-secondary py-2 px-4 disabled:opacity-40">Suivant</button>
          </div>
        </div>
      )}
    </div>
  );
}
