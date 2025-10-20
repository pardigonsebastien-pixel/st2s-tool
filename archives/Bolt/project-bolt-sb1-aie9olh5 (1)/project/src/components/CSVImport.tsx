import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, Eleve } from '../lib/supabase';

interface CSVImportProps {
  onImportComplete: () => void;
}

interface ParsedRow {
  eleve_id: string;
  nom: string;
  prenom: string;
  photo?: string;
  classe?: string;
  groupe?: string;
}

interface ImportStats {
  total: number;
  distribution: Record<string, number>;
}

export function CSVImport({ onImportComplete }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [classeGroupe, setClasseGroupe] = useState<{ classe: '1re' | 'Tle'; groupe: 'A' | 'B' }>({ classe: '1re', groupe: 'A' });
  const [separatorWarning, setSeparatorWarning] = useState(false);

  const normalizeClasse = (value: string | undefined): '1re' | 'Tle' | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (trimmed === '1re' || trimmed === '1ère' || trimmed === 'Première') return '1re';
    if (trimmed === 'Tle' || trimmed === 'Terminale') return 'Tle';
    return null;
  };

  const normalizeGroupe = (value: string | undefined): 'A' | 'B' | null => {
    if (!value) return null;
    const trimmed = value.trim().toUpperCase();
    if (trimmed === 'A' || trimmed === 'B') return trimmed as 'A' | 'B';
    return null;
  };

  const parseCSV = (text: string): { headers: string[]; rows: ParsedRow[]; hasSemicolon: boolean } => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return { headers: [], rows: [], hasSemicolon: true };

    const firstLine = lines[0];
    const hasSemicolon = firstLine.includes(';');
    const separator = hasSemicolon ? ';' : ',';

    const headers = firstLine.split(separator).map(h => h.trim());
    const rows: ParsedRow[] = [];

    for (let i = 1; i < Math.min(6, lines.length); i++) {
      const values = lines[i].split(separator).map(v => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      if (row.eleve_id && row.nom && row.prenom) {
        rows.push({
          eleve_id: row.eleve_id.trim(),
          nom: row.nom.trim(),
          prenom: row.prenom.trim(),
          photo: row.photo?.trim() || undefined,
          classe: row.classe?.trim() || undefined,
          groupe: row.groupe?.trim() || undefined
        });
      }
    }

    return { headers, rows, hasSemicolon };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setSeparatorWarning(false);

    const fileName = selectedFile.name.toLowerCase();
    if (fileName.includes('1re_a') || fileName.includes('1rea')) {
      setClasseGroupe({ classe: '1re', groupe: 'A' });
    } else if (fileName.includes('1re_b') || fileName.includes('1reb')) {
      setClasseGroupe({ classe: '1re', groupe: 'B' });
    } else if (fileName.includes('tle_a') || fileName.includes('tlea')) {
      setClasseGroupe({ classe: 'Tle', groupe: 'A' });
    } else if (fileName.includes('tle_b') || fileName.includes('tleb')) {
      setClasseGroupe({ classe: 'Tle', groupe: 'B' });
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const { headers, rows, hasSemicolon } = parseCSV(text);
      setHeaders(headers);
      setPreview(rows);
      setSeparatorWarning(!hasSemicolon);
    };
    reader.readAsText(selectedFile, 'UTF-8');
  };

  const validateHeaders = (): boolean => {
    const required = ['eleve_id', 'nom', 'prenom'];
    return required.every(req => headers.includes(req));
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      const firstLine = lines[0];
      const separator = firstLine.includes(';') ? ';' : ',';
      const fileHeaders = firstLine.split(separator).map(h => h.trim());

      const elevesToInsert: Omit<Eleve, 'created_at' | 'updated_at'>[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(separator).map(v => v.trim());
        const row: any = {};

        fileHeaders.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        if (row.eleve_id && row.nom && row.prenom) {
          const eleveId = row.eleve_id.trim();
          const nom = row.nom.trim();
          const prenom = row.prenom.trim();
          const photo = row.photo?.trim() || null;

          let classe: '1re' | 'Tle';
          let groupe: 'A' | 'B';

          if (row.classe) {
            const normalizedClasse = normalizeClasse(row.classe);
            if (!normalizedClasse) {
              errors.push(`Ligne ${i + 1}: classe invalide "${row.classe}" (attendu: 1re ou Tle)`);
              continue;
            }
            classe = normalizedClasse;
          } else {
            classe = classeGroupe.classe;
          }

          if (row.groupe) {
            const normalizedGroupe = normalizeGroupe(row.groupe);
            if (!normalizedGroupe) {
              errors.push(`Ligne ${i + 1}: groupe invalide "${row.groupe}" (attendu: A ou B)`);
              continue;
            }
            groupe = normalizedGroupe;
          } else {
            groupe = classeGroupe.groupe;
          }

          elevesToInsert.push({
            eleve_id: eleveId,
            nom: nom,
            prenom: prenom,
            photo: photo,
            classe: classe,
            groupe: groupe,
            pretotal: Number(row.pretotal || row.preTotal) || 0
          });
        }
      }

      if (errors.length > 0) {
        console.error('Erreurs de validation:', errors);
        setResult({
          success: false,
          message: `Erreurs de validation: ${errors.join('; ')}`
        });
        setImporting(false);
        return;
      }

      for (const eleve of elevesToInsert) {
        await supabase
          .from('eleves')
          .upsert(eleve, { onConflict: 'eleve_id' });
      }

      const stats: ImportStats = {
        total: elevesToInsert.length,
        distribution: {}
      };

      elevesToInsert.forEach((eleve) => {
        const key = `${eleve.classe}_${eleve.groupe}`;
        stats.distribution[key] = (stats.distribution[key] || 0) + 1;
      });

      const distributionText = Object.entries(stats.distribution)
        .map(([key, count]) => `${key}=${count}`)
        .join(', ');

      console.log('Import CSV normalisé:', {
        fichier: file.name,
        encodage: 'UTF-8',
        separateur: separator,
        lignesImportees: elevesToInsert.length,
        entetes: fileHeaders,
        repartition: stats.distribution
      });

      setResult({
        success: true,
        message: `Insérés/Mis à jour: ${stats.total}. Répartition: ${distributionText}`
      });

      setTimeout(() => {
        onImportComplete();
        setFile(null);
        setPreview([]);
        setHeaders([]);
        setSeparatorWarning(false);
      }, 3000);

    } catch (error) {
      console.error('Import error:', error);
      setResult({
        success: false,
        message: `Erreur lors de l'import: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setImporting(false);
    }
  };

  const isValid = validateHeaders();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Import CSV (Hotfix V1.0.1)</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un fichier CSV (séparateur ; recommandé)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {separatorWarning && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-orange-50 text-orange-800">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Séparateur point-virgule (;) non détecté. Utilisation de virgule (,) comme fallback.</span>
          </div>
        )}

        {file && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classe importée (si absente dans CSV)
                </label>
                <select
                  value={classeGroupe.classe}
                  onChange={(e) => setClasseGroupe({ ...classeGroupe, classe: e.target.value as '1re' | 'Tle' })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="1re">Première (1re)</option>
                  <option value="Tle">Terminale (Tle)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Groupe importé (si absent dans CSV)
                </label>
                <select
                  value={classeGroupe.groupe}
                  onChange={(e) => setClasseGroupe({ ...classeGroupe, groupe: e.target.value as 'A' | 'B' })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Entêtes détectées: {headers.join(', ')}
              </p>
              <p className="text-xs text-gray-600">
                Attendu minimal: eleve_id, nom, prenom (optionnels: photo, classe, groupe, pretotal)
              </p>
              {!isValid && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Entêtes requises manquantes (eleve_id, nom, prenom)</span>
                </div>
              )}
            </div>

            {preview.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Aperçu (5 premières lignes):
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">ID</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Nom</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Prénom</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Classe</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Groupe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="px-4 py-2">{row.eleve_id}</td>
                          <td className="px-4 py-2">{row.nom}</td>
                          <td className="px-4 py-2">{row.prenom}</td>
                          <td className="px-4 py-2">
                            <span className={row.classe ? 'text-green-700' : 'text-orange-600'}>
                              {row.classe || `→ ${classeGroupe.classe}`}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={row.groupe ? 'text-green-700' : 'text-orange-600'}>
                              {row.groupe || `→ ${classeGroupe.groupe}`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!isValid || importing}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {importing ? 'Import en cours...' : 'Importer avec normalisation'}
            </button>

            {result && (
              <div className={`flex items-center gap-2 p-3 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {result.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm">{result.message}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
