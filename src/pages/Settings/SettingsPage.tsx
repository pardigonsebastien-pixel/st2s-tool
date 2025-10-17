import { useState } from 'react';
import { Tabs } from '../../components/Tabs';
import { ClassesTab } from './ClassesTab';
import { ItemsTab } from './ItemsTab';
import { RetardsTab } from './RetardsTab';
import './SettingsPage.css';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('classes');

  const tabs = [
    { id: 'classes', label: 'Classes & Groupes' },
    { id: 'items', label: 'Points d\'attention' },
    { id: 'retards', label: 'Retards' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Paramètres</h1>
        <p className="settings-subtitle">
          Configuration générale de l'application ST2S Tool
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="settings-content">
        {activeTab === 'classes' && <ClassesTab />}
        {activeTab === 'items' && <ItemsTab />}
        {activeTab === 'retards' && <RetardsTab />}
      </div>
    </div>
  );
}
