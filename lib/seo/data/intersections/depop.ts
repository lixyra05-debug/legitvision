import type { Intersection } from "../../types";
import { facts } from "@/lib/site-facts";

const FACTS = facts();

export const depopIntersections: Intersection[] = [
  {
    platformSlug: "depop",
    brandSlug: "nike",
    angle:
      "Nike sur Depop concentre une population acheteuse jeune (Gen Z, 15-25 ans) souvent inexperte en authentification. La dynamique d'achat d'impulsion (interface scrollable type Instagram) couplée à l'absence totale d'authentification crée un cocktail particulièrement dangereux. Pour un Nike authentique sur Depop, privilégiez les vendeurs avec ≥ 50 transactions terminées et historique cohérent d'un même type de stock.",
    faqs: [
      {
        question: "Pourquoi Depop est-il pire que Vinted pour les Nike ?",
        answer:
          "Trois raisons conjuguées : 1) Base utilisateur plus jeune et moins experte en authentification ; 2) Dynamique d'achat d'impulsion via l'interface Instagram-like qui court-circuite la vérification ; 3) Absence de service d'authentification payant optionnel comme Vinted.",
      },
      {
        question: "Comment vérifier un vendeur Nike Depop ?",
        answer:
          "Trois critères cumulatifs : 1) ≥ 50 transactions terminées avec ≥ 30 évaluations 5 étoiles ; 2) Historique de stock cohérent (toujours Nike/adidas sneakers, pas un mix chaotique) ; 3) Ancienneté du compte ≥ 12 mois. Vérifiez aussi les commentaires d'anciens acheteurs (vrais commentaires détaillés vs faux génériques). Un vendeur qui refuse d'envoyer photos supplémentaires en DM = signal d'alerte rouge.",
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "air-jordan",
    angle:
      "Air Jordan sur Depop est un segment ciblé par les revendeurs de contrefaçons, notamment sur les modèles ultra-hyped Travis Scott Jordan, Off-White Jordan 1 et Dior Jordan. Un prix cassé (Jordan 1 Chicago < 400 €, Travis Scott < 700 €) est un signal d'alerte. La culture Depop du « inspired by » et des « faithful replicas » crée une zone grise où certains vendeurs basculent du replica assumé au produit « authentique » en DM, exploitant la confusion. Pour Jordan > 500 €, Depop est à utiliser avec extrême prudence et systématiquement avec vérification tiers avant paiement.",
    faqs: [
      {
        question: "Les Travis Scott Jordan sur Depop : éviter ou possible ?",
        answer:
          `À éviter sauf vérification exhaustive préalable. Le prix marché Travis Scott Jordan 1 Low Mocha est 1 100-1 600 €, Jordan 1 High Mocha 1 500-2 800 €. Toute annonce Depop sous 700 € est un signal d'alerte. Même pour une annonce au prix marché, exigez une vérification tiers (analyse LegitVision ${FACTS.priceSingle} ou CheckCheck 15-40 €) avant tout paiement.`,
      },
      {
        question: "« Faithful replica » Depop : légal ou pas ?",
        answer:
          "Commercialement interdit par Depop (politique anti-contrefaçon affichée), mais en pratique toléré tant qu'il n'est pas signalé. Acheter sciemment une « faithful replica » vous rend complice de contrefaçon avec des risques douaniers réels si expédition internationale. Ne basculez jamais d'une conversation « replica » à « authentique » avec le même vendeur — c'est un signal d'alerte.",
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "adidas",
    angle:
      "adidas sur Depop présente des risques sur les Yeezy (fin de production 2024 → super-fakes massifs) et les Samba/Gazelle hyped (viralité TikTok depuis 2023). La culture streetwear Gen Z de Depop amplifie le phénomène : les « dupe culture » et « rep culture » sont explicitement revendiquées par certaines communautés de la plateforme, créant une confusion permanente entre répliques assumées et faux déguisés. Pour des adidas > 200 €, Depop est à considérer avec la même prudence que Leboncoin : vérification tiers systématique avant paiement, refus absolu des paiements hors Depop, et éviter les vendeurs à stock « inspired » mélangé avec des articles « authentic ».",
    faqs: [
      {
        question: "Depop accepte-t-il les contrefaçons déclarées ?",
        answer:
          "Non officiellement — la politique Depop interdit explicitement la vente de contrefaçons, avec risque de suspension de compte et bannissement permanent. En pratique, la modération est réactive (sur signalement) et non proactive (pas de scan algorithmique). Les vendeurs qui décrivent clairement des « replicas » ou « dupes » risquent le bannissement.",
      },
      {
        question: "Samba Wales Bonner sur Depop : possible ou piège ?",
        answer:
          "Possible mais risqué. Les collabs Samba Wales Bonner (prix retail 140 €, marché 350-550 €) sont ciblées par les contrefacteurs depuis 2024. Pour une paire authentique, exigez : Article Number dans la base adidas, box label cohérente avec l'étiquette intérieure, coutures WB spécifiques visibles nettement, et historique vendeur solide (≥ 50 transactions, stock ALD/Wales Bonner régulier).",
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "new-balance",
    angle:
      "New Balance sur Depop a explosé depuis 2022 grâce à la hype Aimé Leon Dore qui a aligné parfaitement avec la culture Gen Z de la plateforme. Les 990v5 Grey Day, 2002R Protection Pack et collabs Joe Freshgoods circulent massivement sur Depop, attirant une vague de contrefaçons « Made in USA » produites en Chine. La jeunesse et l'inexpérience de la base acheteurs amplifie les risques.",
    faqs: [
      {
        question: "Aimé Leon Dore x New Balance sur Depop : arnaque systémique ?",
        answer:
          "Risque très élevé. Les collabs ALD (993 Brown, 990v3 Tan, 550 Red) retail 180-230 € atteignent 400-700 € au marché avec une marge de contrefaçon exceptionnelle. Les super-fakes reproduisent correctement le cuir premium et le N latéral, mais échouent sur l'étiquette intérieure Made in USA/UK et la midsole multi-couches ABZORB/ENCAP.",
      },
      {
        question: "Comment vérifier une 2002R Protection Pack sur photo Depop ?",
        answer:
          `Trois zones à demander en photo HD : 1) Étiquette intérieure avec mention Salehe Bembury (collabs Protection Pack) + pays de fabrication cohérent ; 2) Box label avec code produit M2002RXY correspondant au colorway exact ; 3) Midsole latérale avec couches ENCAP/ABZORB visiblement distinctes (pas imprimées en 2D). Passez le tout par LegitVision pour un diagnostic IA en ${FACTS.median} secondes (durée médiane).`,
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "louis-vuitton",
    angle:
      "Louis Vuitton sur Depop est extrêmement risqué : la plateforme n'est pas positionnée sur le luxe et son expertise d'authentification est inexistante. Les pochettes, petites maroquineries et accessoires LV (Félicie, Pochette Métis Mini, porte-cartes) sont ciblés par les contrefacteurs. La culture « bag dupes » récurrente sur Depop accentue le risque, et les vendeurs basculent fréquemment entre articles assumés « inspired » et articles prétendument « authentic » pour les acheteurs séduits. Pour LV, privilégiez Vestiaire Collective ou eBay à Depop dans tous les cas.",
    faqs: [
      {
        question: "Peut-on trouver un vrai LV sur Depop ?",
        answer:
          "C'est possible, mais une annonce LV sur Depop est suspecte. Le public Depop (Gen Z, 15-25 ans) n'est généralement pas propriétaire de vrais sacs Louis Vuitton neufs, donc les ventes authentiques concernent souvent des héritages ou des revendeurs luxe qui utilisent Depop en second canal. Signaux rassurants : vendeur avec historique varié luxe (pas uniquement LV), prix raisonnable (pas cassé), documentation fournie spontanément, code date / puce RFID photographiée nettement.",
      },
      {
        question: "Pochette Métis à 400 € sur Depop : forcément une arnaque ?",
        answer:
          "La Pochette Métis Monogram retail à 2 750 € (2025) avec un marché secondaire à 2 000-2 500 € en état correct. Une annonce à 400 € est suspecte. Les contrefaçons de Pochette Métis sont ciblées sur Depop car le prix marché à 2 000+ € attire les acheteurs qui croient faire une affaire. Ne payez jamais moins de 1 500 € une Pochette Métis prétendue authentique sans expertise préalable.",
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "chanel",
    angle:
      "Chanel sur Depop relève d'un cas paradoxal : très peu d'annonces Chanel authentiques circulent (la plateforme n'est pas positionnée luxe premium), mais les contrefacteurs y ciblent les acheteuses jeunes voulant leur premier Chanel. Une annonce Chanel à moins de 2 500 € est un signal d'alerte. Les modèles visés : Wallet on Chain (WOC), Classic Flap Mini, et 19 en version compacte. La norme recommandée pour Chanel : ne jamais acheter sur Depop, et basculer systématiquement sur Vestiaire Collective ou eBay authentifié pour ce segment premium.",
    faqs: [
      {
        question: "Chanel WOC sur Depop à 1 500 € : réel ou fake ?",
        answer:
          "Le Chanel WOC (Wallet on Chain) en caviar retail à 3 600 € (2025) avec un marché secondaire authentifié à 2 500-3 500 €. Une annonce à 1 500 € est un signal d'alerte. Les exceptions concernent des WOC très abîmés ou vintage pré-2010 sans hologramme. Dans tous les cas, Chanel sur Depop est à déconseiller formellement — basculez sur Vestiaire Collective pour ce segment.",
      },
      {
        question: "Existe-t-il des arnaques Chanel sophistiquées sur Depop ?",
        answer:
          "Oui. Certains contrefacteurs Depop construisent des profils crédibles (50+ transactions, photos personnelles, ton professionnel) spécialement pour écouler des Chanel contrefaits à des acheteuses débutantes. Le modèle économique : 5-10 ventes authentiques réalisées à bas prix pour construire la réputation, puis drops de 2-3 Chanel contrefaits à 1 500-3 000 €. Méfiez-vous des changements soudains dans le type de stock d'un vendeur Depop.",
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "gucci",
    angle:
      "Gucci sur Depop présente un risque sur les accessoires et petites maroquineries : ceintures GG, porte-cartes Marmont, sliders, et sacs Mini Marmont à bas prix. Ces articles à marge unitaire élevée pour les contrefacteurs et prix final plus accessible (100-400 €) sont massivement ciblés. Pour Gucci sur Depop, limitez-vous aux articles accessoires si vraiment nécessaire, et privilégiez Vestiaire ou eBay pour tout > 500 €.",
    faqs: [
      {
        question: "Gucci Mini Marmont sur Depop à 600 € : crédible ?",
        answer:
          "Risque élevé. Le Mini Marmont Matelassé retail à 1 300 € (2025) avec un marché secondaire authentifié à 950-1 400 €. Une annonce Depop à 600 € est un signal d'alerte. Pour un Mini Marmont authentique, le prix plancher raisonnable est 850-1 000 € avec documentation vendeur + photo heat-stamp + numéro de série au format XXXXXX • XXXX.",
      },
      {
        question: "Ceintures Gucci GG sur Depop : à éviter totalement ?",
        answer:
          "Pratiquement oui. Pour une ceinture authentique retail 440-550 €, toute annonce sous 200 € est suspecte. Les super-fakes reproduisent correctement la quincaillerie Double G visuelle mais échouent sur le poids (85-110 g authentique vs 40-60 g fake) et le marquage intérieur « Made in Italy ». Basculez sur Vestiaire ou Gucci directement.",
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "hermes",
    angle:
      "Hermès sur Depop est exceptionnellement rare et suspect. La base acheteurs Depop n'a généralement pas les moyens ni l'expertise pour acheter des pièces Hermès authentiques, donc les rares annonces Hermès qui apparaissent sont suspectes. Recommandation absolue : ne jamais acheter Hermès sur Depop, quel que soit le prix ou la crédibilité apparente du vendeur.",
    faqs: [
      {
        question: "Un Birkin à 5 000 € sur Depop : possible ?",
        answer:
          "Le prix plancher d'un Birkin 25 ou 30 authentique en état correct est 12 000-15 000 € en seconde main authentifiée. Toute annonce Hermès Depop sous 10 000 € est suspecte. Pour un Birkin authentique, basculez sur Vestiaire Collective (authentification luxe dédiée) ou eBay avec Authenticity Guarantee. Depop n'a ni l'expertise ni le filtre pour ce segment ultra-premium.",
      },
      {
        question: "Les Twilly et foulards Hermès sur Depop sont-ils plus sûrs ?",
        answer:
          "Pas vraiment. Même les petites pièces Hermès (Twilly, foulards carré 90, bracelets Clic H) sont contrefaites sur Depop, avec un prix cible de 150-400 € pour les contrefaçons (vs 280-550 € retail). Les signaux à vérifier : étiquette tissée « HERMÈS 100 % silk » avec typographie exacte, tampon « Made in France » brodé, et bordures roulées à la main (pas industrielles).",
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "prada",
    angle:
      "Prada sur Depop présente des risques sur la Re-Edition 2000 Nylon Mini, modèle emblématique du revival Y2K ultra-populaire auprès de la Gen Z. Les super-fakes reproduisent correctement le triangle logo sur photo mais échouent sur la densité du nylon, la carte d'authenticité et le numéro de série à 13 chiffres. Pour Prada > 800 €, Depop est à éviter en faveur de Vestiaire ou eBay.",
    faqs: [
      {
        question: "Re-Edition 2000 sur Depop à 700 € : vraie ou fausse ?",
        answer:
          "Un prix de 700 € est un signal d'alerte. Le prix minimum crédible d'une Re-Edition 2000 authentique en seconde main est 1 200-1 500 €. Les contrefaçons Depop à 500-900 € ciblent précisément la Gen Z qui pense faire une affaire. Pour une vérification rapide, exigez photo ultra-nette du triangle logo avec « DAL 1913 » parfaitement gravé, carte d'authenticité avec numéro 13 chiffres + lettre.",
      },
      {
        question: "Les Prada Cleo sont-elles ciblées sur Depop ?",
        answer:
          "Oui. La Cleo retail à 2 100 € avec marché 1 800-2 500 €, prix un peu élevés pour la Gen Z moyenne Depop, mais les contrefaçons à 900-1 300 € commencent à inonder la plateforme. Pour une Cleo authentique, exigez triangle logo parfait, intérieur jacquard « PRADA MILANO » net, et poids ferme en main (380-450 g selon taille).",
      },
    ],
  },
  {
    platformSlug: "depop",
    brandSlug: "dior",
    angle:
      "Dior sur Depop cible les Saddle Bag, Book Tote Mini et Lady Dior Mini — modèles emblématiques adaptés au goût esthétique Gen Z. Un prix inférieur à 2 000 € sur ces modèles est un signal d'alerte. Les super-fakes Dior produits depuis 2024 reproduisent correctement l'Oblique canvas sur photo, mais échouent sur la broderie (vs impression), le blind stamp alphanumérique au dos du tag intérieur, et le poids des charms D.I.O.R. (35-45 g authentiques vs 15-25 g contrefaçon). Les Dior Jordan (collaboration 2020) sont également massivement contrefaites sur Depop, ciblées par les jeunes amateurs sneakers + luxe.",
    faqs: [
      {
        question: "Saddle Bag à 1 500 € Depop : à fuir ?",
        answer:
          "Oui. Le Saddle Bag Oblique retail à 3 500 € avec marché 2 800-4 500 €. Toute annonce Depop sous 2 500 € est un signal d'alerte. Pour un Saddle authentique, exigez : broderie tactile du motif (pas impression), blind stamp alphanumérique intérieur, charms D.I.O.R pesants (vérifiable sur photo comparée), et tag cuir parfaitement cousu sur 4 côtés.",
      },
      {
        question: "Dior Jordan 1 sur Depop : toujours fake ?",
        answer:
          "La collab Dior x Jordan 1 : retail 2 200 €, marché 10 000-18 000 €. Toute annonce Depop sous 7 000 € est un signal d'alerte. Pour une paire authentique, passez par eBay Authenticity Guarantee ou StockX — Depop n'a pas l'expertise ni le filtre pour ce modèle ultra-spécifique.",
      },
    ],
  },
];
