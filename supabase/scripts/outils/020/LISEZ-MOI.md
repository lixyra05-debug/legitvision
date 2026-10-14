# Migration 020 : banc d'essai et requête d'état

La 020 (`supabase/migrations/020_offre_premier_achat_et_cout_ia.sql`) crée le
registre des analyses offertes au premier achat, la table des coûts IA,
l'index qui empêche de créditer deux fois un paiement, et les trois
fonctions qui créditent un achat, accordent ou retirent l'analyse offerte.
Elle est exécutée par Hector dans l'éditeur SQL de Supabase, une étape par
requête vide : état, migration, état. Retour arrière :
`supabase/scripts/020_retour.sql`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `supabase/scripts/020_etat.sql` | Requête d'état, en lecture seule : « PRÊT », « APPLIQUÉE » ou « ÉCARTS » en première ligne, et le détail. Ses valeurs attendues (empreintes de la base avant et après, texte des trois fonctions) sont écrites par le banc (`BANC_MAJ=oui`). |
| `socle-supabase.sql` | Ce que Supabase fournit avant la première migration (rôles, auth, storage, extensions, droits par défaut), pour la base d'essai. Jamais en production. |
| `banc.mjs` | Le banc, sur PGlite : rejoue 001 à 019, vérifie que la base obtenue est celle de la production, puis éprouve la requête d'état, la migration, son contrôle, son rejeu, le retour, les refus et la migration coupée. |

## Lancer le banc

```
LV_PGLITE=/chemin/vers/@electric-sql/pglite/dist/index.js node banc.mjs
```

`BANC_MAJ=oui` écrit dans `020_etat.sql` les valeurs qu'il mesure (après un
changement de la migration ou d'une migration antérieure) ; sans lui, le banc
échoue si le fichier ne les porte pas.

## Exécution en production : 2026-10-14

Exécutée par Hector dans l'éditeur SQL, une étape par requête vide :
- étape 1 : « PRÊT », empreinte `996d63cf501e1c39bc0d8ea0cbd8d4a9` ;
- étape 2 : tableau de 60 lignes, toutes « ok » ; la 020 est inscrite au
  registre à 13 h 25 min 44 s, heure de Paris ;
- étape 3, à 13 h 27 : « APPLIQUÉE », empreinte
  `180a07c7d29172014a6d8a866ba927bd`.

Relu ensuite en lecture seule (connecteur supabase-lecture) :
- `020_etat.sql` : APPLIQUÉE (20 migrations, 6 objets sur 6, 3 fonctions
  conformes, aucun doublon, garde des profils active, repère de la
  production reconnu) ;
- `supabase/checks/020_controle.sql` : 29 lignes, 27 « ok », 2 « info »
  (registre des offres et coûts IA vides), aucun écart ;
- `supabase/checks/etat_base.sql` : 255 lignes, identiques famille par
  famille à la nouvelle référence `etat_base.attendu.tsv` : l'ancienne (196
  lignes), les 59 lignes de la 020 mesurées sur le banc (3 fonctions, 2
  tables, 29 colonnes, 16 contraintes, 9 index), et la dérive de Supabase
  sur `storage.buckets` et `storage.objects` (anon et authenticated : `arwd`
  au lieu de `arwdDxtm`).

## Vérifications du 2026-10-14

- Base rejouée (001 à 019, socle) : identique à la production pour 174
  lignes de `supabase/checks/etat_base.sql` comparées à
  `etat_base.attendu.tsv` : schémas public et private (fonctions et leur
  texte, déclencheurs, règles RLS, droits, structure, contraintes, index),
  droits par défaut de postgres (public et global), déclencheur de
  `auth.users`. Les droits par défaut que Supabase donne à supabase_admin et
  le stockage ne sont pas reproduits.
- Production, en lecture seule le 2026-10-14 : `etat_base.sql` reproduit
  l'attendu sur 186 lignes de 196. Les 10 autres sont les lignes « table » ;
  l'écart porte sur deux d'entre elles, `storage.buckets` et
  `storage.objects` : Supabase y a retiré à anon et à authenticated quatre
  droits (TRUNCATE, REFERENCES, TRIGGER, MAINTAIN). Ces tables appartiennent
  à Supabase ; la 020 n'y touche pas. Le nouvel attendu, relevé après la
  020, l'intégrera.
