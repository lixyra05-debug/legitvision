// Tient lieu de next/navigation dans le navigateur des tests : pas de routeur.
export function useRouter() {
  return { push() {}, replace() {}, refresh() {}, back() {}, prefetch() {} };
}

// L'adresse d'un rapport : /check/<identifiant> (page de repli du rapport).
export function useParams() {
  return { id: "0f8fad5b-d9cb-469f-a165-70867728950e" };
}

// Dans Next, redirect et notFound interrompent le rendu : ici, une erreur, que
// le test relève.
export function redirect(vers: string): never {
  throw new Error(`redirect ${vers}`);
}

export function notFound(): never {
  throw new Error("notFound");
}
