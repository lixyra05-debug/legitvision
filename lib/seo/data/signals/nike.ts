import type { GuideSignal } from "../../guide-types";

export const nikeSignals: GuideSignal[] = [
  {
    slug: "etiquette-langue",
    name: "Étiquette langue (tongue label)",
    brandSlug: "nike",
    category: "sneakers",
    tagline: "Lire une tongue label Nike : police, alignement, informations obligatoires",
    intro:
      "L'étiquette cousue à l'intérieur de la langue (« tongue label ») est l'un des indices d'authentification Nike les plus riches et aussi l'un des plus mal contrefaits. Sur une paire authentique, elle rassemble en quelques centimètres carrés la pointure (US/UK/EU/CM), le style code à 9 caractères, la date de fabrication (MM/YY) et le pays d'assemblage — le tout imprimé dans une typographie Helvetica Neue fine, avec un kerning régulier et des contrastes de gras maîtrisés. Les contrefaçons, elles, trahissent presque toujours un défaut : police trop grasse, espacement irrégulier, ligne « MADE IN » alignée différemment, ou — très fréquent — un style code qui ne correspond pas au colorway photographié sur Nike.com. Les super-fakes asiatiques imitent le visuel mais butent sur un détail : le point de couture qui fixe le haut de l'étiquette est quasi systématiquement décalé d'un ou deux millimètres, et la couleur du fil (noir ou blanc selon modèle) ne correspond pas à celle utilisée en usine Nike. Savoir lire cette étiquette est le réflexe numéro un quand une paire arrive en main — ça prend trente secondes et élimine 70 % des contrefaçons de bas de gamme.",
    steps: [
      {
        title: "Photographier la langue à plat, éclairage neutre",
        description:
          "Posez la chaussure sur une surface plane, tirez légèrement la langue vers vous pour qu'elle se déploie sans plis. Prenez la photo à la perpendiculaire, éclairage naturel ou LED neutre (pas de flash direct qui sature les noirs).",
      },
      {
        title: "Lire la ligne du haut (taille)",
        description:
          "La première ligne doit afficher quatre pointures séparées par des espaces : « US 9 · UK 8 · EU 42.5 · CM 27 ». La police est Helvetica Neue fine, pas grasse. Un chiffre en gras ou un format « 9 US 8 UK » sans séparateur est suspect.",
      },
      {
        title: "Vérifier le style code à 9 caractères",
        description:
          "Deux lettres + quatre chiffres + tiret + trois chiffres (ex : « DH7138-006 »). Ce code doit exister sur Nike.com ou sur StockX et correspondre au colorway en main. Un code introuvable, ou attribué à un autre coloris, est une preuve quasi définitive de contrefaçon.",
      },
      {
        title: "Contrôler la date et le pays",
        description:
          "Sous le style code : date MM/YY (ex : « 09/23 ») et ligne « MADE IN VIETNAM » (ou Indonesia, China, Thailand). La date doit être antérieure à la date de drop officielle et cohérente avec le colorway. Vérifiez que la ligne « MADE IN » est parfaitement horizontale, sans rotation de 1-2°.",
      },
      {
        title: "Inspecter la couture du haut",
        description:
          "L'étiquette est fixée en haut par une couture fine, 8-10 points par centimètre, parallèle au bord supérieur. Les contrefaçons utilisent souvent 5-7 points par cm (couture plus visible) ou une couture oblique.",
      },
    ],
    commonErrors: [
      {
        title: "Croire qu'un style code existant = paire authentique",
        description:
          "Les contrefacteurs recopient des style codes réels et les impriment sur des fakes. Le code correct est nécessaire mais pas suffisant : il doit être accompagné d'une date cohérente, d'une police correcte et d'une couture propre.",
      },
      {
        title: "Ignorer la cohérence date ↔ drop",
        description:
          "Une paire Air Jordan 1 « Chicago Lost & Found » drop en novembre 2022 ne peut pas avoir une date de fabrication « 03/22 » si c'est une deadstock. Comparez systématiquement date étiquette et date de drop StockX.",
      },
      {
        title: "Ne regarder qu'une seule chaussure",
        description:
          "Les deux langues doivent afficher le même style code et la même date MM/YY. Une asymétrie — deux codes différents, deux dates différentes — révèle un assemblage frauduleux avec éléments recyclés.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires utilisent des impressions thermo-collées basse résolution qui pixellisent au zoom x5, ou des impressions jet d'encre qui bavent sur les contours des lettres. Les super-fakes UA (Unauthorized Authentic) produits dans les mêmes usines que Nike — puis revendus hors circuit — contournent ce test : ils ont la vraie étiquette. Pour ces cas, il faut basculer sur d'autres signaux (style code cross-check, box label, qualité semelle).",
    faqs: [
      {
        question: "Que faire si le style code de l'étiquette langue est introuvable sur Nike.com ?",
        answer:
          "Un style code absent de Nike.com n'est pas automatiquement une preuve de contrefaçon : Nike retire certaines pages produit après un drop, et les modèles Nike By You ou certaines exclusives régionales n'ont pas toujours de page publique. Cherchez alors sur StockX, GOAT, Flight Club ou dans la Nike SNKRS archive. Si le code est introuvable partout, c'est un signal très fort — combinez avec box label et tongue photo pour trancher.",
      },
      {
        question: "La tongue label peut-elle être décolorée sur une paire vintage authentique ?",
        answer:
          "Oui. Les paires 1985-2005 ont des étiquettes qui jaunissent ou brunissent avec le temps, surtout si la paire a été exposée au soleil. La décoloration ne tue pas l'authenticité — au contraire, une étiquette parfaitement blanche sur une paire « vintage deadstock 1994 » est plus suspecte qu'une étiquette jaunie. Vérifiez alors la typographie (tendance Helvetica plus épaisse sur les 90's) et le style code (format à 6 chiffres sans tiret avant 2001).",
      },
    ],
  },
  {
    slug: "box-label",
    name: "Box label (étiquette boîte)",
    brandSlug: "nike",
    category: "sneakers",
    tagline: "Décoder la box label Nike : style code, colorway nominal, code-barre",
    intro:
      "La box label est collée sur le petit côté de la boîte Nike et concentre autant d'informations que la tongue label, mais avec un angle différent : c'est l'étiquette « logistique » utilisée en entrepôt. On y trouve le style code, le colorway nominal complet (pas juste le surnom marketing), la pointure, le code-barre EAN-13, et parfois un QR code depuis 2020. La typographie est toujours Helvetica Neue, mais plus grasse que sur la tongue label — c'est un repère fort. Les contrefaçons butent sur trois détails : la colle qui laisse des bulles d'air sous l'étiquette, le code-barre qui ne scanne pas (ou scanne vers un produit n'ayant rien à voir), et le colorway nominal qui utilise des séparateurs incorrects — Nike utilise systématiquement le format « COLOR1/COLOR2-COLOR3 » avec une barre oblique et un tiret, jamais trois tirets ou trois barres obliques. Sur une paire hypée comme une Jordan 1 Chicago, le colorway sera « WHITE/BLACK-VARSITY RED » — jamais « WHITE-BLACK-RED » ni « White/Black/Red ». Un détail de ponctuation suffit à trancher 30 % des cas douteux.",
    steps: [
      {
        title: "Vérifier l'adhésion de l'étiquette",
        description:
          "L'étiquette authentique est parfaitement collée, sans bulle, sans décalage par rapport au bord de la boîte. Une étiquette qui se décolle dans les coins, qui a des bulles d'air visibles ou qui est décalée de plus de 2 mm par rapport aux autres étiquettes de la même palette est un signal fort.",
      },
      {
        title: "Lire le style code + colorway complet",
        description:
          "Le style code (format XX1234-567) doit correspondre au style code de la tongue label. Le colorway nominal doit utiliser le format exact « COLOR1/COLOR2-COLOR3 » avec barre oblique et tiret, pas d'autre séparateur. Exemple authentique : « WHITE/BLACK-VARSITY RED ».",
      },
      {
        title: "Scanner le code-barre EAN-13",
        description:
          "Le code-barre doit scanner correctement (13 chiffres) et mener au bon modèle. Utilisez une app gratuite de scan EAN (Barcode Reader, ScanLife). Un code qui ne scanne pas, ou qui scanne vers un autre produit (chaussettes, sac Nike), est une preuve de contrefaçon.",
      },
      {
        title: "Croiser la pointure étiquette ↔ langue ↔ semelle",
        description:
          "La pointure doit être identique sur trois emplacements : box label, tongue label, et estampille intérieure de la semelle (parfois embossée). Une asymétrie — box dit « US 9 » mais tongue dit « US 9.5 » — révèle un remplacement d'étiquette.",
      },
      {
        title: "Vérifier le QR code (paires 2020+)",
        description:
          "Depuis 2020 sur certains drops SNKRS, un QR code est ajouté à la box label. Scannez-le : il doit mener à une page nike.com/launch, nike.com/snkrs ou app.snkrs.com. Un QR menant à un autre domaine, ou inerte, est suspect.",
      },
    ],
    commonErrors: [
      {
        title: "Ignorer la cohérence box ↔ paire",
        description:
          "Les contrefacteurs vendent parfois une vraie boîte vide (achetée 20-40 € sur Vinted) avec une paire fake à l'intérieur. Vérifiez toujours que les étiquettes de la boîte correspondent à la paire livrée : même style code, même colorway, même pointure.",
      },
      {
        title: "Valider sur le seul code-barre",
        description:
          "Un code-barre peut être copié d'une vraie paire et réimprimé sur une étiquette fake. Le scan correct est nécessaire mais pas suffisant — croisez avec typographie et adhésion de l'étiquette.",
      },
      {
        title: "Croire qu'une boîte abîmée = fake",
        description:
          "Une boîte cabossée ou avec un coin enfoncé ne signifie pas paire fake. Nike livre parfois des paires en boîte endommagée (transport, stockage). C'est la qualité de l'étiquette et du contenu qui compte, pas l'état extérieur de la boîte.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs produisent aujourd'hui des box labels quasi-identiques visuellement — même typographie, même mise en page. Le détail qui les trahit : l'encre d'impression. Les labels authentiques utilisent une encre mate qui absorbe la lumière ; les fakes utilisent souvent une encre semi-brillante qui reflète légèrement sous un éclairage tangentiel. Tournez la box label sous une LED : un reflet uniforme = suspect. Pour les boîtes vintage recyclées (vraie boîte + fake paire), vérifiez toujours que la date de fabrication sur la boîte colle avec la date de la paire.",
    faqs: [
      {
        question: "La box label peut-elle être différente selon le pays d'achat ?",
        answer:
          "Oui, légèrement. Les paires vendues en Europe ont une box label avec mention de l'importateur UE (Nike European Operations Netherlands B.V.) et parfois un adressage en plusieurs langues. Les paires US ont juste « Nike, Inc. Beaverton, OR ». Une paire achetée sur SNKRS EU avec une box label 100 % US est suspecte — probablement une paire revendue depuis l'Asie avec échange de boîte.",
      },
      {
        question: "Comment distinguer une box label Nike vintage authentique d'une reproduction ?",
        answer:
          "Les box labels pre-2003 ont trois marqueurs spécifiques : style code à 6 chiffres sans tiret (ex : 130690), police Helvetica condensed (plus serrée que la Neue actuelle), et absence de code-barre EAN (remplacé par un code UPC-A). Les reproductions vintage vendues sur eBay ou Grailed imitent la forme mais ratent souvent la police — un Helvetica Neue moderne à la place du condensed historique.",
      },
    ],
  },
  {
    slug: "semelle-interieure",
    name: "Semelle intérieure (insole) et codes embossés",
    brandSlug: "nike",
    category: "sneakers",
    tagline: "Inspecter la semelle intérieure Nike : codes, embossage, collage",
    intro:
      "La semelle intérieure (insole) Nike n'est pas un simple coussinet : c'est un composant technique avec mousse Ortholite, logo Nike embossé ou sérigraphié, et — sur la face cachée collée à la chaussure — des codes de production que les contrefacteurs oublient régulièrement. Décoller partiellement l'insole d'une Air Force 1 authentique révèle typiquement un texte embossé « AIR » en très grand, un code usine à 4 chiffres, et une référence QA (quality assurance) à 3 lettres. Les contrefaçons ont souvent un dessous uni, une mousse de densité incorrecte (plus dure et plus légère), ou un collage qui laisse des résidus de colle jaune plutôt que la colle blanche-translucide Nike. Sur les Air Jordan, le logo Jumpman sur l'insole a une silhouette et une courbure très précises qui bougent d'un millimètre sur les fakes — détail invisible à l'œil nu mais évident au pied-à-coulisse. Cette zone est un « tell » d'expert : les faussaires concentrent leurs efforts sur ce qui se voit, pas sur ce qui se cache sous le pied.",
    steps: [
      {
        title: "Décoller partiellement l'insole",
        description:
          "Avec précaution, décollez l'insole sur 3-4 cm depuis le talon. La colle authentique est translucide-blanche et se détache sans laisser de résidus jaunes. Si la colle est jaune, grumeleuse ou sent fortement le solvant, c'est suspect.",
      },
      {
        title: "Lire les codes embossés sur le dessous",
        description:
          "Le dessous de l'insole authentique porte un texte embossé : logo « AIR » (sur Air Force 1, Air Max) ou « JUMPMAN » (sur Jordan), un code usine à 4 chiffres, et parfois une référence QA à 3 lettres. L'embossage doit être net, bien profond (1-1,5 mm).",
      },
      {
        title: "Vérifier la densité de la mousse",
        description:
          "L'insole authentique Nike utilise une mousse Ortholite ou Nike Comfort avec une densité spécifique : comprimez entre pouce et index, la mousse doit reprendre sa forme en 1-2 secondes. Une mousse qui reste déformée, ou qui rebondit instantanément, est suspecte.",
      },
      {
        title: "Inspecter le logo visible sur le dessus",
        description:
          "Le logo Nike ou Jumpman sur le dessus de l'insole doit être parfaitement centré et symétrique. Sur les Jordan, le Jumpman a 5 doigts à la main tendue et une jambe arrière fléchie à 45° exact. Mesurez au pied-à-coulisse si doute.",
      },
      {
        title: "Comparer les deux insoles entre elles",
        description:
          "Les deux insoles (gauche et droite) d'une paire authentique ont exactement les mêmes codes usine et les mêmes QA refs. Une asymétrie — deux codes différents ou un logo placé différemment — révèle un assemblage de pièces provenant de lots différents.",
      },
    ],
    commonErrors: [
      {
        title: "Craindre de décoller l'insole sur une deadstock",
        description:
          "Décoller partiellement l'insole n'abîme pas une paire authentique si c'est fait doucement — la colle Nike est conçue pour résister à ça. Pour une deadstock vendue 800 € et plus, vérifier ce signal vaut largement le risque minime.",
      },
      {
        title: "Confondre mousse Ortholite et mousse générique",
        description:
          "La mousse Ortholite est blanche-crème, légèrement granuleuse au toucher. Une mousse grise, noire ou très lisse est un substitut bon marché typique des contrefaçons. L'odeur est aussi un marqueur : Ortholite n'a pratiquement pas d'odeur, les substituts ont une odeur chimique.",
      },
      {
        title: "Ne pas croiser insole ↔ tongue ↔ box",
        description:
          "Le code usine de l'insole doit être cohérent avec la date de fabrication de la tongue et de la box. Un code usine ancien (« 0412 » = semaine 4 de 2012) sur une paire drop 2023 est une preuve immédiate de contrefaçon.",
      },
    ],
    counterfeiterTactics:
      "Les faussaires ignorent souvent le dessous de l'insole car ils savent que la majorité des acheteurs ne décolle jamais. Les super-fakes haut de gamme (> 200 € de prix de production) ajoutent un embossage sommaire sur le dessous, mais la profondeur est typiquement 0,3-0,5 mm au lieu de 1-1,5 mm authentique. La mousse Ortholite est aussi un goulot d'étranglement : Ortholite est une marque déposée qui ne vend qu'à Nike, Adidas et quelques autres — les contrefaçons utilisent des substituts chinois qui imitent la couleur mais ratent la densité.",
    faqs: [
      {
        question: "Pourquoi les insoles de mes Air Max sont-elles plus dures qu'avant ?",
        answer:
          "La mousse Ortholite durcit avec l'âge et avec les chocs thermiques (laisser les chaussures dans une voiture chaude accélère le phénomène). Une paire de 3-5 ans peut avoir des insoles plus dures qu'à l'achat, sans que ce soit un signe de fake. En revanche, une paire neuve deadstock avec insoles dures dès la sortie de boîte est suspecte.",
      },
      {
        question: "Les insoles Nike sont-elles interchangeables entre modèles ?",
        answer:
          "Non. Chaque modèle Nike a une insole avec une coupe et des codes spécifiques. Une Air Force 1 a une insole plate uniforme avec « AIR » embossé ; une Dunk a une insole avec « NIKE » embossé et une courbure d'arche différente ; une Jordan a « JUMPMAN ». Si vous voyez une AF1 avec un embossage « JUMPMAN », c'est soit un montage fake, soit une paire recustomisée (dans ce cas, demandez photos avant/après modification).",
      },
    ],
  },
  {
    slug: "swoosh-cuir",
    name: "Qualité du Swoosh et du cuir",
    brandSlug: "nike",
    category: "sneakers",
    tagline: "Inspecter le Swoosh et le cuir Nike : courbure, matière, coutures",
    intro:
      "Le Swoosh n'est pas qu'un logo : c'est un composant cousu sur la tige, avec une géométrie précise (courbure asymétrique, pointe fine, talon légèrement bulbeux) et un cuir spécifique selon modèle. Sur une Air Force 1 Low blanche, le Swoosh est en cuir lisse 1,2 mm d'épaisseur, cousu avec 22-24 points, et chaque courbe a un rayon documenté dans les specs Nike internes. Les contrefaçons ratent trois points : la courbure (trop symétrique ou trop bulbeuse à la pointe), la texture du cuir (grain trop uniforme ou trop artificiel), et le nombre de points de couture (18-20 au lieu de 22-24). Au-delà du Swoosh, le cuir entier de la chaussure est révélateur : Nike utilise du cuir de veau full-grain (peau du dessus), qui marque à la pression puis reprend sa forme en 3-5 secondes. Un cuir qui reste marqué indéfiniment est un split (cuir refendu bas de gamme) ou un cuir synthétique (PU). L'odeur est aussi un signal : cuir Nike = odeur de cuir tanné discret ; cuir fake = odeur chimique forte, voire odeur de colle. Ce test du pouce est le plus fiable après la tongue label.",
    steps: [
      {
        title: "Mesurer l'angle de la pointe du Swoosh",
        description:
          "Sur une AF1 ou Dunk authentique, la pointe du Swoosh se termine par un angle aigu d'environ 30°. Mesurez au rapporteur sur photo : un angle > 40° (Swoosh trop arrondi) ou < 20° (Swoosh trop effilé) est suspect.",
      },
      {
        title: "Tester le grain du cuir au toucher",
        description:
          "Passez le pouce sur le cuir du Swoosh. Le cuir authentique a un grain irrégulier avec de fines imperfections naturelles (pores, petites marques). Un grain parfaitement uniforme, géométrique, révèle un cuir synthétique ou un grain pressé artificiellement.",
      },
      {
        title: "Compter les points de couture du Swoosh",
        description:
          "Le Swoosh est cousu sur la tige avec un nombre de points précis selon modèle : 22-24 sur AF1 Low, 28-30 sur Dunk High. Comptez-les sur photo rapprochée. Un nombre < 20 ou > 32 est suspect. Les points doivent être réguliers (< 0,5 mm d'écart).",
      },
      {
        title: "Appliquer la pression du pouce sur le cuir",
        description:
          "Appuyez fermement avec le pouce sur une zone plate du cuir (côté talon). Un cuir authentique marque légèrement, puis reprend sa forme en 3-5 secondes. Un cuir qui reste marqué indéfiniment est un split bas de gamme. Un cuir qui ne marque pas du tout est un synthétique rigide.",
      },
      {
        title: "Sentir l'odeur du cuir",
        description:
          "Le cuir Nike a une odeur discrète de cuir tanné. Une odeur chimique forte (solvant, plastique), ou une odeur de colle dominante, indique un cuir synthétique ou un assemblage bas de gamme. Le test marche surtout sur les paires récentes — les vintages sentent moins fort.",
      },
    ],
    commonErrors: [
      {
        title: "Comparer un Swoosh sur photo de face uniquement",
        description:
          "Le Swoosh est un objet 3D — ses dimensions changent selon l'angle de la photo. Pour comparer authentique vs suspect, assurez-vous que les deux photos sont prises sous le même angle, perpendiculaire à la chaussure. Une photo de 3/4 déforme la courbure et peut créer de faux négatifs.",
      },
      {
        title: "Croire qu'un cuir rigide = authentique",
        description:
          "Sur certains modèles (Dunk Low Retro), le cuir authentique est intentionnellement rigide au départ et s'assouplit après 2-3 mises. La rigidité n'est pas en soi un signal — c'est la combinaison rigidité + grain uniforme + odeur chimique qui révèle un fake.",
      },
      {
        title: "Ignorer les différences par usine",
        description:
          "Nike produit dans plusieurs usines (Vietnam, Indonesia, China, Thailand) qui utilisent des machines à coudre légèrement différentes. Un écart de 1-2 points de couture entre deux paires authentiques de lots différents est possible. Ce qui compte : la régularité interne (points homogènes sur toute la chaussure) et le résultat global.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs utilisent trois niveaux de cuir selon le budget : split synthétique (fakes bas de gamme à 30-50 €), cuir vrai bas de gamme (split italien, 80-120 €), et full-grain de provenance inconnue (super-fakes UA, 200-300 €). Les super-fakes passent souvent le test du pouce, mais butent sur la couture du Swoosh : les machines industrielles Nike font des points à tension constante impossible à reproduire en atelier artisanal sans investissement majeur. Le nombre de points est correct, mais la tension varie — un point légèrement plus lâche tous les 5-6 points — détail visible au zoom x10.",
    faqs: [
      {
        question: "Est-ce que les Nike Made in China ont un cuir différent des Made in Vietnam ?",
        answer:
          "Le cuir source est identique — Nike impose les mêmes specs à toutes ses usines. Ce qui peut varier : la patine finale (les usines vietnamiennes utilisent un polissage légèrement plus brillant que les chinoises), et le fil de couture (épaisseur identique, mais teinte parfois légèrement différente entre lots). Pas de quoi tirer de conclusion fake/authentique sur ce seul critère.",
      },
      {
        question: "Le Swoosh peut-il se détacher sur une paire Nike authentique ?",
        answer:
          "Très rarement, et presque toujours sur les modèles anciens (> 10 ans) où la colle sous les coutures a séché. Sur une paire récente (< 5 ans), un Swoosh qui se décolle est un défaut rarissime qui justifie un retour SAV Nike — pas un signe de fake. En revanche, un Swoosh qui se décolle sur une paire neuve est presque toujours un fake bas de gamme avec collage mal exécuté.",
      },
    ],
  },
  {
    slug: "numero-sku",
    name: "Numéro SKU / Style Code",
    brandSlug: "nike",
    category: "sneakers",
    tagline: "Vérifier un Style Code Nike : format, cohérence, cross-check",
    intro:
      "Le Style Code Nike — aussi appelé SKU, product code ou style number selon les régions — est l'identifiant unique d'un colorway à 9 caractères dans le format « XX1234-567 » : deux lettres (code collection), quatre chiffres (identifiant modèle), tiret, trois chiffres (code colorway). Ce code est présent à trois endroits : box label, tongue label, et site nike.com. La cohérence entre ces trois sources est la première vérification. Au-delà de la cohérence, le code contient une information sémantique : les deux premières lettres indiquent souvent la collection (DH = Dunk Heritage, DJ = Dunk Jordan limited, CW = Court Winterized, etc.). Un code « AA1234-567 » sur un drop 2024 est suspect : les codes « AA » datent des années 2015-2017. Le troisième chiffre du colorway (les 3 derniers) suit aussi une logique : 100 = base coloris blanc, 001 = base coloris noir, 600 = base rouge, 400 = base bleu. Un colorway « Chicago » (blanc/noir/rouge) qui se termine par « 400 » (bleu) est incohérent. Les faussaires recopient souvent un code existant sans comprendre cette sémantique — et génèrent des incohérences que Nike.com révèle en quelques secondes.",
    steps: [
      {
        title: "Localiser le Style Code aux trois endroits",
        description:
          "Sur la box label (grande étiquette sur le petit côté), sur la tongue label (intérieur de langue), et sur nike.com/launch. Les trois doivent afficher exactement le même code. Une divergence = paire suspecte.",
      },
      {
        title: "Vérifier le format strict",
        description:
          "Le format Nike moderne (post-2001) est strict : deux lettres majuscules + quatre chiffres + tiret + trois chiffres. Pas d'espace. Pas de minuscule. Pas de zéro final omis (« DH7138-6 » au lieu de « DH7138-006 » = fake).",
      },
      {
        title: "Rechercher le code sur Nike.com et StockX",
        description:
          "Tapez le code complet dans la recherche nike.com, StockX, GOAT, Flight Club. Au moins une de ces sources doit afficher une fiche produit correspondant au colorway en main. Si le code est introuvable partout, c'est un signal fort de fake.",
      },
      {
        title: "Contrôler la cohérence sémantique",
        description:
          "Les 3 derniers chiffres indiquent la base colorway : 100 = blanc, 001 = noir, 600 = rouge, 400 = bleu, 700 = vert, 500 = violet. Un code « -600 » sur une paire 100 % blanche est incohérent — probable fake.",
      },
      {
        title: "Vérifier la cohérence date de drop ↔ collection",
        description:
          "Les codes évoluent dans le temps. Un code « DH » (Dunk Heritage) est cohérent pour un drop 2020-2023. Un code « AA » (Air Archive) est cohérent pour 2015-2017. Un code « AA » sur un drop 2024 = incohérent.",
      },
    ],
    commonErrors: [
      {
        title: "Accepter un style code réel sans cross-check visuel",
        description:
          "Les contrefacteurs copient souvent un code Nike réel (par exemple « DD1391-100 » pour Dunk Low Panda) et l'impriment sur un fake. Le code est correct, mais la paire n'est pas Nike. Toujours croiser code + photo officielle Nike.com pour comparer visuellement la paire.",
      },
      {
        title: "Se fier à un screenshot fourni par le vendeur",
        description:
          "Un vendeur qui envoie un screenshot « Nike.com avec le même code » peut avoir photoshopé ou utilisé un faux screenshot généré. Vérifiez vous-même directement sur Nike.com — ne faites jamais confiance à un screenshot envoyé par le vendeur.",
      },
      {
        title: "Oublier les codes régionaux",
        description:
          "Nike utilise parfois des suffixes régionaux pour les exclusives (« -100 » global vs « -101 » Japon vs « -102 » Europe). Un code avec suffixe « -101 » sur une paire vendue en France est suspect mais pas impossible si la paire a été revendue depuis le Japon. Croisez avec le circuit d'achat.",
      },
    ],
    counterfeiterTactics:
      "La stratégie faussaire la plus courante est le « SKU match » : copier un code Nike réel populaire (Jordan 1 Chicago, Dunk Panda) et l'imprimer sur un fake. La faiblesse : les super-fakes se concentrent sur les codes ultra-hyped, mais les codes moins populaires (ex : Nike Pegasus Trail 4) sont rarement contrefaits car le marché est trop petit. Paradoxalement, vérifier un code Nike populaire est moins fiable que vérifier un code moins connu — les populaires sont tous copiés, les obscurs révèlent plus facilement un fake si le code est correct (car le fake est alors rare).",
    faqs: [
      {
        question: "Que faire si le Style Code existe sur StockX mais pas sur Nike.com ?",
        answer:
          "C'est normal. Nike retire les pages produit 3-12 mois après un drop. StockX et GOAT conservent les fiches indéfiniment (archivage). Un code présent sur StockX + absent sur Nike.com n'est pas un signe de fake. En revanche, un code absent des deux = alerte forte. Autre cas légitime : les paires Nike By You (customisées) ont des codes non-publics — si la paire est By You, demandez le certificat Nike fourni à la commande.",
      },
      {
        question: "Les Style Codes Nike vintage (années 80-90) ont-ils le même format ?",
        answer:
          "Non. Les codes pre-2001 sont à 6 chiffres sans lettres ni tiret (ex : 130690 pour Air Max 95 OG 1995). Les codes 2001-2008 sont en transition (parfois 9 caractères, parfois 6). Le format « XX1234-567 » actuel s'est imposé en 2008-2010. Une paire « vintage 1993 » avec un code à 9 caractères modernes est soit une reproduction Retro (authentique mais pas OG), soit un fake.",
      },
    ],
  },
];
