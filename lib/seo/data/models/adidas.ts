import type { ModelData } from "../../legit-check-types";

export const adidasModels: ModelData[] = [
  {
    slug: "yeezy-350-v2",
    name: "Yeezy Boost 350 V2",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "220-1 200 €",
    retailYear: "2016",
    tagline: "La Yeezy la plus copiée, plus de 15 coloris OG",
    intro:
      "La Yeezy Boost 350 V2, co-signée par Kanye West et adidas en 2016, reste la sneaker Yeezy la plus produite et la plus contrefaite au monde. Après la rupture de Kanye avec adidas fin 2022, les stocks restants ont été remis en vente via les adidas CONFIRMED drops de 2023-2024, ce qui a rendu les prix de retail à nouveau accessibles (230-250 €) mais a aussi multiplié les super-fakes produits à Putian et Longyan. Les coloris OG (Zebra, Beluga, Cream White, Bred, Oreo, Static) se négocient entre 300 € et 1 200 €, avec les drops rares (Infrared, MX Oat) qui dépassent régulièrement 800 €. Les contrefaçons 2025-2026 reproduisent fidèlement le pattern Primeknit, la sangle SPLY-350 et la semelle Boost, rendant l'identification visuelle au coup d'œil impossible. Les cinq points de contrôle ci-dessous ciblent les défauts qui résistent encore aux UA batches : le tissage Primeknit spécifique du V2, la géométrie exacte du texte SPLY-350, la qualité des granules Boost TPU, l'insert du heel counter interne et le format exact du tag de taille Made in China.",
    signals: [
      {
        title: "Primeknit — densité et motif spécifique au V2",
        description:
          "Le Primeknit authentique V2 présente un tissage à maille serrée avec une alternance régulière de zones transparentes (see-through) et opaques selon le colorway. La bande latérale transparente doit laisser voir l'intérieur du chausson sans distorsion. Les contrefaçons ont un tissage trop uniforme, des mailles distendues, ou un motif see-through flou avec des fils qui dépassent.",
        difficulty: 2,
      },
      {
        title: "Texte SPLY-350 — miroir exact et typographie",
        description:
          "Le texte SPLY-350 sur la sangle latérale est écrit en miroir (lecture inverse) avec une police sans-serif spécifique. La distance entre SPLY et 350 est exactement de 1,5 mm. Les contrefaçons utilisent souvent une police trop fine, un espacement incorrect, ou oublient de miroirer correctement le chiffre 3.",
        difficulty: 1,
      },
      {
        title: "Granules Boost TPU — transparence et taille",
        description:
          "La semelle Boost authentique est composée de granules TPU individuelles soufflées, visibles à l'œil nu, avec des tailles légèrement irrégulières (1-3 mm). La semelle est translucide avec un effet marbré. Les contrefaçons ont des granules trop uniformes, une semelle opaque ou jaunâtre, et parfois une texture « plastique fondu » trahissant un moulage injecté.",
        difficulty: 2,
      },
      {
        title: "Heel counter interne — fermeté et forme",
        description:
          "Le heel counter V2 authentique est souple mais ferme : il reprend immédiatement sa forme après pression du pouce. Il est positionné 2 cm sous le haut du talon. Les contrefaçons présentent un heel counter soit trop mou (s'écrase), soit trop rigide (carton), et souvent mal positionné.",
        difficulty: 3,
      },
      {
        title: "Size tag — Made in China, code article, layout",
        description:
          "L'étiquette intérieure authentique indique « Made in China » en trois polices distinctes (EN/FR/KR), avec le code article au format XX0000, la taille en US/UK/CM/EU alignée parfaitement. Les contrefaçons ont souvent un code article inexistant, un alignement décalé, ou utilisent « Fabriqué en Chine » avec une police incorrecte.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "« Yeezy Zebra neuve à 150 € avec boîte »",
        description:
          "La Yeezy Zebra OG a un prix marché stable à 350-500 €. Toute annonce sous 250 € boîte incluse est une contrefaçon quasi-certaine, souvent des UA batches Pandabuy revendus sur Vinted avec photos volées à StockX.",
      },
      {
        title: "Receipt adidas CONFIRMED photographiée",
        description:
          "Les vendeurs de fakes envoient une photo de receipt adidas CONFIRMED « comme preuve ». Cette receipt est soit générée par site frauduleux, soit photocopiée d'une vraie commande (même n° de commande réutilisé sur dizaines d'annonces). Exigez le receipt numérique original envoyé par mail.",
      },
    ],
    faqs: [
      {
        question: "Les Yeezy 350 V2 sont-elles authentifiables par StockX/GOAT ?",
        answer:
          "Oui, StockX et GOAT authentifient les Yeezy 350 V2 sur tous les coloris OG. Le taux de rejet pour contrefaçon dépasse 12 % sur les drops récents, ce qui confirme la prévalence des super-fakes. LegitVision vous permet de pré-authentifier vos photos avant un achat hors plateforme Vinted ou Leboncoin.",
      },
      {
        question: "Existe-t-il encore des Yeezy 350 V2 neuves en vente officielle en 2026 ?",
        answer:
          "Oui, adidas a écoulé le stock Yeezy via des drops CONFIRMED en 2023-2024. Les pairs restantes circulent en resell sur StockX, GOAT, Flight Club. adidas ne reproduit plus de nouveaux coloris depuis la rupture avec Kanye West fin 2022, ce qui rend les OG 2016-2022 plus rares et plus ciblés par les contrefacteurs.",
      },
    ],
  },
  {
    slug: "yeezy-700",
    name: "Yeezy Boost 700",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "320-1 500 €",
    retailYear: "2017",
    tagline: "La Wave Runner chunky du dad-shoe trend",
    intro:
      "La Yeezy Boost 700, lancée en 2017 avec le coloris « Wave Runner », a initié la vague dad-shoe qui a dominé la sneaker culture 2018-2020. Sa silhouette massive, son empiècement suède-mesh-cuir et sa semelle Boost pleine longueur en font l'un des designs les plus complexes de la ligne Yeezy — donc l'un des plus difficiles à contrefaire correctement. Les coloris Wave Runner, Mauve, Salt, Inertia et Magnet se négocient entre 400 € et 900 €, avec la Wave Runner OG qui peut atteindre 1 500 € en taille PC. Les super-fakes actuels reproduisent la silhouette mais échouent systématiquement sur la densité de la Boost pleine longueur, l'alignement des empiècements sur le mid-foot et la qualité 3M des overlays réfléchissants. Les cinq signaux ci-dessous permettent d'écarter 90 % des contrefaçons en moins de 3 minutes : empiècements tri-matières, 3M réflectif, géométrie Boost pleine longueur, texte YEEZY BOOST embroidered sur la languette, et format du size tag.",
    signals: [
      {
        title: "Empiècements tri-matières — jointures nettes",
        description:
          "La Yeezy 700 combine suède (orteils + côté), mesh (milieu) et cuir (arrière). Les jointures authentiques sont nettes, sans surplus de colle ni chevauchement visible. Les contrefaçons présentent souvent des raccords irréguliers, des chevauchements de 2-3 mm, ou des fils qui dépassent aux jointures cuir-suède.",
        difficulty: 2,
      },
      {
        title: "Réflectif 3M — overlays et intensité",
        description:
          "Les overlays réfléchissants authentiques (notamment sur Wave Runner) renvoient une lumière blanche intense au flash photo, uniforme sur toute la surface. Les contrefaçons utilisent un réflectif gris-verdâtre peu intense, ou partiellement appliqué (zones non réfléchissantes).",
        difficulty: 1,
      },
      {
        title: "Boost pleine longueur — hauteur et densité",
        description:
          "La Boost 700 authentique a une semelle Boost pleine longueur de 3,2 cm au talon, avec une compression ferme et un rebond immédiat sous pression. Les contrefaçons ont souvent une mousse EVA injectée imitant l'apparence, mais qui s'écrase durablement sous pression et manque de rebond.",
        difficulty: 2,
      },
      {
        title: "YEEZY BOOST embroidered — languette intérieure",
        description:
          "Le texte « YEEZY BOOST » est brodé en relief sur la languette intérieure, avec une broderie dense (points serrés) et une hauteur de 4 mm exactement. Les contrefaçons utilisent souvent une broderie plate, un texte imprimé, ou une hauteur incorrecte (3 mm ou 5 mm).",
        difficulty: 3,
      },
      {
        title: "Size tag — format B75571 et codes pays",
        description:
          "Le code article Yeezy 700 suit le format B75571 (Wave Runner), EE9614 (Mauve), etc. Il doit correspondre exactement au colorway. L'étiquette indique « Made in China » avec les codes pays (EUR/UK/US/CM) alignés sur 4 colonnes. Vérifiez le code sur adidas.com ou StockX avant achat.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Wave Runner « neuve jamais portée » à 200 €",
        description:
          "La Wave Runner OG 2017 a un prix marché stable à 600-900 € neuve. Toute annonce sous 400 € neuve avec boîte est une contrefaçon, souvent avec photos StockX volées ou pairs portées re-teintées.",
      },
      {
        title: "« Taille rare EU 45 en stock » sur Instagram",
        description:
          "Les comptes Instagram vendant exclusivement des « tailles rares » Yeezy 700 à prix moyens sont à 95 % des contrefacteurs Putian. Vérifiez l'ancienneté du compte, les avis clients et exigez un paiement PayPal biens et services (pas Friends & Family).",
      },
    ],
    faqs: [
      {
        question: "Comment distinguer une Yeezy 700 Wave Runner d'une 700 V2 ou V3 ?",
        answer:
          "La Wave Runner (V1) a une silhouette chunky avec empiècement tri-matières et Boost pleine longueur. La V2 a une silhouette similaire mais avec une bande latérale spécifique. La V3 abandonne la Boost et utilise une semelle Adiprene monobloc. Chaque version a ses propres codes article à vérifier.",
      },
      {
        question: "Les Yeezy 700 jaunissent-elles avec le temps ?",
        answer:
          "Oui, la Boost exposée à l'oxygène et aux UV peut jaunir légèrement après 2-3 ans. C'est un défaut naturel sur les vraies Yeezy 700, pas un signe de contrefaçon. Un jaunissement uniforme, non taché, est compatible avec une paire authentique portée.",
      },
    ],
  },
  {
    slug: "yeezy-500",
    name: "Yeezy 500",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "280-900 €",
    retailYear: "2018",
    tagline: "La dad-shoe brutaliste avec semelle Adiprene+",
    intro:
      "La Yeezy 500, sortie en 2018 avec le coloris Blush puis Supermoon Yellow, se distingue de la ligne Yeezy par l'absence de semelle Boost : elle utilise Adiprene+ en full-length, une mousse plus dense et plus lourde, qui lui donne son poids caractéristique de 580 g par chaussure en taille 42. L'upper combine mesh premium, cuir nubuck et suède en empiècements subtils, sans logo visible à l'extérieur — ce qui en fait paradoxalement l'un des modèles Yeezy les plus difficiles à contrefaire correctement, car tout défaut saute aux yeux sur une chaussure si épurée. Les coloris Blush, Super Moon Yellow, Utility Black et Stone se négocient entre 300 € et 700 €. Les contrefaçons échouent sur la densité exacte de la mousse Adiprene+, la texture du nubuck, et l'alignement parfait des empiècements sur une silhouette volontairement minimaliste. Les cinq signaux ci-dessous couvrent les points de contrôle les plus fiables : densité Adiprene+, texture nubuck, empiècements zero-gap, insole embossée et le code article spécifique.",
    signals: [
      {
        title: "Adiprene+ — densité et compression",
        description:
          "La semelle Adiprene+ authentique résiste à la compression sous pression du pouce (presque aucune déformation visible) et retrouve immédiatement sa forme. Les contrefaçons utilisent de l'EVA basique qui s'écrase et laisse une empreinte du pouce visible pendant 10-15 secondes.",
        difficulty: 2,
      },
      {
        title: "Nubuck — texture mate et toucher velouté",
        description:
          "Le nubuck Yeezy 500 authentique est parfaitement mat, avec un toucher velouté uniforme. Passer le doigt inversement crée une trace sombre qui disparaît en passant la main dans le sens du poil. Les contrefaçons ont un nubuck brillant, rugueux, ou qui ne réagit pas au test du doigt inversé.",
        difficulty: 3,
      },
      {
        title: "Empiècements zero-gap — jointures invisibles",
        description:
          "Les empiècements nubuck-mesh-suède sur la Yeezy 500 authentique sont assemblés sans gap visible, avec une précision laser. Les contrefaçons laissent apparaître des espaces de 0,5-1 mm aux jointures, notamment sur le médial du pied.",
        difficulty: 2,
      },
      {
        title: "Insole — embossé YEEZY et densité",
        description:
          "L'insole authentique est embossée YEEZY en relief sur le talon, avec une mousse à mémoire de forme dense. Les contrefaçons ont souvent un embossé aplati, absent, ou une mousse bas de gamme qui s'écrase immédiatement.",
        difficulty: 2,
      },
      {
        title: "Code article — format DB2908, EE7287, etc.",
        description:
          "Chaque colorway a un code article spécifique : DB2908 (Blush), DB2966 (Super Moon Yellow), EE7287 (Utility Black). Vérifiez le code sur adidas.com avant achat. Un code inexistant ou attribué à un autre coloris est un drapeau rouge.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Blush « comme neuves » à 180 € sur Vinted",
        description:
          "La Yeezy 500 Blush a un prix marché stable à 400-600 € neuve. Toute annonce sous 300 € est une contrefaçon ou une paire usée re-teintée. Exigez des photos HD de l'insole et du size tag avant paiement.",
      },
      {
        title: "Vendeur qui refuse photo de la semelle",
        description:
          "Les contrefaçons Yeezy 500 ont une semelle Adiprene+ mal moulée (bords irréguliers, logo manquant). Un vendeur qui refuse de fournir une photo HD de la semelle de côté et du dessous est à 90 % sur une fake.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi la Yeezy 500 n'a-t-elle pas de Boost comme les autres Yeezy ?",
        answer:
          "Kanye West a choisi l'Adiprene+ pour la 500 afin de lui donner un feeling plus dense et brutaliste, en rupture avec le confort bouncy de la Boost. Cette décision stylistique fait partie de l'ADN du modèle — toute Yeezy 500 avec de la Boost visible est une contrefaçon.",
      },
      {
        question: "Le nubuck de la 500 se tache-t-il facilement ?",
        answer:
          "Oui, le nubuck est sensible aux taches d'eau et de gras. Une vraie Yeezy 500 portée présente généralement des marques d'usage visibles. Une paire annoncée « jamais portée » mais sans boîte ni stickers est suspecte.",
      },
    ],
  },
  {
    slug: "yeezy-slide",
    name: "Yeezy Slide",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "60-250 €",
    retailYear: "2019",
    tagline: "La slide EVA mono-bloc la plus copiée de 2024",
    intro:
      "La Yeezy Slide, lancée en 2019 et explosée pendant la pandémie 2020-2022, est devenue le produit Yeezy le plus accessible (retail 55-75 €) et paradoxalement l'un des plus contrefaits en volume brut. Sa construction mono-bloc en EVA foam, son absence totale de couture et son logo « YEEZY » débossé discret la rendent faussement simple à copier, mais plusieurs détails résistent aux super-fakes : densité exacte de l'EVA, géométrie du logo débossé, texture intérieure du footbed et format du tag size imprimé. Les coloris Bone, Pure, Onyx, Resin, Core et Glow Green se négocient entre 100 € et 250 € sur le marché secondaire, avec les drops rares (Flax, Sulfur, Ochre) qui dépassent 300 €. Les contrefaçons sont massivement présentes sur Vinted, Shein, AliExpress et Instagram dropship. Les cinq signaux ci-dessous ciblent les défauts les plus fréquents : densité EVA, YEEZY débossé, footbed pattern, size tag exact et poids.",
    signals: [
      {
        title: "Densité EVA — compression et rebond",
        description:
          "L'EVA authentique a une densité spécifique : sous pression, elle s'enfonce de 3-4 mm puis reprend sa forme en 1-2 secondes. Les contrefaçons utilisent souvent de l'EVA recyclée bas de gamme qui s'enfonce de 6-8 mm et reprend lentement sa forme.",
        difficulty: 2,
      },
      {
        title: "YEEZY débossé — profondeur et netteté",
        description:
          "Le logo YEEZY est débossé (enfoncé) sur la sangle supérieure avec une profondeur uniforme de 1 mm et des bords nets. Les contrefaçons ont souvent un débossé trop superficiel (0,3-0,5 mm), flou, ou au contraire trop profond avec des bords dentelés.",
        difficulty: 2,
      },
      {
        title: "Footbed pattern — relief ergonomique spécifique",
        description:
          "Le footbed authentique présente un relief ergonomique avec 12 zones de bumps distinctes pour masser la plante du pied. Les contrefaçons ont soit un footbed plat, soit un pattern générique avec des bumps irréguliers ou mal positionnés.",
        difficulty: 2,
      },
      {
        title: "Size tag — imprimé sous la sangle, pas étiqueté",
        description:
          "La taille est imprimée directement sous la sangle en police sans-serif blanche ou noire selon colorway, jamais sur une étiquette cousue. Les contrefaçons ont souvent une étiquette textile cousue, ce qui est un défaut-identifiant immédiat.",
        difficulty: 1,
      },
      {
        title: "Poids — 380-420 g par pied en 42",
        description:
          "Une Yeezy Slide authentique en taille 42 pèse entre 380 et 420 g par pied. Les contrefaçons pèsent souvent moins (EVA bas de gamme plus légère) ou plus (PVC injecté plus lourd). Pesez-les sur une balance de cuisine.",
        difficulty: 3,
      },
    ],
    scams: [
      {
        title: "Drop Shein à 25 € « identique »",
        description:
          "Shein et AliExpress vendent des clones Yeezy Slide à 10-30 € sous diverses marques inconnues. Ces produits ne sont pas des contrefaçons juridiquement parlant (logo absent) mais sont souvent revendus sur Vinted à 60-80 € comme des authentiques.",
      },
      {
        title: "« Deadstock avec stickers » à 50 €",
        description:
          "Les contrefaçons Yeezy Slide viennent souvent avec stickers et film plastique imitant un produit neuf. Un retail officiel Yeezy Slide ne descend jamais sous 55 €, donc une annonce « neuve avec stickers » à 50 € est suspecte.",
      },
    ],
    faqs: [
      {
        question: "Les Yeezy Slide taillent-elles normalement ?",
        answer:
          "Non, les Yeezy Slide taillent grand d'1 à 2 pointures. adidas recommande de prendre 1 taille en dessous de votre pointure habituelle. Un vendeur qui dit « taille normalement » vend probablement un clone Shein mal calibré.",
      },
      {
        question: "Peut-on authentifier une Yeezy Slide sans la boîte ?",
        answer:
          "Oui, la boîte n'est pas déterminante pour l'authentification des slides. Les 5 signaux physiques (densité EVA, débossé YEEZY, footbed, tag, poids) suffisent. LegitVision analyse vos photos même sans boîte pour les Yeezy Slide.",
      },
    ],
  },
  {
    slug: "samba",
    name: "Samba OG",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "100-250 €",
    retailYear: "1950 (rééditée en continu)",
    tagline: "Le hit retro 2023-2026 relancé par Bella Hadid",
    intro:
      "La adidas Samba OG, créée en 1950 pour le football en salle, est passée du statut de sneaker fonctionnelle à icône mode retro grâce au revival porté par Bella Hadid, Harry Styles et la vague « quiet luxury » 2023-2024. Les coloris White/Black/Gum, Black/White/Gum et les collaborations Wales Bonner se négocient entre 110 € (retail) et 300 € (collabs revendues), avec les restocks sporadiques créant régulièrement des ruptures et des hausses de prix. Le retour massif de la Samba a déclenché une vague de contrefaçons très bien exécutées : les super-fakes Putian reproduisent correctement la silhouette, le T-toe suède et la semelle gomme, ce qui force à vérifier des détails plus subtils. Les cinq signaux ci-dessous ciblent les points où les contrefaçons échouent encore en 2026 : qualité du T-toe suède, pattern de la semelle gomme, alignement des 3 bandes, broderie du Trefoil languette et stamp pays/date.",
    signals: [
      {
        title: "T-toe suède — grain, épaisseur, jointure",
        description:
          "Le T-toe authentique est en suède épais (1,8 mm), avec un grain uniforme et une jointure cuir-suède parfaitement droite. Les contrefaçons utilisent un suède fin (1,2 mm), un grain irrégulier, et la jointure présente souvent des vagues ou des surplus de colle.",
        difficulty: 2,
      },
      {
        title: "Semelle gomme — teinte jaune-miel et pattern",
        description:
          "La semelle gomme authentique est jaune-miel (pas jaune-citron ni marron-rouge), avec un pattern hexagonal ajouré spécifique. Les contrefaçons ont souvent une gomme trop claire ou trop foncée, et le pattern est soit trop dense soit déformé sur les bords.",
        difficulty: 2,
      },
      {
        title: "3 bandes — parallélisme et stitching",
        description:
          "Les 3 bandes latérales sont parfaitement parallèles, avec un espacement constant de 4 mm entre chaque. Le stitching autour est régulier, avec des points de 2 mm. Les contrefaçons ont des bandes qui convergent ou divergent légèrement, ou un espacement inégal.",
        difficulty: 2,
      },
      {
        title: "Trefoil languette — broderie 3D et couleur",
        description:
          "Le Trefoil sur la languette est brodé en relief 3D avec une hauteur de 1 mm et une couleur dorée précise. Les contrefaçons utilisent souvent un Trefoil imprimé (plat), ou brodé mais en or trop clair/trop orangé.",
        difficulty: 2,
      },
      {
        title: "Stamp size tag — Made in Indonesia/Vietnam, format",
        description:
          "Le tag authentique indique « Made in Indonesia » ou « Made in Vietnam » (selon batch), avec un code article au format B/ID XX00000 et les dates de production (ex. 09/23). Les contrefaçons ont souvent « Made in China » (faux pour la Samba OG moderne) ou un format de date incorrect.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Samba OG « White/Gum neuve » à 65 €",
        description:
          "La Samba OG retail à 110 € et son prix marché ne descend pas sous 85 € même en taille peu demandée. Une annonce à 65 € avec boîte est une contrefaçon ou une paire portée re-nettoyée.",
      },
      {
        title: "Restock « en avant-première » Instagram",
        description:
          "Les restocks Samba sont exclusifs adidas.com et CONFIRMED app. Les comptes Instagram promettant des « restocks avant-première » à prix retail sont des arnaques à 100 %. adidas ne vend jamais via DM privé.",
      },
    ],
    faqs: [
      {
        question: "Quelle différence entre la Samba OG et la Samba Classic ?",
        answer:
          "La Samba OG utilise un upper cuir lisse + T-toe suède et une semelle gomme premium. La Samba Classic (entry-level) utilise un cuir synthétique et une semelle plus rigide. Les contrefaçons sont souvent des Classic repositionnées comme OG.",
      },
      {
        question: "La Samba OG taille-t-elle bien ?",
        answer:
          "La Samba taille grand d'une demi-pointure. adidas recommande de prendre 0,5 en dessous. Une paire « taille normalement » vendue hors boîte officielle est suspecte.",
      },
    ],
  },
  {
    slug: "gazelle",
    name: "Gazelle",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "100-220 €",
    retailYear: "1968 (rééditée en continu)",
    tagline: "Le modèle suède 100 % qui divise les collectionneurs",
    intro:
      "La adidas Gazelle, lancée en 1968 comme chaussure d'entraînement légère, est la cousine retro de la Samba mais avec une signature exclusivement suède (pas de cuir lisse). Après des décennies de présence constante dans le catalogue adidas Originals, elle a bénéficié du revival terrace 2024-2025 et s'impose en 2026 comme l'une des sneakers suède les plus vendues en Europe. Retail 110 € pour les coloris OG (Black/White, Red/White, Navy/White), avec les collaborations Wales Bonner, Gucci et Pharrell qui s'échangent entre 200 € et 600 €. Les super-fakes Gazelle 2025 maîtrisent la silhouette et la couleur, mais échouent sur quatre points techniques invariables : la texture exacte du suède 100 % (pas de renforts cuir cachés), la géométrie de la languette, le stitching doré du Trefoil et la semelle intérieure embossée. Les cinq signaux ci-dessous construisent une check-list rapide pour distinguer une vraie Gazelle des UA batches courants sur Vinted et Leboncoin.",
    signals: [
      {
        title: "Suède 100 % — absence de renforts cuir",
        description:
          "La Gazelle authentique est 100 % suède sur l'ensemble de l'upper (pas de cuir lisse en renfort au talon ou à la languette). Les contrefaçons utilisent parfois un cuir synthétique enduit pour imiter le suède à moindre coût — reconnaissable au toucher plus rigide et au grain inexistant.",
        difficulty: 2,
      },
      {
        title: "Languette — forme arrondie et hauteur",
        description:
          "La languette Gazelle authentique est arrondie à son sommet, mesure 5,5 cm de hauteur depuis le haut du lacet, et présente un Trefoil centré. Les contrefaçons ont souvent une languette plus courte (4,5 cm), trop carrée ou avec un Trefoil décentré.",
        difficulty: 2,
      },
      {
        title: "Trefoil stitching — fil doré spécifique",
        description:
          "Le Trefoil de la languette est brodé au fil doré avec une tension uniforme et une hauteur de broderie de 0,8 mm. Les contrefaçons ont souvent un Trefoil imprimé ou brodé en fil jaune-verdâtre au lieu du doré authentique.",
        difficulty: 2,
      },
      {
        title: "Insole — embossé adidas Gazelle complet",
        description:
          "La semelle intérieure authentique est embossée « adidas Gazelle » en relief sur le talon, avec le Trefoil centré sur l'avant-pied. Les contrefaçons ont souvent une semelle intérieure noire plate sans embossage, ou avec un embossage incomplet.",
        difficulty: 2,
      },
      {
        title: "Stamp size tag — format ID/BB + date production",
        description:
          "Le tag intérieur indique un code au format BB5478 (Black/White), BB5486 (Red/White), etc., avec le lieu de production (Indonésie/Vietnam) et la date (ex. 07/2024). Les contrefaçons ont des codes inexistants ou des dates de production antérieures à la réédition concernée.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Gazelle Rouge « taille 44 » à 55 € avec boîte",
        description:
          "La Gazelle retail à 110 € et son prix marché ne descend jamais sous 80 € en taille courante. Une annonce à 55 € boîte incluse est quasi-certainement une contrefaçon, souvent issue des UA batches Pandabuy.",
      },
      {
        title: "Collab Gucci x adidas à prix « ami »",
        description:
          "La Gucci x adidas Gazelle a un retail à 850 € et un prix marché 600-900 €. Les comptes Instagram proposant cette collab à 250-400 € « prix entre amis » vendent à 100 % des contrefaçons. La collab authentique est vendue exclusivement sur gucci.com et boutiques Gucci.",
      },
    ],
    faqs: [
      {
        question: "La Gazelle existe-t-elle en cuir lisse ?",
        answer:
          "Non, la Gazelle OG est exclusivement en suède. adidas a sorti des variantes « Gazelle Indoor » et « Gazelle Bold » avec des matériaux différents, mais la Gazelle classique est 100 % suède. Toute Gazelle OG en cuir lisse est une contrefaçon.",
      },
      {
        question: "Comment nettoyer une Gazelle suède sans l'abîmer ?",
        answer:
          "Utilisez une brosse à suède (crêpe + poils) en mouvements unidirectionnels, puis un spray imperméabilisant pour suède. N'utilisez JAMAIS d'eau savonneuse sur le suède, qui laisse des auréoles irréversibles.",
      },
    ],
  },
  {
    slug: "campus",
    name: "Campus 00s",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "110-200 €",
    retailYear: "1980 (version 00s rééditée en 2022)",
    tagline: "Le suède silhouette épaisse, hit TikTok 2024",
    intro:
      "La adidas Campus 00s, réédition 2022 du modèle de 1980 inspiré des chaussures de basket universitaire, s'est imposée comme l'alternative épaisse à la Gazelle et la Samba. Sa silhouette plus robuste (upper suède structurel, semelle EVA blanche pure), son succès TikTok 2024 (#campus00s a dépassé 180 M de vues), et ses coloris street (Dark Green, Better Scarlet, Off White, Wonder White) la placent parmi les trois sneakers suède les plus vendues en Europe en 2025-2026. Retail 120 €, prix marché stable 140-180 €. Les contrefaçons exploitent sa popularité sur TikTok avec des campagnes Vinted ciblant les 18-24 ans. Les cinq signaux ci-dessous distinguent la Campus 00s authentique des fakes : épaisseur du suède (plus rigide que Gazelle), géométrie des 3 bandes perforées, forme du midsole EVA, stitching du T-toe et code article BY/ID.",
    signals: [
      {
        title: "Suède structurel — épaisseur et rigidité",
        description:
          "Le suède Campus 00s est plus épais (2,2 mm) et plus rigide que celui de la Gazelle (1,5 mm), ce qui donne à la chaussure sa forme structurée iconique. Les contrefaçons utilisent un suède plus fin et mou, ce qui rend la chaussure flasque au pincement du T-toe.",
        difficulty: 3,
      },
      {
        title: "3 bandes perforées — perforations alignées",
        description:
          "Les 3 bandes latérales sont perforées (pas pleines) avec des perforations rondes de 2 mm alignées sur une grille précise. Les contrefaçons ont souvent des perforations ovales, irrégulièrement espacées, ou manquantes sur les bords.",
        difficulty: 2,
      },
      {
        title: "Midsole EVA — blanc pur et forme spécifique",
        description:
          "Le midsole Campus 00s est en EVA blanc pur (pas crème ni jaune), avec une forme légèrement bombée sur l'arche. Les contrefaçons ont souvent un midsole jaunâtre, crème, ou avec une forme trop plate.",
        difficulty: 2,
      },
      {
        title: "T-toe stitching — fil ton sur ton, points serrés",
        description:
          "Le T-toe est stitché au fil ton sur ton (pas contrastant) avec 14 points par centimètre. Les contrefaçons ont souvent un stitching trop lâche (10 points/cm) et parfois un fil légèrement plus clair que le suède.",
        difficulty: 3,
      },
      {
        title: "Code article — format BY/ID spécifique Campus 00s",
        description:
          "Les codes Campus 00s sont au format HQ8707 (Dark Green), GY0042 (Wonder White), H03471 (Better Scarlet), etc. Vérifiez le code sur adidas.com. Les contrefaçons ont souvent un code Campus classique (pas 00s), donc un modèle et une silhouette différents.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Campus 00s « Dark Green neuves » à 60 €",
        description:
          "La Campus 00s Dark Green a un prix marché stable à 150-200 €. Une annonce à 60 € boîte incluse est une contrefaçon Putian, souvent accompagnée de photos volées à Flight Club.",
      },
      {
        title: "Confusion Campus classique vs Campus 00s",
        description:
          "Certains vendeurs revendent des Campus classiques en se faisant passer pour des Campus 00s. Les Campus 00s ont une silhouette plus épaisse et un midsole bombé. Demandez une photo du code article pour confirmer.",
      },
    ],
    faqs: [
      {
        question: "Quelle différence entre la Campus 00s et la Campus ADV ?",
        answer:
          "La Campus ADV est une version skate renforcée (cup sole vulcanisée, upper plus robuste), tandis que la Campus 00s est la réédition lifestyle inspirée des années 2000. Les codes articles et silhouettes sont différents.",
      },
      {
        question: "La Campus 00s taille-t-elle normalement ?",
        answer:
          "La Campus 00s taille grand d'1 pointure. Prenez 1 taille en dessous de votre pointure habituelle. Un vendeur qui dit « taille normalement » connaît mal le modèle ou vend un clone.",
      },
    ],
  },
  {
    slug: "stan-smith",
    name: "Stan Smith",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "100-180 €",
    retailYear: "1963 (rééditée en continu)",
    tagline: "La tennis blanche la plus vendue de l'histoire",
    intro:
      "La adidas Stan Smith, introduite en 1963 sous le nom « Robert Haillet » puis rebaptisée en 1978 en hommage au champion de tennis Stanley Smith, est la sneaker la plus vendue de l'histoire (plus de 100 millions de paires écoulées). Son succès est porté par sa simplicité : upper cuir lisse blanc, 3 bandes perforées (pas en relief), heel tab coloré, visage de Stan Smith embossé sur la languette. Retail 110 € pour les coloris OG (White/Green, White/Navy), avec les versions Mihara Yasuhiro, Raf Simons et Primegreen qui s'étagent entre 150 € et 500 €. La Stan Smith est une cible massive de contrefaçon en volume brut : Putian produit des milliers de pairs par mois, revendues sur Vinted, Amazon Marketplace et Shein. Les cinq signaux ci-dessous permettent d'identifier 95 % des fakes en moins de 2 minutes : cuir qualité, perforations 3 bandes, heel tab, visage Stan Smith et code article.",
    signals: [
      {
        title: "Cuir — souplesse, absence d'odeur chimique",
        description:
          "Le cuir authentique Stan Smith est souple, sent légèrement le cuir, et présente un grain subtil visible à la loupe. Les contrefaçons utilisent du cuir synthétique (PU) qui sent le plastique, est trop lisse au toucher et trop rigide.",
        difficulty: 2,
      },
      {
        title: "3 bandes perforées — alignement et taille des trous",
        description:
          "Les 3 bandes sont formées par 3 colonnes de perforations rondes de 2,5 mm, alignées parfaitement sur la grille latérale. Les contrefaçons ont des perforations ovales, trop petites (2 mm), ou décalées sur les bords.",
        difficulty: 2,
      },
      {
        title: "Heel tab — couleur spécifique au colorway",
        description:
          "Le heel tab Stan Smith OG est vert forêt (White/Green) ou bleu marine (White/Navy), avec un embossage « Stan Smith » visible. Les contrefaçons ont souvent une couleur légèrement décalée (vert trop clair ou trop foncé) et un embossage flou.",
        difficulty: 1,
      },
      {
        title: "Visage Stan Smith — languette imprimée",
        description:
          "La languette authentique présente un portrait photographique imprimé de Stan Smith avec une signature sous la photo. Les contrefaçons ont souvent une qualité d'impression dégradée (flou, contraste trop élevé, ou signature manquante).",
        difficulty: 2,
      },
      {
        title: "Code article — format M/FX/GW + adidas.com",
        description:
          "Les codes Stan Smith OG sont au format M20324 (White/Green), FX5502 (Primegreen), etc. Vérifiez le code sur adidas.com. Les contrefaçons utilisent souvent des codes inventés ou recyclent des codes d'autres modèles.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Stan Smith « lot de 3 paires » à 150 €",
        description:
          "Les annonces vendant plusieurs pairs de Stan Smith à prix cassé (lots) sont à 100 % des contrefaçons. adidas ne vend jamais en lot à prix cassé, et un particulier avec 3 pairs neuves identiques vient quasi-toujours de Pandabuy.",
      },
      {
        title: "Faux « Adidas CONFIRMED receipt »",
        description:
          "Certains vendeurs fournissent une fausse receipt CONFIRMED générée sur des sites frauduleux. Vérifiez que le receipt est un vrai email adidas, pas une capture d'écran ou un PDF modifiable.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi certaines Stan Smith ont le logo Primegreen et d'autres non ?",
        answer:
          "adidas a introduit Primegreen (matériaux recyclés) sur certaines rééditions Stan Smith en 2020-2022. Les versions OG en cuir pleine fleur coexistent. Les deux versions sont authentiques, avec des codes articles différents. Vérifiez le code pour connaître la version exacte.",
      },
      {
        question: "La Stan Smith jaunit-elle avec le temps ?",
        answer:
          "Oui, la semelle caoutchouc peut jaunir légèrement après 2-3 ans d'exposition UV. Ce n'est pas un signe de contrefaçon. Un jaunissement uniforme, sans taches ponctuelles, est normal sur une Stan Smith portée.",
      },
    ],
  },
  {
    slug: "superstar",
    name: "Superstar",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "100-160 €",
    retailYear: "1969 (rééditée en continu)",
    tagline: "La shell-toe qui a dominé hip-hop et basket",
    intro:
      "La adidas Superstar, lancée en 1969 pour le basket professionnel et propulsée icône hip-hop par Run-DMC en 1986, est l'un des modèles les plus reconnaissables de l'histoire de la sneaker. Sa signature « shell toe » (la coque plastique sur les orteils) la distingue immédiatement des autres low-top adidas. Retail 110 € pour les coloris OG (White/Black, All Black, White/Core Black), avec les collaborations (Kenny Powers, Atmos, Human Made) qui dépassent 300 €. Malgré son iconicité, la Superstar est massivement contrefaite car elle reste une cible facile : silhouette simple, cuir classique, 3 bandes standards. Les contrefaçons échouent sur quatre points invariables : la rigidité et la courbure exacte de la shell toe, le positionnement du Trefoil gold languette, le stitching des 3 bandes, et le format du tag size avec date de production. Les cinq signaux ci-dessous construisent une check-list efficace pour les acheteurs Vinted, Leboncoin, Depop.",
    signals: [
      {
        title: "Shell toe — courbure exacte et rigidité",
        description:
          "La shell toe authentique a une courbure précise de 18° sur le dessus, avec une rigidité ferme (le pouce ne l'enfonce pas). Les contrefaçons ont souvent une shell trop plate (courbure 10-12°), trop molle, ou avec une géométrie déformée sur les côtés.",
        difficulty: 2,
      },
      {
        title: "Trefoil gold — broderie relief 3D",
        description:
          "Le Trefoil sur la languette est brodé en or véritable (fil métallique) avec un relief 3D de 1 mm. Les contrefaçons utilisent souvent un Trefoil imprimé doré (plat), ou brodé mais en fil jaune-synthétique qui oxyde au contact de l'eau.",
        difficulty: 2,
      },
      {
        title: "3 bandes stitching — double piqûre droite",
        description:
          "Les 3 bandes sont fixées par une double piqûre droite (pas zigzag), avec des points de 2 mm parfaitement alignés. Les contrefaçons ont souvent une piqûre simple, un zigzag, ou des points irréguliers visibles à la loupe.",
        difficulty: 2,
      },
      {
        title: "Heel tab — embossage adidas droit",
        description:
          "Le heel tab authentique est embossé « adidas » en police bold droite (pas italique), avec une hauteur de 5 mm. Les contrefaçons ont souvent une police trop fine, italique, ou un embossage incomplet.",
        difficulty: 2,
      },
      {
        title: "Size tag — date production + code pays cohérents",
        description:
          "Le tag authentique indique une date de production cohérente avec le colorway (ex. All Black 2023 = date 2023-2024, pas 2019). Les contrefaçons recyclent souvent des tags de vieux batches, créant des incohérences de date.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Superstar « vintage 1980s » à 300 €",
        description:
          "Les vraies Superstar vintage 1980s ont des particularités (cuir brunâtre, semelle jaunie uniformément, Trefoil languette plus petit). Les contrefaçons « vintage » sont souvent des Superstar modernes vieillies artificiellement avec du thé ou du café. Un vrai vintage 1980s vaut 500-1 500 € selon état.",
      },
      {
        title: "Collab Run-DMC « édition limitée 2026 »",
        description:
          "adidas sort occasionnellement des collabs Run-DMC officielles. Les vendeurs Instagram proposant des « Run-DMC Superstar collab 2026 » à 250 € sans référence officielle adidas vendent des contrefaçons. Vérifiez toujours la collab sur le site officiel avant achat.",
      },
    ],
    faqs: [
      {
        question: "Quelle différence entre la Superstar et la Superstar 80s ?",
        answer:
          "La Superstar 80s (ou Superstar Vintage) est une réédition fidèle de la version 1980s, avec un cuir plus épais et une shell toe plus bombée. La Superstar « moderne » est légèrement plus plate et utilise un cuir plus fin. Les deux sont authentiques mais ciblent des collectionneurs différents.",
      },
      {
        question: "La shell toe peut-elle casser ?",
        answer:
          "Oui, la shell toe peut craqueler après 5-7 ans d'usage intensif ou de stockage sec. Une shell craquelée n'est pas un signe de contrefaçon, mais d'usage. Pour les contrefaçons, la shell casse souvent dès les premiers mois car le plastique utilisé est de moindre qualité.",
      },
    ],
  },
  {
    slug: "forum-low",
    name: "Forum Low",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "100-250 €",
    retailYear: "1984 (rééditée en 2021)",
    tagline: "Le basket retro à strap, hit des collabs Bad Bunny",
    intro:
      "La adidas Forum Low, réédition en 2021 du modèle basket de 1984, s'est imposée grâce aux collaborations Bad Bunny (Last Forum, Pony of The Americas, Back to School) qui ont dépassé 1 000 € en resell. Sa signature est la sangle (strap) qui traverse le cou-de-pied avec la boucle métal « Forum », combinée à l'upper cuir et la semelle vulcanisée blanche. Retail 120 € pour les coloris OG, avec les collabs Bad Bunny qui s'échangent entre 400 € et 1 500 €. Les contrefaçons visent principalement les collabs Bad Bunny, où la marge est maximale. Les cinq signaux ci-dessous ciblent les défauts les plus fréquents : qualité du cuir épais, boucle strap metal, semelle vulcanisée, stitching 3 bandes et insole co-brandée. Pour les collabs Bad Bunny, un 6e point critique est le hangtag et la dust bag personnalisés, qui sont quasi-impossibles à contrefaire correctement.",
    signals: [
      {
        title: "Cuir épais — 2,3 mm, grain visible",
        description:
          "Le cuir Forum Low authentique est épais (2,3 mm) avec un grain pleine fleur visible à la loupe. Les contrefaçons utilisent un cuir split ou synthétique fin (1,5 mm) qui plie trop facilement et manque de tenue structurelle.",
        difficulty: 2,
      },
      {
        title: "Boucle strap — métal brossé, gravure « Forum »",
        description:
          "La boucle du strap est en métal brossé (pas chromé ni plastique) avec la gravure « Forum » lisible en relief. Les contrefaçons utilisent souvent une boucle plastique peinte chromée, ou une gravure incomplète/flou.",
        difficulty: 2,
      },
      {
        title: "Semelle vulcanisée — blanc pur et texture",
        description:
          "La semelle vulcanisée authentique est blanc pur (pas crème) avec une texture fine et régulière. Les contrefaçons ont souvent une semelle jaunâtre (pigment bas de gamme) ou une texture grossière.",
        difficulty: 2,
      },
      {
        title: "3 bandes — stitching double et alignement",
        description:
          "Les 3 bandes sont stitchées en double piqûre parfaitement alignées sur la grille latérale. Les contrefaçons ont souvent un alignement décalé ou un stitching simple.",
        difficulty: 3,
      },
      {
        title: "Insole — co-brandage collab complet",
        description:
          "Pour les collabs (Bad Bunny, etc.), l'insole présente un co-brandage complet (logo adidas + artiste) avec impression HD. Les contrefaçons ont souvent un co-brandage partiel, flou, ou absent.",
        difficulty: 2,
      },
    ],
    scams: [
      {
        title: "Forum Low Bad Bunny « Last Forum » à 350 €",
        description:
          "La collab Last Forum Bad Bunny a un prix marché stable 700-1 200 €. Une annonce à 350 € est une contrefaçon, souvent accompagnée de photos StockX volées. La collab originale était vendue exclusivement sur adidas CONFIRMED.",
      },
      {
        title: "Compte Instagram « sneaker plug » — paiement Revolut",
        description:
          "Les comptes Instagram proposant des Forum Low collab à prix cassé en demandant paiement Revolut ou Wise (non remboursable) sont des arnaques à 100 %. Exigez PayPal biens et services, ou annulez la transaction.",
      },
    ],
    faqs: [
      {
        question: "Comment authentifier une collab Bad Bunny x adidas Forum ?",
        answer:
          "Les collabs Bad Bunny ont des packaging spécifiques (boîte thème, hangtag, dust bag, insole co-brandée). Vérifiez que tous ces éléments sont présents et cohérents. La receipt CONFIRMED originale est une preuve forte mais peut être volée. LegitVision pré-authentifie vos photos avec score de confiance.",
      },
      {
        question: "La Forum Low est-elle confortable au quotidien ?",
        answer:
          "Oui, la Forum Low dispose d'une semelle cushionée et d'un strap ajustable. Elle taille normalement (prenez votre pointure habituelle). Les contrefaçons ont souvent une cushion réduite et taillent incorrectement — un indice supplémentaire d'identification.",
      },
    ],
  },
  {
    slug: "handball-spezial",
    name: "Handball Spezial",
    brandSlug: "adidas",
    category: "sneakers",
    priceRange: "120-200 €",
    retailYear: "1970s (rééditée en continu)",
    tagline: "La terrace sneaker portée par tout Londres en 2024",
    intro:
      "La adidas Handball Spezial, créée dans les années 1970 pour le handball indoor et relancée comme terrace sneaker auprès des supporters anglais des années 1980, est devenue l'un des modèles les plus désirés de 2024-2025. Le coloris Light Blue/White est quasi-impossible à trouver en boutique retail, créant un prix marché à 180-250 € pour un retail à 130 €. Sa silhouette low-profile, son upper suède intégral, ses bandes latérales aux contours plats et sa semelle gomme distincte de la Samba en font un modèle très spécifique. Les contrefaçons 2025 exploitent sa rareté avec des UA batches diffusés sur Vinted à prix « bonne affaire ». Les cinq signaux ci-dessous distinguent la Spezial authentique des clones : suède épais spécifique, bandes plates embroidered (pas stitchées), semelle gomme pattern distinct, languette fine et code article IE/GY.",
    signals: [
      {
        title: "Suède épais — texture granuleuse",
        description:
          "Le suède Spezial authentique est plus épais (2,1 mm) que celui de la Gazelle, avec un grain granuleux perceptible au toucher. Les contrefaçons utilisent un suède lisse et fin qui rappelle celui de la Samba, ce qui est un défaut-identifiant immédiat.",
        difficulty: 3,
      },
      {
        title: "3 bandes plates — broderie et absence de stitching",
        description:
          "Les 3 bandes sont brodées directement dans le suède (flat embroidery), sans stitching visible sur les bords. Les contrefaçons ont souvent des bandes stitchées comme sur la Samba, ce qui rompt la signature visuelle de la Spezial.",
        difficulty: 2,
      },
      {
        title: "Semelle gomme — pattern « indoor » distinct",
        description:
          "La semelle gomme Spezial a un pattern indoor spécifique (petits losanges) différent de celui de la Samba (hexagones). Les contrefaçons utilisent souvent une semelle Samba recyclée, ce qui trahit immédiatement la fake.",
        difficulty: 2,
      },
      {
        title: "Languette fine — longueur spécifique",
        description:
          "La languette Spezial est fine et courte (4,5 cm), avec un Trefoil brodé or centré. Les contrefaçons utilisent souvent une languette plus épaisse ou plus longue, souvent empruntée à la Gazelle.",
        difficulty: 2,
      },
      {
        title: "Code article — format IE/GY Spezial spécifique",
        description:
          "Les codes Handball Spezial sont au format IE2382 (Light Blue/White), GY7403, etc. Vérifiez sur adidas.com. Les contrefaçons ont souvent un code Samba, Gazelle ou inventé.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Light Blue « neuve » à 80 €",
        description:
          "La Spezial Light Blue a un prix marché stable 150-220 € neuve. Une annonce à 80 € est une contrefaçon quasi-certaine. adidas rupture régulièrement ce coloris, donc un stock particulier est improbable.",
      },
      {
        title: "Confusion avec la Samba rebrandée",
        description:
          "Certains vendeurs proposent des Samba peintes ou modifiées en se faisant passer pour des Spezial (tailles rares). Les silhouettes sont différentes (Spezial plus fine, Samba plus épaisse). Demandez une photo du pattern semelle pour trancher.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi la Handball Spezial est-elle si difficile à trouver ?",
        answer:
          "adidas produit la Spezial en quantités limitées pour préserver son positionnement terrace/niche. Les drops sont sporadiques et les tailles courantes (42-44) se vendent en quelques minutes sur adidas.com. Cette rareté gonfle le prix marché et attire les contrefacteurs.",
      },
      {
        question: "La Spezial existe-t-elle en dehors du Light Blue ?",
        answer:
          "Oui, la Spezial se décline en plusieurs coloris (Navy/White, Burgundy/White, Green/White, Black/Gum). Le Light Blue reste le plus désiré. Chaque coloris a son code article spécifique à vérifier sur adidas.com.",
      },
    ],
  },
];
