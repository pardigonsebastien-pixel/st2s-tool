# Cahier des charges — Page « Séance / Participation »
*(mis à jour le 13/10/2025 – V3.1)*

## Table des matières
1. Objectif métier
2. Flux d’entrée
3. Rappel « Absents & Documents »
4. Fonctionnalités principales
5. Clôture de séance
6. Offline / Synchro
7. Règles de fusion (conflits multi-appareils)
8. Structure de données
9. RGPD et garde-fous
10. Module Photos / Découpe trombinoscope (Lot P)

---

## 1. Objectif métier
Permettre la saisie de la participation et de la présence des élèves pour une séance donnée, avec suivi clair des documents, retards et clôture complète.

## 2. Flux d’entrée
1. L’utilisateur clique sur « Séance ».
2. Sélection d’une classe/groupe.
3. Choix : continuer dernière séance ou nouvelle séance.
4. Séance nommée automatiquement : `Séance du {date} — {Classe} — {Groupe} — {Activité}`.

## 3. Rappel « Absents & Documents »
Affiche au démarrage les élèves absents précédemment et les documents à rattraper.

## 4. Fonctionnalités principales
### Distribution de documents
- Menu déroulant filtré (1re/Tle, CE/DG).
- L’app mémorise qui a reçu ou non le document.

### Liste des élèves
- Photo, présence/retard/absence, note de participation, compteur commentaires.
- Par défaut : Présent.

### Saisie de participation
- Clic sur élève → boutons barème (−3 à +3) + popup justificatif.

## 5. Clôture de séance
Popup : question d’arrêt, ambiance de classe, case « Mettre à jour Cahier de texte » cochée par défaut.

## 6. Offline / Synchro
Offline-first, file d’attente locale pending, envoi différé.

## 7. Règles de fusion
| Type | Règle | Exemple |
|------|--------|----------|
| Participation | Somme cap ±3 | +1 + +2 = +3 |
| Présence | Dernier horodaté gagne | – |
| Commentaire | Append | cumulatif |
| Doc distribué | Union | au moins un = distribué |
| Clôture | Dernier horodaté gagne | – |
| Tous | ID unique | idempotence garantie |

## 8. Structure de données
```json
{
  "version_schema": "1.0",
  "seance": {
    "id": "2025-10-13_PremiereA_DG_Act2_AM",
    "participations": [ { "eleve_id": "E001", "delta": 1 } ],
    "presence": { "E001": { "statut": "retard", "minutes": 8 } }
  }
}
```

## 9. RGPD et garde-fous
- Données locales, aucune transmission tierce.
- HTTPS et chiffrement local.
- Cahier de texte lecture seule.

## 10. Module Photos / Découpe trombinoscope (Lot P)
### Objectif
Import de trombinoscopes PDF → découpe manuelle/auto → JPEG → association élèves.

### Flux principal
1. Onglets : Importer / Associer & Découper / Vérifier.
2. Découpe → JPEG 600×750 px, qualité 85, ratio 4:5.
3. Index `data/photos_index.csv` :
   - NomPrenoms, classe, groupe, photo_path, hash_raw, updated_at, source, archived, consentement.
4. Affichage automatique dans la Page Séance.

### Dossiers
`trombinos_pdf/`, `photos_cropped/`, `photos_cache/thumbs/`, `data/photos_index.csv`.

### Paramètres techniques
| Élément | Valeur |
|----------|--------|
| Import | PDF → images |
| Ratio | 4:5 |
| Taille | 600×750 px |
| Qualité | 85 % |
| Détection visage | Auto si fiable (>90 %) |
| Consentement | Oui par défaut |
| Nom fichier | `CLASSE_GROUPE_NOM_Prenoms_{uuid8}.jpg` |

### Critères d’acceptation
- Import PDF sans erreur.
- Découpe fluide (raccourcis N/P/S/Espace).
- Photos visibles dans Page Séance, avatars remplacés.
