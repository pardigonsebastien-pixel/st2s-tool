# ST2S Tool — Dépôt source

Ce dépôt est la **source de vérité** du projet (code + documents).  
On travaille **en branches** et on fusionne via **Pull Requests** (PR).

## Arborescence
- `app/` – code de l’application (frontend PWA + plus tard backend si besoin)
- `data/` – données de test (CSV anonymisés)
- `docs/` – **triptyque** (CDC.md, Spec_ecran.md, Changelog.md)
- `tests/` – tests unitaires/visuels (optionnel)
- `.github/` – modèles de PR, issues, règles

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
