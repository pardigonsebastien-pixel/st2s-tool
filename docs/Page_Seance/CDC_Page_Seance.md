# Cahier des charges — Page « Séance / Participation »  
*(validé le 13/10/2025)*

## 1. Objectif métier
Permettre la saisie, en cours, de la participation et de la présence des élèves pour une séance donnée, avec un suivi clair des documents distribués, des retards, des commentaires individuels, et une clôture complète de séance.  
L’écran prépare les données nécessaires au futur module « Cahier de texte » sans le déclencher.

## 2. Flux d’entrée
1. L’utilisateur clique sur **« Séance »**.  
2. L’application affiche la liste des **classes / groupes** disponibles.  
3. Après sélection, deux choix :
   - **Continuer** la dernière séance,
   - **Nouvelle séance**.  
4. La séance est automatiquement nommée :  
   > `Séance du {date} — {Classe} — {Groupe} — {Activité}`

## 3. Rappel « Absents & Documents »
Au chargement, si des élèves étaient **absents** la séance précédente et qu’un **document** a été distribué :  
- l’application affiche la **liste des élèves** + **le nom du document** à rattraper.

## 4. Fonctionnalités principales
### 4.1. Distribution de documents
- Menu déroulant des documents issus de **« Préparation des cours »** (filtré par niveau : 1re/Terminale, CE/DG).  
- Après sélection d’un document :  
  - l’application calcule **qui ne l’a pas reçu** (absents),  
  - et **mémorise** cette information pour rappel à la prochaine séance.

### 4.2. Liste des élèves
Chaque ligne (un élève) comporte :
1. **Photo** (à droite, optionnelle).  
2. **Présence / Retard / Absence**  
   - Par défaut, chaque élève est **Présent**.  
   - En cas de **retard**, l’enseignant saisit les minutes :  
     - `<10 min` → pénalité automatique `−1`  
     - `≥10 min` → pénalité `−2`.  
3. **Note de participation**  
   - Total **avant séance**,  
   - **Différentiel du jour** (somme des clics de participation),  
   - **Fin de séance** (après application du cap ±3).  
4. **Commentaires (compteur)** — nombre total de commentaires individuels saisis pour l’élève depuis le début du trimestre.

### 4.3. Saisie de participation
- L’utilisateur sélectionne un élève (mise en surbrillance).  
- Boutons : `−3 | −2 | −1 | −0.5 | +0.5 | +1 | +2 | +3`.  
- Chaque clic ouvre une **popup d’items justificatifs** : voir grille barème complète.  
- **Bouton “Ajouter un commentaire individuel”** : ouvre une popup texte libre.  

## 5. Clôture de séance
Bouton **« Clôturer la séance »** → popup demandant :
- *« À quelle question vous êtes-vous arrêté ? »*  
- *« Attitude de la classe »* (champ libre).  
- ✅ Case « Mettre à jour le Cahier de texte » (cochée par défaut).  

## 6. Offline / Synchro
- L’application est **offline-first** : toutes les actions sont stockées localement dans une file `pending`.  
- Au retour réseau :  
  - Les actions sont **envoyées automatiquement**,  
  - L’interface affiche l’état : `Offline / En attente (n) / OK (hh:mm)`.

## 7. Règles de fusion (conflits multi-appareils)
| Type d’action | Règle de fusion | Détail |
|---------------|----------------|---------|
| Participation | **Somme** des deltas sur la séance, puis **cap ±3** | Exemple : +1 + +2 = +3 (cap) |
| Présence/Retard | **Dernier horodaté gagne** | Pénalité recalculée selon minutes |
| Commentaires | **Append (ajout)** | Tous les commentaires conservés |
| Distribution doc | **Union** | Si au moins un “Distribué” → Distribué |
| Clôture séance | **Dernier horodaté gagne** | Question / attitude / maj CDT |
| (Tous types) | **ID unique** → aucune double comptabilisation | Idempotence garantie |

## 8. Structure de données (schéma stabilisé)
```json
{
  "version_schema": "1.0",
  "seance": {
    "id": "2025-10-13_PremiereA_DG_Act2_AM",
    "date": "2025-10-13",
    "classe": "Première ST2S A",
    "groupe": "DG",
    "activite": "Activité 2",
    "participations": [ { "eleve_id": "E001", "delta": 1, "ts_utc": "..." } ],
    "presence": { "E001": { "statut": "retard", "minutes": 8 } },
    "commentaires": [ { "eleve_id": "E001", "texte": "Bon travail" } ],
    "docs": [ { "doc_id": "D123", "eleve_id": "E004", "etat": "en_attente" } ],
    "fin_de_seance": { "question_arret": "", "attitude": "", "maj_cdt": true }
  }
}
```

## 9. RGPD et garde-fous
- Données **minimales** et **locales** ; aucune transmission à un tiers.  
- **HTTPS** côté serveur ; chiffrement local.  
- Module Cahier de texte = **lecture seule** sur les données de séance.  
- Schéma versionné (`version_schema`) pour compatibilité future.
