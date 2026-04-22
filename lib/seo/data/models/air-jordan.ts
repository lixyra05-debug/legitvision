import type { ModelData } from "../../legit-check-types";

export const airJordanModels: ModelData[] = [
  {
    slug: "jordan-3",
    name: "Air Jordan 3",
    brandSlug: "air-jordan",
    category: "sneakers",
    priceRange: "220-900 €",
    retailYear: "1988 (rééditée en continu)",
    tagline: "La première Jordan avec Air visible et Elephant Print",
    intro:
      "La Air Jordan 3, dessinée par Tinker Hatfield en 1988, a révolutionné la ligne Jordan en introduisant trois signatures iconiques : l'Air visible au talon, l'Elephant Print sur les overlays orteils-talon, et le logo Jumpman (remplaçant le Wings logo). C'est également la première Jordan portée par Michael Jordan lors du célèbre « Free Throw Line Dunk » du Slam Dunk Contest 1988. Les coloris OG (White Cement, Black Cement, Fire Red, True Blue) se négocient entre 250 € et 800 € selon rareté, avec les rééditions limitées (A Ma Maniere) qui dépassent 600 €. Les contrefaçons ciblent massivement la AJ3 car les détails iconiques (Elephant Print, Air visible) sont complexes à reproduire correctement. Les UA batches Putian 2025 maîtrisent la silhouette générale mais échouent sur la géométrie exacte de l'Elephant Print, la qualité du cuir des overlays, la clarté de la bulle Air visible et l'alignement du Jumpman languette. Les cinq signaux ci-dessous distinguent une AJ3 authentique.",
    signals: [
      {
        title: "Elephant Print — motifs organiques et précision",
        description:
          "L'Elephant Print authentique présente des motifs organiques asymétriques (pas de répétition parfaite) avec un relief 3D perceptible au toucher. Les contrefaçons ont souvent un pattern géométriquement régulier ou un relief absent (imprimé plat). Les contours des « éléphants » doivent être nets, sans bavure.",
        difficulty: 2,
      },
      {
        title: "Bulle Air visible — transparence et forme",
        description:
          "La bulle Air au talon est parfaitement transparente, visible des deux côtés, avec une forme ovoïde spécifique. Les contrefaçons ont souvent une bulle opaque, déformée ou partiellement visible (mousse qui bouche).",
        difficulty: 2,
      },
      {
        title: "Cuir des overlays — souplesse et grain",
        description:
          "Les overlays non-Elephant Print sont en cuir pleine fleur avec un grain subtil. Les contrefaçons utilisent souvent du cuir split synthétique qui manque de souplesse et présente un grain trop lisse ou plastifié.",
        difficulty: 3,
      },
      {
        title: "Jumpman languette — broderie et proportions",
        description:
          "Le Jumpman sur la languette est brodé en relief avec des proportions exactes (bras étendu à 45°, ballon centré). Les contrefaçons ont souvent un Jumpman aux proportions incorrectes (bras trop court ou ballon décalé) ou une broderie plate.",
        difficulty: 2,
      },
      {
        title: "Style Code — format 136064 + suffixe coloris",
        description:
          "Les codes AJ3 suivent 136064-105 (White Cement), 854262-001 (Black Cement), 136064-161 (Fire Red), etc. Vérifiez sur Nike.com ou StockX. Les contrefaçons utilisent souvent un code inexistant ou attribué à un autre coloris AJ3.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "White Cement Retro « neuve » à 180 €",
        description:
          "La AJ3 White Cement Retro retail à 220-250 € et son prix marché ne descend pas sous 200 € en taille courante. Une annonce à 180 € neuve avec boîte est quasi-certainement une contrefaçon UA.",
      },
      {
        title: "AJ3 Nike Air « OG 1988 » à 500 €",
        description:
          "Les AJ3 originales de 1988 avec « Nike Air » au talon (et non « Jumpman ») ont un prix minimum de 3 000-5 000 € neuves. Toute annonce à 500 € est une contrefaçon ou une réédition moderne repeinte.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi certaines AJ3 ont « Nike Air » et d'autres « Jumpman » au talon ?",
        answer:
          "Les AJ3 originales 1988 et certaines rééditions (2001, 2011, 2018) portent « Nike Air » au talon. Les rééditions post-2020 portent le Jumpman. Les deux sont authentiques selon date de production. Attention aux « Nike Air » OG vieillies artificiellement.",
      },
      {
        question: "La collab A Ma Maniere x AJ3 est-elle authentifiable ?",
        answer:
          "Oui, la collab A Ma Maniere vient avec packaging spécifique (boîte premium, hangtag, insoles co-brandées). La collab authentique a un prix marché 400-900 €. Les contrefaçons dépassent rarement 150-200 €.",
      },
    ],
  },
  {
    slug: "jordan-5",
    name: "Air Jordan 5",
    brandSlug: "air-jordan",
    category: "sneakers",
    priceRange: "200-700 €",
    retailYear: "1990 (rééditée en continu)",
    tagline: "La Jordan au reflective tongue et aux dents de requin",
    intro:
      "La Air Jordan 5, sortie en 1990 et inspirée des avions de chasse Mustang P-51 (dents de requin sur la midsole, silhouette aérodynamique), est reconnaissable à sa languette réfléchissante 3M, sa semelle translucide (première Jordan avec semelle glace) et ses « teeth » sur le midsole. Les coloris OG (Fire Red, Grape, Metallic, Black Metallic, Stealth) s'échangent entre 250 € et 600 €, avec les rééditions limitées (Off-White x AJ5, A Ma Maniere) atteignant 1 000-2 000 €. La AJ5 est ciblée par les contrefaçons car sa silhouette complexe (teeth, 3M, semelle glace) permet aux super-fakes d'approcher l'apparence générale. Cependant, les détails techniques résistent : la géométrie exacte des teeth, la qualité du 3M languette, la clarté de la semelle glace et le Jumpman broderie précis. Les cinq signaux ci-dessous permettent une identification rapide.",
    signals: [
      {
        title: "Teeth midsole — géométrie et alignement",
        description:
          "Les dents de requin sur le midsole authentique sont au nombre de 8 par côté, avec un angle de 35° et un espacement régulier de 8 mm. Les contrefaçons ont souvent 7 ou 9 teeth, un angle trop faible ou trop agressif, ou un espacement irrégulier.",
        difficulty: 2,
      },
      {
        title: "Languette 3M réflective — intensité flash",
        description:
          "La languette réfléchissante renvoie une lumière blanche intense au flash, uniforme. Les contrefaçons utilisent souvent un film métallisé non-3M qui renvoie une lumière grise ou un 3M partiel (bords non réfléchissants).",
        difficulty: 1,
      },
      {
        title: "Semelle translucide — clarté et pureté",
        description:
          "La semelle glace authentique est parfaitement translucide (pas jaunie dès le neuf), avec une épaisseur uniforme. Les contrefaçons ont souvent une semelle jaunâtre ou trouble, signe d'un caoutchouc bas de gamme.",
        difficulty: 2,
      },
      {
        title: "Netting latéral — mesh-leather jointure",
        description:
          "Le netting (mesh) sur le flanc authentique est finement tissé et parfaitement ajusté dans les fenêtres cuir, avec une jointure nette. Les contrefaçons ont souvent un mesh grossier ou un chevauchement visible entre mesh et cuir.",
        difficulty: 3,
      },
      {
        title: "Style Code — format 136027 + suffixe coloris",
        description:
          "Les codes AJ5 suivent 136027-101 (Grape), 136027-061 (Metallic), 136027-160 (Fire Red 2020). Vérifiez sur Nike.com. Les contrefaçons ont souvent un code inventé ou attribué à un autre coloris.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Grape 2020 Retro « neuve » à 150 €",
        description:
          "La Grape 2020 a un prix marché 200-280 €. Une annonce à 150 € avec boîte est une contrefaçon UA. Les vraies Grape 2020 sont authentifiables sur StockX.",
      },
      {
        title: "Off-White x AJ5 « Sail » à 500 €",
        description:
          "La Off-White x AJ5 Sail a un prix marché 1 200-2 500 €. Une annonce à 500 € est une contrefaçon garantie, souvent avec photos StockX volées.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi la semelle translucide de la AJ5 jaunit-elle ?",
        answer:
          "La semelle translucide est faite de caoutchouc soft-rubber qui s'oxyde aux UV et à l'air. Un jaunissement uniforme sur une paire portée est normal. Les contrefaçons jaunissent plus vite (dès 3-6 mois) à cause de caoutchouc bas de gamme.",
      },
      {
        question: "Les teeth de la AJ5 servent-ils à quelque chose fonctionnellement ?",
        answer:
          "Non, les teeth sont purement stylistiques (référence aux Mustang P-51). Ils n'affectent ni confort ni performance. Ils servent de signal d'authentification car leur géométrie exacte est difficile à reproduire correctement.",
      },
    ],
  },
  {
    slug: "jordan-6",
    name: "Air Jordan 6",
    brandSlug: "air-jordan",
    category: "sneakers",
    priceRange: "220-800 €",
    retailYear: "1991 (rééditée en continu)",
    tagline: "La Jordan du premier titre NBA de Michael Jordan",
    intro:
      "La Air Jordan 6, lancée en 1991 et portée par Michael Jordan lors de son premier titre NBA, est reconnaissable à son spoiler arrière (la languette de traction au talon), ses deux boutons de lacets circulaires sur la languette, et son profil aérodynamique inspiré de la Porsche 911. Les coloris OG (Infrared, Carmine, Maroon, Black, DMP) s'échangent entre 250 € et 700 €, avec les collaborations Travis Scott et Union atteignant 800-1 500 €. La AJ6 est une cible fréquente de contrefaçon car ses signatures (spoiler, boutons de lacets) sont immédiatement reconnaissables — ce qui la rend vendable en fake à prix moyen. Cependant, la qualité du nubuck, la courbure exacte du spoiler, la fonctionnalité des boutons de lacets et la netteté du Jumpman sur le heel tab résistent aux super-fakes. Les cinq signaux ci-dessous construisent la check-list AJ6.",
    signals: [
      {
        title: "Spoiler arrière — courbure et rigidité",
        description:
          "Le spoiler authentique a une courbure précise (angle 45°) et une rigidité ferme qui permet de tirer sur la languette pour enfiler la chaussure. Les contrefaçons ont souvent un spoiler trop mou (s'affaisse) ou trop rigide (cassant), avec un angle incorrect.",
        difficulty: 2,
      },
      {
        title: "Boutons de lacets — fonctionnalité et métal",
        description:
          "Les deux boutons de lacets sur la languette doivent être entièrement fonctionnels (bascule métal réelle pour bloquer les lacets). Les contrefaçons ont souvent des boutons purement décoratifs (non fonctionnels) ou en plastique chromé au lieu de métal brossé.",
        difficulty: 2,
      },
      {
        title: "Nubuck — texture mate et profondeur couleur",
        description:
          "Le nubuck authentique est parfaitement mat, avec une couleur profonde et uniforme. Le passage du doigt inversement crée une trace visible qui disparaît au redressement. Les contrefaçons utilisent un nubuck fin, brillant ou qui ne réagit pas au test.",
        difficulty: 3,
      },
      {
        title: "Jumpman heel tab — embossage et alignement",
        description:
          "Le Jumpman sur le heel tab est embossé en relief avec une hauteur de 1,5 mm, parfaitement centré. Les contrefaçons ont souvent un Jumpman décentré, un embossage flou, ou un Jumpman imprimé (pas en relief).",
        difficulty: 2,
      },
      {
        title: "Style Code — format 384664 / 555088 + coloris",
        description:
          "Les codes AJ6 suivent 384664-160 (Infrared), 384664-623 (Carmine), 555088-XXX pour certaines collabs. Vérifiez sur Nike.com ou StockX. Les contrefaçons utilisent souvent des codes inexistants.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Infrared 2019 « neuve » à 180 €",
        description:
          "La AJ6 Infrared 2019 retail à 200 € et son prix marché est stable à 350-500 €. Une annonce à 180 € est une contrefaçon UA.",
      },
      {
        title: "Travis Scott x AJ6 British Khaki à 400 €",
        description:
          "La collab Travis Scott x AJ6 British Khaki a un prix marché 1 000-1 800 €. Une annonce à 400 € est une contrefaçon garantie. La collab authentique vient avec packaging Cactus Jack.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi les boutons de lacets sur la AJ6 sont-ils importants à vérifier ?",
        answer:
          "Les boutons de lacets sont l'une des signatures AJ6 et Michael Jordan les utilisait pour serrer rapidement ses chaussures. Les contrefaçons négligent souvent leur fonctionnalité (boutons purement décoratifs), car reproduire le mécanisme métal fonctionnel augmente le coût de production.",
      },
      {
        question: "La collab Travis Scott AJ6 existe-t-elle en plusieurs coloris ?",
        answer:
          "Oui, Travis Scott a collaboré sur plusieurs coloris AJ6 (British Khaki, Medium Olive, Washed Denim). Chaque coloris a son code article spécifique et son packaging Cactus Jack. Vérifiez le code avant achat.",
      },
    ],
  },
  {
    slug: "jordan-12",
    name: "Air Jordan 12",
    brandSlug: "air-jordan",
    category: "sneakers",
    priceRange: "200-600 €",
    retailYear: "1996 (rééditée en continu)",
    tagline: "La Jordan du « Flu Game » avec rising sun japonais",
    intro:
      "La Air Jordan 12, sortie en 1996 et portée par Michael Jordan lors du mythique « Flu Game » des NBA Finals 1997 (performance malade à 38 points), est reconnaissable à son upper en cuir lux avec motif « rising sun » japonais, sa semelle Zoom Air et sa broderie « TWO 3 » sur le talon. Les coloris OG (Flu Game, Taxi, Playoffs, Cherry, Playoffs Reverse) s'échangent entre 250 € et 500 €. La AJ12 est moins contrefaite que la AJ1, 3 ou 4 à cause de sa silhouette plus complexe (pattern rising sun + Zoom Air + cuir lourd), mais les UA batches existent. Les cinq signaux ci-dessous distinguent l'authentique : cuir qualité, rising sun pattern exact, Zoom Air technologie, broderie « TWO 3 » et Style Code.",
    signals: [
      {
        title: "Cuir lux — épaisseur et lourdeur",
        description:
          "Le cuir AJ12 authentique est épais (2,5 mm) et lourd, ce qui donne à la chaussure son poids caractéristique de 580 g par pied en 42. Les contrefaçons utilisent un cuir fin qui rend la chaussure plus légère (450-500 g) et trahit immédiatement.",
        difficulty: 2,
      },
      {
        title: "Rising sun pattern — alignement exact",
        description:
          "Le pattern « rising sun » sur les overlays a 12 rayons exactement, partant du point central. Les contrefaçons ont souvent 10, 11 ou 13 rayons, ou un point central décalé.",
        difficulty: 2,
      },
      {
        title: "Zoom Air — fermeté et rebond",
        description:
          "La technologie Zoom Air dans le midsole offre une cushion ferme avec rebond immédiat. Les contrefaçons utilisent de l'EVA basique qui s'écrase, créant une sensation molle et durable.",
        difficulty: 3,
      },
      {
        title: "Broderie TWO 3 — talon, police et relief",
        description:
          "La broderie « TWO 3 » sur le talon est en relief 1 mm, police bold avec tracking précis. Les contrefaçons ont souvent une broderie plate, une police incorrecte (trop fine) ou un tracking trop serré.",
        difficulty: 2,
      },
      {
        title: "Style Code — format 130690 + coloris",
        description:
          "Les codes AJ12 suivent 130690-016 (Flu Game), 130690-125 (Taxi), 130690-001 (Playoffs), etc. Vérifiez sur Nike.com. Les contrefaçons utilisent souvent des codes inventés.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "Flu Game 2016 « neuve » à 150 €",
        description:
          "La Flu Game 2016 a un prix marché 300-450 €. Une annonce à 150 € est une contrefaçon UA avec photos StockX souvent volées.",
      },
      {
        title: "AJ12 OG 1996 « rare » à 400 €",
        description:
          "Les AJ12 OG 1996 ont un prix minimum 1 500 € deadstock. Toute annonce à 400 € prétendant être une OG 1996 est une contrefaçon ou une réédition repeinte vieillie.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi la AJ12 est-elle si lourde par rapport aux autres Jordan ?",
        answer:
          "Le cuir épais et la technologie Zoom Air ajoutent du poids. Une AJ12 authentique pèse 550-600 g par pied en 42. Les contrefaçons pèsent 450-500 g car elles utilisent du cuir synthétique fin et de l'EVA à la place du Zoom Air.",
      },
      {
        question: "La Flu Game 2016 vaut-elle moins que l'OG 1997 ?",
        answer:
          "Oui largement. L'OG 1997 vaut 1 500-3 000 € deadstock (rareté + aura Flu Game original), tandis que la rédition 2016 vaut 300-450 € deadstock. Les contrefaçons ne peuvent pas reproduire les détails OG 1997 correctement.",
      },
    ],
  },
  {
    slug: "jordan-13",
    name: "Air Jordan 13",
    brandSlug: "air-jordan",
    category: "sneakers",
    priceRange: "200-500 €",
    retailYear: "1997 (rééditée en continu)",
    tagline: "La Jordan au holographic pendant inspirée des panthères",
    intro:
      "La Air Jordan 13, créée en 1997 pour la dernière saison de Michael Jordan aux Bulls (avant son premier retour), est inspirée des mouvements de la panthère noire, incarnée par la « holographic cat eye » (pendentif latéral holographique) et la semelle en « paw print » (empreinte de patte). Les coloris OG (He Got Game, Bred, Flint, Chutney) s'échangent entre 220 € et 400 €, avec les DMP Pack (Defining Moments Pack) atteignant 600-1 000 €. La AJ13 est moins contrefaite que les AJ1/3/4/11 mais les UA batches existent, exploitant la signature holographic pendant qui n'est pas parfaite sur les fakes. Les cinq signaux ci-dessous : hologramme pendant, cuir-suède combo, semelle paw print, soft-rubber midsole et Style Code.",
    signals: [
      {
        title: "Hologramme pendant — reflets multicolores",
        description:
          "Le pendentif latéral authentique est un hologramme avec reflets multicolores (bleu-vert-rose) qui changent selon l'angle. Les contrefaçons utilisent souvent un sticker métallisé fixe sans effet holographique, ou un hologramme basique 2 couleurs.",
        difficulty: 1,
      },
      {
        title: "Cuir-suède combo — jointures et qualité",
        description:
          "La AJ13 combine cuir (overlays) et suède (flanc) avec des jointures parfaitement nettes. Les contrefaçons ont souvent un suède qui déborde sur le cuir ou vice-versa, avec des surplus de colle.",
        difficulty: 2,
      },
      {
        title: "Semelle paw print — empreintes alignées",
        description:
          "La semelle présente 5 empreintes de patte (paw print) alignées sur la zone avant-pied, avec une profondeur de 3 mm. Les contrefaçons ont souvent 4 ou 6 empreintes, ou une profondeur insuffisante.",
        difficulty: 2,
      },
      {
        title: "Soft-rubber midsole — flexibilité et rebond",
        description:
          "Le midsole soft-rubber authentique est flexible et revient immédiatement à sa forme. Les contrefaçons utilisent de l'EVA qui s'écrase durablement sous pression.",
        difficulty: 3,
      },
      {
        title: "Style Code — format 414571 / 136064 + coloris",
        description:
          "Les codes AJ13 suivent 414571-020 (Flint), 414571-104 (He Got Game), etc. Vérifiez sur Nike.com. Les contrefaçons utilisent souvent des codes AJ5 ou AJ12 recyclés.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "He Got Game Retro « neuve » à 140 €",
        description:
          "La He Got Game Retro a un prix marché 220-320 €. Une annonce à 140 € est une contrefaçon UA.",
      },
      {
        title: "DMP Pack « complet » à 500 €",
        description:
          "Le DMP Pack (Defining Moments Pack) AJ13+AJ6 a un prix marché 1 200-1 800 € complet. Une annonce à 500 € est une contrefaçon ou un pack incomplet.",
      },
    ],
    faqs: [
      {
        question: "Pourquoi l'hologramme de la AJ13 est-il si difficile à contrefaire ?",
        answer:
          "L'hologramme authentique utilise une technologie optique complexe (film diffractif) avec effets multicolores selon l'angle. Les contrefaçons utilisent des stickers métallisés basiques qui ne reproduisent pas l'effet multicolore. C'est l'un des signaux les plus rapides à vérifier.",
      },
      {
        question: "La AJ13 taille-t-elle normalement ?",
        answer:
          "La AJ13 taille fidèlement. Prenez votre pointure habituelle. Les contrefaçons peuvent avoir une cambrure différente qui fausse la taille, ajoutant un indice supplémentaire.",
      },
    ],
  },
  {
    slug: "jordan-travis-scott",
    name: "Air Jordan x Travis Scott",
    brandSlug: "air-jordan",
    category: "sneakers",
    priceRange: "700-3 500 €",
    retailYear: "2017 (collabs récurrentes)",
    tagline: "La collab Cactus Jack la plus recherchée du resell",
    intro:
      "Les collaborations Travis Scott x Air Jordan, lancées en 2017 avec la AJ4 Olive et poursuivies sur AJ1 (Mocha, Fragment, Reverse Mocha, British Khaki), AJ6 (British Khaki, Medium Olive, Washed Denim), AJ4 (Purple, Cactus Jack Khaki), représentent l'une des séries de collabs les plus recherchées du resell : prix marché 800 € à 3 500 € selon rareté et taille. La AJ1 Mocha a atteint 1 500-2 500 € en taille PC, la AJ1 Fragment 2 000-4 000 €. Cette prime extrême attire les contrefacteurs professionnels qui ont massivement investi dans les super-fakes Travis Scott — certains UA batches coûtent 300-400 € à produire pour tromper des acheteurs inexpérimentés. Les cinq signaux ci-dessous regroupent les points les plus résistants aux super-fakes : logo Cactus Jack inversé, qualité du nubuck/suède, boîte brown Cactus Jack, hangtag signé Travis, et Style Code.",
    signals: [
      {
        title: "Logo Cactus Jack inversé — précision typographique",
        description:
          "Les collabs Travis Scott utilisent un swoosh Nike inversé (sur AJ1) ou un logo Cactus Jack brodé spécifique. La géométrie exacte du logo et l'alignement doivent être parfaits. Les contrefaçons ont souvent un logo légèrement décalé ou une broderie Cactus Jack imprécise.",
        difficulty: 1,
      },
      {
        title: "Nubuck/suède — texture premium",
        description:
          "Les Travis Scott utilisent du nubuck ou suède premium selon colorway. La texture est mate, veloutée, et réagit au test du doigt inversé. Les contrefaçons utilisent des matériaux fins et brillants qui manquent de profondeur.",
        difficulty: 3,
      },
      {
        title: "Boîte brown Cactus Jack — carton et impression",
        description:
          "La boîte authentique est en carton kraft brown avec impression Cactus Jack HD sur le côté et le dessus. Les contrefaçons ont souvent un carton plus fin, une impression floue ou des couleurs délavées.",
        difficulty: 2,
      },
      {
        title: "Hangtag Cactus Jack — signature + logos",
        description:
          "Le hangtag inclut la signature Travis Scott, le logo Cactus Jack, et parfois un sticker smiley. Les contrefaçons ont souvent un hangtag simplifié, sans signature, ou avec un logo Cactus Jack imprimé basse qualité.",
        difficulty: 2,
      },
      {
        title: "Style Code + receipt SNKRS",
        description:
          "Chaque collab a un Style Code spécifique (CD4487-100 pour AJ1 Mocha, etc.). Exigez une receipt SNKRS originale pour les collabs. Les contrefaçons utilisent parfois des codes OG Jordan au lieu des codes collab.",
        difficulty: 1,
      },
    ],
    scams: [
      {
        title: "AJ1 Mocha « neuve » à 400 €",
        description:
          "La AJ1 Mocha a un prix marché stable 1 500-2 500 € neuve. Toute annonce sous 800 € est une contrefaçon UA, souvent avec photos StockX volées et receipt SNKRS falsifiée.",
      },
      {
        title: "AJ1 Fragment x Travis Scott à 800 €",
        description:
          "La AJ1 Fragment x Travis Scott a un prix marché 2 000-4 000 €. Une annonce à 800 € est une contrefaçon garantie. Même les UA premium ne s'approchent pas de ce niveau de détail pour moins de 300 € de coût de production.",
      },
    ],
    faqs: [
      {
        question: "Toutes les collabs Travis Scott sont-elles aussi rares ?",
        answer:
          "Non. La AJ1 Mocha et AJ1 Fragment sont les plus rares (2 000 € et +). Les AJ6 British Khaki et AJ4 Cactus Jack se négocient 800-1 200 €. Les rééditions et coloris moins recherchés (AJ4 Purple) tournent autour de 500-700 €. Le prix reflète la rareté de production.",
      },
      {
        question: "Comment authentifier la receipt SNKRS pour une Travis Scott ?",
        answer:
          "La receipt SNKRS authentique est un email Nike avec order number au format ORD-XXXXXXX et lien vers ta commande sur nike.com. Les contrefacteurs envoient des captures d'écran ou PDFs faciles à modifier. Exigez un screenshot live de la commande dans l'app SNKRS, pas une image statique.",
      },
    ],
  },
];
