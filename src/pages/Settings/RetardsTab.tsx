import { useState, useEffect } from 'react';
import { readFile, writeFile } from '../../utils/fs';
import { dataPath } from '../../utils/path';
import './RetardsTab.css';

interface RetardsSettings {
  palier_minutes: number[];
  penalites: number[];
  justifie_vs: boolean;
}

export function RetardsTab() {
  const [settings, setSettings] = useState<RetardsSettings>({
    palier_minutes: [5, 15, 30],
    penalites: [1, 2, 3],
    justifie_vs: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const content = await readFile(dataPath('settings.json'));
      const data = JSON.parse(content);
      if (data.retards) {
        setSettings(data.retards);
      }
    } catch (error) {
      console.error('Failed to load settings, using defaults');
    }
  };

  const validateSettings = (): boolean => {
    if (settings.palier_minutes.length !== settings.penalites.length) {
      setValidationError(
        `Le nombre de paliers (${settings.palier_minutes.length}) doit être égal au nombre de pénalités (${settings.penalites.length})`
      );
      return false;
    }

    if (settings.palier_minutes.length === 0) {
      setValidationError('Vous devez définir au moins un palier');
      return false;
    }

    for (let i = 0; i < settings.palier_minutes.length; i++) {
      if (settings.palier_minutes[i] <= 0) {
        setValidationError(`Le palier ${i + 1} doit être supérieur à 0`);
        return false;
      }
      if (settings.penalites[i] <= 0) {
        setValidationError(`La pénalité ${i + 1} doit être supérieure à 0`);
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      const data = { retards: settings };
      await writeFile(dataPath('settings.json'), JSON.stringify(data, null, 2));
      setMessage({ type: 'success', text: 'Paramètres de retard enregistrés avec succès' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePalierChange = (index: number, value: string) => {
    const updated = [...settings.palier_minutes];
    updated[index] = parseInt(value) || 0;
    setSettings({ ...settings, palier_minutes: updated });
  };

  const handlePenaliteChange = (index: number, value: string) => {
    const updated = [...settings.penalites];
    updated[index] = parseInt(value) || 0;
    setSettings({ ...settings, penalites: updated });
  };

  const handleAddPalier = () => {
    setSettings({
      ...settings,
      palier_minutes: [...settings.palier_minutes, 0],
      penalites: [...settings.penalites, 0]
    });
  };

  const handleRemovePalier = (index: number) => {
    setSettings({
      ...settings,
      palier_minutes: settings.palier_minutes.filter((_, i) => i !== index),
      penalites: settings.penalites.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="retards-tab">
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Gestion des retards</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-xs)' }}>
              Configurez les paliers de retard et les pénalités associées
            </p>
          </div>
          <button
            className="button-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        {message && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        {validationError && (
          <div className="message message-error">
            {validationError}
          </div>
        )}

        <div className="retards-form">
          <div className="form-section">
            <h3>Paliers de retard</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: 'var(--spacing-md)' }}>
              Définissez les seuils de temps (en minutes) et les points de pénalité correspondants
            </p>

            <div className="paliers-list">
              {settings.palier_minutes.map((palier, index) => (
                <div key={index} className="palier-row">
                  <div className="palier-inputs">
                    <div className="input-group">
                      <label>Palier {index + 1}</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={palier}
                          onChange={(e) => handlePalierChange(index, e.target.value)}
                          min="0"
                        />
                        <span className="unit">minutes</span>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Pénalité</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={settings.penalites[index]}
                          onChange={(e) => handlePenaliteChange(index, e.target.value)}
                          min="0"
                        />
                        <span className="unit">points</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="button-danger-small"
                    onClick={() => handleRemovePalier(index)}
                    disabled={settings.palier_minutes.length === 1}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>

            <button className="button-ghost" onClick={handleAddPalier}>
              + Ajouter un palier
            </button>
          </div>

          <div className="form-section">
            <h3>Options</h3>
            <label className="checkbox-full">
              <input
                type="checkbox"
                checked={settings.justifie_vs}
                onChange={(e) => setSettings({ ...settings, justifie_vs: e.target.checked })}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label-text">
                Activer la justification des retards par vie scolaire
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="card info-card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Exemple d'utilisation</h3>
        <div className="example-list">
          {settings.palier_minutes.map((palier, index) => (
            <div key={index} className="example-item">
              <span className="example-time">{palier} min</span>
              <span className="example-arrow">→</span>
              <span className="example-penalty">{settings.penalites[index]} point(s)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
