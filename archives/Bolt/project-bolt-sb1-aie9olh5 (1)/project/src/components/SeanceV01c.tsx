import { useState, useEffect, useMemo } from 'react';
import { Search, Download, XCircle, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, Eleve } from '../lib/supabase';
import { ParticipationPalette } from './ParticipationPalette';
import { SessionData, ClickValue } from '../types/participation';
import {
  initializeParticipation,
  addClickToParticipation,
  undoLastClick,
  toggleCap
} from '../utils/sessionCalculations';
import {
  generateParticipationCSV,
  generateClicksCSV,
  downloadCSV,
  formatDatetimeForFilename
} from '../utils/csvExport';

export function SeanceV01c() {
  const [classe, setClasse] = useState<'1re' | 'Tle'>('1re');
  const [groupe, setGroupe] = useState<'A' | 'B'>('A');
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [seanceStarted, setSeanceStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [terminateInput, setTerminateInput] = useState('');
  const [copiedSessionId, setCopiedSessionId] = useState(false);

  const loadEleves = async () => {
    setLoading(true);
    try {
      const { data: allData, error } = await supabase
        .from('eleves')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;

      const filtered = (allData || []).filter((eleve) => {
        const eleveClasse = eleve.classe?.trim().toLowerCase() || '';
        const eleveGroupe = eleve.groupe?.trim().toLowerCase() || '';
        const targetClasse = classe.trim().toLowerCase();
        const targetGroupe = groupe.trim().toLowerCase();

        return eleveClasse === targetClasse && eleveGroupe === targetGroupe;
      });

      setEleves(filtered);
      setFilteredEleves(filtered);

      console.log('[Filtre] Résultat:', {
        classe: classe,
        groupe: groupe,
        total_base: allData?.length || 0,
        apres_filtre: filtered.length
      });
    } catch (error) {
      console.error('Erreur chargement élèves:', error);
      setEleves([]);
      setFilteredEleves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seanceStarted && sessionData) {
      loadEleves();
    }
  }, [classe, groupe]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEleves(eleves);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = eleves.filter(
      (e) =>
        e.nom.toLowerCase().includes(term) ||
        e.prenom.toLowerCase().includes(term)
    );
    setFilteredEleves(filtered);
  }, [searchTerm, eleves]);

  const handleStartSeance = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('eleves')
        .select('*')
        .eq('classe', classe)
        .eq('groupe', groupe)
        .order('nom', { ascending: true });

      if (error) throw error;

      const loadedEleves = data || [];
      setEleves(loadedEleves);
      setFilteredEleves(loadedEleves);

      const sessionId = crypto.randomUUID();
      const sessionDatetime = new Date().toISOString();

      const elevesParticipation: Record<string, any> = {};
      loadedEleves.forEach((eleve) => {
        elevesParticipation[eleve.eleve_id] = initializeParticipation(
          eleve.eleve_id,
          eleve.pretotal || 0
        );
      });

      const newSession: SessionData = {
        session_id: sessionId,
        session_datetime: sessionDatetime,
        classe: `${classe}_${groupe}`,
        groupe: groupe,
        eleves: elevesParticipation
      };

      setSessionData(newSession);
      setSeanceStarted(true);

      console.log('Session créée:', {
        session_id: sessionId,
        nombre_eleves: loadedEleves.length,
        classe: classe,
        groupe: groupe
      });
    } catch (error) {
      console.error('Erreur démarrage séance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (eleveId: string, value: ClickValue) => {
    if (!sessionData) return;

    const startTime = performance.now();

    setSessionData((prev) => {
      if (!prev) return prev;

      const participation = prev.eleves[eleveId];
      if (!participation) return prev;

      const updated = addClickToParticipation(participation, value);

      const endTime = performance.now();
      const latency = endTime - startTime;

      console.log('Clic ajouté:', {
        eleve_id: eleveId,
        value,
        session_raw: updated.session_raw,
        session_capped: updated.session_capped,
        latence_ms: latency.toFixed(2)
      });

      return {
        ...prev,
        eleves: {
          ...prev.eleves,
          [eleveId]: updated
        }
      };
    });
  };

  const handleUndo = (eleveId: string) => {
    if (!sessionData) return;

    setSessionData((prev) => {
      if (!prev) return prev;

      const participation = prev.eleves[eleveId];
      if (!participation) return prev;

      const updated = undoLastClick(participation);

      console.log('Undo effectué:', {
        eleve_id: eleveId,
        clicks_restants: updated.clicks.length
      });

      return {
        ...prev,
        eleves: {
          ...prev.eleves,
          [eleveId]: updated
        }
      };
    });
  };

  const handleToggleCap = (eleveId: string) => {
    if (!sessionData) return;

    setSessionData((prev) => {
      if (!prev) return prev;

      const participation = prev.eleves[eleveId];
      if (!participation) return prev;

      const updated = toggleCap(participation);

      console.log('Cap togglé:', {
        eleve_id: eleveId,
        cap_applied: updated.cap_applied,
        session_capped: updated.session_capped
      });

      return {
        ...prev,
        eleves: {
          ...prev.eleves,
          [eleveId]: updated
        }
      };
    });
  };

  const handleExportCSV = () => {
    if (!sessionData) return;

    const elevesMap = new Map(eleves.map((e) => [e.eleve_id, e]));

    const participationCSV = generateParticipationCSV(sessionData, elevesMap);
    const clicksCSV = generateClicksCSV(sessionData);

    const dateStr = formatDatetimeForFilename(sessionData.session_datetime);

    downloadCSV(participationCSV, `Participation_Session_${dateStr}.csv`);
    downloadCSV(clicksCSV, `Clicks_Session_${dateStr}.csv`);

    const totalClicks = Object.values(sessionData.eleves).reduce(
      (sum, p) => sum + p.clicks.length,
      0
    );

    console.log('Exports CSV générés:', {
      fichiers: [
        `Participation_Session_${dateStr}.csv`,
        `Clicks_Session_${dateStr}.csv`
      ],
      nombre_eleves: Object.keys(sessionData.eleves).length,
      total_clics: totalClicks
    });
  };

  const handleTerminateSession = () => {
    if (terminateInput !== 'VALIDER') return;

    console.log('Confirmation "VALIDER" reçue - Session terminée:', {
      session_id: sessionData?.session_id,
      total_clicks: sessionData
        ? Object.values(sessionData.eleves).reduce((sum, p) => sum + p.clicks.length, 0)
        : 0
    });

    setSessionData(null);
    setSeanceStarted(false);
    setEleves([]);
    setFilteredEleves([]);
    setShowTerminateModal(false);
    setTerminateInput('');
  };

  const handleCopySessionId = () => {
    if (sessionData) {
      navigator.clipboard.writeText(sessionData.session_id);
      setCopiedSessionId(true);
      setTimeout(() => setCopiedSessionId(false), 2000);
    }
  };

  const totalClicks = useMemo(() => {
    if (!sessionData) return 0;
    return Object.values(sessionData.eleves).reduce(
      (sum, p) => sum + p.clicks.length,
      0
    );
  }, [sessionData]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {seanceStarted ? 'Séance en cours' : 'En-tête de séance'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe
            </label>
            <select
              value={classe}
              onChange={(e) => setClasse(e.target.value as '1re' | 'Tle')}
              disabled={seanceStarted}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="1re">Première</option>
              <option value="Tle">Terminale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Groupe
            </label>
            <select
              value={groupe}
              onChange={(e) => setGroupe(e.target.value as 'A' | 'B')}
              disabled={seanceStarted}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date / Heure
            </label>
            <input
              type="text"
              value={
                sessionData
                  ? new Date(sessionData.session_datetime).toLocaleString('fr-FR')
                  : new Date().toLocaleString('fr-FR')
              }
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            />
          </div>

          <div className="flex items-end">
            {!seanceStarted ? (
              <button
                onClick={handleStartSeance}
                disabled={loading}
                className="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Chargement...' : 'Démarrer la séance'}
              </button>
            ) : (
              <button
                onClick={() => setShowTerminateModal(true)}
                className="w-full px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Terminer
              </button>
            )}
          </div>
        </div>

        {seanceStarted && sessionData && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Session ID</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-blue-900 break-all">
                    {sessionData.session_id}
                  </code>
                  <button
                    onClick={handleCopySessionId}
                    className="p-1 hover:bg-blue-100 rounded"
                    title="Copier"
                  >
                    {copiedSessionId ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Statistiques</div>
                <div className="text-lg font-semibold text-green-900">
                  {eleves.length} élèves • {totalClicks} clics
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exporter CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {seanceStarted && sessionData && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Participation - {classe === '1re' ? 'Première' : 'Terminale'} / Groupe {groupe}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                  Filtre: Classe={classe} | Groupe={groupe}
                </span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {filteredEleves.length} élève{filteredEleves.length !== 1 ? 's' : ''} affiché{filteredEleves.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un élève (nom ou prénom)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Chargement des élèves...
            </div>
          ) : eleves.length === 0 ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-900">Aucun élève pour ce filtre</h4>
              </div>
              <p className="text-sm text-orange-800 mb-3">
                Vérifiez classe/groupe dans la base ou réimportez avec normalisation (Hotfix V1.0.1).
              </p>
              <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
                Filtre actif: Classe={classe}, Groupe={groupe}
              </div>
            </div>
          ) : filteredEleves.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun élève ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEleves.map((eleve) => {
                const participation = sessionData.eleves[eleve.eleve_id];
                if (!participation) return null;

                return (
                  <ParticipationPalette
                    key={eleve.eleve_id}
                    eleve={eleve}
                    participation={participation}
                    onAddClick={handleAddClick}
                    onUndo={handleUndo}
                    onToggleCap={handleToggleCap}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {showTerminateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirmer la fin de séance
            </h3>
            <p className="text-gray-700 mb-4">
              Cette action va réinitialiser toutes les données de participation de la séance en cours.
            </p>
            <p className="text-gray-700 mb-4">
              Pour confirmer, veuillez saisir <strong>VALIDER</strong> ci-dessous :
            </p>
            <input
              type="text"
              value={terminateInput}
              onChange={(e) => setTerminateInput(e.target.value)}
              placeholder="Saisir VALIDER"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTerminateModal(false);
                  setTerminateInput('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleTerminateSession}
                disabled={terminateInput !== 'VALIDER'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Terminer la séance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
