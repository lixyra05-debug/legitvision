# Libellés du catalogue : outils des scripts du 2026-10-06

Ce dossier garde ce qui a produit et vérifié les deux scripts de données :

- `supabase/scripts/2026-10-06-libelles-catalogue.sql` (l'aller) ;
- `supabase/scripts/2026-10-06-libelles-catalogue-retour.sql` (le retour arrière).

Rien de ce dossier n'écrit en base : seul `controle-prod.sql` s'y lance, en
lecture seule. Les deux scripts, eux, sont lancés à la
main par Hector dans l'éditeur SQL de Supabase, étape par étape : leur en-tête
« EN BREF » dit comment.

## Fichiers

| Fichier | Rôle |
|---|---|
| `corrections-v2.json` | La table des 46 corrections : zone, ancien libellé, nouveau libellé, nombre de points, et les identifiants des modèles quand ils sont connus un par un. Elle fait foi. |
| `ids-profil-court.txt` | Les 28 modèles qui portent déjà « Emballage » avant la correction. |
| `generer.mjs` | Écrit en entier les deux scripts et `controle-prod.sql`. `node generer.mjs` redonne les fichiers du dépôt à l'octet près. |
| `controle-prod.sql` | Une seule requête en lecture seule, à lancer en production avant l'aller : comptes, listes, aller-retour simulé, empreintes attendues. |
| `banc-independant.mjs` | Banc d'essai sur PGlite qui prend les deux scripts comme des boîtes noires : aller, relance sans effet, retour au caractère près, états faussés refusés. |

Ne jamais retoucher un fichier SQL à la main : l'étape 2 recalcule l'empreinte
de ses listes et refuse un script modifié. Un changement passe par la table,
puis par `node generer.mjs`.

## Relevés de production (lecture seule)

| | 2026-10-06 | 2026-10-12 |
|---|---|---|
| Lignes de `public.models` | 530 | 530 |
| dont modèles analysables (ceux que le site annonce) | 474 | 474 |
| dont modèles désactivés, montres, actifs sans point | 36, 10, 10 | 36, 10, 10 |
| Points à corriger | 2713 | 2713 |
| Modèles à corriger (analysables + désactivés) | 437 (436 + 1) | 437 (436 + 1) |
| Corrections au mauvais compte, listes fausses | 0, 0 | 0, 0 |
| Modèles différents après un aller-retour simulé | non mesuré | 0 |
| Modèles avec deux points de même libellé après l'aller | 0 | 0 |
| Verdict qu'affichera l'étape 1 | non mesuré | PRÊT |
| Empreinte des libellés | `fd2933191dd38b2e2b6ad4dbbe22a74d` | `fd2933191dd38b2e2b6ad4dbbe22a74d` |

Empreintes relevées le 2026-10-12 par `controle-prod.sql` : autres colonnes
`00fcb5453bee84534e622f64c7e08897`, points suivis
`3235309eb340d6ee941c47ac841290b8`. Prévues après l'aller : libellés
`5b7e6a6baa82bebe458bc74ea0ecbe98`, points suivis
`b593f6408a170e90294df946144a440f`. Elles ne valent que tant que le catalogue
ne bouge pas : relancer `controle-prod.sql` juste avant l'exécution.

## Ce qui a été vérifié

- Le banc d'essai de l'auteur (PGlite, 748 contrôles, 0 échec) est passé sur
  ces scripts le 2026-10-06 : aller, relance, retour à l'octet près, six
  fusions défaites une à une, états partiels, listes faussées, sabotages du
  bloc, 150 bases perturbées au hasard. Ce banc pèse près de 5 Go de mémoire
  par exécution et tient à des chemins de la machine : il n'est pas dans le
  dépôt.
- Depuis ce passage, seuls des commentaires d'en-tête ont changé. Les trois
  étapes de chaque fichier, donc tout le SQL exécuté, sont identiques à
  l'octet près à la version éprouvée (comparaison faite le 2026-10-12).
- `banc-independant.mjs` : 43 contrôles, tout passe (2026-10-12).
- Fenêtre d'avertissement de l'éditeur SQL de Supabase (« Potential issue
  detected ») : les contrôles d'avant exécution du code public de Supabase
  Studio (branche master, relevée le 2026-10-12 : opérations destructrices,
  UPDATE sans WHERE, ALTER DATABASE, CREATE TABLE sans RLS) ont été rejoués
  sur les six étapes, chacune seule. Aucune n'ouvre la fenêtre, et l'éditeur
  n'ajoute de « limit » à aucune. La fenêtre s'ouvre si l'étape 2 est collée
  sous un reste de requête (« delete », « update » sans « where ») ou coupée
  avant son « end $$; » : dans ces cas, annuler. Ce contrôle vaut pour le code
  relevé ce jour-là : l'éditeur évolue.
- Relecture adverse, premier tour : 28 remarques confirmées, toutes
  traitées. Aucune ne concernait l'aller sur une base conforme au relevé.
  L'une montrait que le retour, après deux changements du catalogue qui se
  compensent, pouvait remettre un ancien libellé sur un modèle que l'aller
  n'avait pas touché : d'où l'empreinte des points suivis (voir les limites).
- Relecture adverse, second tour : 34 remarques, dont 2 seulement ont été
  vérifiées avant l'arrêt du travail. Les deux sont traitées (la phrase « Si
  une première ligne… » de « EN BREF » ; la recette du retour bloqué, retirée
  des en-têtes). Les autres sont résumées ci-dessous.

