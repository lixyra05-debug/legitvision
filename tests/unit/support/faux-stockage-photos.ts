// Faux client Supabase (clé serveur) pour la purge des photos : le bucket
// analysis-photos et la table analysis_photos, en mémoire. Partagé par
// tests/unit/purge-photos.test.ts (la purge) et purge-route.test.ts (sa route).
// `panne` : le listage du bucket échoue avec ce message, comme le 03/10.
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Ligne = { id: string; analysis_id: string; storage_path: string; created_at: string };
export type Objet = { path: string; writtenAt: string; size: number };
type Entree = {
  name: string;
  id: string | null;
  created_at: string | null;
  updated_at: string | null;
  metadata: { size: number } | null;
};

export function fauxAdmin(objets: Objet[], lignes: Ligne[], { panne }: { panne?: string } = {}) {
  const etat = { objets: [...objets], lignes: [...lignes] };
  const storage = {
    from: () => ({
      async list(dossier: string, { limit, offset }: { limit: number; offset: number }) {
        if (panne) return { data: null, error: { message: panne } };
        const prefixe = dossier ? `${dossier}/` : "";
        const entrees = new Map<string, Entree>();
        for (const o of etat.objets.filter((x) => x.path.startsWith(prefixe))) {
          const [nom, ...sous] = o.path.slice(prefixe.length).split("/");
          entrees.set(
            nom,
            sous.length > 0
              ? { name: nom, id: null, created_at: null, updated_at: null, metadata: null }
              : { name: nom, id: o.path, created_at: o.writtenAt, updated_at: o.writtenAt, metadata: { size: o.size } }
          );
        }
        const triees = [...entrees.values()].sort((a, b) => a.name.localeCompare(b.name));
        return { data: triees.slice(offset, offset + limit), error: null };
      },
      async remove(chemins: string[]) {
        const retires = etat.objets.filter((o) => chemins.includes(o.path));
        etat.objets = etat.objets.filter((o) => !chemins.includes(o.path));
        return { data: retires.map((o) => ({ name: o.path })), error: null };
      },
    }),
  };
  const from = (table: string) => {
    assert.equal(table, "analysis_photos");
    return {
      select: () => ({
        order: () => ({
          range: async (de: number, a: number) => ({ data: etat.lignes.slice(de, a + 1), error: null }),
        }),
      }),
      delete: () => ({
        in: async (_colonne: string, ids: string[]) => {
          const avant = etat.lignes.length;
          etat.lignes = etat.lignes.filter((l) => !ids.includes(l.id));
          return { error: null, count: avant - etat.lignes.length };
        },
      }),
    };
  };
  return { admin: { storage, from } as unknown as SupabaseClient, etat };
}
