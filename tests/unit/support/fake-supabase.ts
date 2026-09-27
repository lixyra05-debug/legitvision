// Faux client Supabase (clé serveur) en mémoire, assez fidèle à PostgREST pour
// exécuter la VRAIE route /api/analyze et lib/credit-release.ts. Chaque requête
// cède la main avant de s'exécuter : des requêtes concurrentes s'entrelacent
// comme sur le réseau.
//
// `faults` : fonctions (appel) → undefined | { error } | { commitThenError }
//   - { error } : la requête échoue SANS rien écrire ;
//   - { commitThenError } : la requête s'exécute (écrit) PUIS le client reçoit
//     une erreur (réponse perdue après la validation : coupure réseau, délai).
// `guardRevert` : un déclencheur remet l'ancien solde, sans erreur.

type Row = Record<string, unknown>;
type DbError = { message: string; code?: string };
export type Call = { table: string; op: string; values: Row | null; desc: string };
export type Fault = (call: Call) => { error?: DbError; commitThenError?: DbError } | undefined;
type Result = { data: unknown; error: DbError | null };

export interface FakeDb {
  profiles: Row[];
  analyses: Row[];
  analysis_photos: Row[];
  credits_transactions: Row[];
  brands: Row[];
  models: Row[];
  faults: Fault[];
  guardRevert: boolean;
  calls: Call[];
}

type Table = "profiles" | "analyses" | "analysis_photos" | "credits_transactions" | "brands" | "models";

const tick = () => new Promise((resolve) => setImmediate(resolve));
let seq = 0;

export function createFakeSupabase(init: Omit<FakeDb, "faults" | "guardRevert" | "calls" | "credits_transactions">) {
  const db: FakeDb = {
    profiles: init.profiles.map((p) => ({ ...p })),
    analyses: init.analyses.map((a) => ({ updated_at: new Date().toISOString(), ...a })),
    analysis_photos: init.analysis_photos.map((p) => ({ ...p })),
    credits_transactions: [],
    brands: init.brands,
    models: init.models,
    faults: [],
    guardRevert: false,
    calls: [],
  };

  function applyFaults(call: Call): { error?: DbError; after?: DbError } {
    db.calls.push(call);
    let after: DbError | undefined;
    for (const fault of db.faults) {
      const r = fault(call);
      if (r?.error) return { error: r.error };
      if (r?.commitThenError) after = r.commitThenError;
    }
    return { after };
  }

  function builder(table: Table) {
    const q = {
      op: "select",
      filters: [] as Array<(r: Row) => boolean>,
      desc: [] as string[],
      single: false,
      limit: null as number | null,
      returning: null as string | null,
      values: null as Row | null,
    };
    const api = {
      select(cols?: string) {
        if (q.op !== "select") q.returning = cols ?? "*";
        return api;
      },
      update(values: Row) { q.op = "update"; q.values = values; return api; },
      insert(values: Row) { q.op = "insert"; q.values = values; return api; },
      eq(c: string, v: unknown) { q.filters.push((r) => r[c] === v); q.desc.push(`${c}=${String(v)}`); return api; },
      neq(c: string, v: unknown) { q.filters.push((r) => r[c] !== v); return api; },
      in(c: string, vs: unknown[]) { q.filters.push((r) => vs.includes(r[c])); q.desc.push(`${c} in ${vs.join(",")}`); return api; },
      gte(c: string, v: string) { q.filters.push((r) => String(r[c]) >= v); return api; },
      lt(c: string, v: string) { q.filters.push((r) => String(r[c]) < v); return api; },
      order() { return api; },
      limit(n: number) { q.limit = n; return api; },
      single() { q.single = true; return api; },
      then<T>(resolve: (r: Result) => T, reject?: (e: unknown) => T) { return run().then(resolve, reject); },
    };

    const project = (r: Row) => {
      if (!q.returning || q.returning === "*") return { ...r };
      return Object.fromEntries(q.returning.split(",").map((c) => c.trim()).map((c) => [c, r[c]]));
    };

    async function run(): Promise<Result> {
      await tick();
      const { error, after } = applyFaults({ table, op: q.op, values: q.values, desc: q.desc.join(" & ") });
      if (error) return { data: null, error };
      const rows = db[table];
      let out: Result;
      if (q.op === "select") {
        let m = rows.filter((r) => q.filters.every((f) => f(r)));
        if (q.limit != null) m = m.slice(0, q.limit);
        out = q.single
          ? m.length === 1
            ? { data: { ...m[0] }, error: null }
            : { data: null, error: { code: "PGRST116", message: "not single" } }
          : { data: m.map((r) => ({ ...r })), error: null };
      } else if (q.op === "update") {
        const m = rows.filter((r) => q.filters.every((f) => f(r)));
        for (const r of m) {
          const v = { ...q.values };
          if (table === "profiles" && db.guardRevert) delete v.credits_remaining;
          Object.assign(r, v, { updated_at: new Date().toISOString() });
        }
        out = { data: q.returning ? m.map(project) : null, error: null };
      } else {
        rows.push({ id: `tx${++seq}`, created_at: new Date().toISOString(), ...q.values });
        out = { data: null, error: null };
      }
      return after ? { data: null, error: after } : out;
    }
    return api;
  }

  const client = {
    from: (table: Table) => builder(table),
    // decrement_credits_atomic (migration 017) : UPDATE conditionnel et ligne
    // « usage » dans la même transaction.
    async rpc(name: string, args: { p_user_id: string; p_analysis_id: string; p_description: string }): Promise<Result> {
      await tick();
      const { error, after } = applyFaults({ table: "rpc", op: name, values: args, desc: "" });
      if (error) return { data: null, error };
      const p = db.profiles.find((x) => x.id === args.p_user_id && (x.credits_remaining as number) >= 1);
      if (!p) return { data: null, error: { message: "INSUFFICIENT_CREDITS", code: "P0001" } };
      p.credits_remaining = (p.credits_remaining as number) - 1;
      db.credits_transactions.push({
        id: `tx${++seq}`, user_id: args.p_user_id, type: "usage", amount: -1,
        balance_after: p.credits_remaining, description: args.p_description, analysis_id: args.p_analysis_id,
      });
      return after ? { data: null, error: after } : { data: p.credits_remaining, error: null };
    },
    storage: {
      from: () => ({
        async download(path: string) {
          await tick();
          const { error } = applyFaults({ table: "storage", op: "download", values: { path }, desc: path });
          if (error) return { data: null, error };
          return { data: { arrayBuffer: async () => new ArrayBuffer(8) }, error: null };
        },
      }),
    },
  };
  return { db, client };
}

