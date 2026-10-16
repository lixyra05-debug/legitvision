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

## État : exécuté en production le 2026-10-17

Hector a lancé les trois étapes dans la nuit du 16 au 17 octobre 2026, vers
0 h 55, heure de Paris (exports CSV des étapes 1 et 3 à 0 h 54 et 0 h 56).
Étape 1 : « PRÊT : 284 noms de photos à corriger dans 71 lignes de marque
(table : 80 lignes, 693 photos demandées). On peut lancer la correction. »
Étape 2 : « Success. No rows returned ». Étape 3 : « APPLIQUÉ : les 34
corrections sont en place (284 noms corrigés dans 71 lignes de marque), 0 nom
à corriger. » Empreinte des noms : `5dd4011eb6d10aafc4dc4f645d2df213` avant,
`a7935327f8a1c045d2ef70267e238aca` après ; autres colonnes inchangées
(`7df0492cd93fb8e3c5c97d88401abf5c`). Le retour arrière n'a pas été lancé.
Les deux CSV, relus par Claude le 2026-10-17 (verdicts, empreintes, totaux,
et pour chacune des 34 corrections : avant, le compte du relevé ; après,
0 à corriger et le nouveau nom porté par autant de photos en plus) : aucun
écart. Base relue en lecture seule la veille, à 20 h 08 UTC : état « PRÊT »,
empreintes attendues. Aucune requête relancée depuis l'exécution.

- Ne pas relancer la correction : sur l'état corrigé, elle n'écrirait rien,
  et la requête d'état répond « APPLIQUÉ ».
- Le retour arrière ne se lance que sur décision d'Hector ; il exige
  l'empreinte des noms `a7935327f8a1c045d2ef70267e238aca`.

