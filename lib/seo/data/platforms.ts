import type { Platform } from "../types";
import { facts } from "@/lib/site-facts";

const FACTS = facts();

// Vérification Vinted : « Prix : 100 € minimum », « 10 € par article » — centre d'aide Vinted France, https://www.vinted.fr/help/1147 (consulté le 2026-09-25).
export const platforms: Platform[] = [
  {
    slug: "vinted",
    name: "Vinted",
    tagline: "La seconde main entre particuliers, sans commission vendeur",
    description:
      "Vinted s'est imposé depuis 2008 dans la seconde main entre particuliers en France. Son modèle — vente entre particuliers sans commission vendeur, paiement sécurisé via la Vinted Wallet — a démocratisé l'achat d'occasion. Mais le revers : une modération des annonces très légère, aucune authentification systématique des articles de luxe en-dessous de 100 €, et un volume massif qui attire les revendeurs de contrefaçons.",
    authProgram: "Service d'authentification optionnel pour les articles à partir de 100 € (payant, 10 €)",
    accentColor: "#09B1BA",
    shortLabel: "V",
    externalUrl: "https://www.vinted.fr",
    scams: [
      {
        title: "Photos volées à un autre vendeur",
        description:
          "Le vendeur utilise des photos authentiques trouvées sur StockX, eBay ou Vestiaire Collective, mais vous envoie une contrefaçon. Faites systématiquement une recherche inversée sur Google Images avant d'acheter. Si les photos apparaissent ailleurs, fuyez.",
      },
      {
        title: "Profil vendeur récent avec 0 évaluation",
        description:
          "Vinted permet de créer un compte en 30 secondes sans vérification d'identité. Un compte de moins de 3 mois, sans photo de profil, sans aucune évaluation et qui vend d'emblée des articles haut de gamme Jordan ou Louis Vuitton est un signal d'alerte majeur. Privilégiez les vendeurs avec ≥ 20 évaluations positives sur au moins 6 mois.",
      },
      {
        title: "Prix cassé irréaliste",
        description:
          "Une paire de Jordan 1 Chicago authentique ne se vend pas 90 € sur Vinted. Un prix affiché inférieur de plus de 40 % au marché StockX est un signal d'alerte. Les revendeurs de faux ciblent précisément les acheteurs qui pensent faire l'affaire du siècle.",
      },
      {
        title: "Refus de photos supplémentaires",
        description:
          "Un vendeur sérieux accepte toujours d'envoyer des photos complémentaires en message privé (étiquette intérieure, semelle, couture précise). Un refus, une excuse (« batterie à plat », « je ne sais pas faire ») ou des photos floues volontaires sont des signaux d'alerte.",
      },
    ],
    faqs: [
      {
        question: "Est-ce que Vinted vérifie l'authenticité des articles de luxe ?",
        answer:
          "Non, pas par défaut. Vinted propose un service d'authentification payant (10 €) pour les articles vendus à partir de 100 €, mais il reste optionnel et choisi par l'acheteur au moment du paiement.",
      },
      {
        question: "Comment signaler une contrefaçon détectée sur Vinted ?",
        answer:
          "Ouvrez l'annonce litigieuse, cliquez sur les trois points puis « Signaler ». Vinted retire l'annonce sous 24-72 h si elle est manifestement contrefaite. Si vous avez déjà payé, contestez la transaction dans les 2 jours suivant la livraison via la Protection Acheteurs.",
      },
      {
        question: "La Protection Acheteurs Vinted rembourse-t-elle en cas de faux ?",
        answer:
          "Oui, à condition de signaler le litige dans les 2 jours suivant la réception. Vous devez fournir des preuves (photos détaillées, rapport d'authentification). Vinted suspend alors le paiement au vendeur le temps de l'instruction. Les remboursements complets sont fréquents quand la contrefaçon est évidente.",
      },
      {
        question: "Peut-on demander un contrôle LegitVision avant d'acheter sur Vinted ?",
        answer:
          `Oui. Demandez au vendeur ${FACTS.photosMin} à ${FACTS.photosMax} photos détaillées selon notre protocole (étiquette intérieure, box label, semelle, coutures) puis uploadez-les sur LegitVision. Vous obtenez un score d'authenticité en ${FACTS.median} secondes (durée médiane) pour ${FACTS.priceSingle}, avant de valider votre achat.`,
      },
    ],
  },
  {
    slug: "vestiaire-collective",
    name: "Vestiaire Collective",
    tagline: "La marketplace premium du luxe de seconde main",
    description:
      "Vestiaire Collective, fondée à Paris en 2009, est une plateforme européenne de mode de luxe de seconde main. La plateforme positionne la qualité et l'authentification comme son cœur de différenciation : chaque article au-dessus de 100 € passe par un contrôle d'authentification par ses équipes internes avant l'envoi à l'acheteur. Mais ce filet de sécurité n'est pas infaillible, et les tarifs y sont plus élevés que sur les marketplaces généralistes.",
    authProgram: "Authentification systématique par experts internes pour les articles > 100 €",
    accentColor: "#000000",
    shortLabel: "VC",
    externalUrl: "https://fr.vestiairecollective.com",
    scams: [
      {
        title: "Articles en dessous du seuil d'authentification",
        description:
          "Les articles vendus sous les 100 € ne passent pas systématiquement par le contrôle d'authentification. Les petites pièces (foulards, ceintures, portefeuilles, lunettes) sont vendues sans vérification. C'est le segment où les vendeurs de contrefaçons concentrent leurs annonces pour éviter le filtrage.",
      },
      {
        title: "Erreurs d'authentification sur les modèles très récents",
        description:
          "Les équipes d'authentification Vestiaire sont excellentes sur les modèles classiques, mais peuvent laisser passer des contrefaçons de dernière génération (super-fakes) sur des sorties récentes (< 6 mois). Les Dior Saddle récentes et les sacs Chanel 22 sont des exemples où des faux haut de gamme sont passés.",
      },
      {
        title: "Direct Shipping sans contrôle",
        description:
          "Depuis 2022, Vestiaire propose l'option « Expédition Directe » qui laisse le vendeur envoyer directement à l'acheteur, sans passage par leur centre d'authentification. Cette option est signalée par un badge — vérifiez toujours si votre article passe par le contrôle ou non avant de valider l'achat.",
      },
      {
        title: "Prix Vestiaire gonflé : arnaque à la plus-value",
        description:
          "Certains revendeurs achètent sur Vinted ou Leboncoin à bas prix, passent par Vestiaire pour le badge d'authentification, et revendent avec une marge. Ce n'est pas une contrefaçon mais une arnaque au prix : vérifiez systématiquement le prix de marché avant d'acheter.",
      },
    ],
    faqs: [
      {
        question: "L'authentification Vestiaire Collective est-elle fiable à 100 % ?",
        answer:
          "Très fiable mais pas infaillible. Les cas de contestation existent, notamment sur les modèles super-fakes récents ou sur les articles vendus en Expédition Directe (sans passage par leur centre). Pour les pièces > 2 000 €, un double contrôle LegitVision reste recommandé.",
      },
      {
        question: "Puis-je retourner un article acheté sur Vestiaire Collective ?",
        answer:
          "Oui, dans les 14 jours suivant la réception, à condition que l'article ne corresponde pas à la description ou présente un défaut non mentionné. Les retours sont gratuits en France. En cas de doute sur l'authenticité malgré le contrôle, ouvrez immédiatement une réclamation via leur service client.",
      },
      {
        question: "Que veut dire le badge « Article authentifié » sur Vestiaire ?",
        answer:
          "Il indique que l'article a transité par le centre d'authentification Vestiaire en France, où des experts ont vérifié matériaux, finitions, quincaillerie et accessoires. Les articles sans ce badge ont été expédiés en direct par le vendeur — c'est indiqué clairement sur la fiche produit.",
      },
      {
        question: "Pourquoi certains prix explosent sur Vestiaire Collective ?",
        answer:
          "Vestiaire est une plateforme de luxe premium : sa clientèle accepte de payer pour la garantie d'authentification. C'est cohérent pour une Hermès Birkin à 15 000 €, moins pour un sac Gucci courant. Comparez toujours les prix Vestiaire / Vinted / eBay avant d'acheter.",
      },
    ],
  },
  {
    slug: "leboncoin",
    name: "Leboncoin",
    tagline: "Le géant français des petites annonces généralistes",
    description:
      "Leboncoin, fondé en 2006, est un site français de petites annonces. Sa force : la proximité géographique et la transaction en main propre. Mais côté mode et luxe, Leboncoin reste une plateforme généraliste sans aucun mécanisme d'authentification, ce qui en fait simultanément un terrain privilégié pour les bonnes affaires (déstockages familiaux, successions) et un eldorado pour les revendeurs de contrefaçons.",
    authProgram: null,
    accentColor: "#EC5A13",
    shortLabel: "LBC",
    externalUrl: "https://www.leboncoin.fr",
    scams: [
      {
        title: "Aucune authentification — zéro filet de sécurité",
        description:
          "Leboncoin n'a aucun service d'authentification, même pour les articles haut de gamme. L'intégralité du risque est portée par l'acheteur. Contrairement à Vinted ou Vestiaire, aucun examen n'est effectué ni sur les photos ni sur l'article. Vous êtes seul responsable de votre vérification.",
      },
      {
        title: "Arnaque au paiement hors-plateforme",
        description:
          "Un vendeur qui vous propose de finaliser la transaction via PayPal Friends & Family, virement SEPA ou cryptomonnaies cherche à contourner la protection Leboncoin. Ces paiements sont irrécupérables en cas de contrefaçon. Utilisez uniquement le paiement sécurisé Leboncoin intégré à l'annonce.",
      },
      {
        title: "Remise en main propre sans photos préalables",
        description:
          "Un vendeur qui refuse d'envoyer des photos supplémentaires avant la rencontre, arguant « vous verrez sur place », cherche à vous mettre sous pression. À la remise, difficile de refuser face au vendeur, surtout si la transaction est en liquide. Exigez toutes les photos de vérification avant le déplacement.",
      },
      {
        title: "Annonce sans historique vendeur visible",
        description:
          "Leboncoin affiche l'ancienneté du vendeur et son nombre d'annonces. Un compte créé la semaine dernière qui publie d'emblée un sac Chanel à prix cassé est une alerte rouge. Préférez les vendeurs avec ≥ 1 an d'ancienneté et un historique d'annonces cohérent (mobilier, auto, articles divers).",
      },
    ],
    faqs: [
      {
        question: "Leboncoin authentifie-t-il les articles de luxe ?",
        answer:
          "Non, jamais. Leboncoin est une plateforme de petites annonces généraliste qui met en relation acheteurs et vendeurs sans intervention sur le contenu des articles. Toute vérification d'authenticité est à votre charge, avant la transaction. C'est le point faible majeur de cette plateforme pour le luxe.",
      },
      {
        question: "Le paiement sécurisé Leboncoin protège-t-il contre les contrefaçons ?",
        answer:
          "Partiellement. Le paiement sécurisé permet de contester la transaction dans les 72h suivant la livraison si l'article ne correspond pas à la description. Mais la charge de la preuve revient à l'acheteur et les litiges sur l'authenticité sont parfois rejetés faute d'expertise.",
      },
      {
        question: "Dois-je acheter en main propre ou en livraison sur Leboncoin ?",
        answer:
          "La livraison via Mondial Relay sécurisé est plus sûre car elle permet de contester et d'obtenir un remboursement en cas de problème. La main propre est plus risquée car vous ne pouvez pas revenir sur la transaction une fois l'argent liquide remis. Privilégiez la livraison sécurisée pour tout article > 150 €.",
      },
      {
        question: "Comment vérifier un sac avant la rencontre physique ?",
        answer:
          `Demandez au vendeur des photos ultra-détaillées (étiquette intérieure, code date, coutures, quincaillerie, intérieur complet) 24h avant le rendez-vous. Uploadez-les sur LegitVision pour obtenir un pré-diagnostic en ${FACTS.median} secondes (durée médiane). Si le score est rouge, annulez le rendez-vous.`,
      },
    ],
  },
  {
    slug: "ebay",
    name: "eBay",
    tagline: "La marketplace globale avec Authenticity Guarantee",
    description:
      "eBay, pionnier des marketplaces online depuis 1995, reste un canal de vente de produits luxe et sneakers en seconde main. Son programme Authenticity Guarantee, lancé en 2020, authentifie certaines catégories (sneakers > 100 $, montres, sacs de luxe sélectionnés) via des experts tiers avant livraison à l'acheteur. Mais la couverture reste partielle et l'écosystème global expose à des vendeurs internationaux moins scrupuleux.",
    authProgram: "Authenticity Guarantee pour sneakers > 100 $, montres > 2 000 $, sacs sélectionnés",
    accentColor: "#E53238",
    shortLabel: "eB",
    externalUrl: "https://www.ebay.fr",
    scams: [
      {
        title: "Articles hors périmètre Authenticity Guarantee",
        description:
          "Le programme eBay Authenticity Guarantee couvre uniquement les sneakers > 100 $, certaines montres et une liste limitée de sacs de luxe. Tout le reste (vêtements, accessoires, chaussures < 100 $, sacs non couverts) est vendu sans vérification, exactement comme sur Leboncoin. Vérifiez le badge vert sur la fiche produit.",
      },
      {
        title: "Vendeurs internationaux basés en Asie",
        description:
          "Des contrefaçons sur eBay proviennent de vendeurs situés en Chine, au Vietnam ou en Turquie, présentés comme des particuliers mais en réalité des revendeurs de stock AliExpress repackagé. Filtrez systématiquement la provenance : privilégiez les vendeurs européens ou nord-américains avec ≥ 100 évaluations positives.",
      },
      {
        title: "Description générique copiée-collée",
        description:
          "Les revendeurs de masse utilisent des descriptions-types copiées d'annonce en annonce (« Brand new with tags », « 100 % authentic, guaranteed »). Ces mentions ne garantissent rien sans badge Authenticity Guarantee. Méfiez-vous des descriptions excessivement génériques sans détail spécifique sur l'article vendu.",
      },
      {
        title: "Détournement de la Money-Back Guarantee",
        description:
          "Certains vendeurs profitent des délais longs de livraison internationale (15-30 jours) pour faire expirer la période de réclamation eBay. D'autres envoient des articles réels sur le suivi colis puis substituent une contrefaçon à la dernière minute. Activez la déclaration écrite dès réception et photographiez l'ouverture du colis.",
      },
    ],
    faqs: [
      {
        question: "Le programme eBay Authenticity Guarantee couvre-t-il tous les articles ?",
        answer:
          "Non. Le programme est limité aux sneakers > 100 $, aux montres > 2 000 $, et à une liste restreinte de sacs de luxe (certaines Hermès Birkin, Chanel Classic Flap, LV Neverfull). Les vêtements, accessoires, lunettes et chaussures courantes restent sans authentification. Le badge vert sur la fiche produit indique la couverture.",
      },
      {
        question: "Comment fonctionne l'authentification eBay concrètement ?",
        answer:
          "Quand vous achetez un article couvert, il est d'abord envoyé au centre eBay en France ou au Royaume-Uni. Des experts tiers (CISA, Entrupy) l'authentifient sous 48 h, puis l'expédient vers vous avec un certificat. Le délai total est de 5-8 jours, contre 2-3 jours pour une expédition directe.",
      },
      {
        question: "Que faire si je reçois une contrefaçon d'un vendeur eBay ?",
        answer:
          "Ouvrez un dossier Money-Back Guarantee dans les 30 jours, section « Ne correspond pas à la description ». Joignez photos et rapport d'authentification tiers. eBay tranche généralement en faveur de l'acheteur si les preuves sont claires. Le remboursement est effectué sous 10-15 jours.",
      },
      {
        question: "Faut-il privilégier les vendeurs « Top Rated » sur eBay ?",
        answer:
          "Oui, c'est un signal de fiabilité significatif. Un vendeur Top Rated affiche ≥ 98 % d'évaluations positives sur 12 mois avec au moins 100 transactions. Le badge réduit drastiquement le risque de contrefaçon mais ne l'élimine pas — certains Top Rated se sont fait hacker leur compte par des contrefacteurs.",
      },
    ],
  },
  {
    slug: "depop",
    name: "Depop",
    tagline: "La plateforme mode de la Gen Z",
    description:
      "Depop, lancée à Milan en 2011, a été rachetée par Etsy en 2021. La plateforme est très orientée streetwear, vintage et sneakers. Son interface inspirée d'Instagram encourage les achats d'impulsion, mais l'absence totale de service d'authentification et la jeunesse de sa base utilisateur en font une cible pour les contrefacteurs spécialisés dans le streetwear (Supreme, Travis Scott, Yeezy, Off-White).",
    authProgram: null,
    accentColor: "#FF2301",
    shortLabel: "Dp",
    externalUrl: "https://www.depop.com",
    scams: [
      {
        title: "Réplicas assumées déguisées en authentiques",
        description:
          "Depop abrite une économie parallèle de vendeurs qui postent des réplicas sous des intitulés ambigus (« inspired by », « dupe », « faithful replica »). Certains basculent ensuite en message privé vers des articles déclarés authentiques à prix cassé. Si un vendeur a ne serait-ce qu'une annonce « replica » dans son profil, considérez toutes ses annonces comme suspectes.",
      },
      {
        title: "Ciblage des drops hyped (Travis Scott, Yeezy, Off-White)",
        description:
          "Les sorties limitées (Travis Scott Jordan, Yeezy 350, Off-White x Nike) sont des cibles des contrefacteurs sur Depop, car la demande explose à la revente. Un Travis Scott Jordan 1 Low Mocha à 250 € sur Depop quand StockX affiche 1 100 € est un signal d'alerte.",
      },
      {
        title: "Profils avec followers achetés",
        description:
          "Depop fonctionne sur une logique sociale avec followers et likes, ce qui peut donner une fausse impression de légitimité. Certains vendeurs achètent des followers pour paraître établis. Vérifiez l'ancienneté du compte, l'engagement réel (commentaires), et la cohérence du stock avant d'acheter.",
      },
      {
        title: "Paiement hors Depop via Instagram ou WhatsApp",
        description:
          "Les arnaqueurs Depop tentent régulièrement de détourner la transaction vers des DMs Instagram ou WhatsApp pour contourner les protections de la plateforme. Une fois payé par virement ou PayPal Friends, impossible de récupérer votre argent. Restez toujours sur Depop Payments avec protection acheteur.",
      },
    ],
    faqs: [
      {
        question: "Depop vérifie-t-il les articles avant l'envoi ?",
        answer:
          "Non. Depop ne dispose d'aucun service d'authentification, contrairement à StockX ou eBay pour les sneakers. La responsabilité de vérifier l'article revient entièrement à l'acheteur.",
      },
      {
        question: "La Depop Buyer Protection fonctionne-t-elle bien ?",
        answer:
          "La Buyer Protection couvre les articles qui n'arrivent pas ou qui diffèrent significativement de la description, mais les litiges sur l'authenticité sont régulièrement rejetés si l'acheteur n'a pas de rapport d'expert tiers. Documentez chaque réception par vidéo et obtenez une attestation d'authentification avant d'ouvrir un litige.",
      },
      {
        question: "Pourquoi autant de fausses sneakers sur Depop ?",
        answer:
          "Depop cible un public jeune (Gen Z) moins expert en authentification, avec une dynamique d'achat d'impulsion via l'interface scrollable type Instagram. Les contrefacteurs exploitent ce biais en postant des photos léchées de produits populaires (Travis Scott, Yeezy, Dior B23) à des prix alléchants pour déclencher l'achat rapide.",
      },
      {
        question: "Comment repérer un vendeur Depop fiable ?",
        answer:
          "Cherchez un compte avec ≥ 50 transactions terminées, ≥ 12 mois d'ancienneté, au moins 30 évaluations ≥ 5 étoiles, et un stock cohérent (toujours la même marque/style, pas un mix chaotique). Les vendeurs sérieux répondent rapidement aux DMs et fournissent des photos supplémentaires sans réticence.",
      },
    ],
  },
  {
    slug: "facebook-marketplace",
    name: "Facebook Marketplace",
    tagline: "Le Far West des petites annonces locales",
    description:
      "Facebook Marketplace, lancé en 2016 et adossé à l'écosystème Meta, est devenu un acteur massif du C2C local en France depuis 2020. Sa force : l'intégration native dans Facebook, la gratuité totale, et la géolocalisation pour les transactions en main propre. Son faiblesse majeure : aucun mécanisme d'authentification, aucun paiement sécurisé imposé, et une modération quasi inexistante sur les articles de luxe.",
    authProgram: null,
    accentColor: "#1877F2",
    shortLabel: "FB",
    externalUrl: "https://www.facebook.com/marketplace",
    scams: [
      {
        title: "Zéro authentification, zéro protection acheteur",
        description:
          "Facebook Marketplace ne propose ni authentification, ni paiement sécurisé intégré, ni médiation en cas de litige. La plateforme se positionne comme un simple « tableau d'affichage » sans responsabilité sur les transactions. Si vous payez en liquide à la rencontre et recevez une contrefaçon, vous êtes seul face au vendeur, sans recours Meta.",
      },
      {
        title: "Comptes Facebook récents ou piratés",
        description:
          "Les contrefacteurs exploitent deux modus operandi : créer des comptes Facebook récents via de fausses identités, ou racheter des comptes piratés à des utilisateurs ordinaires pour bénéficier de leur historique « propre ». Vérifiez l'ancienneté du compte, les photos personnelles cohérentes, et l'activité Facebook hors Marketplace.",
      },
      {
        title: "Pression pour clôturer en moins de 24h",
        description:
          "« J'ai 3 personnes intéressées, il faut décider vite », « Je pars en vacances demain, venez ce soir ». Cette urgence artificielle vise à court-circuiter votre réflexion et votre vérification. Un vendeur sérieux laisse toujours 48-72h pour la décision. Toute pression temporelle forte est un signal d'arnaque.",
      },
      {
        title: "Rencontres en lieu isolé ou en soirée",
        description:
          "Un vendeur qui insiste pour un rendez-vous dans un parking isolé, à son domicile, ou en soirée tardive présente un double risque : arnaque sur l'article (pas d'éclairage correct pour inspecter) et risque physique. Refusez et proposez un lieu public de jour : gare, café, centre commercial. Un vendeur honnête acceptera toujours.",
      },
    ],
    faqs: [
      {
        question: "Facebook protège-t-il les acheteurs Marketplace contre les contrefaçons ?",
        answer:
          "Non. Facebook se positionne comme un intermédiaire de mise en relation sans responsabilité sur les transactions. Il n'existe ni authentification, ni paiement sécurisé intégré, ni médiation. Meta répond uniquement aux signalements massifs de faux comptes, pas aux litiges transactionnels individuels.",
      },
      {
        question: "Quel paiement utiliser sur Facebook Marketplace ?",
        answer:
          "Privilégiez PayPal Goods & Services pour bénéficier de la Protection des Achats PayPal (remboursement en cas de contrefaçon documentée). Refusez absolument PayPal Friends & Family, les virements bancaires directs, les cryptomonnaies et le liquide en main propre — aucun recours possible.",
      },
      {
        question: "Pourquoi tant de contrefaçons circulent-elles sur Facebook Marketplace ?",
        answer:
          "Trois raisons cumulatives : aucune friction à la création de comptes, aucune modération algorithmique des annonces, et une base d'utilisateurs extrêmement large et peu experte en authentification luxe. Les contrefacteurs y écoulent les stocks qui seraient supprimés sur Vinted ou Vestiaire.",
      },
      {
        question: "Que faire en cas d'arnaque sur Facebook Marketplace ?",
        answer:
          "Signalez immédiatement le profil et l'annonce à Meta via l'option « Signaler » de l'annonce. Si vous avez payé via PayPal Goods, ouvrez un litige PayPal dans les 180 jours avec photos et rapport d'authentification. Si vous avez payé en liquide, déposez une plainte pour escroquerie auprès de la police — le préjudice peut être remboursé par votre assurance habitation dans certains cas.",
      },
    ],
  },
];

export function getPlatformBySlug(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}
