// Tient lieu des trois clients Supabase dans le navigateur des tests
// (lib/supabase/server.ts, admin.ts et client.ts) : aucune requête ne sort, la
// page du tableau de bord lit les données posées dans window.__PAGE.
import { clientDuTableauDeBord, type DonneesTableauDeBord } from "../faux-tableau-de-bord";

function donnees(): DonneesTableauDeBord {
  const page = window.__PAGE;
  if (page.ecran !== "tableau-de-bord") throw new Error("Supabase lu hors du tableau de bord");
  return page.donnees;
}

export const createClient = () => clientDuTableauDeBord(donnees);
export const createAdminClient = createClient;
