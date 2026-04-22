import type { GuideSignal } from "../../guide-types";

export const stoneIslandSignals: GuideSignal[] = [
  {
    slug: "badge-compass",
    name: "Badge compass (boussole bras gauche)",
    brandSlug: "stone-island",
    category: "clothing",
    tagline:
      "Analyser le badge boussole Stone Island : couleurs, broderie, fixation bouton-velcro",
    intro:
      "Le badge boussole — rose des vents jaune et noire brodée sur fond cousu au bras gauche — est l'élément iconique de Stone Island depuis la création de la marque par Massimo Osti en 1982. C'est aussi le signal d'authentification le plus scruté par les acheteurs : sa réalisation technique est exigeante et trahit immédiatement les contrefaçons. Sur une pièce issue de la production officielle, le badge mesure 7,5 cm de diamètre (tolérance ± 2 mm), est brodé avec 2 200 à 2 500 points sur un support en coton ou nylon selon la saison, et utilise deux fils de couleurs précises : jaune Pantone 116C pour les rayons de la boussole et le texte « STONE ISLAND », noir Pantone Black 6C pour le contour et les détails intérieurs. Le nom « STONE ISLAND » en capitales forme un demi-cercle supérieur, « DOWN » ou la catégorie apparaît en bas selon la saison. Le badge est fixé au bras par un système à deux boutons (un en haut, un en bas) + velcro périphérique — jamais cousu directement sur le vêtement (sauf exceptions sur pièces spéciales). Les contrefaçons trahissent plusieurs défauts : diamètre de 7 cm ou 8 cm (erreur de gabarit), jaune tirant vers l'orange ou le citron au lieu du jaune chaud 116C, densité de broderie insuffisante laissant apparaître le support textile, fixation cousue fixe au lieu du système bouton-velcro, ou — détail fréquent — orientation de la rose des vents (l'aiguille principale doit pointer nord, pas est ou ouest). Ce signal résout 70 % des cas douteux sur vestes et sweats Stone Island.",
    steps: [
      {
        title: "Mesurer le diamètre du badge (7,5 cm)",
        description:
          "Avec un mètre souple, mesurez le diamètre externe du badge. 7,5 cm ± 2 mm sur vestes et sweats adultes. Sur pièces junior, 6,5 cm. Sur pièces XXL et manteaux down, 8 cm. Un diamètre hors de cette grille est un signal fort.",
      },
      {
        title: "Vérifier les teintes Pantone 116C et Black 6C",
        description:
          "Jaune 116C (jaune chaud légèrement ocré, distinguable de 109C plus clair et 124C plus foncé). Noir Black 6C (noir mat). Un jaune citron ou orangé, ou un noir tirant vers le gris anthracite, sont des signaux.",
      },
      {
        title: "Compter la densité de broderie (2 200-2 500 points)",
        description:
          "Au zoom ×10, les points de broderie doivent couvrir 100 % du support, sans zone textile apparente. Une broderie clairsemée laissant voir le coton sous les fils est un défaut industriel typique des fakes à moulin bas de gamme.",
      },
      {
        title: "Tester le système de fixation bouton + velcro",
        description:
          "Le badge est fixé au bras par 2 boutons pression et un velcro périphérique. Retirez délicatement le badge pour vérifier. Un badge cousu fixe (sans bouton-velcro), sur une pièce Stone Island standard, est un signal fort.",
      },
      {
        title: "Contrôler l'orientation de la rose des vents",
        description:
          "L'aiguille principale de la boussole (la plus longue, souvent rouge ou noire selon modèle) doit pointer vers le haut (nord). Une orientation est/ouest/sud est un défaut d'assemblage impossible chez Stone Island.",
      },
    ],
    commonErrors: [
      {
        title: "Confondre les badges « STONE ISLAND » et les éditions spéciales",
        description:
          "Les lignes Shadow Project, Ghost Piece, Stone Island Marina ont des badges légèrement différents (couleurs, ajout de mentions). Vérifiez sur stoneisland.com la référence exacte de votre modèle avant de signaler une divergence.",
      },
      {
        title: "Ignorer le système de fixation bouton-velcro",
        description:
          "C'est le test le plus discriminant sur les pièces classiques : Stone Island ne coud pas ses badges fixe (sauf sur pièces junior et quelques modèles SS). Un badge fixe sur une veste ou un sweat adulte est un signal définitif.",
      },
      {
        title:
          "Accepter une broderie clairsemée comme « variation de lot »",
        description:
          "Stone Island n'a pas de variation de densité de broderie : le standard industriel est 2 200-2 500 points. Une broderie qui laisse voir le support textile est toujours un défaut de contrefaçon, jamais une « tolérance ».",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs reproduisent la forme générale du badge et les deux couleurs, mais butent sur trois points. Premier : la densité de broderie — ils utilisent 1 500-1 800 points au lieu de 2 200-2 500, économie d'un tiers de fil et de temps machine. Résultat : support textile visible au zoom. Deuxième : le système de fixation — ils cousent le badge fixe par économie d'assemblage, ignorant le velcro périphérique. Troisième : la teinte jaune — ils confondent 116C (référence Stone Island) et 109C (jaune citron plus clair), ou 124C (jaune orangé). Les super-fakes récents (2024+) reproduisent la densité et la teinte, mais oublient souvent le velcro et l'orientation correcte de l'aiguille. Une inspection en 3 minutes règle 80 % des cas.",
    faqs: [
      {
        question:
          "Le badge Stone Island peut-il être retiré et perdu sur une pièce d'origine ?",
        answer:
          "Oui — c'est même une pratique connue des porteurs qui enlèvent le badge pour éviter les vols ou pour un look plus discret. Le système bouton-velcro est conçu pour cela. Sur une pièce de seconde main sans badge mais avec les boutons et velcro intacts, l'authentification bascule sur les autres signaux (certilogo, étiquette composition, boutons gravés). Demandez au vendeur de vérifier les 2 boutons pression et le velcro — s'ils sont absents, la pièce n'a probablement jamais eu de badge et est une contrefaçon ancienne.",
      },
      {
        question:
          "Les badges des éditions Shadow Project ou Ghost Piece sont-ils différents ?",
        answer:
          "Oui, significativement. Shadow Project : badge ton sur ton noir/noir ou gris/gris, plus discret. Ghost Piece : badge complètement teint en noir (technique de teinture pièce entière après assemblage, créant un effet vieilli). Stone Island Marina : badge avec mention « MARINA » ajoutée en bas. Prototype Research Series : badge varié selon le projet. Consultez toujours la page stoneisland.com ou une archive du drop avant d'authentifier un badge non standard. Un badge « Shadow Project » jaune/noir classique est un signal de contrefaçon (les Shadow Project sont toujours monochromes).",
      },
    ],
  },
  {
    slug: "certilogo",
    name: "Certilogo (code d'authentification officiel)",
    brandSlug: "stone-island",
    category: "clothing",
    tagline:
      "Vérifier le Certilogo Stone Island : code à 13 chiffres, scan via certilogo.com",
    intro:
      "Le Certilogo est un système d'authentification officiel implanté par Stone Island sur la quasi-totalité de sa production depuis 2014. C'est une petite étiquette noire cousue à l'intérieur du vêtement (généralement côté gauche à hauteur de hanche, parfois dans la poche intérieure sur les vestes), qui porte un QR code et un code numérique à 13 chiffres. Ce code se vérifie gratuitement sur certilogo.com : en l'entrant sur le site ou en scannant le QR via l'app Certilogo (iOS/Android), le système confirme ou infirme la pièce dans les 5 secondes. Le retour officiel affiche la marque, la saison, le modèle, le pays d'assemblage, et un verdict « The product is most likely an original » ou « This code does not match a Stone Island product in our database ». Les contrefaçons trahissent plusieurs niveaux. Premier niveau : le Certilogo est absent (les fakes bas de gamme ne prennent pas la peine de le reproduire). Deuxième niveau : le Certilogo existe physiquement mais le code ne scanne pas ou retourne une erreur (code inventé). Troisième niveau : le code retourne un produit réel, mais associé à un modèle différent de celui en main — indique une contrefaçon haut de gamme qui a recopié un vrai code trouvé en ligne. Dans ce cas, comparez saison/modèle/pays du retour Certilogo avec la pièce physique — une divergence est un signal définitif. Ce test est le plus rapide de l'arsenal d'authentification Stone Island : 30 secondes et un résultat quasi définitif.",
    steps: [
      {
        title: "Localiser l'étiquette Certilogo (côté gauche, hauteur hanche)",
        description:
          "L'étiquette est une petite bande noire 3×5 cm cousue à l'intérieur du vêtement, généralement côté gauche dans la couture latérale à hauteur de hanche. Sur les vestes, elle peut être dans la poche intérieure.",
      },
      {
        title: "Photographier le QR code et lire le code à 13 chiffres",
        description:
          "Le code à 13 chiffres est imprimé en blanc sous le QR code, parfaitement lisible à l'œil nu. Format : XXXX-XXXX-XXXX-X (groupes séparés par des tirets).",
      },
      {
        title: "Vérifier le code sur certilogo.com",
        description:
          "Rendez-vous sur certilogo.com (ou téléchargez l'app Certilogo), entrez le code à 13 chiffres. Le retour affiche soit « The product is most likely an original » avec détails du modèle, soit un message d'erreur.",
      },
      {
        title: "Croiser le retour Certilogo avec la pièce physique",
        description:
          "Le retour indique la saison, le modèle, le pays d'assemblage, le colorway. Vérifiez la cohérence avec la pièce en main. Une veste FW22 grise retournée comme « tee SS19 bleu » révèle un code recopié sur un autre produit — contrefaçon haut de gamme.",
      },
      {
        title: "Signaler un code utilisé plusieurs fois",
        description:
          "Certilogo détecte les scans multiples d'un même code. Si le retour indique « This code has been verified more than X times, which may indicate a counterfeit », c'est un signal fort : le code a été copié sur des centaines de fakes.",
      },
    ],
    commonErrors: [
      {
        title: "Ignorer le Certilogo parce que « ça a l'air d'origine »",
        description:
          "Le Certilogo est le test le plus rapide et le plus fiable. Ne pas le faire parce que la pièce « semble authentique » est une erreur fréquente. 30 secondes suffisent — toujours le faire.",
      },
      {
        title:
          "Accepter un retour « originel » sans croiser avec la pièce physique",
        description:
          "Un code peut retourner un verdict positif mais sur un autre modèle que celui en main. Croisez toujours saison/modèle/pays du retour avec la réalité physique.",
      },
      {
        title: "Penser qu'un Certilogo absent = pièce vintage d'origine",
        description:
          "Le Certilogo est implanté depuis 2014. Une pièce antérieure (2010-2013) n'en a pas, normalement. Mais à partir de 2015, l'absence totale de Certilogo est un signal fort. Vérifiez la saison avant de conclure.",
      },
    ],
    counterfeiterTactics:
      "Trois niveaux de sophistication chez les contrefacteurs. Niveau 1 (70 % des fakes) : pas de Certilogo du tout. Niveau 2 (20 %) : Certilogo physique avec code inventé qui ne scanne pas. Niveau 3 (10 %, super-fakes) : vrai code recopié depuis une photo StockX ou Grailed d'une pièce officielle — le scan retourne un résultat positif, mais sur un modèle différent. Dans ce cas, seul le croisement saison/modèle/pays avec la pièce physique révèle la fraude. Certains fakes très récents (2024+) investissent même dans des codes achetés au marché noir (codes volés dans des entrepôts officiels) — mais Certilogo détecte les scans multiples et alerte l'utilisateur après 3-5 vérifications du même code. C'est le seul système d'authentification de luxe qui se protège de manière dynamique.",
    faqs: [
      {
        question:
          "Que faire si Certilogo retourne « This code has been verified more than 5 times » ?",
        answer:
          "C'est un signal fort mais pas définitif. Certilogo alerte après plusieurs scans d'un même code — ce qui peut arriver légitimement si la pièce a changé plusieurs fois de propriétaire (marché second-hand actif) et que chaque nouveau propriétaire scanne pour vérifier. Dans ce cas, un 3-4 scans sont plausibles. Au-delà de 10-15 scans, c'est presque certainement un code volé recopié sur des dizaines de contrefaçons. Combinez ce signal avec badge compass, boutons gravés et certilogo physique (étiquette intacte ou recousue) pour trancher.",
      },
      {
        question:
          "Le Certilogo peut-il être présent mais ne pas scanner (QR code endommagé) ?",
        answer:
          "Oui, sur les pièces vintage ou très portées. Un QR code frotté par 5 ans de port peut devenir illisible au scan. Dans ce cas, entrez le code à 13 chiffres manuellement sur certilogo.com — le système accepte l'une ou l'autre méthode. Si le code manuel retourne un résultat positif cohérent avec la pièce, l'authentification tient. Si le code manuel échoue aussi, c'est un signal fort de contrefaçon — les codes d'origine restent scannables manuellement même après usure du QR.",
      },
    ],
  },
  {
    slug: "boutons-badge",
    name: "Boutons gravés (metal buttons STONE ISLAND)",
    brandSlug: "stone-island",
    category: "clothing",
    tagline:
      "Lire les boutons métalliques Stone Island : gravure, laiton doré, finition",
    intro:
      "Les boutons métalliques qui fixent le badge boussole au bras — deux boutons pression en laiton doré — sont un signal d'authentification secondaire mais très discriminant quand le badge a été retiré. Sur une pièce d'origine, les boutons mesurent 14 mm de diamètre (tolérance ± 0,5 mm), sont gravés en creux de la mention « STONE ISLAND » en capitales Helvetica autour du cercle, avec un creux de gravure de 0,4 mm perceptible à l'ongle. Le laiton est doré à l'or jaune 14 carats (finition brillante satinée, pas chromée), et le mécanisme à pression est de fabrication italienne (souvent Prym ou YKK Snap, reconnaissables à un petit marquage sur le dos). La rondelle de pression intérieure est également gravée « STONE ISLAND » en petites capitales. Les contrefaçons trahissent plusieurs défauts : gravure imprimée au lieu de gravée (test à l'ongle immédiat), laiton trop rouge (cuivré) ou trop pâle (alliage bas de gamme), chromage brillant au lieu du satiné doré, diamètre 12 ou 16 mm au lieu de 14, mécanisme de pression chinois bas de gamme qui se casse après 5-10 utilisations. La rondelle intérieure non gravée est également un signal — les fakes économisent sur cette pièce invisible au porter. Ce signal est particulièrement utile quand le badge compass est manquant : les boutons seuls permettent une authentification à 70 % de confiance.",
    steps: [
      {
        title: "Retirer délicatement le badge pour exposer les boutons",
        description:
          "Déboutonnez les deux pressions, décollez le velcro, retirez le badge. Les deux boutons mâles (sur le vêtement) et les deux femelles (sous le badge) sont visibles.",
      },
      {
        title: "Mesurer le diamètre 14 mm",
        description:
          "Au pied à coulisse ou à la règle, le diamètre externe du bouton mâle doit faire 14 mm ± 0,5 mm. Un diamètre 12 ou 16 mm est un signal fort de contrefaçon.",
      },
      {
        title: "Tester la gravure « STONE ISLAND » à l'ongle",
        description:
          "Passez l'ongle sur les lettres « S-T-O-N-E-I-S-L-A-N-D » autour du cercle. Vous devez sentir un creux de 0,4 mm. Une surface lisse (impression) est un signal définitif.",
      },
      {
        title: "Vérifier la finition dorée satinée (pas chromée)",
        description:
          "Le laiton doré a un aspect chaud, satiné, légèrement jaune. Un chromage brillant froid (argenté) est un défaut typique des fakes bas de gamme qui utilisent du laiton chromé au lieu du doré à l'or.",
      },
      {
        title: "Contrôler la rondelle intérieure gravée",
        description:
          "Sous le badge, la rondelle de pression femelle doit aussi porter la gravure « STONE ISLAND » en petites capitales. Son absence ou le remplacement par une rondelle lisse est un signal fort.",
      },
    ],
    commonErrors: [
      {
        title: "Ne pas retirer le badge pour inspecter les boutons",
        description:
          "La plupart des acheteurs ne pensent pas à retirer le badge. Résultat : ils manquent 50 % des signaux. Prenez 30 secondes pour déboutonner et inspecter les 4 boutons.",
      },
      {
        title: "Confondre chromage et dorure",
        description:
          "Un chromage brillant froid (type argenterie) est très différent du doré satiné chaud. Mettez les boutons sous lumière naturelle, la teinte doit être jaune-doré, pas argenté-bleu.",
      },
      {
        title: "Ignorer la rondelle intérieure",
        description:
          "C'est l'élément le plus négligé par les faussaires — ils supposent que personne ne regarde sous le badge. Une rondelle non gravée est un signal fort même si les boutons externes sont parfaits.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires reproduisent la forme générale du bouton et la gravure extérieure. Ils butent sur : la profondeur de gravure (souvent 0,2 mm au lieu de 0,4, test à l'ongle immédiat), la teinte dorée (chromage bas coût au lieu de laiton or 14k), et surtout la rondelle intérieure. 80 % des fakes ont une rondelle lisse. Les super-fakes 2024 gravent aussi la rondelle, mais avec une profondeur moindre et une typographie Arial au lieu d'Helvetica. La qualité du mécanisme de pression est également un indicateur : les boutons d'origine résistent à 200+ pressions sans jeu ; les fakes commencent à avoir du jeu après 30-50 pressions, symptôme d'un acier ressort bas de gamme.",
    faqs: [
      {
        question:
          "Les boutons peuvent-ils s'oxyder ou se ternir avec le temps sur une pièce d'origine ?",
        answer:
          "Oui, légèrement. Le laiton doré à l'or 14 carats reste stable pendant 5-7 ans en usage normal, mais peut présenter une légère patine (teinte qui fonce) après 10+ ans de port, surtout si la pièce a été stockée dans un environnement humide. Cette patine est uniforme et graduelle. En revanche, une oxydation verdâtre ou noirâtre localisée (tache d'oxydation) est typique des alliages bas de gamme utilisés dans les contrefaçons — le vrai laiton doré ne développe pas ce type de défaut. La gravure, elle, reste intacte même avec patine.",
      },
      {
        question:
          "Est-il possible de remplacer les boutons Stone Island en SAV ?",
        answer:
          "Oui, Stone Island remplace les boutons défectueux en SAV dans ses boutiques italiennes et partenaires agréés. Un bouton remplacé après 2015 porte la même gravure et les mêmes spécifications que l'original. Si vous achetez en seconde main une pièce avec un bouton « neuf » au milieu de boutons légèrement patinés, c'est normalement le résultat d'un SAV officiel. Demandez au vendeur s'il a la facture SAV. Attention cependant : certains contrefacteurs remplacent un vrai bouton par un faux sur une vraie pièce, ou inversement — d'où l'importance de vérifier les 4 boutons (2 externes + 2 rondelles internes), pas seulement 1 ou 2.",
      },
    ],
  },
  {
    slug: "etiquette-composition",
    name: "Étiquette composition (interne latérale)",
    brandSlug: "stone-island",
    category: "clothing",
    tagline:
      "Décoder l'étiquette composition Stone Island : pays, fibres, code saison",
    intro:
      "L'étiquette de composition cousue à l'intérieur du vêtement sur la couture latérale gauche est un signal d'authentification moins iconique que le badge ou le Certilogo, mais très complet — elle concentre les informations réglementaires obligatoires et révèle l'histoire de production de la pièce. Sur une pièce d'origine, l'étiquette mesure 6×9 cm, est imprimée sur tissé mat blanc, et comporte cinq blocs d'information en Helvetica Neue 7pt : composition textile détaillée (pourcentages exacts, nommage par fibre — « 100% COTTON », « 80% COTTON / 20% POLYAMIDE », « 100% WOOL » pour les maille, « SHELL: 100% NYLON / LINING: 100% POLYESTER » pour les vestes), pays d'assemblage (« MADE IN ITALY » pour 70 % des pièces, « MADE IN ROMANIA » pour certains basiques, « MADE IN PORTUGAL » pour quelques projets spéciaux), symboles de lavage ISO 3758 (5 pictogrammes), code saison (format 7 caractères, ex. « 10 0001 » où 10 = FW10, 0001 = référence modèle), et copyright « © Sportswear Company 20XX » (Sportswear Company étant la société mère italienne de Stone Island). Les contrefaçons trahissent plusieurs défauts : composition en pourcentages arrondis (« 80% COTTON » au lieu de « 80% COTTON / 20% POLYAMIDE »), pays « MADE IN CHINA » impossible chez Stone Island, copyright « © Stone Island » au lieu de « © Sportswear Company » (erreur fréquente), code saison incohérent avec le modèle (un sweat FW23 avec code « 05 XXXX » de 2005 est impossible). Ce signal, combiné au Certilogo, résout 95 % des cas sur pièces standard.",
    steps: [
      {
        title: "Localiser l'étiquette sur la couture latérale gauche",
        description:
          "L'étiquette composition est cousue à l'intérieur du vêtement sur la couture latérale gauche, à hauteur de hanche. Sur les vestes doublées, elle peut être dans la poche intérieure ou au bas du dos.",
      },
      {
        title: "Vérifier la composition détaillée (pas arrondie)",
        description:
          "Une étiquette d'origine précise toujours chaque fibre avec son pourcentage exact. « 100% COTTON » seul, ou « 80% COTTON / 20% POLYAMIDE » avec les deux fibres. Une mention « 80% COTTON » sans le complément à 100 % est un signal fort.",
      },
      {
        title: "Contrôler le pays d'assemblage cohérent",
        description:
          "MADE IN ITALY (70 % des pièces), MADE IN ROMANIA (basiques), MADE IN PORTUGAL (spécial). Jamais MADE IN CHINA, MADE IN TURKEY ou MADE IN BANGLADESH sur une pièce Stone Island récente.",
      },
      {
        title: "Vérifier le copyright « © Sportswear Company »",
        description:
          "Stone Island est une marque détenue par Sportswear Company S.p.A. (rachetée par Moncler en 2021). Le copyright doit porter « © Sportswear Company 20XX » ou « © Sportswear Company Spa ». Un copyright « © Stone Island » est une erreur fréquente des faussaires.",
      },
      {
        title: "Lire le code saison (7 caractères)",
        description:
          "Format : 2 chiffres année + 4 chiffres référence + 1 lettre colorway. Ex. « 10 0001 W » = FW10, modèle 0001, colorway W. L'année doit correspondre à la saison du drop réel — incohérence = contrefaçon.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter « © Stone Island » au lieu de « © Sportswear Company »",
        description:
          "C'est l'erreur la plus fréquente : les faussaires mettent logiquement « © Stone Island » en pensant bien faire. Mais la société mère légale est Sportswear Company — c'est cette mention qui figure. Test définitif en 5 secondes.",
      },
      {
        title: "Ignorer la cohérence code saison ↔ année de drop",
        description:
          "Un sweat FW23 acheté neuf ne peut pas avoir un code « 05 XXXX » (FW05) — ce serait une pièce vintage 2005 déstockée, ce qui est improbable. Vérifiez toujours la cohérence 2 chiffres année du code ↔ saison réelle.",
      },
      {
        title: "Oublier de vérifier la composition complète",
        description:
          "Une composition incomplète (« 80% COTTON » sans le complément à 100 %) est une erreur d'impression de contrefaçon. La réglementation textile européenne impose 100 % de la composition explicite.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires utilisent plusieurs raccourcis sur l'étiquette composition. Premier : ils omettent le copyright ou écrivent « © Stone Island » au lieu de « © Sportswear Company » (80 % des cas). Deuxième : ils simplifient la composition en arrondissant (« 80% COTTON » au lieu de « 80% COTTON / 20% POLYAMIDE »). Troisième : ils utilisent un code saison générique recopié sur un produit officiel qu'ils fakent, sans vérifier la cohérence avec leur propre lot (résultat : 500 fakes du même modèle partagent le même code). Quatrième : ils mettent « MADE IN ITALY » sur toutes les pièces, même celles qui devraient être roumaines ou portugaises, en pensant que « Italy » vend mieux. Chacun de ces défauts est éliminatoire à lui seul.",
    faqs: [
      {
        question: "Pourquoi le copyright indique-t-il « Sportswear Company » et pas « Stone Island » ?",
        answer:
          "Stone Island est une marque commerciale détenue par Sportswear Company S.p.A., société italienne fondée par Carlo Rivetti en 1982 (en même temps que la marque). Depuis décembre 2020, Sportswear Company est une filiale à 100 % du groupe Moncler après un rachat à 1,15 milliard d'euros. Le copyright d'une pièce Stone Island est toujours « © Sportswear Company 20XX » — c'est la société mère légale, propriétaire de la marque et des droits. Les contrefacteurs écrivent souvent « © Stone Island » par méconnaissance, pensant que c'est le nom légal. C'est un piège classique qui élimine 80 % des fakes en 5 secondes.",
      },
      {
        question:
          "Les pièces Stone Island vintage (avant 2010) ont-elles le même format d'étiquette ?",
        answer:
          "Non. Le format actuel (6×9 cm, Helvetica Neue, copyright Sportswear Company, code saison 7 caractères) est stabilisé depuis environ 2010-2012. Les pièces antérieures (1982-2009) ont des formats variables, souvent plus petits, avec des informations moins normées — certaines ne portent même pas de code saison explicite. Pour authentifier une pièce vintage, le Certilogo est absent (implanté en 2014) et les signaux principaux deviennent : badge compass (design légèrement différent selon décennie), boutons gravés (toujours présents), coutures d'assemblage, et compilation avec des archives photo (grailed.com, fishtail-parka.com archives, stoneislandarchives.com). Un vintage 1990 authentique est plus difficile à valider qu'une pièce moderne — privilégiez les vendeurs spécialisés archive.",
      },
    ],
  },
];
