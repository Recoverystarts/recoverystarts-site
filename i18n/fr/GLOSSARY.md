# French glossary — the words every tr3 runner uses the same way

*Started 2026-10-12 by wave tr3 S1-fr (the super). Neutral French, the French A.A. World Services publishes (read in Québec, Europe and Africa alike). The reader is **vous**, plain and warm. No Québec-only or France-only slang. Where A.A. prints its own French, we use it word for word; the source is in brackets. **[nôtre]** marks a wording we couldn't find printed by A.A. online: it's ours, fixed here so every page says it the same way. Add to this file through your close (the super merges additions), not by changing it mid-wave. The 12 & 12 (« Les Douze Étapes et les Douze Traditions ») is never a source.*

Sources checked 2026-10-12: SMF-121FR (Steps), FP-28 (Traditions), SMF-114FR (Concepts), SMF-141FR (Serenity Prayer), SMF-92FR (Preamble), FP-15 (sponsorship), the French Big Book chapters and Appendice I on aa.org (`aa.org/sites/default/files/2021-11/fr_bigbook_*.pdf`), the French Service Manual (FBM-31), aa.org/fr.

## How to write a segment
- Write in the placeholder form: keep every `<0>…</0>` pair and `<1/>` the English has, around the words that belong in it, in whatever order French needs. Don't type HTML.
- `node scripts/i18n/check.mjs fr <your-batch>` must say 0 problems. `node scripts/i18n/score.mjs fr` has a `reg` column (tu/toi/ton/ta/tes/t' slips) — keep it at 0 outside quotes.
- **Typography:** write « guillemets » for quotes, ’ or ' for the apostrophe, and a normal space before : ; ! ? and inside « ». **The desk turns those spaces into non-breaking ones at merge** (`desk/fix_fr.py`), so don't hunt for special characters. Plain characters are fine (é, à, ç, œ, —, …); `&mdash;`-style entities may stay as they are.
- **AA, not A.A.:** French A.A. writes **AA** with no periods: « les AA », « des AA », « un membre des AA », « un groupe des AA ». The fellowship is **le Mouvement** (capital M) or « notre association » — never « la Fraternité ». A fellowship in general (NA, GA…) is « une fraternité ».
- **Register:** vous everywhere. Inclusive spelling (« seul·e ») isn't used; use the masculine generic as A.A.'s French does, or reword to avoid gender. Sponsor in general: « parrain ou marraine » once, then « parrain ».
- Numbers: 1 234 (space) · 2,99 $ · 19 h 30 · le 18 novembre 1982 · 4e édition · XXe siècle. Months and days lower case in running text (janvier, lundi); a month alone as a label or heading starts with a capital (Janvier).
- **Page references stay the English 4th Edition's numbers**: « p. 417 », « page 86 ». The French edition is paginated differently; never swap in its page numbers.
- Names stay as they are: Bill W., Dr Bob (no period after Dr in French), Akron, Recovery Einstein, Recovery Starts, Addict2Influencer, AutoGrow AI Solutions, Claude's Lab, Derick, Seeker, Pro.
- Watch for lost negatives: « ne… pas », « ne… jamais », « ne… aucun », « sauf » — a dropped « ne » or « jamais » turns a Tradition upside down (tr1 lost one in Tradition Four).
- Meta descriptions (the short text Google shows) end on a full sentence, never cut mid-sentence.
- Translate it yourself; no Google or other machine translation.

## Crisis lines — read this before any 988, detox or withdrawal segment
What's true (checked 2026-10-12, each on the service's own site):
- **Canada — 9-8-8, Ligne d'aide en cas de crise de suicide**: call **or text** 988, **in French or English**, 24/7, free. [canada.ca: « peuvent appeler ou envoyer un texto au 988, en anglais ou en français »; 988.ca/fr: « 24/7/365 »]. In Québec, a call to 988 is put through to Québec's own line, **1 866 APPELLE (1 866 277-3553)**; Québec also takes texts at **535353** and chat at suicide.ca [suicide.ca].
- **USA — 988 Suicide & Crisis Lifeline**: calls, chat and text are in English and Spanish; a **call** gets an interpreter in 240+ more languages, French among them, free. **Text and chat have no interpreter.** [samhsa.gov/mental-health/988/faqs]
- **France — 3114**, « le numéro national de prévention du suicide », free, 24/7, all of France [3114.fr].
- **Belgium — Centre de Prévention du Suicide, 0800 32 123** [preventionsuicide.be]. **Switzerland — La Main Tendue, 143** [143.ch]. Only where a segment already talks about lines outside North America.
- Emergency: 911 in Canada and the US; 112 in France and Europe (15 SAMU in France).

