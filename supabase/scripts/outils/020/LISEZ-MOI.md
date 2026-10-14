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

## Vérifications du 2026-10-14

- Base rejouée (001 à 019, socle) : identique à la production pour les 169
  lignes des schémas public et private de `supabase/checks/etat_base.sql`
  (fonctions et leur texte, déclencheurs, règles RLS, droits, structure,
  contraintes, index), comparées à `etat_base.attendu.tsv`.
- Production, en lecture seule le 2026-10-14 : `etat_base.sql` reproduit
  l'attendu sur 186 lignes de 196. Les 10 autres sont les lignes « table » ;
  l'écart porte sur deux d'entre elles, `storage.buckets` et
  `storage.objects` : Supabase y a retiré à anon et à authenticated quatre
  droits (TRUNCATE, REFERENCES, TRIGGER, MAINTAIN). Ces tables appartiennent
  à Supabase ; la 020 n'y touche pas. Le nouvel attendu, relevé après la
  020, l'intégrera.
- Production, en lecture seule le 2026-10-14 : `020_etat.sql` répond
  « PRÊT », empreinte `996d63cf501e1c39bc0d8ea0cbd8d4a9`, celle que le banc
  calcule. 019 en place, 19 migrations, aucun objet de la 020, aucun paiement
  crédité deux fois (2 lignes « purchase »), garde des profils active.
- La requête d'état donne la même empreinte quel que soit le réglage de
  l'éditeur (`"$user", public, extensions` pour Hector, `"$user", public`
  pour le connecteur en lecture seule, `pg_catalog`) : les noms de schéma
  public et extensions sont retirés avant l'empreinte.
- Banc : 28 contrôles, tout passe. La migration rend les 60 lignes de son
  contrôle interne toutes « ok » ; données intactes ; état « APPLIQUÉE »
  (empreinte `180a07c7d29172014a6d8a866ba927bd`) ; `020_controle.sql` tout
  « ok » ; rejeu identique ; retour arrière, puis état « PRÊT » au caractère
  près, puis migration de nouveau ; retour refusé quand le registre a une
  offre ; migration refusée avec un paiement crédité deux fois, ou après une
  migration plus récente, sans rien appliquer ; migration coupée à 110
  endroits, dont juste avant « commit » : rien d'appliqué.
- Fenêtre « Potential issue detected » de l'éditeur (contrôles d'avant
  exécution de Supabase Studio, code public relevé le 2026-10-12, rejoués
  hors ligne) : la requête d'état ne l'ouvre pas ; la migration l'ouvre, à
  cause de sa seule suppression, celle de la table temporaire de son contrôle
  (`drop table if exists pg_temp.controle_020`) ; le retour arrière l'ouvre
  (il supprime les objets de la 020). Aucune n'ajoute de « limit ».

## Limites connues

- PGlite n'a qu'une connexion : les verrous (profil, carte probable,
  `lock_timeout` de 5 s) ne sont pas éprouvés par ce banc.
- Le socle imite Supabase ; il ne reproduit ni le schéma auth complet ni le
  stockage. Ce que l'empreinte couvre (public, private) est vérifié
  identique ; le reste ne l'est pas.
- Une migration coupée juste avant « commit » laisse, dans l'éditeur, une
  transaction ouverte que rien ne valide ; le banc la referme par un
  « rollback », comme la fin de la session.
