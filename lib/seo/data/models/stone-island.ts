import type { ModelData } from "../../legit-check-types";

export const stoneIslandModels: ModelData[] = [
  {
    slug: "patch-hoodie",
    name: "Patch Hoodie",
    brandSlug: "stone-island",
    category: "clothing",
    priceRange: "180-400 €",
    retailYear: "1982-présent",
    tagline: "Le hoodie italien à patch compass iconique",
    intro:
      "Le Stone Island Patch Hoodie, produit depuis la fondation de la marque en 1982 par Massimo Osti, est le hoodie à patch « compass » (boussole) détachable sur la manche gauche — signature absolue de la marque italienne. Retail 220-350 € selon coton et saison, avec prix marché secondaire 180-400 € selon coloris et millésime. Les coloris classiques (navy, black, grey, green) sont les plus accessibles (180-280 €), tandis que les éditions limitées (ghost pieces, prototype research, shadow project) atteignent 400-800 €. Stone Island est une des marques les plus contrefaites en Europe (particulièrement UK pour culture football casual/terrace). Les signaux d'authentification ciblent : patch compass (broderie précise, boutons spécifiques), tag intérieur (étiquette tissée avec code produit), bouton compass (marquage gravé au laser), coton Italian-made (densité et toucher), et hang tag (cartonné premium avec numéro série).",
    signals: [
      {
        title: "Patch compass — broderie haute précision",
        description:
          "Le patch compass (losange avec étoile à 8 branches) est brodé en haute précision avec fil Madeira, 5000-7000 points. Les contrefaçons ont souvent des points visibles, une broderie fine (3000 points) ou une impression sérigraphie imitant broderie. Le contour du losange est parfaitement symétrique authentique.",
        difficulty: 1,
      },
      {
        title: "Boutons compass — 2 boutons gravés laser",
        description:
          "Le patch compass est fixé au hoodie par 2 boutons métalliques spécifiques Stone Island, avec logo compass gravé au laser. Les contrefaçons utilisent souvent des boutons simples ou un logo imprimé (pas gravé). Les boutons authentiques sont en laiton (pas en acier ou plastique peint).",
        difficulty: 2,
      },
      {
        title: "Tag intérieur — code produit 6 chiffres",
        description:
          "Le tag intérieur tissé indique la marque « Stone Island » + code produit 6 chiffres (ex: 64120, 64220, 631541). Le tag a aussi la mention « Made in Italy » avec police exacte. Les contrefaçons ont souvent « Made in China/Turkey » ou un code produit inexistant dans le catalogue Stone Island.",
        difficulty: 2,
      },
      {
        title: "Coton Italian-made — densité et ghost effect",
        description:
          "Le coton est produit en Italie (Ravenne) avec densité 350-450 gsm (selon modèle) et traitement « garment dyed » (teint après confection) qui donne un effet légèrement délavé et unique à chaque pièce. Les contrefaçons ont un coton uniforme (teint avant confection), avec densité 250-300 gsm plus légère.",
        difficulty: 3,
      },
      {
        title: "Hang tag — cartonné premium avec numéro série",
        description:
          "Le hang tag est en carton premium épais (1 mm) avec numéro série unique à 10 chiffres, hologramme Stone Island, et QR code de vérification (depuis 2022). Les contrefaçons ont souvent un hang tag en carton fin, sans hologramme ou avec QR code menant à un site fake.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Patch Hoodie « ghost piece » à 200 €",
        description:
          "Les « ghost pieces » (pièces tout-noir, logo noir sur noir) valent 500-900 €. Toute annonce à 200 € est une contrefaçon. Les ghost pieces authentiques ont un patch compass en fil ton-sur-ton (noir sur noir), détail que les contrefaçons ratent souvent.",
      },
      {
        title: "Vente patch détaché + hoodie fake",
        description:
          "Certains vendeurs achètent un patch compass authentique (50-80 €) puis le fixent sur un hoodie fake pour vendre le tout comme authentique. Vérifiez que les boutons, le tissu et les tags correspondent à une pièce authentique, pas juste le patch.",
      },
    ],
    faqs: [
      {
        question: "Faut-il retirer le patch compass Stone Island avant lavage ?",
        answer:
          "Oui, OBLIGATOIRE. Le patch est fixé par 2 boutons qui se dévissent. Lavage à 30°C max sans patch, sinon le patch peut se déformer ou le hoodie peut perdre sa teinte « garment dyed ». Stone Island recommande lavage à l'envers + patch retiré + séchage à l'air.",
      },
      {
        question: "Comment distinguer un Patch Hoodie classic d'un Shadow Project ou Ghost ?",
        answer:
          "Shadow Project a un tag intérieur noir avec logo « Shadow Project » au lieu de « Stone Island » classique (prix 400-800 €). Ghost Pieces ont un patch compass ton-sur-ton et code produit spécifique. Prototype Research (Stone Island Shadow Project) a un tag jaune limited edition. Les contrefaçons imitent mais les tags sont souvent incorrects.",
      },
    ],
  },
  {
    slug: "jacket",
    name: "Stone Island Jacket",
    brandSlug: "stone-island",
    category: "clothing",
    priceRange: "350-1 200 €",
    retailYear: "1982-présent",
    tagline: "La veste technique italienne au patch compass",
    intro:
      "La Stone Island Jacket — terme générique regroupant les vestes iconiques David-TC, Raso Gommato, Nylon Metal, Tela Stella — est le vêtement technique signature de la marque italienne depuis 1982. Retail 450-900 € selon matériau, avec prix marché secondaire 350-1 200 € selon modèle et millésime. Les vestes classiques David-TC (navy, black, khaki) sont les plus accessibles (350-600 €), tandis que les Raso Gommato (coton enduit), Nylon Metal Shiny et les Heat Reactive Ice Jackets (changement de couleur selon température) atteignent 800-1 500 €. La contrefaçon Stone Island Jacket est particulièrement rentable pour les fakers (marge de 500-800 € par pièce), donc très présente sur Vinted UK, Grailed et sites russes. Les cinq signaux ci-dessous ciblent : patch compass premium, zippers YKK italiens, tag intérieur triangulaire, fabric tech (membrane respirante spécifique), et hang tag avec care instructions détaillées.",
    signals: [
      {
        title: "Patch compass — boutons + double liserés",
        description:
          "Le patch compass sur jacket est fixé par 2 boutons gravés, avec un double liseré de couture autour du patch (plus précis que sur hoodie). Les contrefaçons ont souvent un seul liseré ou un liseré mal aligné. Sur Raso Gommato, le patch est cousu ton-sur-ton sans liseré visible — détail difficile à imiter.",
        difficulty: 2,
      },
      {
        title: "Zippers YKK italiens — marquage spécifique",
        description:
          "Tous les zippers sont YKK italiens avec marquage « YKK » + « Stone Island » gravé sur le tirette principale. Les contrefaçons utilisent souvent des zippers génériques (pas YKK) ou YKK asiatiques sans co-branding Stone Island.",
        difficulty: 2,
      },
      {
        title: "Tag intérieur triangulaire — code + date",
        description:
          "Le tag intérieur des jackets a une forme triangulaire spécifique (pas rectangulaire comme hoodies), avec code produit + date de production (MM/YYYY). Les contrefaçons ont souvent un tag rectangulaire copié du hoodie ou un tag triangulaire avec date incohérente avec le modèle.",
        difficulty: 3,
      },
      {
        title: "Fabric tech — membrane respirante Italie",
        description:
          "Les jackets techniques (David-TC, Raso Gommato) utilisent des membranes respirantes développées en Italie par SOFILETA ou équivalent, avec étiquette intérieure « Laminated Fabric Made in Italy ». Les contrefaçons utilisent des membranes chinoises sans étiquette ou avec une étiquette générique.",
        difficulty: 3,
      },
      {
        title: "Hang tag — care instructions détaillées + QR",
        description:
          "Le hang tag inclut des care instructions détaillées spécifiques au matériau (ex: Raso Gommato = pas de machine, nettoyage à sec uniquement), un numéro série à 10 chiffres, et un QR code de vérification (depuis 2022). Les contrefaçons ont souvent des care instructions génériques ou absentes.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Ice Jacket « heat reactive » à 300 €",
        description:
          "Les Ice Jackets (qui changent de couleur selon température) valent 900-1 500 €. Toute annonce à 300 € est une contrefaçon. Les Ice Jackets authentiques ont un test simple : appliquer glace → couleur change visiblement en 30 secondes. Les fakes ne changent pas ou changent très peu.",
      },
      {
        title: "Vente Raso Gommato « déstockage boutique »",
        description:
          "Prétexte fréquent : « ancien stock boutique, prix cassé ». Stone Island ne fait jamais de déstockage public en-dessous de 40% off (prix minimum = 540 € pour Raso Gommato retail 900 €). Toute annonce à moins de 400 € est suspecte.",
      },
    ],
    faqs: [
      {
        question: "Quelles sont les Stone Island Jackets les plus recherchées ?",
        answer:
          "Par ordre de rareté et valeur : (1) Ice Jackets Heat Reactive 1988-1995 (1 500-5 000 €, ultra-rare vintage), (2) Shadow Project prototype research (800-2 500 €), (3) Raso Gommato garment dyed (700-1 200 €), (4) Nylon Metal Shiny (500-900 €), (5) David-TC classique (350-700 €). Les collabs (Supreme x Stone Island 2014-2023) atteignent 1 500-4 000 €.",
      },
      {
        question: "Les Stone Island Jackets Shadow Project sont-elles plus rares ?",
        answer:
          "Oui. Stone Island Shadow Project est une sous-ligne premium lancée en 2008 (direction créative Errolson Hugh, ACRONYM) avec tag noir au lieu de tag classique, prix retail 800-1 500 €. Drop 2 fois/an en séries limitées. Les contrefaçons Shadow Project sont rares car la marge est moindre pour les fakers (demande plus ciblée), mais existent.",
      },
    ],
  },
];
