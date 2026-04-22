import type { GuideSignal } from "../../guide-types";

export const offWhiteSignals: GuideSignal[] = [
  {
    slug: "zip-tie",
    name: "Zip tie signature (attache de sécurité)",
    brandSlug: "off-white",
    category: "clothing",
    tagline:
      "Analyser le zip tie rouge Off-White : typographie industrielle, fil nylon, code série",
    intro:
      "Le zip tie rouge — ce serre-câble siglé « SECURITY TAG / OFF-WHITE™ » accroché à la poche, à la manche ou au col — n'est pas qu'un gadget marketing : c'est l'un des signaux d'authentification les plus discriminants de la maison fondée par Virgil Abloh. Sur une pièce issue de la production officielle, le zip tie mesure 18 cm de long pour 5 mm de large, est moulé en nylon rouge Pantone 185C, et porte une gravure en relief lisible « OFF-WHITE™ c/o VIRGIL ABLOH™ » sur une face, « SECURITY TAG / FOR ALLOCATION » sur l'autre, le tout en typographie Helvetica Bold condensée. La gravure est creuse (pas simplement imprimée), perceptible à l'ongle, profondeur 0,3 mm. Un code série à 7 chiffres est imprimé en petites capitales sur la tête du zip tie — il correspond au lot de production et peut être croisé avec le numéro d'étiquette col. Les contrefaçons trahissent plusieurs défauts : nylon trop rigide ou trop souple (le vrai a une rigidité médiane caractéristique), typographie imprimée au lieu de gravée (test de l'ongle immédiat), teinte rouge trop orangée ou trop sombre, code série absent ou incohérent avec l'étiquette col. Le zip tie est livré attaché au vêtement par un point de couture fin (fil rouge assorti) qui le relie à l'œillet de poche — sur les fakes, ce point est souvent absent ou réalisé avec un fil blanc standard. Ce signal résout environ 50 % des cas douteux à l'achat en deadstock.",
    steps: [
      {
        title: "Mesurer la longueur et la largeur du zip tie",
        description:
          "Longueur totale 18 cm (tête + brin), largeur du brin 5 mm. Tolérance ± 2 mm sur la longueur, ± 0,3 mm sur la largeur. Un zip tie de 15 ou 20 cm est un signal de contrefaçon.",
      },
      {
        title: "Tester la gravure en relief à l'ongle",
        description:
          "Passez l'ongle sur la mention « OFF-WHITE™ c/o VIRGIL ABLOH™ ». Vous devez sentir un creux net de 0,3 mm. Si la surface est lisse, c'est une impression de surface — signal très fort de contrefaçon.",
      },
      {
        title: "Vérifier la teinte Pantone 185C",
        description:
          "Le rouge doit être vif, légèrement tirant vers le cerise, avec l'app Pantone Connect entre 184C et 186C. Un rouge orangé (192C) ou bordeaux (201C) révèle un nylon bon marché coloré en masse différente.",
      },
      {
        title: "Lire le code série à 7 chiffres",
        description:
          "Sur la tête du zip tie, en petites capitales Helvetica, un numéro de 7 chiffres est imprimé (ex. 2203847). Il doit correspondre au numéro de série de l'étiquette col principale. Une incohérence est un signal fort.",
      },
      {
        title: "Contrôler le point de couture de fixation",
        description:
          "Le zip tie est relié au vêtement (œillet de poche, boutonnière de manche) par un point fin en fil rouge assorti. Un point en fil blanc standard, ou l'absence totale de point (zip tie juste noué), est un signal.",
      },
    ],
    commonErrors: [
      {
        title: "Couper le zip tie avant de l'inspecter",
        description:
          "Beaucoup d'acheteurs coupent le zip tie dès le déballage parce qu'il gêne au port. Résultat : impossible de l'authentifier après coup. Conservez-le quelques jours, photographiez-le sous tous les angles, puis coupez.",
      },
      {
        title: "Ignorer le code série et ne regarder que la gravure",
        description:
          "La gravure en relief est nécessaire mais pas suffisante. Le code série doit correspondre à celui de l'étiquette col — c'est la double vérification qui élimine les fakes qui ont réussi la gravure mais imprimé un code aléatoire.",
      },
      {
        title: "Comparer un zip tie SS à un zip tie FW",
        description:
          "Off-White varie très légèrement les dimensions et la teinte entre saisons (rouge 184C en SS22, 186C en FW23). Comparez toujours à une photo du même drop plutôt qu'à un zip tie d'une saison différente.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs reproduisent le visuel du zip tie (couleur rouge, forme, mention « OFF-WHITE »), mais butent systématiquement sur la gravure en relief : ils impriment la typographie en surface par sérigraphie ou transfert thermique, sans creux perceptible. Les fakes haut de gamme sortis depuis 2023 utilisent des moules injection plus sophistiqués et reproduisent la gravure creuse — mais le code série reste incohérent ou identique sur toutes les pièces d'un même lot de contrefaçon (détectable en comparant deux fakes). Une autre tactique : joindre un vrai zip tie récupéré sur une pièce déstockée à un faux vêtement. Dans ce cas, le point de fixation est refait à la main, souvent au fil blanc standard.",
    faqs: [
      {
        question:
          "Le zip tie peut-il être manquant sur une pièce Off-White d'origine ?",
        answer:
          "Oui, dans deux cas. Premier cas : la pièce a été achetée et le zip tie coupé puis jeté par le premier propriétaire — c'est le plus fréquent sur le marché de seconde main. L'authentification bascule alors sur étiquette col, impression arrows, tag main label, coutures. Deuxième cas : certaines pièces techniques (GORE-TEX, vestes performance) ne sont pas livrées avec zip tie — c'est documenté sur off---white.com et cohérent. En revanche, un tee ou un hoodie Off-White vendu « neuf avec tags » sans zip tie est suspect : il aurait dû être présent à la livraison.",
      },
      {
        question:
          "La gravure en relief peut-elle s'user avec le temps et devenir moins lisible ?",
        answer:
          "Non, ou très peu. Le nylon injecté conserve sa gravure même après plusieurs années de port (le zip tie ne subit pas de friction notable puisqu'il reste accroché à l'œillet). Un zip tie dont la gravure est lissée ou peu lisible est soit une contrefaçon, soit une pièce qui a subi un accident (passage machine à laver, exposition directe à la chaleur). Dans le second cas, d'autres signaux sur le vêtement lui-même (étiquette col, tag main label) révèlent la légitimité.",
      },
    ],
  },
  {
    slug: "tag-main-label",
    name: "Tag main label (étiquette col principale)",
    brandSlug: "off-white",
    category: "clothing",
    tagline:
      "Décoder l'étiquette col Off-White : mention FIRENZE, made in Portugal, typographie Helvetica",
    intro:
      "L'étiquette principale cousue à l'intérieur du col Off-White est le signal d'identification le plus dense de la pièce — elle concentre l'identité de la maison (« OFF-WHITE c/o VIRGIL ABLOH™ - FIRENZE »), le pays d'assemblage, la composition textile, la taille, et un numéro de série à 7-8 chiffres qui croise avec le zip tie. Sur une pièce d'origine, l'étiquette mesure 6,5×4 cm, est imprimée sur tissé synthétique mat (pas brillant), et utilise une typographie Helvetica Neue Bold pour la ligne principale, Helvetica Neue Regular pour les informations techniques. La mention « FIRENZE » est obligatoire — Off-White étant légalement basée à Florence (siège New Guards Group, propriétaire de la marque depuis 2012). Le pays d'assemblage indique « MADE IN PORTUGAL » pour la majorité des tees et hoodies, « MADE IN ITALY » pour les pièces couture, « MADE IN ROMANIA » pour certaines denim et workwear. La composition textile respecte un format normé : « 100% COTTON » pour tees SS, « 80% COTTON / 20% POLYESTER » pour hoodies FW, avec chiffres exacts (jamais « 80-82% »). L'étiquette est cousue par 4 coutures droites aux 4 coins, 6-8 points/cm en fil noir ou ton sur ton. Les contrefaçons trahissent plusieurs défauts : tissu brillant (type satin au lieu de synthétique mat), typographie Arial ou Helvetica Standard au lieu de Neue, mention « FIRENZE » orthographiée « FIRENCE » ou « FLORENCE », numéro de série absent ou incohérent avec le zip tie. 70 % des fakes bas de gamme sont écartés uniquement par ce signal.",
    steps: [
      {
        title: "Retourner le col pour exposer l'étiquette principale",
        description:
          "Retournez le vêtement, écartez le col, photographiez l'étiquette à plat sous éclairage neutre. Elle doit être parfaitement lisible, sans plis ni reflets synthétiques.",
      },
      {
        title: "Vérifier la mention « FIRENZE » (pas Florence, pas Firence)",
        description:
          "La ville de référence est Florence, mais Off-White indique toujours « FIRENZE » (italien). Une orthographe « FLORENCE » (anglaise) ou « FIRENCE » (faute) est un signal immédiat de contrefaçon. La mention complète est « OFF-WHITE c/o VIRGIL ABLOH™ - FIRENZE ».",
      },
      {
        title: "Contrôler la typographie Helvetica Neue Bold",
        description:
          "La ligne principale utilise Helvetica Neue Bold. Comparez les lettres « O », « W », « F » avec une référence officielle. Une Arial Bold (très proche) trahit un contrefacteur qui n'a pas acquis la Neue. Le « a » à double étage et le « R » à jambe droite sont les différenciateurs.",
      },
      {
        title: "Lire le pays d'assemblage cohérent avec le modèle",
        description:
          "Tees/hoodies : MADE IN PORTUGAL. Pièces couture, vestes tailorées : MADE IN ITALY. Denim, workwear : MADE IN ROMANIA. Un tee classique « MADE IN CHINA » est impossible. Vérifiez la cohérence modèle ↔ pays.",
      },
      {
        title: "Identifier le numéro de série à 7-8 chiffres",
        description:
          "En bas à droite de l'étiquette, un numéro de 7-8 chiffres est imprimé en petite Helvetica Regular. Il correspond au lot de production et doit croiser avec le code du zip tie (les 7 derniers chiffres identiques).",
      },
    ],
    commonErrors: [
      {
        title: "Accepter « FLORENCE » au lieu de « FIRENZE »",
        description:
          "Off-White n'utilise que l'italien « FIRENZE ». Une étiquette « FLORENCE » est soit une contrefaçon bas de gamme, soit une impression erronée — dans les deux cas, c'est un signal définitif à écarter.",
      },
      {
        title:
          "Ignorer la cohérence numéro de série étiquette ↔ zip tie",
        description:
          "Les 7 derniers chiffres du numéro de série d'étiquette doivent être identiques au code série du zip tie. Une divergence révèle soit un assemblage frauduleux (vrai zip tie + faux vêtement), soit une contrefaçon complète.",
      },
      {
        title: "Confondre tissu mat et tissu satin",
        description:
          "L'étiquette d'origine est en synthétique mat, quasi invisible au flash. Un tissu satin brillant (très flatteur visuellement) est typique des fakes haut de gamme qui veulent « faire premium » — ça les trahit.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs reproduisent la mention « OFF-WHITE c/o VIRGIL ABLOH™ - FIRENZE » correctement dans 90 % des cas. Ils butent sur trois détails. Premier : le tissu — ils utilisent du satin brillant pour « faire cher » alors que l'original est mat. Deuxième : le numéro de série — ils impriment un code aléatoire qui ne croise pas avec le zip tie. Troisième : le pays — ils mettent « MADE IN ITALY » sur tous les modèles pour impressionner, alors que les tees et hoodies classiques sont portugais. Les fakes haut de gamme récents (2024+) maîtrisent l'étiquette et le zip tie de manière cohérente — pour ces cas, l'impression arrows et les coutures d'épaules restent discriminantes.",
    faqs: [
      {
        question:
          "Pourquoi Off-White utilise-t-il « FIRENZE » alors que la marque est associée à Milan ?",
        answer:
          "Off-White a été fondée à Milan par Virgil Abloh en 2013, mais la marque est légalement détenue depuis 2012 par New Guards Group, entité italienne basée à Florence (Firenze en italien). La mention « FIRENZE » reflète le siège social légal de la marque, pas le lieu de création. C'est un détail juridique qui authentifie la pièce — les contrefacteurs mal informés l'ignorent et écrivent « MILANO » ou « FLORENCE » en pensant bien faire.",
      },
      {
        question:
          "L'étiquette peut-elle avoir des dimensions ou un format différent selon les pièces ?",
        answer:
          "Oui, modérément. Les tees portent une étiquette 6,5×4 cm, les hoodies 7×4,5 cm (un peu plus grande pour accueillir les informations de composition), les vestes couture 8×5 cm (avec une ligne supplémentaire pour le modèle). Ces variations sont documentées. En revanche, une étiquette 10×6 cm (trop grande) ou 4×2 cm (trop petite) est un signal fort, ainsi qu'une étiquette collée au lieu de cousue (Off-White coud toujours).",
      },
    ],
  },
  {
    slug: "impression-arrows",
    name: "Impression arrows (flèches diagonales dos)",
    brandSlug: "off-white",
    category: "clothing",
    tagline:
      "Lire les arrows Off-White : écartement 10 cm, Pantone noir mat, sérigraphie",
    intro:
      "Les quatre flèches diagonales imprimées dans le dos des hoodies, tees et crewnecks sont la signature visuelle la plus reconnaissable d'Off-White — et l'un des signaux les plus précis pour authentifier une pièce. Sur une pièce d'origine, les arrows sont sérigraphiées en noir mat Pantone Black 6C (pas Black 7C — une nuance plus froide), disposées en croix (deux diagonales orientées haut-gauche/bas-droite, deux orientées haut-droite/bas-gauche), avec un écartement rigoureux de 10 cm entre chaque flèche sur un hoodie adulte taille M (tolérance ± 5 mm). Chaque flèche mesure 8×8 cm (tolérance ± 3 mm), avec des contours nets sans bavure, et l'encre pénètre le textile sur environ 0,2 mm (pas seulement en surface). Les contrefaçons trahissent plusieurs défauts : écartement incorrect (12 cm ou 8 cm, visible à la règle), flèches de dimensions inégales entre elles (un défaut de gabarit d'impression), encre trop brillante (vernis) ou trop pâle (sous-encrage), et — détail essentiel — orientation des flèches incohérente (trois dans un sens, une dans l'autre, par exemple). Au zoom ×10, les contours des vraies arrows sont nets et crénelés, les fakes montrent des bavures d'encre de 0,1-0,3 mm. Le test du grattage à l'ongle : sur une pièce d'origine, l'encre résiste ; sur une contrefaçon bas de gamme, elle s'écaille. Ce signal, combiné au tag main label et au zip tie, résout 85 % des cas douteux.",
    steps: [
      {
        title: "Photographier le dos à plat, éclairage rasant",
        description:
          "Posez le vêtement à plat, prenez la photo du dos avec un éclairage rasant (angle 45°) pour révéler la texture de l'encre. Un flash direct écrase le relief et masque certains défauts de sérigraphie.",
      },
      {
        title: "Mesurer l'écartement 10 cm entre flèches",
        description:
          "Sur un hoodie taille M, les flèches sont séparées de 10 cm centre à centre (tolérance ± 5 mm). Une règle flexible suit la courbure du dos. Un écartement de 12 cm ou 8 cm est un signal fort. Ajuster ± 1 cm pour les tailles XS (9 cm) et XXL (11 cm).",
      },
      {
        title: "Contrôler les dimensions 8×8 cm de chaque flèche",
        description:
          "Chaque flèche est un carré de 8 cm de côté. Sur les 4 flèches, elles doivent être strictement identiques en dimensions (tolérance ± 3 mm). Une flèche visiblement plus grande ou plus petite que les trois autres est un défaut de gabarit typique des fakes.",
      },
      {
        title: "Vérifier les 4 orientations en croix",
        description:
          "Deux flèches pointent en haut-gauche / bas-droite, deux en haut-droite / bas-gauche. Elles forment une croix visuelle. Une orientation toutes identiques, ou trois dans un sens et une dans l'autre, est un défaut d'impression impossible chez Off-White.",
      },
      {
        title: "Tester la teinte Pantone Black 6C et la résistance au grattage",
        description:
          "Black 6C est un noir mat légèrement chaud, distinguable du Black 7C (plus froid) au nuancier Pantone. Test secondaire : grattez légèrement l'encre à l'ongle sur 1 mm². Sur une pièce d'origine, l'encre résiste ; sur un fake bas de gamme, elle s'écaille en 2-3 passages.",
      },
    ],
    commonErrors: [
      {
        title: "Mesurer l'écartement sans ajuster pour la taille",
        description:
          "10 cm est la référence pour une taille M. Un XS a 9 cm, un L 10,5 cm, un XXL 11 cm. Ne signalez pas un écartement de 9 cm sur un XS comme contrefaçon — c'est normal. Vérifiez d'abord la taille.",
      },
      {
        title: "Ignorer les 4 orientations en croix",
        description:
          "C'est le détail le plus négligé. Les fakes bas de gamme impriment les 4 flèches dans la même orientation (par flemme de gabarit). Sur une pièce d'origine, c'est toujours une croix.",
      },
      {
        title: "Confondre encre brillante (fake) et légère patine de lavage (vrai)",
        description:
          "Une pièce lavée 20 fois perd légèrement l'intensité des arrows — l'encre devient plus terne. C'est normal et n'indique pas une contrefaçon. En revanche, une encre brillante comme du vernis sur une pièce « neuve » est un signal fort.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs maîtrisent la forme de la flèche et la teinte noire. Ils butent sur trois paramètres : l'écartement précis (souvent 12 cm au lieu de 10 cm, le gabarit « joli à l'œil »), les 4 orientations en croix (souvent toutes identiques), et la pénétration de l'encre (sérigraphie superficielle qui s'écaille au grattage). Les fakes haut de gamme 2024 reproduisent les 4 orientations mais gardent un écartement légèrement trop grand (11-12 cm) — détectable à la règle. Certains contrefacteurs utilisent un transfert thermique au lieu de sérigraphie : le rendu est brillant et l'encre ne pénètre pas le textile, elle flotte dessus. Le test du grattage révèle immédiatement ce défaut.",
    faqs: [
      {
        question:
          "Les arrows sont-elles toujours imprimées au dos, ou peuvent-elles être ailleurs ?",
        answer:
          "Sur les pièces classiques (hoodies, tees, crewnecks), les arrows sont systématiquement au dos, disposées en croix sur 4 flèches. Sur certaines pièces spéciales (collab Nike, capsules saisonnières), elles peuvent apparaître sur la manche, sur le devant en haut-gauche, ou sur une poche. Dans ces cas, consultez les archives de off---white.com ou les photos StockX du drop pour vérifier l'emplacement attendu. Une flèche au dos sur un modèle qui devait l'avoir sur la manche est un signal fort de contrefaçon.",
      },
      {
        question:
          "Les arrows perdent-elles leur intensité après plusieurs lavages ?",
        answer:
          "Oui, légèrement. Après 15-20 lavages à 30°C, la sérigraphie Off-White peut voir son noir Black 6C tirer vers un gris foncé (Pantone 433C environ). C'est un vieillissement normal. Ce qui reste intact : les dimensions, l'écartement et l'orientation en croix. Une pièce portée 5 ans dont les arrows sont légèrement terne mais aux dimensions exactes est plus légitime qu'une pièce « neuve » aux arrows parfaitement noires mais aux dimensions incorrectes.",
      },
    ],
  },
  {
    slug: "etiquette-lavage",
    name: "Étiquette de lavage (care label)",
    brandSlug: "off-white",
    category: "clothing",
    tagline:
      "Décoder l'étiquette lavage Off-White : symboles ISO, copyright, code RN/CA",
    intro:
      "L'étiquette de lavage cousue à l'intérieur du vêtement (généralement sur le côté gauche à hauteur de hanche) est le signal d'authentification le plus négligé par les acheteurs — et paradoxalement l'un des plus discriminants. Elle concentre des informations réglementaires obligatoires qu'un contrefacteur pressé oublie souvent : symboles de lavage ISO 3758 (5 pictogrammes standards), composition textile détaillée en pourcentages exacts (doit correspondre à l'étiquette col), code RN ou CA (registration number US/Canada, 5-6 chiffres), pays d'assemblage répété, copyright « © OFF-WHITE™ 20XX » avec année exacte, et un numéro de lot à 4-5 chiffres imprimé horizontalement. L'étiquette mesure 5×8 cm, est imprimée en Helvetica Neue Regular 6pt sur tissé mat blanc, avec un interlignage serré mais lisible à la loupe. Les contrefaçons trahissent plusieurs défauts : symboles ISO incorrects ou mal positionnés (l'ordre officiel est : lavage, blanchiment, séchage, repassage, nettoyage à sec), absence de code RN/CA (les fakes oublient cette mention obligatoire aux USA et Canada), année de copyright incohérente avec la saison du drop (un tee SS24 avec © 2020 est impossible), ou typographie en Arial au lieu d'Helvetica. Le détail le plus discriminant reste la correspondance composition étiquette lavage ↔ étiquette col : elles doivent être strictement identiques en pourcentages. Une divergence (80% / 20% au col, 82% / 18% au lavage) révèle une contrefaçon qui a recopié deux sources différentes.",
    steps: [
      {
        title: "Localiser l'étiquette de lavage (côté gauche, hauteur hanche)",
        description:
          "L'étiquette est cousue à l'intérieur du vêtement sur la couture latérale gauche, à hauteur de hanche (environ 40 cm en dessous du col). Sur les hoodies, elle peut être dans la couture de la poche kangourou.",
      },
      {
        title: "Vérifier les 5 symboles ISO 3758 dans l'ordre officiel",
        description:
          "Lavage (bassine), blanchiment (triangle), séchage (carré), repassage (fer), nettoyage à sec (cercle). Dans cet ordre, de gauche à droite. Une inversion, ou l'absence d'un symbole, est un signal.",
      },
      {
        title: "Contrôler la correspondance composition ↔ étiquette col",
        description:
          "Les pourcentages de composition textile doivent être strictement identiques entre étiquette col et étiquette lavage. Une divergence de 2 % révèle une contrefaçon qui a utilisé deux templates.",
      },
      {
        title: "Lire le code RN ou CA (5-6 chiffres)",
        description:
          "Pour l'export USA/Canada, Off-White imprime un « RN 12345 » ou « CA 98765 ». L'absence totale de ce code sur un tee destiné au marché US est un signal fort. Vérifiez avec le site rn.ftc.gov si le code existe.",
      },
      {
        title: "Vérifier le copyright « © OFF-WHITE™ 20XX » cohérent avec la saison",
        description:
          "L'année du copyright doit correspondre à la saison du drop : SS24 → © 2024, FW23 → © 2023, collab Nike AW22 → © 2022. Un copyright 2020 sur un tee SS24 est une incohérence logique impossible en production officielle.",
      },
    ],
    commonErrors: [
      {
        title: "Ne pas photographier l'étiquette lavage à la loupe",
        description:
          "Le texte est en 6pt, illisible à l'œil nu. Photographiez en macro (zoom x3 minimum) avec éclairage LED. Vous devez pouvoir lire chaque caractère.",
      },
      {
        title: "Ignorer la cohérence copyright ↔ année de drop",
        description:
          "C'est le test le plus rapide : une divergence d'année est un signal définitif. Certains fakes réutilisent un template 2020 pour toutes les saisons — une erreur éliminatoire.",
      },
      {
        title: "Accepter une composition textile non identique au col",
        description:
          "Si le col indique « 80% COTTON / 20% POLYESTER » et le lavage « 82% COTTON / 18% POLYESTER », c'est une contrefaçon. Off-White utilise un template unique par pièce — pas de divergence.",
      },
    ],
    counterfeiterTactics:
      "Les contrefacteurs bas de gamme reproduisent l'étiquette col avec soin, mais négligent l'étiquette lavage — ils y mettent des symboles ISO génériques téléchargés sur Google, un code RN imaginaire, une composition approximative, et un copyright « © 2020 » recopié d'un ancien drop. Résultat : incohérence immédiate avec le col. Les fakes haut de gamme 2024 synchronisent les deux étiquettes, mais butent sur le code RN : ils impriment soit un code inexistant (vérifiable sur rn.ftc.gov), soit un code attribué à une marque concurrente (catastrophe immédiate au croisement). Le test RN est l'un des plus rapides : 30 secondes sur rn.ftc.gov suffisent pour confirmer ou infirmer.",
    faqs: [
      {
        question: "Comment vérifier un code RN en ligne ?",
        answer:
          "Rendez-vous sur rn.ftc.gov (site officiel de la Federal Trade Commission US). Entrez le code à 5-6 chiffres trouvé sur l'étiquette lavage. Le site retourne le nom de l'entreprise détentrice. Pour Off-White, le code doit renvoyer à « New Guards Group » ou à une de ses filiales (Off-White Operating ou équivalent). Un retour « Off-White International », « Off White LLC » ou tout autre nom est suspect — c'est souvent un code inventé. L'absence totale de résultat est un signal fort de contrefaçon sur une pièce destinée au marché US.",
      },
      {
        question:
          "L'étiquette lavage peut-elle être découpée par l'utilisateur sans affecter l'authentification ?",
        answer:
          "Oui mais c'est problématique à la revente. Certains porteurs coupent l'étiquette lavage parce qu'elle gratte la peau. Sur le marché de seconde main, une étiquette lavage coupée divise par deux les signaux disponibles et rend l'authentification plus difficile. La plupart des plateformes (Grailed, Vestiaire Collective) acceptent les pièces sans étiquette lavage mais demandent des photos macro de l'étiquette col et du tag main label. À l'achat, privilégiez systématiquement les pièces avec étiquette lavage intacte.",
      },
    ],
  },
];
