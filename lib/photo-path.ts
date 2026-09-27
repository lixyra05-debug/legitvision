/**
 * Chemin de stockage d'une photo d'analyse : {user_id}/{analysis_id}/{nom}
 * (CLAUDE.md, règle 4 ; le nom est {photo_type}.{extension}). Le navigateur
 * l'écrit lui-même dans analysis_photos. La base le vérifie à l'insertion
 * (migration 018, public.is_own_photo_path, même règle) ; le serveur, qui lit
 * et supprime avec la clé de service, le revérifie : il ne suit un chemin que
 * s'il désigne un fichier du dossier de CETTE analyse.
 *
 * Le nom doit être un seul segment ordinaire. storage-js n'encode pas le
 * chemin et fetch le normalise ; sont donc refusés :
 * - « / » et « \ » (séparateurs de segment pour une URL http) ;
 * - « % » (« %2e%2e » est lu comme « .. » : remontée vers le dossier d'un
 *   autre utilisateur, voire un autre bucket) ;
 * - « ? » et « # » (fin du chemin dans une URL) ;
 * - les caractères de contrôle (retirés par l'analyseur d'URL) ;
 * - les segments « . » et « .. ».
 */
export function isOwnPhotoPath(path: unknown, userId: string, analysisId: string): path is string {
  if (typeof path !== "string") return false;
  const dossier = `${userId}/${analysisId}/`;
  if (!path.startsWith(dossier)) return false;
  const nom = path.slice(dossier.length);
  return nom.length > 0 && nom !== "." && nom !== ".." && !/[/\\%?#\u0000-\u001f\u007f]/.test(nom);
}
