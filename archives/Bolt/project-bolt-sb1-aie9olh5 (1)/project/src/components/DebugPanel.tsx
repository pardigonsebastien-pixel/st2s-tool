import { useState, useEffect } from 'react';
import { Bug, RefreshCw, Eye, PlusCircle, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, Eleve } from '../lib/supabase';

interface DistributionRow {
  classe_groupe: string;
  count: number;
}

export function DebugPanel() {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [distribution, setDistribution] = useState<DistributionRow[]>([]);
  const [preview, setPreview] = useState<Eleve[]>([]);
  const [allEleves, setAllEleves] = useState<Eleve[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [injecting, setInjecting] = useState(false);
  const [injectResult, setInjectResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadDebugData = async () => {
    setLoading(true);
    try {
      const { data: allData, error } = await supabase
        .from('eleves')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;

      const eleves = allData || [];
      setTotalCount(eleves.length);
      setAllEleves(eleves);

      const dist: Record<string, number> = {};
      eleves.forEach((eleve) => {
        const key = `${eleve.classe}_${eleve.groupe}`;
        dist[key] = (dist[key] || 0) + 1;
      });

      const distArray = Object.entries(dist).map(([key, count]) => ({
        classe_groupe: key,
        count
      }));
      setDistribution(distArray);

      setPreview(eleves.slice(0, 5));

      console.log('[Debug] Données chargées:', {
        total: eleves.length,
        distribution: dist
      });
    } catch (error) {
      console.error('[Debug] Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInjectTestStudents = async () => {
    setInjecting(true);
    setInjectResult(null);

    try {
      const testStudents: Omit<Eleve, 'created_at' | 'updated_at'>[] = [
        {
          eleve_id: '1A-001',
          nom: 'DUPONT',
          prenom: 'Leila',
          photo: null,
          classe: '1re',
          groupe: 'A',
          pretotal: 0
        },
        {
          eleve_id: '1A-002',
          nom: 'ALI',
          prenom: 'Yanis',
          photo: null,
          classe: '1re',
          groupe: 'A',
          pretotal: 0
        },
        {
          eleve_id: '1A-003',
          nom: 'MADI',
          prenom: 'Amina',
          photo: null,
          classe: '1re',
          groupe: 'A',
          pretotal: 0
        }
      ];

      let successCount = 0;
      const errors: string[] = [];

      for (const student of testStudents) {
        const { data, error } = await supabase
          .from('eleves')
          .upsert(student, { onConflict: 'eleve_id' })
          .select();

        if (error) {
          console.error(`[Debug] Erreur insertion ${student.eleve_id}:`, error);
          errors.push(`${student.eleve_id}: ${error.message}`);
        } else {
          successCount++;
          console.log(`[Debug] Élève ${student.eleve_id} inséré avec succès:`, data);
        }
      }

      if (errors.length > 0) {
        throw new Error(`${errors.length} échec(s): ${errors.join('; ')}`);
      }

      console.log('[Debug] Élèves de test injectés:', {
        nombre: successCount,
        classe: '1re',
        groupe: 'A',
        ids: testStudents.map(s => s.eleve_id)
      });

      setInjectResult({
        success: true,
        message: `3 élèves de test (1re_A) ajoutés avec succès`
      });

      setTimeout(() => {
        loadDebugData();
        setInjectResult(null);
      }, 2000);

    } catch (error) {
      console.error('[Debug] Erreur injection:', error);
      setInjectResult({
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setInjecting(false);
    }
  };

  const handleDeleteTestStudents = async () => {
    if (deleteInput !== 'VALIDER') return;

    setDeleting(true);

    try {
      const testIds = ['1A-001', '1A-002', '1A-003'];
      let successCount = 0;
      const errors: string[] = [];

      for (const id of testIds) {
        const { error } = await supabase
          .from('eleves')
          .delete()
          .eq('eleve_id', id);

        if (error) {
          console.error(`[Debug] Erreur suppression ${id}:`, error);
          errors.push(`${id}: ${error.message}`);
        } else {
          successCount++;
          console.log(`[Debug] Élève ${id} supprimé avec succès`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`${errors.length} échec(s): ${errors.join('; ')}`);
      }

      console.log('[Debug] Élèves de test supprimés:', {
        nombre: successCount,
        ids: testIds
      });

      setInjectResult({
        success: true,
        message: `${successCount} élève(s) de test supprimé(s) avec succès`
      });

      setTimeout(() => {
        loadDebugData();
        setInjectResult(null);
        setShowDeleteModal(false);
        setDeleteInput('');
      }, 2000);

    } catch (error) {
      console.error('[Debug] Erreur suppression:', error);
      setInjectResult({
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    loadDebugData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-yellow-700" />
            <h2 className="text-lg font-semibold text-yellow-900">[Debug] Panneau de diagnostic</h2>
          </div>
          <button
            onClick={loadDebugData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-1">Total élèves</div>
            <div className="text-3xl font-bold text-yellow-900">{totalCount}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-1">Classes distinctes</div>
            <div className="text-3xl font-bold text-yellow-900">
              {new Set(allEleves.map(e => e.classe)).size}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-1">Groupes distincts</div>
            <div className="text-3xl font-bold text-yellow-900">
              {new Set(allEleves.map(e => e.groupe)).size}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-yellow-200 mb-4">
          <h3 className="font-semibold text-yellow-900 mb-3">Répartition classe/groupe</h3>
          {distribution.length === 0 ? (
            <p className="text-sm text-yellow-700">Aucune donnée disponible</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-yellow-700">Classe_Groupe</th>
                  <th className="px-4 py-2 text-left font-medium text-yellow-700">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {distribution.map((row, idx) => (
                  <tr key={idx} className="border-t border-yellow-100">
                    <td className="px-4 py-2 font-mono text-yellow-900">{row.classe_groupe}</td>
                    <td className="px-4 py-2 font-semibold text-yellow-900">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border border-yellow-200 mb-4">
          <h3 className="font-semibold text-yellow-900 mb-3">Aperçu (5 premières lignes)</h3>
          {preview.length === 0 ? (
            <p className="text-sm text-yellow-700">Aucune donnée disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-yellow-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">ID</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">Classe</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">Groupe</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">Nom</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">Prénom</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((eleve, idx) => (
                    <tr key={idx} className="border-t border-yellow-100">
                      <td className="px-4 py-2 font-mono text-yellow-900">{eleve.eleve_id}</td>
                      <td className="px-4 py-2 text-yellow-900">{eleve.classe}</td>
                      <td className="px-4 py-2 text-yellow-900">{eleve.groupe}</td>
                      <td className="px-4 py-2 text-yellow-900 uppercase">{eleve.nom}</td>
                      <td className="px-4 py-2 text-yellow-900 lowercase">{eleve.prenom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border border-yellow-200 mb-4">
          <h3 className="font-semibold text-yellow-900 mb-3">Actions de test</h3>
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleInjectTestStudents}
              disabled={injecting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              {injecting ? 'Injection...' : 'Injecter élèves de test (1re_A)'}
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer élèves de test
            </button>
          </div>

          {injectResult && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${injectResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {injectResult.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm">{injectResult.message}</span>
            </div>
          )}

          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <strong>Info:</strong> Les élèves de test (1A-001, 1A-002, 1A-003) permettent de vérifier le filtre et la palette sans import CSV.
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-yellow-200">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium text-sm"
          >
            <Eye className="w-4 h-4" />
            {showAll ? 'Masquer' : 'Afficher TOUT (bypass filtre)'}
          </button>

          {showAll && (
            <div className="mt-4 overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-yellow-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">ID</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">Classe</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">Groupe</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">Nom</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">Prénom</th>
                    <th className="px-4 py-2 text-left font-medium text-yellow-700">PreTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {allEleves.map((eleve, idx) => (
                    <tr key={idx} className="border-t border-yellow-100 hover:bg-yellow-50">
                      <td className="px-4 py-2 font-mono text-yellow-900">{eleve.eleve_id}</td>
                      <td className="px-4 py-2 text-yellow-900">{eleve.classe}</td>
                      <td className="px-4 py-2 text-yellow-900">{eleve.groupe}</td>
                      <td className="px-4 py-2 text-yellow-900 uppercase">{eleve.nom}</td>
                      <td className="px-4 py-2 text-yellow-900 lowercase">{eleve.prenom}</td>
                      <td className="px-4 py-2 text-yellow-900">{eleve.pretotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-700 mb-4">
              Cette action va supprimer les 3 élèves de test (1A-001, 1A-002, 1A-003).
            </p>
            <p className="text-gray-700 mb-4">
              Pour confirmer, veuillez saisir <strong>VALIDER</strong> ci-dessous :
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Saisir VALIDER"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteInput('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteTestStudents}
                disabled={deleteInput !== 'VALIDER' || deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
