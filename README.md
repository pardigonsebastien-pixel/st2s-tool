# ST2S Tool — Dépôt source

Ce dépôt est la **source de vérité** du projet (code + documents).
On travaille **en branches** et on fusionne via **Pull Requests** (PR).

## Arborescence
- `src/` – code source de l'application (React + TypeScript)
- `data/` – données locales (CSV avec séparateur point-virgule, UTF-8 BOM)
- `docs/` – **triptyque** (CDC.md, Spec_ecran.md, Changelog.md)
- `.github/` – modèles de PR, issues, règles

## Installation et démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm

### Démarrage rapide

**Windows:**
```bash
run.bat
```

**Linux/Mac:**
```bash
npm install
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:3000

### Build de production
```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## Branches
- `main` — **protégée** (pas d’écriture directe)  
- `feat/<intitulé>` — nouvelle fonctionnalité  
- `fix/<intitulé>` — correctif  
- `docs/<intitulé>` — mise à jour du triptyque

## Rituels
1. Créer une branche (`feat/...`).
2. Demander un **diff** avant écriture quand on utilise Bolt.
3. Commit(s) clairs (voir conventions).
4. PR → review → merge → **mise à jour du Changelog**.

## Conventions de commit
- `feat: ...` / `fix: ...` / `docs: ...` / `chore: ...` / `refactor: ...` / `test: ...`

## Licence
Usage interne (Éducation/IAE). À compléter si besoin.