/** Un utilisateur, son solde, et des analyses « pending » d'une photo chacune. */
export function seedAnalyses({ userId, credits, analyses }: { userId: string; credits: number; analyses: string[] }) {
  return {
    profiles: [{ id: userId, credits_remaining: credits, subscription_plan: "free" }],
    analyses: analyses.map((id) => ({
      id, user_id: userId, brand_id: "b1", model_id: "m1", category: "sneakers", status: "pending",
      created_at: new Date(Date.now() - 60_000).toISOString(),
    })),
    analysis_photos: analyses.map((id) => ({
      id: `ph-${id}`, analysis_id: id, user_id: userId, storage_path: `${userId}/${id}/sole.jpg`,
      photo_type: "sole", order_index: 0,
    })),
    brands: [
      { id: "b1", name: "Nike", category: "sneakers", is_active: true, photo_protocol: [{ name: "sole", label: "Semelle", required: true }] },
      { id: "b2", name: "Chanel", category: "bag", is_active: true, photo_protocol: [{ name: "front", label: "Face", required: true }] },
    ],
    models: [
      {
        id: "m1", brand_id: "b1", name: "Dunk", is_active: true, authentication_points: [{ zone: "sole", weight: 1 }],
        specific_auth_points: null, variants: ["Low", "High"], collaborations: [{ name: "Off-White", detail: "" }],
      },
      {
        id: "m2", brand_id: "b2", name: "2.55", is_active: true, authentication_points: [{ zone: "front", weight: 1 }],
        specific_auth_points: null, variants: [], collaborations: [],
      },
    ],
  };
}
