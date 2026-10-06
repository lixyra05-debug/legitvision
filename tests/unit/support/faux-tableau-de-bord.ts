// Ce que lit la page du tableau de bord (app/(dashboard)/dashboard/page.tsx),
// servi en mémoire : l'utilisateur, son profil, ses analyses. Sert à exécuter
// la VRAIE page hors de Next, dans Node (tableau-de-bord-assistant.test.ts) et
// dans le Chromium des tests (support/navigateur/page-assistant.tsx).
// Assez fidèle pour cette page, pas plus : filtres et tris sont ignorés, la
// fenêtre de lecture (.range) et le compte (head) sont respectés.

export interface DonneesTableauDeBord {
  utilisateur: { id: string; email: string; user_metadata: { full_name: string } };
  profil: Record<string, unknown>;
  analyses: Array<Record<string, unknown>>;
}

const UTILISATEUR = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

/** `nombre` analyses terminées, avec leur marque et leur modèle : aucune n'est à reprendre ni à renommer. */
export function donneesDuTableauDeBord(nombre: number): DonneesTableauDeBord {
  const verdicts = [
    { verdict: "likely_authentic", overall_score: 86 },
    { verdict: "inconclusive", overall_score: 58 },
    { verdict: "likely_fake", overall_score: 31 },
  ];
  return {
    utilisateur: { id: UTILISATEUR, email: "hector@example.com", user_metadata: { full_name: "Hector V" } },
    profil: {
      id: UTILISATEUR,
      full_name: "Hector V",
      avatar_url: null,
      role: "user",
      credits_remaining: 12,
      subscription_plan: "free",
      stripe_customer_id: null,
      stripe_subscription_id: null,
      created_at: "2026-09-01T08:00:00.000Z",
      updated_at: "2026-10-05T08:00:00.000Z",
    },
    analyses: Array.from({ length: nombre }, (_, i) => ({
      id: `0f8fad5b-d9cb-469f-a165-${String(i).padStart(12, "0")}`,
      user_id: UTILISATEUR,
      brand_id: "marque-1",
      model_id: "modele-1",
      status: "completed",
      ...verdicts[i % verdicts.length],
      confidence: "high",
      ai_raw_response: { confidence_level: "high" },
      created_at: "2026-10-05T10:00:00.000Z",
      updated_at: "2026-10-05T10:01:00.000Z",
      brands: { name: "Nike", slug: "nike" },
      models: { name: `Air Force 1 '07 (${i + 1})` },
    })),
  };
}

/** Faux client Supabase : tient lieu du client du serveur, du client admin et de celui du navigateur. */
export function clientDuTableauDeBord(lire: () => DonneesTableauDeBord) {
  function requete(table: string) {
    let compte = false;
    let bornes: [number, number] | null = null;
    const resultat = () => {
      const lignes = table === "analyses" ? lire().analyses : [];
      if (compte) return { data: null, count: lignes.length, error: null };
      return { data: bornes ? lignes.slice(bornes[0], bornes[1] + 1) : lignes, count: null, error: null };
    };
    const q = {
      select(_colonnes?: string, options?: { head?: boolean }) {
        compte = options?.head === true;
        return q;
      },
      eq: () => q,
      in: () => q,
      order: () => q,
      range(de: number, a: number) {
        bornes = [de, a];
        return q;
      },
      single: async () => ({ data: table === "profiles" ? lire().profil : null, error: null }),
      then<T>(suite: (valeur: ReturnType<typeof resultat>) => T) {
        return Promise.resolve(resultat()).then(suite);
      },
    };
    return q;
  }
  return {
    auth: {
      getUser: async () => ({ data: { user: lire().utilisateur } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signOut: async () => ({ error: null }),
    },
    from: requete,
  };
}