## Limites connues

- **Sélection à la main dans l'éditeur.** Lancer une étape, c'est lancer
  exactement son texte. Une sélection qui part du bandeau de l'étape 2 et
  s'arrête avant sa fin est une erreur de syntaxe : rien n'est lancé. Seule
  une sélection qui ne prend que des commentaires, ou qu'un morceau du début
  du bloc sans son « do $$ », passe sans erreur, et sans rien écrire. Deux
  étapes lancées ensemble s'exécutent toutes les deux, mais l'éditeur n'en
  affiche qu'un tableau. La preuve est toujours l'étape 3, lancée seule : elle
  dit « APPLIQUÉ » ou « PAS APPLIQUÉ ».
- **Retour arrière et empreinte.** Les comptes ne voient pas deux changements
  qui se compensent (un point retiré d'un modèle, le même ajouté à un autre).
  Seule l'empreinte des points suivis les voit, et c'est la personne qui lance
  le retour qui la compare à celle notée à l'étape 3 de l'aller.
- **Retour bloqué.** Si le catalogue a bougé depuis l'aller sur un des 87
  libellés suivis (modèle créé avec un de ces libellés, modèle concerné
  supprimé, libellé retouché), l'étape 1 du retour dit « ÉCARTS » et rien ne
  s'écrit. Un retour adapté se prépare alors comme un script neuf. Le mode
  « relevé adapté » de `generer.mjs` (`LV_RELEVE`) existe mais n'est pas
  validé de bout en bout : l'en-tête qu'il génère est à relire à la main, et
  aucun banc livré ne rejoue des scripts adaptés.
- **Anciens libellés qui reviennent.** Les migrations 001, 003, 006, 008, 009,
  010 et 012 écrivent encore les anciens libellés : un modèle créé en
  recopiant leurs gabarits après l'aller les ramène. L'étape 1 de l'aller le
  dirait (« ÉCARTS »), rien ne le corrige tout seul.
- **Déclencheur sur `public.models`.** Aucun au relevé. S'il en apparaît un
  qui change une autre colonne à chaque écriture, l'étape 1 dit « PRÊT » puis
  l'étape 2 s'arrête sans rien écrire, en le nommant.

## Lancer les outils

```
node generer.mjs
LV_PGLITE=/chemin/vers/@electric-sql/pglite/dist/index.js node banc-independant.mjs
```

`LV_SORTIE=dossier node generer.mjs` écrit ailleurs que dans le dépôt.
