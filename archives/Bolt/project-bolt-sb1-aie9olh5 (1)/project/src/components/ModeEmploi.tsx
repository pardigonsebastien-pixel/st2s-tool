import { BookOpen, CheckCircle } from 'lucide-react';

export function ModeEmploi() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Mode d'emploi</h2>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Contraintes</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Mode verrouillé : pas de code ni d'exécution locale</li>
              <li>Base de données : Supabase (table eleves)</li>
              <li>Import CSV uniquement (séparateur point-virgule ;)</li>
              <li>Pas d'écriture de fichiers locaux</li>
              <li>Exports CSV en téléchargement mémoire uniquement</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Import CSV</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Encodages supportés : UTF-8, UTF-8-SIG, CP1252</li>
              <li>Colonnes requises : eleve_id;nom;prenom</li>
              <li>Colonnes optionnelles : photo;classe;groupe;pretotal</li>
              <li>Si classe/groupe absents : valeurs appliquées selon le nom du fichier</li>
              <li>Upsert automatique sur eleve_id</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Utilisation V1</h3>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Importer les fichiers CSV (1re_A.csv, 1re_B.csv)</li>
              <li>Sélectionner Classe et Groupe dans "Séance V0.1c"</li>
              <li>Cliquer sur "Démarrer la séance"</li>
              <li>Utiliser la palette de participation (-2 à +3) pour chaque élève</li>
              <li>Activer/désactiver le Cap (±3) avec le toggle</li>
              <li>Annuler le dernier clic avec le bouton Undo</li>
              <li>Exporter les données via "Exporter CSV"</li>
              <li>Terminer la séance en saisissant "VALIDER"</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Barème de participation</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Valeurs disponibles : -2, -1, -0.5, 0, +0.5, +1, +2, +3</li>
              <li>Cap par séance : ±3 (ON par défaut)</li>
              <li>Toggle "Cap OFF" : permet de dépasser la limite ±3</li>
              <li>Bouton Undo : annule le dernier clic (LIFO)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Calculs automatiques</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>PreTotal</strong> : valeur initiale de l'élève (base de données)</li>
              <li><strong>SessionRaw</strong> : somme brute de tous les clics de la séance</li>
              <li><strong>SessionCapped</strong> : SessionRaw plafonné à ±3 si Cap ON</li>
              <li><strong>CapApplied</strong> : indique si le plafond est actif (ON/OFF)</li>
              <li><strong>PostTotal</strong> : PreTotal + SessionCapped</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Exports CSV</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Participation_Session_&lt;datetime&gt;.csv</strong> : données par élève (pre_total, session_raw, session_capped, post_total, etc.)</li>
              <li><strong>Clicks_Session_&lt;datetime&gt;.csv</strong> : historique détaillé de tous les clics avec horodatage</li>
              <li>Téléchargement automatique des deux fichiers</li>
              <li>Format CSV standard avec virgules comme séparateur</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Checklist d'acceptation V0.1c</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Import 1re_A.csv → lignes visibles avec classe="1re", groupe="A"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Import 1re_B.csv → lignes visibles avec classe="1re", groupe="B"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Sélection "Première / A" → liste 1re_A affichée (id/nom/prénom)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Changer pour "B" → liste 1re_B affichée</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Recherche texte filtre correctement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Tri par nom ascendant par défaut</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span>Aucun message d'erreur / interface stable</span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Checklist d'acceptation V1</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Palette -2…+3 fonctionnelle pour chaque élève</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Mise à jour immédiate des 5 champs (PreTotal, SessionRaw, SessionCapped, CapApplied, PostTotal)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Cap ±3 ON par défaut, OFF via toggle fonctionnel</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Undo par élève opérationnel (supprime le dernier clic)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Exports CSV conformes au schéma (Participation_Session.csv et Clicks_Session.csv)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Confirmation "VALIDER" requise avant réinitialisation de la séance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Aucune latence visible (&lt;100ms) ni erreur console</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Session ID copiable et statistiques affichées en temps réel</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Historique des clics visible par élève</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Journal console complet (session créée, clics, cap togglé, exports, confirmation)</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Performance attendue</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Latence par clic : &lt;100ms pour 40 élèves</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Recalcul immédiat de tous les champs en temps réel</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Interface fluide sans blocage ni ralentissement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Aucune erreur JavaScript dans la console</span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Checklist d'acceptation V1.0.1 (Hotfix)</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Import normalise classe/groupe si absents ou mal renseignés</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Le filtre renvoie des élèves après sélection "Première/A" et "Première/B"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Le panneau Debug affiche un total &gt; 0 et la répartition correcte</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Avec des valeurs contenant espaces/accents, la liste s'affiche (trim + case-insensitive)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Badge filtre actif affiché (Classe=... | Groupe=...)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Alerte non bloquante affichée si aucun élève pour le filtre</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>0 régression sur participation/exports CSV/cap/undo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Toast recap d'import avec répartition (1re_A=X, 1re_B=Y, ...)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Séparateur point-virgule détecté (warning si absent)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">✓</span>
            <span>Validation classe (1re/Tle) et groupe (A/B) avec rejet si invalide</span>
          </li>
        </ul>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="font-semibold text-orange-900 mb-3">Panneau Debug</h3>
        <p className="text-sm text-orange-800 mb-3">
          Le panneau Debug (accessible via la navigation) permet de diagnostiquer les problèmes de filtre et de visualiser toutes les données de la base.
        </p>
        <ul className="space-y-2 text-sm text-orange-800">
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Total élèves (compte global)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Répartition par classe_groupe (table 2 colonnes)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Aperçu des 5 premières lignes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Bouton "Afficher TOUT" pour bypass du filtre (lecture seule)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Injecter élèves de test (1re_A) : ajoute 3 élèves directement en DB</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">•</span>
            <span>Supprimer élèves de test : suppression avec confirmation VALIDER</span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">Checklist d'acceptation V1.1 (DB Sync)</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Debug : Injecter → Total=3, Répartition 1re_A=3</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Séance : Première + A → Démarrer → 3 élèves s'affichent</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Import : 1re_A.csv (sans classe/groupe) → la modale me les demande → upsert OK (Total augmente)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Import : 1re_B.csv idem → Première + B → liste OK</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Recherche : "dup" / "yan" filtre correctement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Palette/Exports : inchangés et fonctionnels</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Table public.eleves accessible avec colonnes : eleve_id, nom, prenom, photo, classe, groupe, pretotal</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Filtre séance tolère trim + case-insensitive + mapping Première→1re</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Toast import affiche : "Insérés/Mis à jour: X. Répartition: 1re_A=N, 1re_B=M..."</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">□</span>
            <span>Debug panel refresh automatique après injection/suppression</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
