import { useState, useEffect } from 'react';
import { readCsv, writeCsv } from './csv';
import { dataPath } from '../../utils/path';
import './ItemsTab.css';

interface ItemRow {
  id: string;
  label: string;
  enabled: string;
}

export function ItemsTab() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await readCsv(dataPath('items.csv'));
    setItems(data.map(row => ({
      id: row.id || '',
      label: row.label || '',
      enabled: row.enabled || 'true'
    })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await writeCsv(
        dataPath('items.csv'),
        ['id', 'label', 'enabled'],
        items as any
      );
      setMessage({ type: 'success', text: 'Points d\'attention enregistrés avec succès' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (index: number, field: keyof ItemRow, value: string | boolean) => {
    const updated = [...items];
    if (field === 'enabled') {
      updated[index] = { ...updated[index], enabled: value ? 'true' : 'false' };
    } else {
      updated[index] = { ...updated[index], [field]: value as string };
    }
    setItems(updated);
  };

  const handleAdd = () => {
    const newId = `item_${Date.now()}`;
    setItems([...items, { id: newId, label: '', enabled: 'true' }]);
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  return (
    <div className="items-tab">
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Points d'attention</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-xs)' }}>
              Gérez les éléments de suivi et d'observation pour vos élèves
            </p>
          </div>
          <div className="card-actions">
            <button className="button-ghost" onClick={handleAdd}>
              + Ajouter un point
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
                <th>ID</th>
                <th>Libellé</th>
                <th>Activé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="text"
                      value={item.id}
                      readOnly
                      style={{ background: '#F3F4F6', cursor: 'not-allowed' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleEdit(index, 'label', e.target.value)}
                      placeholder="Ex: Retard, Matériel oublié..."
                    />
                  </td>
                  <td>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={item.enabled === 'true'}
                        onChange={(e) => handleEdit(index, 'enabled', e.target.checked)}
                      />
                      <span className="checkbox-custom"></span>
                    </label>
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

        {items.length === 0 && (
          <div className="empty-state">
            <p>Aucun point d'attention configuré</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-xs)' }}>
              Cliquez sur "Ajouter un point" pour commencer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
