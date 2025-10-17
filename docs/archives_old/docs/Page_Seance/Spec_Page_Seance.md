# Spécification écran — Page « Séance / Participation »
*(mis à jour le 13/10/2025 – V3.1)*

## Table des matières
1. Écran principal « Séance »
2. Éléments de participation
3. Popup de clôture
4. Page « Photos / Découpe »

---

## 1. Écran principal « Séance »
Liste élèves, photos, statut présence, boutons participation.

## 2. Éléments de participation
Palette flottante (−3 à +3), popup justificatif, compteur commentaires, total brut/après cap, badge ON/OFF.

## 3. Popup de clôture
Champs : question d’arrêt, ambiance, mise à jour Cahier de texte.

## 4. Page « Photos / Découpe »
### Composants
- Onglets : Importer | Associer & Découper | Vérifier.
- Zone centrale : aperçu PDF converti, découpe 4:5.
- Boutons : Détecter visage, Centrer, Zoom ±, Rotation, Sauver.
- Barre latérale : recherche élèves, miniature, bouton Remplacer.
- Barre d’état : messages succès/erreur.

### Dynamique
- Navigation élève suivant/précédent.
- Affichage miniature instantané.
- Codes couleur : vert (photo OK), orange (ancienne), gris (aucune).

### Interaction Page Séance
- Lecture `photos_index.csv` pour vignette récente.
- Avatar initiales si aucune photo.
