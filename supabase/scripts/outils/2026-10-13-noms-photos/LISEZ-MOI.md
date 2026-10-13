# Noms des photos à l'envoi : outils des requêtes du 2026-10-13

Ce dossier garde ce qui a produit et vérifié les trois requêtes de données :

- `supabase/scripts/2026-10-13-noms-photos-etat.sql` : l'état, en lecture seule ;
- `supabase/scripts/2026-10-13-noms-photos-aller.sql` : l'aller ;
- `supabase/scripts/2026-10-13-noms-photos-retour.sql` : le retour arrière.

Chaque fichier ne contient qu'une instruction (décision d'Hector du
2026-10-13 : « une seule étape par requête »). Rien de ce dossier n'écrit en
base : seul `controle-prod.sql` s'y lance, en lecture seule. Les requêtes sont
lancées à la main par Hector dans l'éditeur SQL de Supabase, une par une :
leur en-tête « EN BREF » dit comment.

## État : PAS ENCORE EXÉCUTÉ (2026-10-13)

À exécuter par Hector avant la mesure des 60 paires, jamais pendant : ces noms
partent dans la consigne envoyée à l'IA (`lib/ai/analyze.ts` : « nom
(identifiant) » pour chaque photo). L'outil de mesure fige le catalogue, noms
des photos compris, au premier `pnpm fiabilite verifier` lancé avec des
articles : l'ordre est donc aller, état « APPLIQUÉ », puis `verifier`.

## Ce que changent les requêtes

34 corrections des noms de photos (`public.brands.photo_protocol`, clé
`label`) : 284 noms dans 71 des 80 lignes de marque. Des accents manquants
(« Vue arriere »), du franglais (« Tags », « print », « zip »), un mot faux
(« langue » pour « languette »), et trois choix validés par Hector le
2026-10-13 : « Étiquette de languette », « Pièces métalliques », « (gros
plan) » partout. Seule la clé `label` change : l'ordre des emplacements, leur
identifiant (`name`, qui nomme le fichier de la photo), `required`,
`min_resolution` et les autres colonnes ne changent pas.

Non corrigés, parce que la table validée ne les porte pas : « Vue de dos »
(7 lignes de vêtements, à côté de « Vue arrière complète »), « Logo principal
(gros plan) », « Coutures et broderie (gros plan) ».

## Fichiers

| Fichier | Rôle |
|---|---|
| `corrections.json` | La table des 34 corrections : identifiant de l'emplacement, ancien nom, nouveau nom, nombre d'emplacements au relevé. Elle fait foi. |
| `releve-2026-10-13.json` | Les 80 lignes de `public.brands`, relevées en lecture publique le 2026-10-13 à 11 h 36 UTC (ce sont les données du catalogue, lisibles par tout visiteur). |
| `generer.mjs` | Écrit en entier les trois requêtes, `controle-prod.sql` et `attendus.json`. `node generer.mjs` redonne les fichiers du dépôt à l'octet près. Il refuse une table incohérente avec le relevé. |
| `attendus.json` | Les comptes, les verdicts et les empreintes prévus, pour la feuille d'exécution et le banc. |
| `controle-prod.sql` | Une seule requête en lecture seule, à lancer en production avant l'aller : comptes, aller simulé, empreintes, liste du retour. |
| `banc.mjs` | Banc d'essai sur PGlite : les trois requêtes prises comme des boîtes noires, sur le relevé. |

Ne jamais retoucher un fichier SQL à la main : changer la table, puis
`node generer.mjs`.

## Comment les requêtes se protègent

- **Tout ou rien, sur un état exact.** L'aller n'écrit que si l'empreinte de
  tous les noms est celle du relevé, puis vérifie que le résultat a
  exactement l'empreinte prévue ; sinon une erreur annule tout. Le retour fait
  de même dans l'autre sens. Une requête retouchée, coupée ou lancée sur une
  table qui a bougé ne peut donc pas écrire un autre état que les deux prévus.
- **L'empreinte des noms** est le `md5` de toutes les lignes, dans l'ordre des
  identifiants : `id=photo_protocol::text`. Elle couvre l'ordre des
  emplacements et toutes leurs clés.
- **L'empreinte des autres colonnes** couvre le reste de la ligne (date en
  UTC). Les blocs vérifient qu'elle ne change pas pendant leur écriture.