- Production, en lecture seule le 2026-10-14 : `020_etat.sql` répond
  « PRÊT », empreinte `996d63cf501e1c39bc0d8ea0cbd8d4a9`, celle que le banc
  calcule. 019 en place (appliquée le 2026-09-27T14:52:30.546896 UTC : c'est
  le repère de la production, une copie répond « ÉCARTS »), 19 migrations,
  aucun objet de la 020, aucun paiement crédité deux fois (2 lignes
  « purchase »), garde des profils active.
- La requête d'état donne la même empreinte quel que soit le réglage de
  l'éditeur (`"$user", public, extensions` pour Hector, `"$user", public`
  pour le connecteur en lecture seule, `pg_catalog`) : les noms de schéma
  public et extensions sont retirés avant l'empreinte. Conséquence assumée :
  « public.f », « extensions.f » et « f » y comptent pour un même nom ; les
  fonctions du schéma extensions, le stockage et les droits par défaut ne
  sont pas dans l'empreinte (`etat_base.sql`, relu après l'exécution, les
  couvre).
- Quand le verdict est « ÉCARTS », la cellule `empreinte_base` commence par
  « ÉCARTS » : la feuille d'exécution refuse alors de passer au vert, même si
  l'empreinte seule est celle d'avant (un doublon de paiement, par exemple,
  n'est pas dans l'empreinte).
- Banc : 29 contrôles, tout passe. La migration rend les 60 lignes de son
  contrôle interne toutes « ok » ; données intactes ; état « APPLIQUÉE »
  (empreinte `180a07c7d29172014a6d8a866ba927bd`) ; `020_controle.sql` tout
  « ok » ; rejeu identique ; retour arrière, puis état « PRÊT » au caractère
  près, puis migration de nouveau ; retour refusé quand le registre a une
  offre ; migration refusée avec un paiement crédité deux fois, ou après une
  migration plus récente, sans rien appliquer ; requête d'état sur une copie
  qui n'est pas la production : « ÉCARTS » ; migration coupée à 110
  endroits, dont juste avant « commit » : aucune validation avant la fin du
  texte (ce contrôle ne dit rien du comportement de l'éditeur : une coupe au
  milieu d'une instruction est refusée par PostgreSQL avant toute exécution,
  une coupe entre deux instructions laisse une transaction jamais validée,
  que le banc annule).
- Fenêtre « Potential issue detected » de l'éditeur (contrôles d'avant
  exécution de Supabase Studio, code public relevé le 2026-10-12, rejoués
  hors ligne) : la requête d'état ne l'ouvre pas ; la migration l'ouvre, à
  cause de sa seule suppression, celle de la table temporaire de son contrôle
  (`drop table if exists pg_temp.controle_020`) ; le retour arrière l'ouvre
  (il supprime les objets de la 020). Aucune n'ajoute de « limit ».

## Limites connues

- Pendant les quelques secondes de la migration, ses contrôles verrouillent
  en écriture `credits_transactions`, `auth.users` et `analyses` : un achat,
  une inscription ou une analyse qui arrive à ce moment attend la fin.
- Relecture poussée du 2026-10-14 (un relecteur, un tour) : aucun défaut qui
  rende l'exécution dangereuse ; ses six remarques sont appliquées (cellule
  d'empreinte en « ÉCARTS », repère de la production, socle aux droits par
  défaut de la production, exclusion exacte de la doublure de moddatetime,
  formulation du contrôle de la coupe, feuille : rôle postgres et retour).

- PGlite n'a qu'une connexion : les verrous (profil, carte probable,
  `lock_timeout` de 5 s) ne sont pas éprouvés par ce banc.
- Le socle imite Supabase ; il ne reproduit ni le schéma auth complet ni le
  stockage. Ce que l'empreinte couvre (public, private) est vérifié
  identique ; le reste ne l'est pas.
- Une migration coupée juste avant « commit » laisse, dans l'éditeur, une
  transaction ouverte que rien ne valide ; le banc la referme par un
  « rollback », comme la fin de la session.
