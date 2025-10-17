# Spéc — Page « Avance » (V0)

1) Liste des préparations
- Filtres légers : Classe, Groupe, Statut (Tous/À faire/En cours/Prêt).
- Carte : Date–Heure | Classe–Groupe | Objectif (extrait) | Supports (compteur) | Statut.
- Actions : Préparer (éditer), Dupliquer, Supprimer, + Nouvelle préparation.

2) Fiche « Préparer »
- Créneau : Date, Heure début, Heure fin, Classe, Groupe.
- Contenu :
  - 🎯 Objectif (textarea)
  - 📎 Supports (texte libre, un par ligne → stocké `|`-séparé)
  - ⭐ Points_d_attention (cases depuis `items.csv`, + ajout ponctuel)
  - 🗒 Notes (textarea)
  - ⚙️ Statut : `a_faire | en_cours | pret`
- Boutons : Enregistrer, Retour.

3) Interaction avec Page Séance
- À l’ouverture, si une prépa `statut=pret` match (date/heure/classe/groupe) :
  - Afficher « 🧩 Prépa disponible — Pré-remplir ? »
  - Si oui : injecter objectif, supports, points_d_attention ; écrire `prep_link_id` dans `seances.csv`.

États vides & erreurs
- Aucun item actif → message « Activez vos points d’attention dans Réglage ».
- CSV manquant → message aide.

Accessibilité
- Contrastes ≥ 4.5:1, cibles ≥ 36×36.