- **Le retour** porte, pour chacun des 284 emplacements, la ligne de marque,
  la position, l'identifiant, l'ancien nom et le nouveau : plusieurs anciens
  noms ont reçu le même nouveau, la liste dit lequel revient où.
- **Relancer** un bloc sur une table déjà dans l'état qu'il produit n'écrit
  rien.

## Vérifications du 2026-10-13

Trois calculs indépendants donnent les mêmes empreintes :

| | Empreinte des noms avant | après l'aller | autres colonnes |
|---|---|---|---|
| Générateur (JavaScript, d'après le relevé) | `5dd4011eb6d10aafc4dc4f645d2df213` | `a7935327f8a1c045d2ef70267e238aca` | `7df0492cd93fb8e3c5c97d88401abf5c` |
| Banc (PGlite 0.3.15, les vraies requêtes) | la même | la même | la même |
| Production, `controle-prod.sql`, lecture seule, 11 h 50 UTC | la même | la même (aller simulé) | la même |

- Production (lecture seule) : 80 lignes, 693 emplacements, 284 noms à
  corriger dans 71 lignes ; 0 correction au mauvais compte ; 0 ligne avec deux
  photos du même nom après l'aller simulé ; 0 identifiant en double dans une
  ligne ; la liste du retour recalculée depuis la base a l'empreinte de celle
  du script (`07a6f0dd6a91680d8a9a7df5b3074da8`).
- `public.brands` au relevé : aucun déclencheur ; RLS active, non forcée ;
  propriétaire `postgres` (qui passe outre la RLS) ; PostgreSQL 17.6.
- `banc.mjs` : 96 contrôles, tout passe. Aller, relance sans effet, retour au
  caractère près, aller après retour ; huit états faussés refusés dans les
  deux sens sans rien écrire ; deux déclencheurs parasites qui annulent tout ;
  requêtes retouchées (une correction retirée, un nom changé) qui s'annulent ;
  bloc coupé ou collé avec l'autre.
- Fenêtre d'avertissement de l'éditeur SQL de Supabase (« Potential issue
  detected ») : les contrôles d'avant exécution du code public de Supabase
  Studio, relevé le 2026-10-12, rejoués sur les trois requêtes, chacune seule.
  Aucune n'ouvre la fenêtre, l'éditeur n'ajoute de « limit » à aucune. La
  fenêtre s'ouvre si un bloc est collé sous un reste de requête (« delete »,
  « update » sans « where ») ou coupé avant sa fin : dans ces cas, annuler.
  Ce contrôle vaut pour le code relevé ce jour-là.

## Limites connues

- **La table ne doit pas bouger entre le relevé et l'aller.** Une marque
  ajoutée, un protocole retouché, et l'état répond « ÉCARTS » : rien ne
  s'écrit, il faut régénérer d'après un nouveau relevé
  (`releve-2026-10-13.json` à refaire, puis `node generer.mjs`).
- **Retour bloqué.** De même après l'aller : si la table change, le retour
  refuse. Un retour adapté se prépare alors comme un script neuf.
- **Anciens noms qui reviennent.** Les migrations qui ont créé les lignes de
  marque écrivent encore les anciens noms : une ligne créée en recopiant
  leurs gabarits les ramène. Rien ne le corrige tout seul.
- **Version anglaise.** `lib/i18n/photo-labels.ts` traduit les noms un par un
  et retombe sur le français pour un nom inconnu. Après l'aller, quatre noms
  aujourd'hui traduits s'afficheront en français dans la version anglaise
  (« Étiquette de la boîte », « Logo (gros plan) », « Coutures (gros plan) »,
  « Étiquette de col ») ; la plupart des noms de sacs et de vêtements n'y sont
  déjà pas traduits, et la version anglaise disparaît avec la refonte.
- **Concurrence.** Le verrou des blocs (« share row exclusive », délai de
  5 s) n'est pas éprouvé par le banc, qui n'a qu'une connexion.

## Lancer les outils

```
node generer.mjs
LV_PGLITE=/chemin/vers/@electric-sql/pglite/dist/index.js node banc.mjs
```

`LV_SORTIE=dossier node generer.mjs` écrit ailleurs que dans le dépôt ;
`node banc.mjs dossier` éprouve les requêtes de ce dossier.
