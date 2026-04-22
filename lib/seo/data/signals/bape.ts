import type { GuideSignal } from "../../guide-types";

export const bapeSignals: GuideSignal[] = [
  {
    slug: "camo-pattern",
    name: "1st Camo ABC (motif camouflage signature)",
    brandSlug: "bape",
    category: "clothing",
    tagline:
      "Analyser le 1st Camo BAPE : teintes Pantone, alignement, netteté d'impression",
    intro:
      "Le 1st Camo — ou ABC Camo — est le motif camouflage signature de A Bathing Ape depuis 2000, créé par Nigo et reconnaissable à ses formes organiques arrondies qui cachent subtilement le visage simiesque de la marque (« Ape Head »). C'est l'élément visuel le plus copié et, paradoxalement, l'un des plus faciles à authentifier quand on connaît les références. Sur une pièce d'origine (hoodie Shark, tee, short), le camo utilise cinq teintes exactes selon la variante : pour le Green Camo classique, vert olive Pantone 5815C, vert foncé 5605C, beige sable 464C, marron foncé 462C, et noir Black 6C. Les formes du camo s'emboîtent selon un pattern répété tous les 55-60 cm sur la largeur du vêtement. L'impression est réalisée par sérigraphie rotative chez NOWHERE Co. (société mère de BAPE), avec une pénétration d'encre de 0,2 mm dans le textile et une netteté de contour parfaite (pas de bavure d'encre entre les zones de couleur). Les Ape Heads cachés dans le motif (4-6 par pièce selon taille) sont visibles au zoom x5 et font toujours 2,5×2 cm exactement — leur présence est obligatoire sur tout 1st Camo d'origine. Les contrefaçons trahissent plusieurs défauts : teintes décalées (olive trop jaune ou trop vert, beige trop blanc), absence ou déformation des Ape Heads cachés, bavures d'encre entre zones de couleur (impression digitale bas de gamme au lieu de sérigraphie), pattern de répétition incorrect (40 cm ou 70 cm au lieu de 55-60). Ce signal, en première inspection, écarte 75 % des fakes.",
    steps: [
      {
        title: "Photographier le camo à plat sous lumière neutre",
        description:
          "Posez le vêtement à plat, éclairage LED 5000K. Photographiez une zone de 30×30 cm du motif, perpendiculairement, pour capturer le pattern et les Ape Heads cachés.",
      },
      {
        title: "Identifier les 5 teintes du Green Camo",
        description:
          "Green Camo classique : vert olive 5815C, vert foncé 5605C, beige sable 464C, marron foncé 462C, noir Black 6C. Utilisez l'app Pantone Connect pour valider. Un écart de plus de 2 références Pantone sur une teinte est un signal.",
      },
      {
        title: "Chercher les Ape Heads cachés (2,5×2 cm)",
        description:
          "Au zoom x5, 4 à 6 têtes de singe BAPE sont cachées dans les formes du camo, dissimulées dans les zones foncées. Leur absence totale est éliminatoire — le 1st Camo les contient systématiquement depuis 2000.",
      },
      {
        title: "Mesurer le pattern de répétition (55-60 cm)",
        description:
          "Le motif se répète tous les 55-60 cm sur la largeur. Prenez un point de référence (une forme distinctive du camo), mesurez jusqu'à sa prochaine occurrence identique. Un pattern de 40 ou 70 cm est un signal fort.",
      },
      {
        title: "Contrôler la netteté d'impression au zoom ×10",
        description:
          "Les contours entre les zones de couleur doivent être nets, sans bavure d'encre. Une transition floue de 0,3-0,5 mm est typique des impressions digitales bas de gamme (fakes) au lieu de la sérigraphie rotative officielle.",
      },
    ],
    commonErrors: [
      {
        title: "Ignorer les Ape Heads cachés",
        description:
          "C'est le détail le plus discriminant. Sans Ape Heads au zoom x5, la pièce est une contrefaçon, quelle que soit la qualité apparente du camo à 2 m. Les faussaires bas de gamme ne les reproduisent pas.",
      },
      {
        title: "Confondre variantes Green/Purple/Blue/Desert",
        description:
          "BAPE décline le 1st Camo en Green (standard), Purple (plus foncé), Blue (2005+), Desert (beige dominant). Chaque variante a ses 5 Pantones spécifiques. Ne comparez pas un Green Camo aux teintes d'un Purple — chacun a sa palette.",
      },
      {
        title: "Accepter une bavure d'encre comme « texture artistique »",
        description:
          "BAPE ne bavure jamais. La sérigraphie rotative officielle produit des contours nets. Une bavure de 0,3-0,5 mm est toujours un défaut d'impression de contrefaçon, pas une « variation de production ».",
      },
    ],
    counterfeiterTactics:
      "Les faussaires reproduisent le pattern général du camo (formes, 5 couleurs dominantes), mais butent sur trois points. Premier : les Ape Heads cachés — les fakes bas de gamme les omettent totalement, les super-fakes les reproduisent mais mal dimensionnés (3×2,5 cm au lieu de 2,5×2). Deuxième : les teintes Pantone — ils utilisent souvent des olives génériques (5825C, 5757C) au lieu du 5815C officiel, détectable à l'app Pantone Connect. Troisième : l'impression — ils utilisent le DTG (Direct-to-Garment) digital bas de gamme plutôt que la sérigraphie rotative, créant des bavures aux transitions de couleurs. Un zoom x10 sur une bordure de forme du camo révèle immédiatement le type d'impression utilisé.",
    faqs: [
      {
        question:
          "Combien d'Ape Heads cachés sont présents sur un hoodie BAPE 1st Camo d'origine ?",
        answer:
          "De 4 à 6 Ape Heads selon la taille et la pièce. Un tee M : 4 têtes (2 devant, 2 derrière). Un hoodie L : 5 têtes (2 devant, 2 derrière, 1 sur la capuche). Un short M : 3 têtes (1 devant droit, 1 devant gauche, 1 derrière). Les positions exactes varient légèrement entre drops, mais la présence est systématique. Zéro Ape Head = contrefaçon, quelle que soit la qualité du motif. 8+ Ape Heads = également suspect (défaut de gabarit répété trop souvent).",
      },
      {
        question: "Comment distinguer BAPE (A Bathing Ape) et AAPE by A Bathing Ape ?",
        answer:
          "BAPE est la ligne premium originale, prix 200-600 € pour un hoodie, production japonaise historique (maintenant aussi Portugal/Chine via NOWHERE). AAPE (A Ape Premium Exploration) est la ligne accessible, prix 80-200 €, cible plus jeune, avec un logo « AAPE » distinct et un camo légèrement différent. Les deux sont officiels, mais une pièce affichant le logo BAPE classique alors qu'elle est vendue au prix d'un AAPE (80-150 €) est suspecte — soit une contrefaçon, soit un mélange frauduleux. Vérifiez toujours la cohérence prix ↔ ligne ↔ logo avant l'achat.",
      },
    ],
  },
  {
    slug: "wgm-broderie",
    name: "WGM broderie dos (Shark Hoodie)",
    brandSlug: "bape",
    category: "clothing",
    tagline:
      "Vérifier la broderie WGM du Shark Hoodie : police, densité, positionnement",
    intro:
      "Le WGM — « World Gone Mad » — est l'acronyme brodé au dos du Shark Hoodie BAPE, la pièce la plus iconique et la plus contrefaite de la marque depuis 2005. Les trois lettres en majuscules forment un trident visuel positionné entre les omoplates, et leur réalisation technique est un signal d'authentification majeur. Sur un Shark Hoodie d'origine, le WGM mesure 25×8 cm (tolérance ± 5 mm), est brodé en fil de coton mercerisé avec 1 800 à 2 200 points, utilise la police BAPE Custom Sans Serif (une variante exclusive dérivée de la Futura Bold), et la couleur du fil varie selon la version : blanc pour Shark Hoodie noir ou marine, noir pour Shark Hoodie blanc ou beige, rouge pour Shark Hoodie camo rouge, jaune pour camo jaune. Le positionnement est précis : le centre du W se trouve à 18 cm sous la couture du col, et l'axe vertical du motif est strictement aligné avec l'axe vertical du dos (test à la règle). Chaque lettre mesure 7×8 cm exactement (tolérance ± 2 mm). Les contrefaçons trahissent plusieurs défauts : dimensions incorrectes (30×10 cm trop grand, 20×6 cm trop petit), positionnement désaxé par rapport au centre du dos (décalage latéral de 1-2 cm visible), broderie lacunaire laissant apparaître le textile, fil synthétique polyester brillant au lieu de coton mat, ou — détail typique — lettres de dimensions inégales entre elles (W plus grand que M, etc.). Ce signal, combiné au 1st Camo, résout 85 % des cas douteux sur Shark Hoodies.",
    steps: [
      {
        title: "Photographier le dos du Shark Hoodie à plat",
        description:
          "Posez le hoodie à plat, dos visible. Éclairage neutre LED 5000K. Photographiez perpendiculairement à 50 cm de distance pour capturer l'intégralité du WGM et son environnement.",
      },
      {
        title: "Mesurer les dimensions 25×8 cm du WGM",
        description:
          "Longueur totale (W à M) : 25 cm ± 5 mm. Hauteur (haut à bas des lettres) : 8 cm ± 3 mm. Une déviation de plus de 5 mm sur la longueur est un signal fort. Chaque lettre fait 7×8 cm.",
      },
      {
        title: "Vérifier le positionnement (18 cm sous le col, centré)",
        description:
          "Le centre du W est à 18 cm sous la couture du col, sur l'axe vertical exact du dos (distance identique entre W et couture latérale gauche / M et couture latérale droite). Un décalage de 1-2 cm est un signal.",
      },
      {
        title: "Compter la densité de broderie (1 800-2 200 points)",
        description:
          "Au zoom x10, aucune zone textile ne doit transparaître entre les points. Une broderie lacunaire (coton visible sous les fils) indique un atelier bas de gamme avec broderie économique.",
      },
      {
        title: "Tester la nature du fil (coton mat vs polyester brillant)",
        description:
          "Au flash direct, un fil de coton mercerisé reste mat. Un fil polyester brille de manière caractéristique. BAPE utilise systématiquement du coton mercerisé — le polyester brillant est un signal fort.",
      },
    ],
    commonErrors: [
      {
        title:
          "Comparer un Shark Hoodie 2010 à un 2023 sans tenir compte des variations",
        description:
          "Les dimensions et la densité du WGM ont légèrement évolué entre 2005 et 2023. Un WGM 2010 peut mesurer 24×7,5 cm, un 2023 25×8. Comparez toujours au même drop, pas à une autre année.",
      },
      {
        title: "Ignorer l'alignement vertical du W-G-M",
        description:
          "Les 3 lettres doivent former une ligne horizontale parfaite (axe supérieur aligné). Une lettre plus haute ou plus basse que les deux autres est un défaut de gabarit typique des fakes.",
      },
      {
        title: "Accepter un fil polyester comme « variation matière »",
        description:
          "BAPE n'utilise pas de fil polyester pour sa broderie WGM — c'est toujours du coton mercerisé. Un fil brillant au flash est éliminatoire, pas une variation acceptable.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires reproduisent les 3 lettres WGM correctement dans 70 % des cas — c'est une broderie simple techniquement. Ils butent sur : les dimensions précises (25×8 cm, souvent 27×9 ou 23×7 dans les fakes), la position verticale (18 cm sous col, souvent 16 ou 20 cm), et surtout la nature du fil (polyester au lieu de coton mercerisé, détectable au flash). Les super-fakes 2024 maîtrisent les dimensions mais gardent le fil polyester par économie — test du flash immédiat. Une autre tactique consiste à broder un WGM sur un hoodie de qualité moyenne puis l'appliquer comme patch thermocollé — dans ce cas, soulevez légèrement le bord du W avec un cure-dents : s'il n'est pas solidaire du textile, c'est une supercherie.",
    faqs: [
      {
        question:
          "Pourquoi « WGM » et que signifie exactement « World Gone Mad » ?",
        answer:
          "WGM est un acronyme créé par Nigo (fondateur de BAPE) au milieu des années 2000, probablement inspiré par l'esthétique punk et l'esprit streetwear post-9/11 — « World Gone Mad » (« le monde est devenu fou ») reflète l'atmosphère culturelle de l'époque. L'acronyme est devenu une signature graphique reconnaissable du Shark Hoodie (et de quelques autres pièces comme certains pantalons WGM Camo). Il n'a jamais été formellement expliqué par Nigo ou BAPE — sa signification reste ouverte à interprétation, ce qui contribue à son aura. Toutes les pièces BAPE ne portent pas de WGM : c'est spécifique au Shark Hoodie et à quelques collabs/drops WGM Camo.",
      },
      {
        question:
          "Le WGM peut-il manquer sur un Shark Hoodie d'origine (modèle sans broderie) ?",
        answer:
          "Non. Le Shark Hoodie porte toujours le WGM au dos depuis sa création en 2005 — c'est une caractéristique définissante du modèle. Un « Shark Hoodie sans WGM » n'existe pas dans la production officielle BAPE. Si vous voyez un hoodie avec la gueule de requin zippée caractéristique mais sans WGM brodé au dos, c'est soit une contrefaçon, soit une pièce non-BAPE qui utilise un design similaire (AAPE a parfois des variantes Shark sans WGM). Vérifiez systématiquement la présence et les dimensions du WGM comme signal obligatoire.",
      },
    ],
  },
  {
    slug: "zip-ykk",
    name: "Zip YKK ou Riri gravé BAPE",
    brandSlug: "bape",
    category: "clothing",
    tagline:
      "Contrôler le zip BAPE : marquage YKK ou Riri, gravure dents, curseur",
    intro:
      "Les zippers sur les pièces BAPE — notamment sur le Shark Hoodie (zip central complet qui remonte sur le visage) et les sweats zippés — sont un signal d'authentification précieux car ils nécessitent un équipement industriel coûteux pour être reproduits correctement. Sur une pièce d'origine, BAPE utilise exclusivement deux fournisseurs : YKK (japonais, majorité de la production) pour 85 % des pièces, et Riri (suisse, haut de gamme) pour les capsules premium et collabs luxe. Les zips YKK BAPE sont au format 5# (pour sweats et hoodies) ou 3# (pour poches), avec un marquage « YKK » gravé en creux sur chaque dent du côté intérieur du zip (visible en dézippant puis en retournant), un curseur en alliage chromé poli portant l'inscription « BAPE » gravée sur la patte (face externe), et une bande textile latérale de 2 cm imprimée « A BATHING APE » en Helvetica Bold capitales. Les zips Riri portent le marquage « Riri » sur les dents et « BAPE » sur le curseur, avec une finition laiton doré plutôt que chromé. Les contrefaçons trahissent plusieurs défauts : dents lisses sans gravure (test à la loupe immédiat), curseur marqué « BAPE » en impression de surface au lieu de gravure en creux (test à l'ongle), bande textile latérale absente ou avec typographie Arial au lieu d'Helvetica, ou — détail fréquent — un marquage « YKK » sur les dents externes visible immédiatement au lieu d'être gravé à l'intérieur (BAPE commande à YKK un marquage intérieur pour éviter la contrefaçon du zip entier). Ce signal discrimine 60 % des fakes bas de gamme.",
    steps: [
      {
        title: "Dézipper à 50 % et photographier la bande externe",
        description:
          "Descendez le zip à mi-course. La bande textile latérale de 2 cm est visible. Elle doit porter l'inscription « A BATHING APE » en Helvetica Bold capitales, espacée régulièrement.",
      },
      {
        title: "Retourner le zip pour voir la gravure YKK intérieure",
        description:
          "Sur le côté intérieur de chaque dent (invisible zip fermé), un marquage « YKK » est gravé en creux. Utilisez une loupe ×5 pour le lire. Absence = signal fort. Marquage YKK visible côté externe = signal fort (BAPE commande intérieur).",
      },
      {
        title: "Tester la gravure « BAPE » du curseur à l'ongle",
        description:
          "La patte du curseur porte l'inscription « BAPE » en capitales Helvetica. Passez l'ongle dessus : vous devez sentir un creux de 0,3 mm. Surface lisse = impression = contrefaçon.",
      },
      {
        title: "Vérifier le format du zip (5# ou 3#)",
        description:
          "Hoodies et sweats zippés : YKK 5# (5 mm de largeur dent). Poches et détails : YKK 3# (3 mm). Le format est parfois imprimé en petit sur la patte du curseur. Un format non standard (4# ou 7#) est un signal.",
      },
      {
        title: "Pour les pièces Riri, vérifier la finition laiton doré",
        description:
          "Riri (pièces premium/collab luxe) : finition laiton doré sur toute la mécanique. Un laiton chromé ou argenté sur une pièce supposée Riri est un signal fort — Riri utilise uniquement du doré.",
      },
    ],
    commonErrors: [
      {
        title: "Supposer qu'un zip YKK visible externe = authentique",
        description:
          "Un « YKK » marqué en gros sur le côté extérieur du zip est plutôt un signal fake — BAPE commande à YKK un marquage intérieur pour cette raison. Les faussaires utilisent des zips YKK standards achetés au détail.",
      },
      {
        title: "Ignorer la bande textile latérale « A BATHING APE »",
        description:
          "Cette bande est imprimée sur toute la longueur du zip (souvent 50-60 cm sur un Shark Hoodie). Son absence, ou le remplacement par une bande unie, est éliminatoire.",
      },
      {
        title: "Ne pas tester la gravure à l'ongle sur le curseur",
        description:
          "L'impression de surface sur le curseur (lisse au toucher) est typique des fakes bas de gamme. Le test à l'ongle prend 3 secondes et tranche 30 % des cas.",
      },
    ],
    counterfeiterTactics:
      "Trois niveaux de contrefaçon sur les zips. Niveau 1 (fakes bas de gamme, 60 %) : zips chinois génériques sans gravure YKK et avec « BAPE » imprimé en surface sur le curseur. Niveau 2 (fakes moyens, 30 %) : zips YKK standards (marquage YKK externe visible) + patte personnalisée mal gravée. Niveau 3 (super-fakes, 10 %) : zips YKK commandés avec gravure intérieure + curseur gravé correctement, mais bande textile latérale imprimée en Arial au lieu d'Helvetica. Aucun de ces niveaux ne reproduit parfaitement la chaîne d'approvisionnement BAPE (YKK + personnalisation intérieure). Pour les pièces Riri, les contrefaçons sont quasi inexistantes — Riri ne vend qu'aux maisons officielles.",
    faqs: [
      {
        question:
          "Comment savoir si une pièce BAPE utilise du YKK ou du Riri ?",
        answer:
          "Le standard BAPE est YKK pour 85 % des pièces. Riri est réservé aux capsules premium et collabs luxe (BAPE x COMME des GARÇONS, BAPE x Undercover, certains drops anniversaires). Pour vérifier : YKK a une finition chromée / gris-acier, Riri une finition laiton doré. La mention est visible sur la patte du curseur ou sur l'étiquette produit d'origine (photo StockX du drop). Si une pièce « standard » (hoodie classique, tee zippé) est annoncée en Riri à un prix modeste (100-200 €), c'est suspect — Riri ajoute 40-80 € au coût de production, donc 100-150 € au retail minimum.",
      },
      {
        question: "Le zip peut-il être remplacé en SAV sur une pièce BAPE d'origine ?",
        answer:
          "Oui, mais uniquement chez les boutiques BAPE officielles à Tokyo, New York ou Paris (NOWHERE retail). Un zip remplacé en SAV officiel conserve les spécifications YKK ou Riri selon la pièce d'origine, avec les gravures et la bande textile. Si vous achetez une pièce en seconde main avec un zip qui semble « neuf » sur un vêtement usé, c'est potentiellement un SAV officiel (demandez la facture). Méfiez-vous en revanche d'un zip remplacé chez un couturier local : souvent un zip générique sans gravure BAPE, ce qui transforme une pièce d'origine en « pièce rapiécée » peu revendable — et rend l'authentification via zip inutilisable.",
      },
    ],
  },
  {
    slug: "tags-dores",
    name: "Tags dorés (hangtags en papier doré)",
    brandSlug: "bape",
    category: "clothing",
    tagline:
      "Lire les tags BAPE : papier doré, impression embossée, numéro de référence",
    intro:
      "Les tags suspendus au vêtement BAPE à l'achat — deux étiquettes en papier doré reliées par un cordon noir — sont un signal d'authentification puissant pour les pièces « deadstock » (jamais portées, tags toujours attachés). Sur une pièce d'origine, le tag principal est un rectangle de papier cartonné doré métallisé (finition embossée type foil doré chaud), format 6×10 cm, portant au recto le logo « A BATHING APE » en capitales Helvetica Bold noir, l'Ape Head central embossé en relief, le nom du modèle, le prix retail en yen japonais (JPY) ou en USD/EUR selon marché, un numéro de référence à 10-12 chiffres en bas à droite, et un code-barre EAN-13. Le verso porte l'adresse du siège NOWHERE Co. à Shibuya (Tokyo), les mentions légales en japonais et anglais, et le copyright « © NIGO × BAPE ». Le tag secondaire (plus petit, 3×5 cm) porte la taille et la couleur. La finition dorée est obtenue par embossage à chaud (gold foil stamping), perceptible à l'ongle comme une surface légèrement rugueuse et chaude. Les contrefaçons trahissent plusieurs défauts : finition dorée imprimée en surface (plane au toucher) au lieu d'embossée, papier trop fin (bristol 200 g/m² au lieu du carton 350 g/m² officiel), Ape Head imprimé plat au lieu d'embossé en relief, absence de numéro de référence ou numéro incohérent avec la base de données BAPE/StockX, code-barre qui ne scanne pas, ou adresse du siège incorrecte (« Tokyo, Japan » générique au lieu de « 4-28-23 Jingumae, Shibuya-ku, Tokyo »). Ce signal résout 70 % des cas sur pièces deadstock.",
    steps: [
      {
        title: "Photographier les deux tags avant découpage",
        description:
          "Avant de couper le cordon, photographiez le tag principal (recto + verso) et le tag secondaire. Éclairage neutre, distance 15 cm, sans flash direct (qui sature la finition dorée).",
      },
      {
        title: "Tester l'embossage doré à l'ongle",
        description:
          "Passez l'ongle sur la surface dorée. Vous devez sentir un léger relief (embossage chaud à 0,1-0,2 mm) et une texture légèrement rugueuse. Une surface parfaitement lisse est une impression dorée simple, signal de contrefaçon.",
      },
      {
        title: "Vérifier l'Ape Head en relief central",
        description:
          "L'Ape Head au centre du tag principal doit être embossé en relief (0,3-0,5 mm de relief). Un Ape Head plat est un signal très fort. Test tactile immédiat.",
      },
      {
        title: "Contrôler l'adresse NOWHERE Co. au verso",
        description:
          "L'adresse officielle complète est « 4-28-23 Jingumae, Shibuya-ku, Tokyo, Japan » ou une variante précise selon l'année. Une adresse générique « Tokyo, Japan » sans numéro de rue est un signal fort.",
      },
      {
        title: "Scanner le code-barre EAN-13 et vérifier le numéro de référence",
        description:
          "Le code-barre doit être valide EAN-13 (scan réussi sur app Barcode). Le numéro de référence à 10-12 chiffres doit correspondre à une fiche produit sur stockx.com ou bapeonline.com archive.",
      },
    ],
    commonErrors: [
      {
        title: "Jeter les tags dès le déballage",
        description:
          "Une pièce BAPE deadstock avec tags vaut 15-25 % plus cher en revente qu'une pièce sans. Photographiez-les, vérifiez-les, puis coupez — mais conservez-les dans le sac d'origine.",
      },
      {
        title: "Confondre finition dorée embossée et finition dorée imprimée",
        description:
          "C'est le test le plus rapide — l'embossage chaud est tactile, l'impression est plate. Les fakes bas de gamme impriment le doré au jet d'encre métallique, qui reste parfaitement lisse. Test à l'ongle en 5 secondes.",
      },
      {
        title: "Ignorer l'adresse NOWHERE Co. au verso",
        description:
          "L'adresse précise à Jingumae-Shibuya est rarement reproduite correctement par les faussaires — soit absente, soit remplacée par une adresse fictive, soit simplement « Tokyo, Japan ». C'est un piège diagnostique puissant.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires reproduisent le format général du tag et le logo BAPE, mais butent sur trois points. Premier : la finition — ils impriment le doré au jet d'encre métallique au lieu de l'embosser à chaud. Résultat : surface lisse au toucher. Deuxième : l'Ape Head — ils le reproduisent plat au lieu d'en relief. Troisième : l'adresse NOWHERE Co. — ils la généralisent (« Tokyo ») ou l'omettent. Les super-fakes 2024 maîtrisent l'embossage mais gardent un papier trop fin (250 g/m² au lieu de 350) — test tactile du cartonné. Une autre tactique : joindre de vrais tags récupérés sur des pièces officielles déstockées à un faux vêtement — dans ce cas, le cordon de fixation est refait à la main et montre 2 nœuds au lieu d'un nœud industriel unique.",
    faqs: [
      {
        question:
          "Pourquoi BAPE utilise-t-il un tag doré et pas un tag classique ?",
        answer:
          "Le tag doré fait partie de l'identité visuelle luxe-streetwear revendiquée par Nigo depuis les débuts de BAPE en 1993. Nigo voulait positionner la marque comme un streetwear premium, au croisement de la culture hip-hop américaine et du luxe japonais — d'où l'or comme codes visuels. La finition embossée à chaud est coûteuse (20-30 yen par tag contre 2-5 pour un tag imprimé simple), ce qui explique pourquoi les contrefacteurs l'évitent et impriment en surface. C'est un choix de production premium délibéré, pas un gadget marketing.",
      },
      {
        question:
          "Les tags BAPE incluent-ils toujours un QR code moderne ?",
        answer:
          "Depuis 2020 environ, BAPE ajoute un QR code sur les tags principaux qui renvoie vers bapeonline.com avec la fiche produit spécifique. Les pièces antérieures à 2020 n'en ont pas — leur authentification passe uniquement par le code-barre EAN-13 et le numéro de référence. Un tag « vintage 2018 » avec QR code est suspect. Un tag « 2023 » sans QR code est également suspect. Vérifiez la cohérence année de drop ↔ présence/absence du QR code. Le QR scanné doit renvoyer au modèle exact (nom, colorway, taille) — un QR qui scanne vers une page générique bapeonline.com sans fiche produit précise est un signal fort.",
      },
    ],
  },
];
