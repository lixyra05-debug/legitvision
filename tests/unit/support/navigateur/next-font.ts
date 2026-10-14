// Tient lieu de next/font/local dans le navigateur des tests : next/font
// n'existe qu'à la compilation de Next. La page prend les polices de repli.
export default function localFont() {
  return { variable: "", className: "", style: { fontFamily: "" } };
}
