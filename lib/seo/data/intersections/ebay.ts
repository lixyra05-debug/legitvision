import type { Intersection } from "../../types";
import { facts } from "@/lib/site-facts";

const FACTS = facts();

export const ebayIntersections: Intersection[] = [
  {
    platformSlug: "ebay",
    brandSlug: "nike",
    angle:
      "Nike sur eBay bénéficie d'une protection différenciée selon le montant : les sneakers > 100 $ (≈ 95 €) passent obligatoirement par le programme Authenticity Guarantee (expertise tiers CISA/Entrupy en 48h). En revanche, les Nike < 100 $ et les ventes de vendeurs internationaux hors du périmètre du programme présentent des risques comparables à Vinted. Le badge vert « Authenticity Guarantee » sur la fiche produit est le signal discriminant.",
    faqs: [
      {
        question: "Le programme Authenticity Guarantee couvre-t-il toutes les Nike eBay ?",
        answer:
          "Non. Le programme couvre uniquement les sneakers vendues au-dessus de 100 $ (≈ 95 €) et expédiées depuis certaines zones géographiques (USA, UK, UE, Australie). Les Nike < 100 $, les chaussures d'entrée de gamme (Pegasus, Revolution), et les vendeurs basés en Asie ou zones non couvertes sont exclus. Vérifiez toujours le badge vert « Authenticity Guarantee » sur la fiche produit avant de payer.",
      },
      {
        question: "Combien de temps prend l'authentification eBay Nike ?",
        answer:
          "Entre 48 et 72h de délai additionnel. Le sneaker est d'abord expédié au centre d'authentification eBay (Galway en Irlande pour l'Europe), examiné par des experts tiers, puis réexpédié à l'acheteur avec un certificat. Le délai total entre achat et réception est de 5 à 8 jours, contre 2-3 pour une expédition directe. Si l'authentification échoue, l'acheteur est remboursé intégralement.",
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "air-jordan",
    angle:
      "Air Jordan sur eBay bénéficie de l'Authenticity Guarantee qui couvre quasi-systématiquement les Jordan > 100 $. Les experts tiers (CISA en Europe, Entrupy aux USA) ont une expertise approfondie sur les 40+ modèles et les super-fakes récents. Le seul angle mort : les vendeurs basés en Chine, Russie ou zones hors programme — à éviter absolument même en dessous de 100 $.",
    faqs: [
      {
        question: "eBay est-il sûr pour les Jordan ?",
        answer:
          "L'Authenticity Guarantee eBay couvre les Jordan > 100 $. StockX authentifie aussi toutes les paires qu'il vend. Les prix varient. Pour des Jordan courantes (Jordan 1 non-collab), eBay peut être plus économique.",
      },
      {
        question: "Que faire si l'authentification eBay détecte une contrefaçon ?",
        answer:
          "Si le centre eBay reçoit une paire non-authentique du vendeur, l'acheteur est automatiquement remboursé intégralement, et le vendeur est pénalisé (compte suspendu, remboursement forcé, blocage des futures ventes). Aucune action de l'acheteur n'est requise — le processus est transparent et rapide (1-3 jours). C'est la principale protection prévue par l'Authenticity Guarantee.",
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "adidas",
    angle:
      "adidas sur eBay suit la même logique que Nike : protection forte sur les articles > 100 $ via Authenticity Guarantee (qui couvre Yeezy, Samba OG, Ultraboost premium, 4D, et certaines collabs), protection quasi nulle en dessous. Les Yeezy sont particulièrement bien authentifiées par les experts eBay grâce à leur expertise historique sur le modèle (depuis 2015). L'arrêt de production Yeezy en 2024 a créé un afflux de super-fakes sur eBay hors programme (vendeurs Asie), qu'il faut absolument éviter — restez exclusivement sur les paires marquées « Authenticity Guarantee ».",
    faqs: [
      {
        question: "Les Yeezy post-2024 sur eBay sont-elles authentiques ?",
        answer:
          "Seulement si elles sont couvertes par Authenticity Guarantee. Aucune nouvelle production Yeezy n'existe depuis mi-2024 (fin du partenariat adidas/Kanye en 2022, écoulement des stocks jusqu'à mi-2024). Toute paire Yeezy prétendument neuve post-2024 est une contrefaçon, sauf stock existant authentifié par eBay ou StockX. Vérifiez la date de fabrication sur la box + Article Number dans la base adidas avant paiement.",
      },
      {
        question: "Samba sur eBay : mieux que Vinted ?",
        answer:
          `Oui. Samba OG > 100 $ passent par Authenticity Guarantee. Les prix eBay sont comparables ou plus élevés que Vinted. Pour des Samba hyped (colorways limités, collabs Wales Bonner), l'écart de prix se justifie pleinement. Pour des colorways courants (noir, blanc, vert), Vinted peut rester compétitif avec une vérification LegitVision préalable à ${FACTS.priceSingle}.`,
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "new-balance",
    angle:
      "New Balance sur eBay bénéficie d'une couverture Authenticity Guarantee variable selon les modèles : les 990 series Made in USA, les 2002R, les 991 Made in UK et les collabs (Aimé Leon Dore, Joe Freshgoods) > 100 $ sont couvertes. Les paires d'entrée de gamme (574, 373) et les modèles Made in Asia courants sont exclus. Pour les acheteurs européens, eBay est particulièrement intéressant pour accéder aux Made in USA (990v5, 990v6, 993) souvent indisponibles en Europe — avec l'assurance de l'authentification.",
    faqs: [
      {
        question: "eBay est-il la meilleure source pour du Made in USA en Europe ?",
        answer:
          "Les 990v5/v6 et 993 Made in USA sont rares dans les boutiques européennes (retail 260-290 € quand disponibles). eBay USA permet d'accéder à un stock plus varié avec authentification, même si les frais de port et douanes ajoutent 30-50 € au total. Pour les colorways exclusifs (Aimé Leon Dore, Joe Freshgoods), eBay USA reste souvent la seule option hors marché secondaire européen.",
      },
      {
        question: "Comment éviter les frais de douane eBay pour les USA ?",
        answer:
          "Vous ne pouvez pas totalement les éviter, mais vous pouvez les minimiser. Au-dessus de 150 € de valeur déclarée hors frais de port, vous payez en moyenne 20 % de TVA + 8-12 % de droits de douane + 15-20 € de frais UPS/DHL. Sur une paire à 400 € port compris, comptez 100-140 € de taxes additionnelles. Certains vendeurs eBay proposent une déclaration valeur « gift » pour minimiser les taxes — pratique légalement risquée.",
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "louis-vuitton",
    angle:
      "Louis Vuitton sur eBay présente un double profil : les articles couverts par Authenticity Guarantee (certaines Neverfull, Speedy, Keepall via programme spécifique luxe bags) sont authentifiés par des experts, tandis que les articles hors périmètre ne bénéficient d'aucune authentification. La liste des modèles LV couverts par eBay est limitée et change régulièrement — vérifiez toujours le badge vert avant paiement. Les vendeurs internationaux basés en Turquie, Russie ou Asie sont à éviter absolument pour LV.",
    faqs: [
      {
        question: "Tous les Louis Vuitton eBay sont-ils authentifiés ?",
        answer:
          "Non. eBay Authenticity Guarantee couvre une liste spécifique de sacs LV (Neverfull MM/PM, Speedy 25/30/35, Keepall 45/50/55, et quelques autres) vendus au-dessus de certains seuils (généralement 500 $). Les articles hors liste (petites maroquineries, accessoires, modèles moins courants) ne sont pas couverts. Vérifiez systématiquement le badge « Authenticity Guarantee » sur la fiche produit.",
      },
      {
        question: "eBay USA ou eBay France pour acheter LV ?",
        answer:
          "eBay USA offre des prix souvent inférieurs à eBay France. En contrepartie : frais de port 40-80 €, taxes et douanes 20-30 % du total, délais 10-20 jours. Pour des sacs > 2 000 €, eBay USA reste avantageux même tout compris. Pour des sacs < 1 200 €, Vestiaire Collective France est souvent plus rapide et équivalent en prix final.",
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "chanel",
    angle:
      "Chanel sur eBay bénéficie du programme Authenticity Guarantee spécifique sacs de luxe qui couvre les Classic Flap, 2.55, Boy et certains modèles à partir de 1 000 $. L'expertise Chanel d'eBay est solide. Pour les sacs Chanel > 5 000 €, vérifiez la couverture Authenticity Guarantee avant achat.",
    faqs: [
      {
        question: "Classic Flap sur eBay : aussi sûr que Vestiaire ?",
        answer:
          "L'authentification Vestiaire et l'Authenticity Guarantee eBay s'appuient toutes deux sur des experts formés spécifiquement sur Chanel. Pour un Classic Flap à 8 500 € sur eBay USA authentifié vs 9 800 € sur Vestiaire, l'écart de 1 300 € peut justifier eBay avec les taxes inclues. Comparez toujours prix finaux tout compris (port + douanes) avant de choisir.",
      },
      {
        question: "Acheter un Chanel aux USA avec port et douanes : rentable ?",
        answer:
          "Rentable surtout pour les sacs > 5 000 €. Sur un Classic Flap à 8 500 € acheté eBay USA + 60 € port + 25 % taxes/douanes = 10 600 € total, contre 9 800 € sur Vestiaire Europe. L'écart est marginal. Pour les pièces rares indisponibles en Europe (colorways limités, vintage), eBay USA reste souvent l'unique option. Pour les modèles courants, Vestiaire Europe reste généralement compétitif.",
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "gucci",
    angle:
      "Gucci sur eBay bénéficie d'une couverture Authenticity Guarantee plus limitée que Chanel ou LV — seuls certains modèles phares (Marmont, Dionysus, Jackie) au-dessus de seuils spécifiques sont couverts. Les accessoires, ceintures, et modèles moins iconiques sont généralement hors programme, créant un profil de risque hétérogène. La distinction claire via le badge vert Authenticity Guarantee est essentielle avant tout achat.",
    faqs: [
      {
        question: "Marmont sur eBay : risque faible ou modéré ?",
        answer:
          "Faible si couverte par Authenticity Guarantee (badge vert vérifié), modéré sans couverture. Vérifiez systématiquement la présence du badge et la localisation du vendeur (privilégiez USA/UE, évitez Asie/Europe de l'Est) avant paiement.",
      },
      {
        question: "Accessoires Gucci eBay (ceintures, sliders) : évitable ?",
        answer:
          "À acheter uniquement de vendeurs USA/UE avec ≥ 100 évaluations positives et historique varié. Les accessoires Gucci sont rarement couverts par Authenticity Guarantee (seuil de prix trop bas) et massivement contrefaits. Privilégiez Vestiaire Collective pour les accessoires Gucci si sécurité prioritaire.",
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "hermes",
    angle:
      "Hermès sur eBay relève d'un cas spécifique : la plateforme a développé un programme d'authentification sacs de luxe spécialement renforcé pour les pièces > 5 000 $ incluant les Birkin, Kelly et Constance. Les experts mobilisés sont des spécialistes Hermès dédiés (anciens Entrupy, Real Authentication). En contrepartie, eBay reste une plateforme exposée aux vendeurs internationaux : un Birkin à 8 000 $ vendu par un compte turc récent sans badge Authenticity Guarantee est un signal d'alerte. Le badge vert est absolument indispensable.",
    faqs: [
      {
        question: "Un Birkin eBay authentifié est-il fiable ?",
        answer:
          "Le programme Authenticity Guarantee eBay pour Hermès premium mobilise des experts dédiés avec expertise Birkin/Kelly/Constance. Les critères vérifiés incluent blind stamp, couture sellier, cuirs par saison, quincaillerie palladium/or, et dizaines d'autres signaux. Pour un Birkin à 15 000 $+, une double expertise Entrupy (500-800 $) après réception reste pertinente pour sécurité absolue.",
      },
      {
        question: "eBay vs Vestiaire pour Hermès : lequel choisir ?",
        answer:
          "Les deux font authentifier les pièces par des experts. eBay USA a des prix parfois inférieurs à Vestiaire Europe hors taxes. Pour un Birkin 30 à 17 000 $ eBay USA + 100 € port + 25 % taxes = 21 500 € total, contre 22 500 € Vestiaire Europe. L'écart de 1 000 € peut justifier eBay pour les acheteurs avertis. Pour la simplicité, Vestiaire reste le choix par défaut.",
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "prada",
    angle:
      "Prada sur eBay dispose d'une couverture Authenticity Guarantee variable : les sacs classiques Galleria, Saffiano Lux et Re-Edition 2000 au-dessus de 500 $ sont généralement couverts, les accessoires et modèles moins courants sont exclus. La particularité Prada : les sacs vintage des années 90-2000 (Nylon Tessuto d'époque) sont souvent hors programme mais peuvent être d'authentiques pépites pour collectionneurs avec vérification tiers appropriée.",
    faqs: [
      {
        question: "Re-Edition 2000 Prada eBay : bonne option ?",
        answer:
          "Oui si couverte par Authenticity Guarantee. Les Re-Edition 2000 Mini > 500 $ passent par le programme. Les prix eBay USA sont souvent comparables ou inférieurs à Vestiaire Europe pour des colorways équivalents. Pour les colorways limités ou les drops récents (< 6 mois), la couverture peut être partielle — vérifiez systématiquement le badge avant achat.",
      },
      {
        question: "Prada vintage eBay : méfiance ou opportunité ?",
        answer:
          `Les deux selon contexte. Les Prada vintage années 90-2000 peuvent être d'authentiques pièces de collection (prix 500-1 500 € selon modèle) qu'on ne trouve plus chez Prada. Vérifiez : vendeur avec historique vintage cohérent, photos personnelles (pas de photos génériques), triangle logo d'époque correctement formaté, étiquette intérieure « MILANO FATTO IN ITALIA » vintage. Une analyse LegitVision à ${FACTS.priceSingle} apporte un premier avis avant paiement.`,
      },
    ],
  },
  {
    platformSlug: "ebay",
    brandSlug: "dior",
    angle:
      "Dior sur eBay présente un profil intermédiaire : les Saddle Bag, Book Tote et Lady Dior au-dessus de 1 000 $ sont couverts par Authenticity Guarantee avec une expertise spécialisée Dior. Les vendeurs basés en Asie et Europe de l'Est présentent un risque extrême hors programme. Pour les acheteurs européens, eBay USA offre un volume Dior intéressant avec authentification, mais les prix finaux (port + douanes) sont souvent équivalents à Vestiaire Europe.",
    faqs: [
      {
        question: "Saddle Bag eBay authentifiée : niveau de confiance ?",
        answer:
          "L'Authenticity Guarantee eBay pour Dior mobilise des experts formés sur les codes Maria Grazia Chiuri (2016+) et John Galliano (2000-2011). Les vintage Galliano bénéficient d'une expertise plus pointue mais avec risque résiduel plus élevé. Pour un Saddle > 5 000 €, une seconde expertise tiers reste pertinente.",
      },
      {
        question: "Dior Jordan 1 sur eBay : authentifiable ?",
        answer:
          "Oui, via le programme sneakers Authenticity Guarantee avec experts CISA/Entrupy spécialisés sur cette collaboration ultra-limitée. Prix marché authentifié : 10 000-18 000 € selon taille et état. À moins de 7 000 €, l'annonce est suspecte.",
      },
    ],
  },
];