So on a fr page **never write "appelez ou textez le 988" without "Au Canada"** — a French speaker who texts the US 988 gets English. Use these:

| English | French |
|---|---|
| In crisis? Call or text 988 | En crise ? Au Canada, appelez ou textez le 988 (en français, 24 h sur 24). Aux États-Unis, appelez le 988 et demandez un interprète en français. En France, appelez le 3114. |
| If you're in crisis, call or text 988 (Suicide & Crisis Lifeline). | Si vous êtes en crise, au Canada, appelez ou textez le 988 (Ligne d'aide en cas de crise de suicide, en français) ; aux États-Unis, appelez le 988 (Suicide & Crisis Lifeline) et demandez un interprète ; en France, appelez le 3114. |
| …988 inside a longer sentence | « le 988 (au Canada, appel ou texto en français ; aux États-Unis, appel avec interprète) », and add « en France, le 3114 » where the sentence has room |
| Call 911 / go to the emergency room | Appelez le 911 (112 en Europe) / rendez-vous aux urgences |
| detox / medical detox | sevrage / sevrage sous surveillance médicale (« désintoxication » also fine) |
| withdrawal / alcohol withdrawal | sevrage / sevrage alcoolique (symptômes de sevrage) |
| withdrawal can be dangerous — even fatal | le sevrage alcoolique peut être dangereux, voire mortel |
| not medical advice | ce n'est pas un avis médical |
| treatment / treatment center | traitement / centre de traitement |

Keep every number in a crisis segment exactly as the English has it, plus the Canada/France lines. Every crisis/988/detox/withdrawal segment is read by the super.

