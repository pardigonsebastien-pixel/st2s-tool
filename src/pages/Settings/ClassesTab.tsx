import { useState, useEffect } from 'react';
import { readCsv, writeCsv, parseCsvString } from './csv';
import { dataPath } from '../../utils/path';
import { FileDrop } from '../../components/FileDrop';
import './ClassesTab.css';

interface ClassRow {
  code: string;
  label: string;
  groupes: string;
}

export function ClassesTab() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClassForImport, setSelectedClassForImport] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const data = await readCsv(dataPath('classes.csv'));
    setClasses(data.map(row => ({
      code: row.code || '',
      label: row.label || '',
      groupes: row.groupes || ''
    })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await writeCsv(
        dataPath('classes.csv'),
        ['code', 'label', 'groupes'],
        classes as any
      );
      setMessage({ type: 'success', text: 'Classes enregistrées avec succès' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (index: number, field: keyof ClassRow, value: string) => {
    const updated = [...classes];
    updated[index] = { ...updated[index], [field]: value };
    setClasses(updated);
  };

  const handleAdd = () => {
    setClasses([...classes, { code: '', label: '', groupes: '' }]);
  };

  const handleDelete = (index: number) => {
    const updated = classes.filter((_, i) => i !== index);
    setClasses(updated);
  };

  const handleImportEleves = async (content: string) => {
    if (!selectedClassForImport) {
      setMessage({ type: 'error', text: 'Sélectionnez d\'abord une classe' });
      return;
    }

    try {
      const rows = parseCsvString(content, false);

      const normalized: { nom_prenom: string; groupe: string }[] = [];

      for (const row of rows) {
        const values = Object.values(row);
        if (values.length === 0) continue;

        const nomPrenom = values[0] || '';
        const groupe = values[1] || '';

        if (nomPrenom.trim()) {
          normalized.push({
            nom_prenom: nomPrenom.trim(),
            groupe: groupe.trim()
          });
        }
      }

      if (normalized.length === 0) {
        setMessage({ type: 'error', text: 'Aucun élève trouvé dans le fichier' });
        return;
      }

      await writeCsv(
        dataPath(`eleves/${selectedClassForImport}.csv`),
        ['nom_prenom', 'groupe'],
        normalized as any
      );

      setMessage({
        type: 'success',
        text: `${normalized.length} élèves importés pour la classe ${selectedClassForImport}`
      });
      setSelectedClassForImport('');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'import des élèves' });
    }
  };

  return (
    <div className="classes-tab">
      <div className="card">
        <div className="card-header">
          <h2>Classes et Groupes</h2>
          <div className="card-actions">
            <button className="button-ghost" onClick={handleAdd}>
              + Ajouter une classe
            </button>
            <button
              className="button-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Libellé</th>
                <th>Groupes (séparés par |)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classe, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={classe.code}
                      onChange={(e) => handleEdit(index, 'code', e.target.value)}
                      placeholder="1reA"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={classe.label}
                      onChange={(e) => handleEdit(index, 'label', e.target.value)}
                      placeholder="Première A"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={classe.groupes}
                      onChange={(e) => handleEdit(index, 'groupes', e.target.value)}
                      placeholder="A|B|C"
                    />
                  </td>
                  <td>
                    <button
                      className="button-danger-small"
                      onClick={() => handleDelete(index)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Import des élèves</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Sélectionnez une classe puis importez un fichier CSV contenant les noms des élèves.
          Le fichier peut contenir une seule colonne (noms) ou deux colonnes (noms et groupe).
        </p>

        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>
            Classe cible :
          </label>
          <select
            value={selectedClassForImport}
            onChange={(e) => setSelectedClassForImport(e.target.value)}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            <option value="">Sélectionner une classe...</option>
            {classes.map((classe) => (
              <option key={classe.code} value={classe.code}>
                {classe.label} ({classe.code})
              </option>
            ))}
          </select>
        </div>

        {selectedClassForImport && (
          <FileDrop
            onFileSelected={handleImportEleves}
            label={`Importer les élèves pour ${selectedClassForImport}`}
          />
        )}
      </div>
    </div>
  );
}