Ces requêtes ne touchent que `public.brands.photo_protocol`. Ces noms
s'affichent à l'étape d'envoi des photos (`components/check/
PhotoUploader.tsx`) et partent dans la consigne envoyée à l'IA
(`lib/ai/analyze.ts` : « nom (identifiant) » pour chaque photo) ; le rapport
ne les affiche pas, il nomme les zones d'après `lib/zone-names.ts`.

La mesure sur 60 paires, que ces requêtes devaient précéder, est abandonnée
(décision d'Hector, 2026-10-13) : il n'y a plus de fenêtre à éviter. Les
en-têtes des requêtes ont été corrigés en conséquence le soir même ; seuls des
commentaires ont changé, les instructions sont les mêmes au caractère près.

## Ce que changent les requêtes

34 corrections des noms de photos (`public.brands.photo_protocol`, clé
`label`) : 284 noms dans 71 des 80 lignes de marque. Des accents manquants
(« Vue arriere »), du franglais (« Tags », « print », « zip »), un mot faux
(« langue » pour « languette »), et trois choix validés par Hector le
2026-10-13 : « Étiquette de languette », « Pièces métalliques », « (gros
plan) » partout. Seule la clé `label` change : l'ordre des emplacements, leur
identifiant (`name`, qui nomme le fichier de la photo), `required`,
`min_resolution` et les autres colonnes ne changent pas.

Cinq identifiants gardent deux noms après l'aller (vingt avant), parce que la
table validée ne les rapproche pas : `back_full` (« Vue arrière complète » sur
19 lignes, « Vue de dos » sur 7), `logo_closeup` (« Logo (gros plan) » 23,
« Logo principal (gros plan) » 19), `stitching_detail` (« Coutures et broderie
(gros plan) » 19, « Coutures (gros plan) » 8), `overall_side_lateral` (« Vue
latérale » 11, « Vue latérale (côté extérieur) » 1) et `tag_size` (« Étiquette
de taille » 5, « Étiquette de taille / QR code » 1).

La photo `tongue_label` s'appelle « Étiquette de languette » (choix d'Hector),
alors que la zone `tongue_label` du rapport s'appelle « Étiquette de taille »
(`lib/zone-names.ts`) : 12 lignes de sneakers demandent aussi une photo
`size_tag` ou `tag_size`, qui porte déjà ce nom, et deux photos d'une même
ligne ne peuvent pas porter le même.

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
  de même dans l'autre sens. Une requête retouchée, coupée ou lancée sur des
  photos demandées qui ont bougé ne peut donc pas écrire un autre état que les
  deux prévus.
- **Le verdict ne regarde que les photos demandées.** Une autre colonne
  changée depuis le relevé (une marque désactivée, un logo ajouté, un nom de
  marque retouché) laisse le verdict à « PRÊT » et n'arrête pas les blocs :
  seule l'empreinte des autres colonnes change. C'est voulu : la correction
  des noms reste juste.
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
- **Un morceau de bloc lancé seul n'écrit rien et ne crée rien.** Les blocs
  rangent leurs empreintes par affectation (`v := (select …)`) et non par
  « select … into », qui, lancé hors du bloc, créerait une table.
- **La dernière ligne de chaque fichier** est un commentaire « -- FIN — … »
  propre à ce fichier : après un collage, l'éditeur montre la fin du texte,
  et cette ligne dit laquelle des trois requêtes est collée, en entier.

## Vérifications du 2026-10-13

Trois calculs indépendants donnent les mêmes empreintes :

| | Empreinte des noms avant | après l'aller | autres colonnes |
|---|---|---|---|
| Générateur (JavaScript, d'après le relevé) | `5dd4011eb6d10aafc4dc4f645d2df213` | `a7935327f8a1c045d2ef70267e238aca` | `7df0492cd93fb8e3c5c97d88401abf5c` |
| Banc (PGlite 0.3.15, les vraies requêtes) | la même | la même | la même |
| Production, `controle-prod.sql`, lecture seule, 12 h 25 UTC | la même | la même (aller simulé) | la même |

- Production (lecture seule, heure rendue par la base : 2026-10-13T12:25:16Z) :
  80 lignes, 693 photos demandées, 284 noms à corriger dans 71 lignes ;
  0 correction au mauvais compte ; 0 ligne avec deux photos du même nom après
  l'aller simulé ; 0 identifiant en double dans une ligne ; la liste du retour
  recalculée depuis la base a l'empreinte de celle du script
  (`07a6f0dd6a91680d8a9a7df5b3074da8`). Un premier passage, avant la relecture,
  avait donné les mêmes valeurs.
- L'instruction de la requête d'état (le fichier, sans son en-tête de
  commentaires), lancée ensuite en lecture seule sur la production : « PRÊT : 284 noms de photos à corriger dans 71 lignes de
  marque (table : 80 lignes, 693 photos demandées). On peut lancer la
  correction. », les deux empreintes attendues, puis 34 lignes où
  `a_corriger` égale `au_releve`.
- `public.brands` au relevé : aucun déclencheur ; RLS active, non forcée ;
  propriétaire `postgres` (qui passe outre la RLS) ; PostgreSQL 17.6.
- `banc.mjs` : 113 contrôles, tout passe. Aller, relance sans effet, retour au
  caractère près, aller après retour ; huit états faussés refusés dans les
  deux sens sans rien écrire ; deux déclencheurs parasites qui annulent tout ;
  requêtes retouchées (une correction retirée, un nom changé) qui s'annulent ;
  bloc coupé ; aller et retour collés ensemble ; requête d'état et aller
  collés ensemble (le tableau affiché date d'avant l'écriture, qui a lieu) ;
  autres colonnes changées ; 1 229 morceaux des deux blocs lancés seuls
  (chaque ligne, chaque début, chaque fin) : la table ne change à aucun
  moment, aucun objet n'est créé, et seuls passent sans erreur des
  commentaires et quatre lignes sans effet (« begin », « end », le délai, le
  verrou).
- Fenêtre d'avertissement de l'éditeur SQL de Supabase (« Potential issue
  detected ») : les contrôles d'avant exécution du code public de Supabase
  Studio, relevé le 2026-10-12, rejoués sur les trois requêtes, chacune seule.
  Aucune n'ouvre la fenêtre, l'éditeur n'ajoute de « limit » à aucune. La
  fenêtre s'ouvre si un bloc est collé sous un reste de requête (« delete »,
  « update » sans « where ») : dans ce cas, annuler. Un bloc coupé n'ouvre
  pas la fenêtre : c'est le serveur qui répond par une erreur de syntaxe. Ce
  contrôle vaut pour le code relevé ce jour-là.
- Relecture poussée, un tour, deux relecteurs indépendants (les requêtes ; la
  feuille d'exécution). Aucun n'a trouvé d'état où l'aller ou le retour
  écrirait autre chose que les deux états prévus, ni de « APPLIQUÉ » à tort ;
  le retour rend la table au caractère près, et sa liste, recalculée sans le
  générateur, est celle du fichier. Corrigé à leur suite : les textes qui
  disaient « la table » pour « les photos demandées » ; « select … into »
  remplacé par une affectation ; les repères de fin ; l'ordre des colonnes de
  l'état (les empreintes juste après le verdict) ; un contrôle du banc qui ne
  lisait pas le corps des blocs ; trois phrases de ce fichier. Non vérifié
  par eux ni par moi : le verrou sous concurrence (une seule connexion au
  banc) et l'affichage réel de l'éditeur de Supabase.

## Limites connues

- **Les photos demandées ne doivent pas bouger entre le relevé et l'aller.**
  Une ligne de marque ajoutée, un protocole retouché, et l'état répond
  « ÉCARTS » : rien ne s'écrit, il faut régénérer d'après un nouveau relevé.
  La date du relevé est écrite dans `generer.mjs` (`DATE_RELEVE`) et dans le
  nom du fichier du relevé : les changer ensemble, puis `node generer.mjs`.
- **Retour bloqué.** De même après l'aller : si une photo demandée change, le
  retour refuse. Un retour adapté se prépare alors comme un script neuf.
- **Sélection dans l'éditeur.** Avec du texte sélectionné, le bouton de
  l'éditeur devient « Run selected » et ne lance que la sélection. Une
  sélection faite de commentaires répond « Success. No rows returned » sans
  rien écrire : la preuve d'une écriture est toujours la requête d'état,
  lancée seule ensuite.
- **Requête d'état et bloc dans la même requête.** Les deux partent, et
  l'éditeur affiche le tableau de l'état, calculé avant l'écriture : il dit
  « PRÊT » alors que la correction est faite. La requête d'état relancée
  seule dit vrai.
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