## Fellowships and books
| English | French |
|---|---|
| Alcoholics Anonymous / A.A. | les Alcooliques anonymes / les AA [aa.org/fr] — a member: « un membre des AA » |
| Narcotics Anonymous / N.A. | Narcotiques anonymes / NA |
| Cocaine Anonymous / C.A. | Cocaïnomanes anonymes / CA |
| Gamblers Anonymous | Gamblers anonymes |
| Crystal Meth Anonymous, Sex Addicts Anonymous, SMART Recovery, Recovery Dharma, Celebrate Recovery | names stay in English |
| Al-Anon / Alateen | Al-Anon / Alateen |
| the Big Book | le Gros Livre [aa.org/fr/the-big-book: « également connu sous le nom de "Gros Livre" »] — its title is <i>Les Alcooliques anonymes</i>; first mention on a page may say « le Gros Livre (<i>Les Alcooliques anonymes</i>) » |
| Alcoholics Anonymous, 4th Edition (a citation of the English book) | <i>Alcoholics Anonymous</i>, 4e édition (en anglais) |
| Twelve Steps and Twelve Traditions ("12 & 12") | <i>Les Douze Étapes et les Douze Traditions</i> (« le Douze et Douze ») [aa.org/fr] |
| Daily Reflections | <i>Réflexions quotidiennes</i> [aa.org/fr] |
| Living Sober | <i>Vivre… sans alcool !</i> [aa.org/fr] |
| As Bill Sees It | <i>Réflexions de Bill</i> [aa.org/fr] |
| A.A. Comes of Age | <i>Le Mouvement des AA devient adulte</i> [FBM-31, SMF-129FR] |
| "Pass It On" | <i>Transmets-le</i> [FBM-31] |
| Dr. Bob and the Good Oldtimers | <i>Dr Bob et les pionniers</i> [FBM-31] |
| The Language of the Heart | <i>Le langage du cœur</i> [FBM-31] |
| Grapevine / La Viña | AA Grapevine / La Viña (the French-language magazine is <i>La Vigne AA</i>; don't swap it in for Grapevine) |
| the A.A. Preamble | le Préambule des AA [SMF-92FR] (below) |
| the Promises | les Promesses **[nôtre]** — the passage begins « Nous connaîtrons une nouvelle liberté et un nouveau bonheur. » [Big Book ch. 6] |

### Big Book chapters — A.A.'s French titles [fr_bigbook_contents.pdf and each chapter]
| English | French |
|---|---|
| Foreword to the First Edition (Second…, Third…, Fourth…) | Avant-propos de la première édition (deuxième, troisième, quatrième) |
| The Doctor's Opinion | L'opinion d'un médecin |
| 1 Bill's Story | L'histoire de Bill |
| 2 There Is a Solution | Il y a une solution |
| 3 More About Alcoholism | Autres données sur l'alcoolisme |
| 4 We Agnostics | Nous, les agnostiques |
| 5 How It Works | Notre méthode |
| 6 Into Action | À l'œuvre ! |
| 7 Working with Others | Au secours des autres |
| 8 To Wives | Aux conjointes |
| 9 The Family Afterward | La famille et le rétablissement |
| 10 To Employers | Aux employeurs |
| 11 A Vision for You | La vie qui vous attend |
| Personal Stories – Part I / II / III | Histoires personnelles – Partie I / II / III |
| Appendices | Appendices |
| Chapter 3 – More About Alcoholism | Chapitre 3 – Autres données sur l'alcoolisme (same pattern for every chapter) |

A personal story's English title: translate it faithfully **[nôtre]**, the same each time it comes back in your batch.

## Program words
| English | French |
|---|---|
| fellowship (A.A.'s) | le Mouvement / notre association [SMF-114FR, FBM-31] |
| meeting | réunion (a room: « une salle ») |
| open / closed meeting | réunion ouverte / fermée [aa.org/fr] |
| home group | groupe d'attache [FP-15, FBM-31] |
| group conscience | conscience de groupe [Tradition 2] |
| sponsor / sponsee / sponsorship / to sponsor | parrain (marraine) / filleul (filleule) / parrainage / parrainer [FP-15] |
| newcomer | nouveau (nouvelle), nouveaux venus [FP-15, aa.org/fr] |
| old-timer | ancien (ancienne), membre de longue date **[nôtre]** |
| sobriety / sober | abstinence, sobriété / abstinent, sobre — A.A.'s French says « abstinent » for "sober" [Preamble], « sobriété » is fine too |
| the Steps / Step One / Twelfth Step work | les Étapes / la Première Étape / le travail de Douzième Étape [SMF-121FR] |
| the Traditions / the Concepts | les Traditions / les Concepts (les Douze Concepts des services mondiaux) [SMF-114FR] |
| inventory / moral inventory | inventaire / inventaire moral [Étape 4] |
| resentment | ressentiment |
| defects of character / character defects | défauts de caractère (Step 6 itself says « tous ces défauts ») [Étape 6] |
| shortcomings | défauts [Étape 7] |
| the exact nature of our wrongs | la nature exacte de nos torts [Étape 5] |
| amends / make amends | réparation / réparer nos torts [Étapes 8–9] |
| Higher Power | Puissance supérieure [Étape 2, Big Book] |
| God as we understood Him | Dieu tel que nous Le concevions [Étapes 3, 11] |
| spiritual awakening | réveil spirituel [Étape 12] |
| powerless over alcohol | impuissants devant l'alcool [Étape 1] |
| our lives had become unmanageable | nous avions perdu la maîtrise de notre vie [Étape 1] — "unmanageable" alone: « ingérable », « hors de contrôle » |
| carry the message | transmettre le message [Étape 12, Tradition 5] |
| the alcoholic who still suffers | l'alcoolique qui souffre encore [Tradition 5] |
| primary purpose | objectif primordial [Tradition 5] |
| self-supporting / the Seventh Tradition basket | subvenir entièrement à ses besoins, s'autofinancer [Tradition 7] / le panier de la Septième Tradition |
| anonymity | anonymat |
| General Service Office / General Service Board / General Service Conference / trustees | Bureau des Services généraux (BSG) / Conseil des Services généraux / Conférence des Services généraux / administrateurs [aa.org/fr, SMF-114FR] |
| the Right of Decision / Participation / Appeal / Petition | le Droit de décision / de participation / d'appel / de pétition [SMF-114FR, FBM-31] |
| intergroup / district / area | intergroupe / district / région |
| the Oxford Group | le Groupe d'Oxford |
| the Third Step prayer / Seventh Step prayer | la prière de la Troisième Étape / la prière de la Septième Étape |
| step work | le travail des Étapes |

## The Twelve Steps — A.A.'s French, word for word [SMF-121FR]
1. Nous avons admis que nous étions impuissants devant l'alcool – que nous avions perdu la maîtrise de notre vie.
2. Nous en sommes venus à croire qu'une puissance supérieure à nous-mêmes pouvait nous rendre la raison.
3. Nous avons décidé de confier notre volonté et notre vie aux soins de Dieu tel que nous Le concevions.
4. Nous avons procédé sans crainte à un inventaire moral, approfondi de nous-mêmes.
5. Nous avons avoué à Dieu, à nous-mêmes et à un autre être humain la nature exacte de nos torts.
6. Nous étions tout à fait prêts à ce que Dieu élimine tous ces défauts.
7. Nous Lui avons humblement demandé de faire disparaître nos défauts.
8. Nous avons dressé une liste de toutes les personnes que nous avions lésées et nous avons consenti à réparer nos torts envers chacune d'elles.
9. Nous avons réparé nos torts directement envers ces personnes dans la mesure du possible, sauf lorsqu'en ce faisant, nous risquions de leur nuire ou de nuire à d'autres.
10. Nous avons poursuivi notre inventaire personnel et promptement admis nos torts dès que nous nous en sommes aperçus.
11. Nous avons cherché par la prière et la méditation à améliorer notre contact conscient avec Dieu tel que nous Le concevions, Lui demandant seulement de connaître Sa volonté à notre égard et de nous donner la force de l'exécuter.
12. Ayant connu un réveil spirituel comme résultat de ces étapes, nous avons alors essayé de transmettre ce message à d'autres alcooliques et de mettre en pratique ces principes dans tous les domaines de notre vie.

A Step quoted in part uses these words, cut, not reworded (« impuissants devant l'alcool », « un inventaire moral, approfondi de nous-mêmes »). Note Step 2 prints « puissance supérieure » lower case inside the Step; elsewhere the term is « Puissance supérieure ».

## The Twelve Traditions, short form — A.A.'s French, word for word [FP-28]
1. Notre bien-être commun devrait venir en premier lieu ; le rétablissement personnel dépend de l'unité des AA.
2. Dans la poursuite de notre objectif commun, il n'existe qu'une seule autorité ultime : un Dieu d'amour tel qu'Il peut se manifester dans notre conscience de groupe. Nos chefs ne sont que des serviteurs de confiance, ils ne gouvernent pas.
3. Le désir d'arrêter de boire est la seule condition pour être membre des AA.
4. Chaque groupe devrait être autonome, sauf sur les points qui touchent d'autres groupes ou l'ensemble du Mouvement.
5. Chaque groupe n'a qu'un objectif primordial : transmettre son message à l'alcoolique qui souffre encore.
6. Un groupe ne devrait jamais endosser ou financer d'autres organismes, qu'ils soient apparentés ou étrangers aux AA, ni leur prêter le nom des Alcooliques anonymes, de peur que les soucis d'argent, de propriété ou de prestige ne nous distraient de notre objectif premier.
7. Tous les groupes devraient subvenir entièrement à leurs besoins et refuser les contributions de l'extérieur.
8. Le mouvement des Alcooliques anonymes devrait toujours demeurer non professionnel, mais nos centres de service peuvent engager des employés qualifiés.
9. Comme Mouvement, les Alcooliques anonymes ne devraient jamais avoir de structure formelle, mais nous pouvons constituer des conseils ou des comités de service directement responsables envers ceux qu'ils servent.
10. Le mouvement des Alcooliques anonymes n'exprime aucune opinion sur des sujets étrangers ; le nom des AA ne devrait donc jamais être mêlé à des controverses publiques.
11. La politique de nos relations publiques est basée sur l'attrait plutôt que sur la réclame ; nous devons toujours garder l'anonymat personnel dans la presse écrite et parlée, de même qu'au cinéma.
12. L'anonymat est la base spirituelle de toutes nos traditions et nous rappelle sans cesse de placer les principes au-dessus des personnalités.

Where the English bolds the first half of a Tradition (`<0>…</0>`), cut the French at the matching point; see core.json (the /aa-info/ page) for all twelve already cut. Lost-negative watch: Four « **sauf** », Six « **jamais** », Nine « **jamais** », Ten « **aucune** » and « **jamais** ».

## The Twelve Traditions, long form — A.A.'s French, word for word [French Big Book, Appendice I, « Les Douze Traditions (Version intégrale) »]
Opening line: « L'expérience des AA nous enseigne ceci : »
1. Chaque membre des Alcooliques anonymes n'est qu'une infime partie d'un grand tout. Les AA doivent continuer d'exister sinon la plupart d'entre nous serons voués à une mort certaine. Notre bien-être commun doit donc venir en premier lieu mais notre bien-être personnel vient tout de suite après.
2. Dans la poursuite de notre objectif commun, il n'existe qu'une seule autorité ultime : un Dieu d'amour tel qu'Il peut se manifester dans notre conscience de groupe.
3. Nous devons admettre dans nos rangs tous ceux qui souffrent d'alcoolisme. Dès lors, nous ne pouvons exclure quiconque désirant se rétablir. De plus, l'adhésion aux AA n'est conditionnelle à aucune contribution monétaire ni à aucune conformité à quelque règle. Dès que deux ou trois alcooliques se rassemblent pour leur sobriété, ils peuvent se considérer comme un groupe des AA pourvu qu'en tant que groupe, ils ne soient associés à aucun autre organisme.
4. En ce qui concerne son propre fonctionnement, chaque groupe des AA ne devrait dépendre d'aucune autorité autre que sa propre conscience. Mais si ses projets affectent le bien-être d'autres groupes environnants, ces derniers devraient être consultés. De même, aucun groupe, comité régional ou membre ne devrait poser d'actes susceptibles d'affecter l'ensemble du Mouvement sans en avoir d'abord parlé aux administrateurs du Conseil des Services généraux. En pareil cas, le bien-être commun passe avant tout.
5. Chaque groupe des Alcooliques anonymes devrait constituer une entité spirituelle n'ayant qu'un objectif primordial : transmettre son message à l'alcoolique qui souffre encore.
6. Les questions d'argent, de propriété et d'autorité peuvent facilement nous détourner de notre but spirituel premier. Nous croyons donc que toute propriété importante vraiment utile aux AA devrait être détenue et administrée séparément par une société dûment constituée, pour bien distinguer le matériel du spirituel. Un groupe des AA comme tel ne devrait jamais se lancer en affaires. Les organismes qui peuvent servir d'appoints aux AA comme les clubs, les hôpitaux, et qui nécessitent l'acquisition ou la gestion de propriété, devraient être constitués en société et demeurer indépendants des groupes pour que, si nécessaire, on puisse s'en détacher facilement. Ces organismes, par conséquent, ne devraient pas utiliser le nom des AA. Leur gestion devrait incomber exclusivement à leurs bailleurs de fonds. Il est cependant préférable que les clubs soient administrés par des membres des AA. Mais les hôpitaux et les autres centres de traitement devraient se situer en dehors du Mouvement et relever d'une autorité médicale. S'il est vrai qu'un groupe des AA peut collaborer avec tous, cette collaboration ne doit jamais prendre la forme d'une association ou d'une caution, réelle ou implicite. Un groupe des AA doit être libre de toute attache.
7. Les groupes des AA devraient s'autofinancer en totalité par les contributions volontaires de leurs membres. Nous croyons que chaque groupe devrait atteindre cet objectif le plus rapidement possible ; qu'il est très dangereux d'utiliser le nom des AA pour quelque sollicitation de fonds auprès du public, qu'elle soit faite par des groupes, des clubs, des hôpitaux ou des organismes extérieurs ; qu'il est imprudent d'accepter des dons considérables, qu'elle qu'en soit la source, ou des contributions comportant quelque obligation que ce soit. De même, nous trouvons très inquiétantes les trésoreries d'entités AA qui accumulent des fonds, au-delà d'une réserve prudente, sans les destiner à des fins AA. L'expérience nous a souvent démontré que rien n'est plus susceptible de détruire notre héritage spirituel que les disputes futiles sur des questions de propriété, d'argent ou d'autorité.
8. Les Alcooliques anonymes devraient toujours demeurer une organisation non professionnelle. Par professionnalisme, on entend tout service rémunéré à titre de conseiller en alcoolisme. Nous pouvons cependant employer des alcooliques pour des tâches qui autrement nous demanderaient d'embaucher des non-alcooliques. Ces services particuliers peuvent mériter une juste rémunération. Notre travail habituel de Douzième Étape doit cependant toujours demeurer gratuit.
9. Chaque groupe des AA n'a besoin que d'une structure minimale. La formule de la rotation à la direction est la meilleure. Un petit groupe peut élire son secrétaire, un groupe plus considérable désignera un comité rotatoire, et les groupes d'une vaste région métropolitaine formeront un comité central ou un intergroupe qui nécessitera souvent l'embauche d'un secrétaire à plein temps. Les administrateurs du Conseil des Services généraux constituent en fait notre Comité des Services généraux des AA. Ils sont les gardiens de nos Traditions et les dépositaires des contributions volontaires des membres, contributions qui servent au support financier du Bureau des Services généraux des AA, à New York. Les groupes leur confèrent l'autorité de s'occuper de l'ensemble de nos relations publiques et d'assurer l'intégrité de notre magazine principal, le AA Grapevine. Tous ces représentants doivent être animés d'un esprit de service parce que chez les AA, les vrais chefs ne sont que des serviteurs de confiance et d'expérience pour l'ensemble du Mouvement. Leur titre ne leur confère aucune autorité véritable ; ils ne gouvernent pas. Leur utilité dérive du respect universel qui leur est accordé.
10. Aucun groupe ou membre des AA ne devrait, sous aucun prétexte, exprimer une opinion qui engagerait le Mouvement sur tout sujet extérieur qui prête à controverse, tout particulièrement en matière de politique, de lutte contre l'alcoolisme ou de différence religieuse. Les groupes des Alcooliques ne s'opposent à personne. Sur de tels sujets, ils ne peuvent exprimer quelque opinion que ce soit.
11. Nos relations avec le grand public devraient se caractériser par l'anonymat personnel. Nous pensons que les AA devraient éviter la publicité à sensation. Notre nom et notre photo nous identifiant comme membres des AA ne devraient jamais être diffusés sur les ondes ou dans des films ou des écrits publics. Nos relations publiques devraient être guidées par l'attrait plutôt que par celui de la réclame. Il n'y a jamais lieu de se vanter. Nous croyons qu'il est beaucoup plus profitable de laisser ce soin à nos amis.
12. En dernier lieu, nous, des Alcooliques anonymes, croyons que le principe de l'anonymat revêt une immense importance spirituelle. Il nous rappelle que nous devons placer les principes au-dessus des personnalités et pratiquer une humilité véritable. Ceci, pour que les grâces reçues ne nous gâtent jamais, et pour que nous puissions vivre pour toujours dans la plus profonde gratitude envers Celui qui est le maître de nos destinées.

(Printed as A.A. prints it, its two slips included: « qu'elle qu'en soit la source » in 7 and « Les groupes des Alcooliques ne s'opposent à personne » in 10.) Where the English splits a long-form Tradition into several segments, split the French at the matching sentence. A sentence from the long form quoted anywhere else on the site (Tradition 3's « pourvu qu'en tant que groupe, ils ne soient associés à aucun autre organisme » is quoted a lot) uses these words.

**On the /12-traditions/ page:** both forms are A.A.'s own French, so "reproduced here in full — both forms, word for word — from Alcoholics Anonymous, 4th Edition: short form pp. 561–562, long form pp. 563–566" becomes « reproduites ici intégralement — les deux formes, mot pour mot — dans la traduction française des AA (<i>Les Alcooliques anonymes</i>, Appendice I) ; dans <i>Alcoholics Anonymous</i>, 4e édition (en anglais) : forme courte p. 561–562, forme longue p. 563–566 ». Keep the English page numbers.

## The Twelve Concepts, short form [SMF-114FR]
Use A.A.'s French, cut to the sentences the English page has (the English site prints only the first sentence of Concepts 7–12). All twelve, already cut, are in `i18n/fr/core.json` (the /aa-info/ page): use exactly those sentences wherever a Concept is quoted. Full official text: SMF-114FR on aa.org.

## Prayers and fixed texts — one wording, everywhere
- **Serenity Prayer** [SMF-141FR]: « Mon Dieu, donnez-moi la sérénité d'accepter les choses que je ne peux changer, le courage de changer celles que je peux, et la sagesse d'en connaître la différence. »
- **Third Step prayer** (English p. 63) [French Big Book, « Notre méthode »]: « Mon Dieu, je m'offre à Vous pour que Vous fassiez de moi et avec moi comme bon Vous semble. Délivrez-moi de l'esclavage de l'égoïsme pour que je puisse mieux faire Votre volonté. Éloignez de moi les difficultés de sorte que ma victoire sur elles soit, pour ceux et celles que j'aurai aidés, un témoignage de Votre force, de Votre amour et de Votre mode de vie. Que j'accomplisse toujours Votre volonté ! » (A.A.'s PDF capitalises « Vous » unevenly; we capitalise it every time.)
- **Seventh Step prayer** (English p. 76) [French Big Book, « À l'œuvre ! »]: « Mon Créateur, je suis maintenant disposé à ce que Vous preniez tout ce que je suis, bon ou mauvais. Je Vous demande d'ôter de moi chacun des défauts qui m'empêche de Vous être utile, à Vous et à mes semblables. Accordez-moi la force de faire Votre volonté à partir de maintenant. Ainsi soit-il. »
- **The A.A. Preamble** [SMF-92FR]: « Les Alcooliques anonymes sont une association de personnes qui partagent entre elles leur expérience, leur force et leur espoir dans le but de résoudre leur problème commun et d'aider d'autres alcooliques à se rétablir. Le désir d'arrêter de boire est la seule condition pour devenir membre des AA. Les AA ne demandent ni cotisation ni droit d'entrée ; nous nous finançons par nos propres contributions. Les AA ne sont associés à aucune secte, confession religieuse ou politique, à aucun organisme ou établissement ; ils ne désirent s'engager dans aucune controverse ; ils n'endossent et ne contestent aucune cause. Notre but premier est de demeurer abstinent et d'aider d'autres alcooliques à le devenir. »
- A prayer or fixed text quoted in part uses these words, cut, not reworded.
- **Any other line the English quotes from the Big Book, a pamphlet or Grapevine:** translate it faithfully yourself (traduction libre), and use the same French each time the same English line comes back in your batch (search your file before you write it again). Don't go looking for the French edition's wording for ordinary quotes — one rule for everyone keeps the pages even.
- A quote's credit line: the English "Alcoholics Anonymous, 4th Edition, page N. A short quote, for identification and study. Read the whole page in your own copy →" becomes « <i>Alcoholics Anonymous</i>, 4e édition (en anglais), page N ; traduction libre. Une courte citation, à des fins d'identification et d'étude. Lisez la page entière dans votre propre exemplaire → ». Keep the English's placeholders around the same words.

## Site words
| English | French |
|---|---|
| Daily Reflection / Daily Tradition | Réflexion du jour / Tradition du jour |
| Today's Reflection / Today's Tradition | La réflexion d'aujourd'hui / La Tradition d'aujourd'hui |
| Recovery Einstein's Big Book perspective | le regard de Recovery Einstein, tiré du Gros Livre |
| Read today's official reflection at aa.org → | Lisez la réflexion officielle d'aujourd'hui sur aa.org → |
| a question to sit with / Sit with | une question à méditer / À méditer |
| Meetings Map / Online Meetings | Carte des réunions / Réunions en ligne |
| Find a meeting | Trouver une réunion |
| Talk to Recovery Einstein | Parler à Recovery Einstein |
| You're not alone | Vous n'êtes pas seul |
| Get the App / web app | Obtenir l'appli / appli Web |
| AI chat | clavardage IA (or « discussion avec l'IA ») |
| Donate — keep it free | Faire un don — pour que ça reste gratuit |
| free | gratuit |
| Home (breadcrumb) | Accueil |
| ← Previous / Next → | ← Précédent / Suivant → |
| Page by page | Page par page |
| Big Book Search Engine | Moteur de recherche du Gros Livre |
| Section | Section |
| Tradition N · live (month grid) | Tradition N · en ligne |
| Tradition N · 30 readings | Tradition N · 30 lectures |
| Ask Recovery Einstein about Tradition N → | Interrogez Recovery Einstein sur la Tradition N → |
| Daily Tradition card tags (the small label under each day's title) — the same on every card | the threat → la menace · the threat today → la menace aujourd'hui · before the tradition → avant la Tradition · how a group breaks it → comment un groupe l'enfreint · how it gets captured → comment on la détourne · the earned answer → la réponse durement acquise · where it goes wrong → là où ça déraille |
| Not verified yet | Pas encore vérifié |
| email | courriel |
