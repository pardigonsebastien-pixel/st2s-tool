# Cahier des charges — Page « Avance » (V0)
Objet : préparer manuellement les cours à venir (sans IA, offline), et permettre le pré-remplissage de la Page Séance lorsqu’une préparation est au statut « prêt ».

Fonctions :
- Lister les préparations (date, heure, classe, groupe, statut).
- Créer/éditer une préparation (objectif, supports, points_d_attention, notes, statut).
- Enregistrer dans `data/avance_preps.csv` (UTF-8-SIG, `;`).
- Au démarrage d’une séance : si une préparation « prêt » correspond au créneau (même date + classe + groupe), proposer le pré-remplissage (non bloquant).

Données :
- `data/avance_preps.csv`  
  `prep_id;date;heure_debut;heure_fin;classe;groupe;objectif;supports;points_d_attention;notes;statut`
  - `supports` et `points_d_attention` : listes séparées par `|`
  - `statut` ∈ `a_faire|en_cours|pret`

Contraintes :
- 100 % offline.
- Pas d’IA, pas d’automatisme de report en V0.
- Compatibilité ascendante : aucune colonne ne sera supprimée plus tard.
