import { useState } from 'react';
import { GraduationCap, Upload, FileText, Bug } from 'lucide-react';
import { CSVImport } from './components/CSVImport';
import { SeanceV01c } from './components/SeanceV01c';
import { ModeEmploi } from './components/ModeEmploi';
import { DebugPanel } from './components/DebugPanel';

type View = 'home' | 'import' | 'seance' | 'docs' | 'debug';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImportComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ST2S Tool</h1>
                <p className="text-xs text-gray-500">Version 0.1c - Restauration Baseline</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'home'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => setCurrentView('import')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'import'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </button>
              <button
                onClick={() => setCurrentView('seance')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'seance'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Séance V0.1c
              </button>
              <button
                onClick={() => setCurrentView('docs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'docs'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                Mode d'emploi
              </button>
              <button
                onClick={() => setCurrentView('debug')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'debug'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bug className="w-4 h-4" />
                Debug
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenue sur ST2S Tool
              </h2>
              <p className="text-gray-600 mb-6">
                Outil pédagogique pour la gestion des séances ST2S
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <button
                  onClick={() => setCurrentView('import')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Import CSV</h3>
                  <p className="text-sm text-gray-600">
                    Importer les listes d'élèves
                  </p>
                </button>
                <button
                  onClick={() => setCurrentView('seance')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Séance V0.1c</h3>
                  <p className="text-sm text-gray-600">
                    Démarrer une séance
                  </p>
                </button>
                <button
                  onClick={() => setCurrentView('docs')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Documentation</h3>
                  <p className="text-sm text-gray-600">
                    Guide et checklist
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Démarrage rapide</h3>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">1.</span>
                    <span>Importez vos fichiers CSV (1re_A.csv, 1re_B.csv)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">2.</span>
                    <span>Accédez à "Séance V0.1c"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">3.</span>
                    <span>Sélectionnez classe et groupe, puis démarrez</span>
                  </li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">Fonctionnalités V0.1c</h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Import CSV avec séparateur point-virgule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Filtrage automatique par classe et groupe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Recherche dynamique sur nom et prénom</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Tri alphabétique automatique</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentView === 'import' && (
          <CSVImport key={refreshKey} onImportComplete={handleImportComplete} />
        )}

        {currentView === 'seance' && (
          <SeanceV01c key={refreshKey} />
        )}

        {currentView === 'docs' && (
          <ModeEmploi />
        )}

        {currentView === 'debug' && (
          <DebugPanel key={refreshKey} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            ST2S Tool V0.1c - Baseline de restauration - Mode verrouillé (Supabase DB)
          </p>
        </div>
      </footer>
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default App;
