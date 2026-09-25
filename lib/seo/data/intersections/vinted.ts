import type { Intersection } from "../../types";
import { facts } from "@/lib/site-facts";

const FACTS = facts();

// Vérification Vinted : « Prix : 100 € minimum », « 10 € par article » — centre d'aide Vinted France, https://www.vinted.fr/help/1147 (consulté le 2026-09-25).
export const vintedIntersections: Intersection[] = [
  {
    platformSlug: "vinted",
    brandSlug: "nike",
    angle:
      "Les Air Force 1 Low blanches et les Dunk Low Panda sont visées par les contrefacteurs : leur prix retail élevé (110-130 €) comparé à un coût de production clandestine de 8-15 € offre une marge profitable. Les revendeurs opèrent souvent depuis des comptes récents créés sur mesure, avec des photos issues de StockX ou du site Nike officiel, puis expédient un produit chinois à bas de gamme. Un contrôle préalable au paiement est donc vital.",
    faqs: [
      {
        question: "Quel prix minimum raisonnable pour des Nike authentiques sur Vinted ?",
        answer:
          "Pour des Air Force 1 blanches neuves, ne descendez pas sous 70 € (retail 110 €). Pour des Dunk Low Panda, le seuil est 90-100 €. En dessous, l'annonce est suspecte. Les Nike de plus de 2 ans peuvent descendre plus bas, mais restez vigilant sur les modèles hyped (Travis Scott, Off-White, SB) où les prix cassés sont suspects.",
      },
      {
        question: "Comment faire une reverse image search pour Nike sur Vinted ?",
        answer:
          "Sur l'annonce Vinted, faites un clic droit sur chaque photo et « Rechercher l'image avec Google ». Si les mêmes photos apparaissent sur StockX, eBay, Stadium Goods ou le Nike Shop officiel, le vendeur les a volées. C'est un signal d'arnaque. Faites systématiquement ce test sur au moins 3 photos de l'annonce avant tout paiement.",
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "air-jordan",
    angle:
      "Les Air Jordan sur Vinted représentent un paradoxe : la plateforme concentre des paires contrefaites, tout en étant un canal où de vraies pépites apparaissent occasionnellement (ventes de collections personnelles, familles qui revendent). Une Jordan 1 Chicago à 150 € est suspecte. Le réflexe à adopter : ne jamais acheter avant d'avoir reçu des photos détaillées selon le protocole LegitVision (wings, Jumpman, box, semelle, coutures).",
    faqs: [
      {
        question: "Pourquoi tant de fausses Jordan 1 Chicago sur Vinted ?",
        answer:
          "La Jordan 1 Chicago est le modèle Jordan le plus iconique (coloris original 1985) avec un prix marché de 800-2 500 € selon la génération. Son design rouge/blanc/noir se copie techniquement facilement. Les contrefacteurs chinois produisent en masse des répliques à 30-50 € qu'ils écoulent sur Vinted à 150-300 €, ciblant les acheteurs débutants qui pensent faire l'affaire du siècle.",
      },
      {
        question: "Les Travis Scott Jordan à moins de 500 € sont-elles authentiques ?",
        answer:
          "Le prix marché des Travis Scott Jordan 1 Low Mocha oscille entre 1 100 et 1 600 €, celui des Travis Scott Jordan 1 High Mocha entre 1 500 et 2 800 €. Toute annonce sous les 700 € est suspecte. Les revendeurs ciblent spécifiquement les acheteurs débutants séduits par des prix « accessibles » sur des modèles ultra-hyped.",
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "adidas",
    angle:
      "adidas sur Vinted a connu une explosion de contrefaçons depuis 2023, particulièrement sur les Samba OG et Gazelle Indoor suite à leur viralité TikTok. Les super-fakes Samba circulent à 50-80 € quand les authentiques se revendent 130-180 €, et sont techniquement convaincantes sur les trois bandes et la gum sole — seule l'étiquette intérieure et la cohérence du pays de production permettent la détection. Côté Yeezy, la fin du partenariat Kanye/adidas en 2022 a gelé l'offre officielle.",
    faqs: [
      {
        question: "Les Samba OG à 80 € sur Vinted sont-elles des fakes ?",
        answer:
          "Les Samba OG authentiques (retail 110 €, marché 150-200 €) ne descendent pas sous 70-90 € en état correct. Sous 80 €, l'annonce est suspecte. Vérifiez systématiquement l'Article Number (format IE1000-style) sur adidas.com, l'étiquette intérieure avec le pays de fabrication, et le logo Trefoil sur la languette qui doit être parfaitement symétrique.",
      },
      {
        question: "Peut-on encore acheter des Yeezy authentiques en 2026 ?",
        answer:
          "Oui, mais uniquement des stocks existants pré-rupture adidas (octobre 2022). Aucune nouvelle production Yeezy n'existe depuis mi-2024. Toute paire prétendument neuve et récente mise en vente après 2024 est suspecte. Vérifiez la date de fabrication sur la box (doit être antérieure à 2024) et l'Article Number existant dans la base adidas avant de valider l'achat.",
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "new-balance",
    angle:
      "L'explosion culturelle des New Balance 990v5 et 2002R depuis la collaboration Aimé Leon Dore a transformé Vinted en terrain miné pour cette marque. Les 990v5 Grey Day, initialement vendues 210 € chez New Balance, atteignent 350-500 € sur Vinted en seconde main et sont contrefaites. Les contrefaçons exploitent la méconnaissance des signaux New Balance chez les acheteurs récents (apparition sur la hype depuis 2022 seulement), notamment sur le marquage « Made in USA » qui est juridiquement sanctionné en cas de fraude mais encore largement fakés.",
    faqs: [
      {
        question: "Les New Balance 2002R sur Vinted sont-elles fiables ?",
        answer:
          "Partiellement. Le 2002R retail à 180 € se revend 250-400 € en seconde main selon le colorway. Les annonces sous 180 € sont suspectes. Vérifiez particulièrement la qualité du N latéral (cuir suédé vs synthétique), la box label cohérente avec l'étiquette intérieure, et le poids en main (les contrefaçons sont souvent 50-80 g plus légères).",
      },
      {
        question: "Le Made in USA sur Vinted est-il vérifiable ?",
        answer:
          "Visuellement oui : les modèles 990v5/v6, 993 et 998 portent un marquage gravé « Made in USA » sur la languette ou l'étiquette intérieure. Ce marquage est encadré par la FTC américaine et son usage frauduleux est pénalement sanctionné. Mais les contrefacteurs l'ajoutent quand même. Vérifiez la cohérence du marquage avec la box label, et la qualité générale d'exécution — les faux Made in USA ont souvent une midsole ABZORB visiblement moins détaillée.",
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "louis-vuitton",
    angle:
      "Louis Vuitton sur Vinted représente un segment risqué de la plateforme. Vinted a déployé un service d'authentification payant (10 €) pour les articles à partir de 100 €, mais il reste optionnel et souvent négligé par les acheteurs. La présence ou l'absence de code date (pré-2021) ou de puce RFID (post-2021) est le signal le plus discriminant dans cette configuration.",
    faqs: [
      {
        question: "Vinted authentifie-t-il automatiquement les Louis Vuitton ?",
        answer:
          "Non, jamais automatiquement. Vinted propose un service d'authentification optionnel pour les articles à partir de 100 €, pour 10 € supplémentaires, choisi par l'acheteur au moment du paiement.",
      },
      {
        question: "Un Neverfull à 500 € sur Vinted est-il crédible ?",
        answer:
          "Le Neverfull MM en Monogram retail à 2 100 € (2025) avec un marché secondaire à 1 200-1 800 € en état correct. Une annonce à 500 € est suspecte. Les rares exceptions (décès, divorce, urgence) sont toujours accompagnées d'explications crédibles du vendeur + photos extrêmement détaillées incluant preuve d'achat originale.",
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "chanel",
    angle:
      "Chanel est une marque sensible sur Vinted : les prix marché (5 000-30 000 € selon modèle) et la rareté organisée par Chanel rendent toute annonce à moins de 3 000 € hautement suspecte. Les super-fakes Chanel de 2024-2026 atteignent un réalisme qui trompe même des vendeuses expérimentées sur photo. Le signal le plus fiable pour distinguer vrai et faux sur Vinted reste l'hologramme d'authenticité avec son numéro de série à 7-8 chiffres, la carte associée, et la cohérence du matelassage sur les angles cachés que les vendeurs montrent rarement en photo. Un achat Chanel sans vérification préalable est un pari.",
    faqs: [
      {
        question: "Un Classic Flap à 2 000 € sur Vinted peut-il être vrai ?",
        answer:
          "Le Classic Flap Medium en caviar noir quincaillerie or retail à 10 800 € (2025) avec un marché secondaire à 6 500-8 500 € en état très bon. Une annonce à 2 000 € est suspecte. Les rares cas authentiques sous 3 000 € concernent des modèles portés abondamment ou abîmés — vérifiez systématiquement photos de l'état et hologramme avant toute considération.",
      },
      {
        question: "L'hologramme Chanel est-il vérifiable sur photo Vinted ?",
        answer:
          "Partiellement. Un hologramme flou ou pris de loin ne permet pas l'authentification. Demandez au vendeur une photo ultra-nette, de face et à 45° (pour voir la grille de sécurité), avec le numéro lisible. Si le vendeur refuse ou fournit une photo de mauvaise qualité volontaire, c'est un signal fort de contrefaçon. L'hologramme doit correspondre exactement à la période de fabrication revendiquée.",
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "gucci",
    angle:
      "Gucci sur Vinted présente une situation complexe : la diversité des lignes (Marmont, Dionysus, Jackie, Ophidia, accessoires, ceintures) crée un volume massif d'annonces où se mélangent vrais et faux. Les sliders (sandales Gucci), ceintures GG et petits accessoires sont un segment de contrefaçon rentable : produits en volume massif en Chine, ils s'écoulent à 60-120 € quand les authentiques valent 350-550 €.",
    faqs: [
      {
        question: "Comment repérer une fausse ceinture Gucci GG sur Vinted ?",
        answer:
          "La ceinture GG Marmont retail à 440-550 € selon la taille — toute annonce sous 180 € en état neuf est suspecte. Vérifiez la quincaillerie Double G (poids de 85-110 g en main), le marquage intérieur « Gucci Made in Italy », et le numéro de série à 10-12 chiffres.",
      },
      {
        question: "Comment vérifier une Gucci Marmont avant achat Vinted ?",
        answer:
          `Demandez au vendeur les ${FACTS.bagPhotosMin} à ${FACTS.bagPhotosMax} photos que l'analyse demande pour un sac, notamment : vue globale, heat-stamp intérieur cuir, numéro de série avec bullet point (format XXXXXX • XXXX), quincaillerie Double G avec marquage intérieur, matelassage chevron sur les angles, et doublure intérieure. Uploadez l'ensemble sur LegitVision pour un diagnostic IA à ${FACTS.priceSingle} avant de valider l'achat.`,
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "hermes",
    angle:
      "Hermès sur Vinted est un segment extrêmement risqué : compte tenu des prix réels en seconde main (Birkin à 15 000-50 000 €, Kelly à 10 000-30 000 €, Constance à 6 000-12 000 €), toute annonce Hermès sous 4 000 € sur Vinted doit être considérée comme une contrefaçon par défaut. La plateforme concentre des super-fakes « UA » abouties, produites à partir de cuirs italiens premium par des contrefacteurs spécialisés, qui peuvent tromper une authentification visuelle. Le blind stamp, la couture sellier main, et la cohérence des cuirs par saison sont les signaux techniques les plus fiables — mais seule une expertise approfondie permet la détection finale.",
    faqs: [
      {
        question: "Un Birkin à 3 000 € sur Vinted est-il possible ?",
        answer:
          "Le prix minimum d'un Birkin 30 Togo ou Epsom en état correct dépasse 12 000-15 000 € en seconde main. Une annonce à 3 000 € est suspecte.",
      },
      {
        question: "Vinted peut-il authentifier un Hermès à 10 000 € ?",
        answer:
          "Le service de vérification de Vinted (articles à partir de 100 €) fait intervenir l'équipe d'experts de Vinted. Pour un sac à 10 000+ €, faites toujours une double authentification avec un expert Hermès dédié, même après validation Vinted. Le risque financier justifie ce double contrôle.",
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "prada",
    angle:
      "Prada sur Vinted concentre ses contrefaçons sur la Re-Edition 2000 Nylon Mini, devenue icône Y2K depuis 2020. Le prix retail à 1 650 € et le marché secondaire à 2 200-2 800 € offrent une marge de contrefaçon intéressante qui attire les revendeurs chinois et turcs. Les super-fakes reproduisent désormais correctement le triangle logo et le nylon Saffiano, exigeant une vérification poussée du numéro de série à 13 chiffres, de la densité nylon (280 g/m² authentique vs 180-220 g/m² contrefaçon), et du marquage « PRADA MILANO » intérieur.",
    faqs: [
      {
        question: "Re-Edition 2000 à 800 € sur Vinted : vraie ou fausse ?",
        answer:
          "À 800 €, l'annonce est suspecte. Le prix minimum raisonnable d'une Re-Edition 2000 en état correct en seconde main est 1 200-1 500 €. En dessous, exigez des photos ultra-détaillées : triangle logo parfaitement aligné avec « DAL 1913 » gravé, carte d'authenticité avec numéro 13 chiffres + lettre, intérieur avec jacquard « PRADA MILANO » et coutures parfaitement finies.",
      },
      {
        question: "Comment tester le nylon Saffiano Prada à la livraison ?",
        answer:
          "Trois tests simples à la réception : 1) Test de la goutte d'eau — elle doit perler sur le nylon authentique, pas pénétrer ; 2) Test du poids — le sac Re-Edition 2000 authentique pèse 380-420 g, une contrefaçon est souvent 280-330 g ; 3) Test visuel du quadrillage ripstop — visible à l'œil nu de très près sur l'authentique, souvent absent ou mal imprimé sur les fakes.",
      },
    ],
  },
  {
    platformSlug: "vinted",
    brandSlug: "dior",
    angle:
      "Dior sur Vinted est devenu depuis 2022 un segment risqué du luxe féminin, avec une concentration massive de Saddle Bag et Book Tote contrefaites. Les Saddle Bag à moins de 2 500 € sont suspectes, tout comme les Book Tote à moins de 1 800 €. Les super-fakes Dior de 2024-2026 reproduisent correctement l'Oblique canvas et les charms D.I.O.R., exigeant une vérification du blind stamp alphanumérique intérieur, de la qualité des coutures sur le tag cuir, et du poids réel des charms en métal (35-45 g authentiques, 15-25 g contrefaçon). Vinted protège partiellement via son service d'authentification payant mais qui reste optionnel et peu utilisé.",
    faqs: [
      {
        question: "Une Saddle Bag à 1 500 € sur Vinted peut-elle être authentique ?",
        answer:
          "Le Dior Saddle en Oblique canvas retail à 3 500 € (2025), avec un marché secondaire à 2 800-4 000 € en état correct. À 1 500 €, l'annonce est suspecte. Les exceptions authentiques à ce prix concernent des sacs visiblement portés plusieurs années avec des signes d'usure importants — vérifiez toujours le blind stamp alphanumérique au dos du tag intérieur pour confirmer.",
      },
      {
        question: "Comment reconnaître un vrai Book Tote Dior ?",
        answer:
          "Le Book Tote authentique présente une broderie (pas une impression) du motif Dior sur l'extérieur, avec des fils de broderie réguliers et une densité de 15-20 points par centimètre. Le tag intérieur « CHRISTIAN DIOR PARIS » est en cuir cousu sur 4 côtés. Le blind stamp alphanumérique au dos du tag est obligatoire (format 2 lettres + 4 chiffres). Les contrefaçons utilisent souvent une impression en relief simulé plutôt qu'une vraie broderie.",
      },
    ],
  },
];
