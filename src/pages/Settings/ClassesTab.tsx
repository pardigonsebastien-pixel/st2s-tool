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

  const getGroupSchemaFromValue = (groupes: string): string => {
    if (!groupes || groupes === '') return 'none';
    if (groupes === 'A;B') return 'ab';
    if (groupes === 'A;B;C') return 'abc';
    if (groupes === '1;2') return '12';
    if (groupes === '1;2;3') return '123';
    return 'custom';
  };

  const getValueFromGroupSchema = (schema: string): string => {
    switch (schema) {
      case 'none': return '';
      case 'ab': return 'A;B';
      case 'abc': return 'A;B;C';
      case '12': return '1;2';
      case '123': return '1;2;3';
      default: return '';
    }
  };

  const handleGroupSchemaChange = (index: number, schema: string) => {
    if (schema !== 'custom') {
      handleEdit(index, 'groupes', getValueFromGroupSchema(schema));
    }
  };

  const handleCustomGroupChange = (index: number, value: string) => {
    const normalized = value.split(';').map(g => g.trim()).filter(g => g).join(';');
    handleEdit(index, 'groupes', normalized);
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
                <th>Groupes — choisissez un schéma ou 'Personnalisé…' (séparer par ';')</th>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <select
                        value={getGroupSchemaFromValue(classe.groupes)}
                        onChange={(e) => handleGroupSchemaChange(index, e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="none">Aucun groupe</option>
                        <option value="ab">A / B</option>
                        <option value="abc">A / B / C</option>
                        <option value="12">1 / 2</option>
                        <option value="123">1 / 2 / 3</option>
                        <option value="custom">Personnalisé…</option>
                      </select>
                      {getGroupSchemaFromValue(classe.groupes) === 'custom' && (
                        <input
                          type="text"
                          value={classe.groupes}
                          onChange={(e) => handleCustomGroupChange(index, e.target.value)}
                          placeholder="ex : A;B;C ou 1;2"
                          style={{ width: '100%', fontSize: '13px' }}
                        />
                      )}
                    </div>
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
