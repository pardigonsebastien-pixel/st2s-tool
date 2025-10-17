# Page Paramètres (V0) - Documentation

## Vue d'ensemble

La page Paramètres permet de configurer les données de base de l'application ST2S Tool. Elle est accessible via trois onglets principaux.

## Architecture

### Contraintes techniques
- **Offline-first** : Aucune connexion réseau ou base de données cloud
- **Persistance locale** : Tous les fichiers sont stockés dans `/data`
- **Format CSV** : Séparateur point-virgule (`;`), encodage UTF-8 avec BOM
- **Framework** : React + TypeScript + Vite

### Structure des fichiers

```
/data
├── classes.csv                    # Liste des classes
├── items.csv                      # Points d'attention
├── settings.json                  # Configuration des retards
└── eleves/                        # Répertoire des élèves par classe
    ├── 1reA.csv
    ├── 1reB.csv
    ├── TleA.csv
    └── TleB.csv
```

## Onglets

### 1. Classes & Groupes

#### Fonctionnalités
- Édition des classes (code, libellé, groupes)
- Ajout/suppression de classes
- Import des élèves par classe (via CSV)

#### Format `classes.csv`
```csv
code;label;groupes
1reA;Première A;A;B
TleA;Terminale A;A;B;C
```

**Champs:**
- `code` : Code unique de la classe (ex: 1reA)
- `label` : Nom complet de la classe
- `groupes` : Groupes séparés par `;`

#### Format `eleves/<code>.csv`
```csv
nom_prenom;groupe
Dupont Marie;A
Martin Lucas;B
```

**Import CSV:**
- Accepte 1 colonne (nom uniquement) ou 2 colonnes (nom + groupe)
- Normalisation automatique vers le format cible
- Création automatique du fichier dans `/data/eleves/`

### 2. Points d'attention

#### Fonctionnalités
- Liste des éléments de suivi (retard, matériel oublié, etc.)
- Activation/désactivation des points
- Ajout/suppression de points

#### Format `items.csv`
```csv
id;label;enabled
item_001;Retard;true
item_002;Matériel oublié;true
item_003;Travail non rendu;false
```

**Champs:**
- `id` : Identifiant unique (lecture seule)
- `label` : Libellé du point d'attention
- `enabled` : Activation (`true`/`false`)

### 3. Retards

#### Fonctionnalités
- Configuration des paliers de retard (en minutes)
- Définition des pénalités associées
- Activation de la justification par vie scolaire

#### Format `settings.json`
```json
{
  "retards": {
    "palier_minutes": [5, 15, 30],
    "penalites": [1, 2, 3],
    "justifie_vs": true
  }
}
```

**Validation:**
- Les tableaux `palier_minutes` et `penalites` doivent avoir la **même longueur**
- Au moins un palier doit être défini
- Toutes les valeurs doivent être > 0

**Exemple:**
- Retard ≤ 5 min → 1 point
- Retard ≤ 15 min → 2 points
- Retard ≤ 30 min → 3 points

## Interface utilisateur

### Design
- **Style** : Cards arrondies (16px), ombres légères
- **Couleurs** : Orange principal (#FF6B35), bleu secondaire (#1A73E8)
- **Typographie** : Inter, 15px, interlignage 1.6
- **Responsive** : Optimisé desktop et mobile

### Composants réutilisables

#### `Tabs`
Système d'onglets avec soulignement actif.

```tsx
<Tabs
  tabs={[
    { id: 'tab1', label: 'Onglet 1' },
    { id: 'tab2', label: 'Onglet 2' }
  ]}
  activeTab="tab1"
  onTabChange={(id) => console.log(id)}
/>
```

#### `FileDrop`
Zone de dépôt de fichiers avec gestion du drag & drop.

```tsx
<FileDrop
  onFileSelected={(content, filename) => console.log(content)}
  accept=".csv"
  label="Déposer un fichier CSV"
/>
```

## Utilitaires

### `csv.ts`
- `readCsv(path)` : Lecture CSV avec PapaParse
- `writeCsv(path, fields, rows)` : Écriture CSV avec UTF-8 BOM
- `parseCsvString(content)` : Parse d'une chaîne CSV

### `fs.ts`
- `readFile(path)` : Lecture sécurisée (uniquement `/data`)
- `writeFile(path, content)` : Écriture sécurisée
- `fileExists(path)` : Vérification d'existence

### `path.ts`
- `dataPath(relative)` : Construction de chemin vers `/data`
- `isValidDataPath(path)` : Validation du chemin

## Tests d'acceptation

### Scénario 1 : Édition de classes
1. ✅ Modifier le code, libellé ou groupes d'une classe
2. ✅ Cliquer sur "Enregistrer"
3. ✅ Vérifier la sauvegarde dans `classes.csv`

### Scénario 2 : Import d'élèves
1. ✅ Sélectionner une classe
2. ✅ Déposer un fichier CSV (1 ou 2 colonnes)
3. ✅ Vérifier la création de `/data/eleves/<code>.csv`
4. ✅ Vérifier la normalisation (nom_prenom;groupe)

### Scénario 3 : Gestion des points d'attention
1. ✅ Ajouter un nouveau point
2. ✅ Modifier le libellé
3. ✅ Activer/désactiver via checkbox
4. ✅ Supprimer un point
5. ✅ Enregistrer et vérifier `items.csv`

### Scénario 4 : Configuration des retards
1. ✅ Modifier les paliers et pénalités
2. ✅ Ajouter/supprimer un palier
3. ✅ Activer/désactiver la justification VS
4. ✅ Vérifier la validation (longueurs égales)
5. ✅ Enregistrer et vérifier `settings.json`

## Limitations connues

### V0
- Pas de synchronisation réseau
- Pas de gestion des conflits multi-utilisateurs
- Persistance en mémoire (fileSystem Map) - les données sont perdues au rechargement
- Pas d'historique des modifications
- Pas d'export/import global

### Évolutions futures
- Système de sauvegarde/restauration complet
- Export ZIP pour portabilité
- Validation avancée des données
- Gestion des doublons élèves
- Interface de prévisualisation CSV avant import

## Commandes utiles

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Lancement rapide (Windows)
run.bat
```

## Support

Pour toute question ou problème, consulter la documentation dans `/docs/`.
