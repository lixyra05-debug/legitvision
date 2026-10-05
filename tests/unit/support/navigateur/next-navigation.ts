// Tient lieu de next/navigation dans le navigateur des tests : pas de routeur.
export function useRouter() {
  return { push() {}, replace() {}, refresh() {}, back() {}, prefetch() {} };
}
