# Portuguese glossary — the words every tr2 runner uses the same way

*Started 2026-10-12 by wave tr2 S1-pt (the super). Brazilian Portuguese (pt-BR), the reader addressed as **você**, plain and warm — the meeting finder's Portuguese already speaks this way. Where Brazilian A.A. (JUNAAB, aa.org.br) prints its own wording, we use theirs; the source is in brackets. **[nossa]** marks a wording we couldn't find printed by JUNAAB online: it's ours, and it's fixed here so every page says it the same way. Add to this file through your close (the super merges additions), not by changing it mid-wave. The 12 & 12 is never a source.*

## How to write a segment
- Write in the placeholder form: keep every `<0>…</0>` pair and `<1/>` the English has, around the words that belong in it, in whatever order Portuguese needs. Don't type HTML yourself.
- `node scripts/i18n/check.mjs pt <your-batch>` must say 0 problems.
- Plain characters are fine (ã, ç, é, —, “ ”); entities like `&mdash;` may stay as they are.
- **Brazilian, not European:** você (never tu/vós/teu/vosso), fato, contato, celular, equipe, usuário, tela, banheiro, registro; "está fazendo", never "está a fazer". `score.mjs pt` counts slips in its `reg` column.
- Numbers: 1.234 · 19h30 (or 7h30 da noite) · 18 de novembro de 1982 · 4ª edição. Page refs stay the English 4th Edition's numbers: "p. 417" / "página 86".
- Names stay as they are: Bill W., Dr. Bob, Akron, Recovery Einstein, Recovery Starts, Addict2Influencer, AutoGrow AI Solutions, Claude's Lab, Derick.
- A book's English title in running text gets its Portuguese title (below); a citation that names the English edition ("Alcoholics Anonymous, 4th Edition") becomes "<i>Alcoólicos Anônimos</i>, 4ª edição (em inglês)".

## Crisis lines — read this before any 988, detox or withdrawal segment
What's true (checked 2026-10-12):
- **988** (USA): calls, chat and text are in English and Spanish; a **call** gets an interpreter in 240+ more languages, Portuguese among them, at no cost. **Text and chat have no interpreter.** [samhsa.gov/mental-health/988/faqs: "the 988 Lifeline uses Language Line Solutions to provide interpretation to callers in more than 240 additional languages"; "988 call, chat, and text services are available in English and Spanish"]
- **Brazil — CVV, 188**: free, 24 hours a day; also chat and e-mail at cvv.org.br. [cvv.org.br: "pelo telefone 188 (24 horas por dia e sem custo de ligação)"]
- **Portugal — SOS Voz Amiga, 213 544 545** (also 912 802 669, 963 524 660, 930 712 500), daily 15h30–00h30. [sosvozamiga.org]

So on a pt page **never write "ligue ou envie mensagem para o 988"** — a Portuguese speaker who texts gets English. Use these:

| English | Portuguese |
|---|---|
| In crisis? Call or text 988 | Em crise? Ligue para o 988 (EUA) e peça um intérprete de português — por telefone é gratuito. No Brasil, ligue 188 (CVV, 24 horas, gratuito). |
| If you're in crisis, call or text 988 (Suicide & Crisis Lifeline). | Se você estiver em crise, ligue para o 988 (Suicide & Crisis Lifeline, EUA; peça um intérprete de português) ou, no Brasil, para o CVV no 188. |
| …988 inside a longer sentence | "ligue para o 988 (com intérprete de português)", and add "no Brasil, o CVV: 188" where the sentence has room |
| Call 911 / emergency | Ligue para o 911 (EUA) — no Brasil, 192 (SAMU) |
| detox / medical detox | desintoxicação / desintoxicação com acompanhamento médico |
| withdrawal / alcohol withdrawal | abstinência / síndrome de abstinência alcoólica |
| not medical advice | não é orientação médica |
| treatment / treatment center | tratamento / clínica (centro) de tratamento |

Keep every number in a crisis segment exactly as the English has it, plus the Brazil line. Don't add Portugal's line unless the segment already speaks about Portugal or about lines outside the US.

## Fellowships and books
| English | Portuguese |
|---|---|
| Alcoholics Anonymous / A.A. | Alcoólicos Anônimos / A.A. [aa.org.br] — members are "AAs", one another "companheiros" |
| Narcotics Anonymous / N.A. | Narcóticos Anônimos / N.A. |
| Cocaine Anonymous / C.A. | Cocaína Anônimos / C.A. |
| Crystal Meth Anonymous / C.M.A. | Crystal Meth Anonymous / C.M.A. (no Portuguese name of its own) |
| the Big Book | o Livro Azul [aa.org.br: "Alcoólicos Anônimos (nosso Livro Azul)"] — first mention on a page may say "o Livro Azul (<i>Alcoólicos Anônimos</i>)" |
| Alcoholics Anonymous, 4th Edition | <i>Alcoólicos Anônimos</i>, 4ª edição (em inglês) |
| Twelve Steps and Twelve Traditions ("12 & 12") | Os Doze Passos e as Doze Tradições [aa.org.br] |
| Daily Reflections | Reflexões Diárias [aa.org.br] |
| Living Sober | Viver Sóbrio [aa.org.br] |
| As Bill Sees It | Na Opinião do Bill [aa.org.br] |
| A.A. Comes of Age | Alcoólicos Anônimos Atinge a Maioridade [aa.org.br] |
| "Pass It On" | Levar Adiante [aa.org.br] |
| Dr. Bob and the Good Oldtimers | Dr. Bob e os Bons Veteranos [nossa] |
| Language of the Heart | A Linguagem do Coração [aa.org.br] |
| Grapevine / La Viña | Grapevine / La Viña (Brazil's own magazine is "Vivência"; don't swap it in) |
| The A.A. Preamble | o Preâmbulo de A.A. [aa.org.br] |

## Program words
| English | Portuguese |
|---|---|
| fellowship (A.A.'s) | a Irmandade [aa.org.br] |
| meeting | reunião |
| open / closed meeting | reunião aberta / fechada [aa.org.br] |
| home group | grupo base [aa.org.br] |
| group conscience | consciência de grupo [Tradição 2] |
| sponsor / sponsee / sponsorship | padrinho (madrinha) / afilhado (afilhada) / apadrinhamento [aa.org.br] |
| newcomer | recém-chegado (recém-chegada) [aa.org.br] |
| old-timer | veterano (veterana) |
| sobriety / sober | sobriedade / sóbrio |
| the Steps / Step One / Twelfth Step work | os Passos / o Primeiro Passo / o trabalho de Décimo Segundo Passo [aa.org.br] |
| the Traditions / the Concepts | as Tradições / os Conceitos (Os Doze Conceitos para o Serviço Mundial) [aa.org.br] |
| inventory / moral inventory | inventário / inventário moral [Passo 4] |
| resentment | ressentimento |
| defects of character | defeitos de caráter [Passo 6] |
| shortcomings | imperfeições [Passo 7] |
| the exact nature of our wrongs | a natureza exata de nossas falhas [Passo 5] |
| amends / make amends | reparações / fazer reparações (reparar os danos) [Passos 8–9] |
| Higher Power | Poder Superior [Passo 2] |
| God as we understood Him | Deus, na forma em que O concebíamos [Passos 3, 11] |
| spiritual awakening | despertar espiritual [Passo 12] |
| powerless over alcohol | impotentes perante o álcool [Passo 1] |
| our lives had become unmanageable | tínhamos perdido o domínio sobre nossas vidas [Passo 1] — "unmanageable" alone: "fora de controle" / "sem domínio" |
| carry the message | levar a mensagem / transmitir a mensagem [Passo 12, Tradição 5] |
| the alcoholic who still suffers | o alcoólico que ainda sofre [Tradição 5] |
| primary purpose | propósito primordial [Tradição 5] |
| self-supporting / Seventh Tradition basket | autossuficiente [Tradição 7] / a sacola da Sétima Tradição |
| anonymity | anonimato |
| service / General Service Office / trustees | serviço / Escritório de Serviços Gerais (ESG) / custódios [aa.org.br] |
| the Promises | as Promessas [aa.org.br] |
| How It Works | Como Funciona [nossa] |
| There Is a Solution | Há uma Solução [nossa] |
| More About Alcoholism | Mais Sobre o Alcoolismo [nossa] |
| We Agnostics | Nós, os Agnósticos [aa.org.br] |
| Into Action | Em Ação [nossa] |
| Working with Others | Trabalhando com os Outros [nossa] |
| To Wives / The Family Afterward / To Employers | Às Esposas / A Família Depois / Aos Empregadores [nossa] |
| A Vision for You | Uma Visão para Você [nossa] |
| The Doctor's Opinion | A Opinião do Médico [nossa] |
| Bill's Story | A História de Bill [nossa] |
| the Third Step prayer / Seventh Step prayer | a oração do Terceiro Passo / a oração do Sétimo Passo |

## The Twelve Steps — JUNAAB's wording, word for word [aa.org.br/01o-passo … /12o-passo]
1. Admitimos que éramos impotentes perante o álcool — que tínhamos perdido o domínio sobre nossas vidas.
2. Viemos a acreditar que um Poder superior a nós mesmos poderia devolver-nos à sanidade.
3. Decidimos entregar nossa vontade e nossa vida aos cuidados de Deus, na forma em que O concebíamos.
4. Fizemos minucioso e destemido inventário moral de nós mesmos.
5. Admitimos perante Deus, perante nós mesmos e perante outro ser humano, a natureza exata de nossas falhas.
6. Prontificamo-nos inteiramente a deixar que Deus removesse todos esses defeitos de caráter.
7. Humildemente rogamos a Ele que nos livrasse de nossas imperfeições.
8. Fizemos uma relação de todas as pessoas a quem tínhamos prejudicado e dispusemo-nos a reparar os danos a elas causados.
9. Fizemos reparações diretas dos danos causados a tais pessoas, sempre que possível, salvo quando fazê-las significasse prejudicá-las ou a outrem.
10. Continuamos fazendo o inventário pessoal e quando estávamos errados, nós o admitíamos prontamente.
11. Procuramos, através da prece e da meditação, melhorar nosso contato consciente com Deus, na forma em que O concebíamos, rogando apenas o conhecimento de Sua vontade em relação a nós, e forças para realizar essa vontade.
12. Tendo experimentado um despertar espiritual, graças a estes Passos, procuramos transmitir esta mensagem aos alcoólicos e praticar estes princípios em todas as nossas atividades.

A Step quoted in part uses these words, cut, not reworded ("impotentes perante o álcool", "um minucioso e destemido inventário moral").

## The Twelve Traditions, short form — JUNAAB's wording, word for word [aa.org.br/as-doze-tradicoes]
1. Nosso bem-estar comum deve estar em primeiro lugar; a recuperação individual depende da unidade de A.A.
2. Para nosso propósito de grupo, há somente uma autoridade suprema — um Deus amantíssimo que Se manifesta em nossa consciência de grupo. Nossos líderes são apenas servidores de confiança; não governam.
3. O único requisito para ser membro de A.A. é o desejo de parar de beber.
4. Cada grupo deve ser autônomo, salvo em assuntos que digam respeito a outros grupos ou a A.A. em seu conjunto.
5. Cada grupo é animado por um único propósito primordial — o de transmitir sua mensagem ao alcoólico que ainda sofre.
6. Nenhum grupo de A.A. deverá jamais emprestar o nome de A.A., endossar ou financiar qualquer sociedade ou empreendimento alheio à Irmandade, a fim de que problemas de dinheiro, propriedade e prestígio não nos afastem do nosso objetivo primordial.
7. Todos os grupos de A.A. deverão ser totalmente autossuficientes, rejeitando quaisquer doações de fora.
8. Alcoólicos Anônimos deverá manter-se sempre não profissional, embora nossos centros de serviços possam contratar funcionários especializados.
9. A.A., como tal, jamais deverá ser organizado; podemos, porém, criar juntas ou comitês de serviço diretamente responsáveis perante aqueles a quem prestam serviços.
10. Alcoólicos Anônimos não opina sobre questões que lhe são alheias; portanto, o nome de A.A. jamais deverá aparecer em controvérsias públicas.
11. Nossa política de relações públicas baseia-se na atração em vez da promoção; precisamos sempre manter o anonimato pessoal na imprensa, rádio e filmes.
12. O anonimato é o alicerce espiritual de todas as nossas tradições, lembrando-nos sempre da necessidade de colocar os princípios acima das personalidades.

(Two slips to watch for, from tr1: Tradition Four's "**salvo** em assuntos…" and Tradition Six's "**jamais**" — a lost negative turns a Tradition upside down.)

**The long form** isn't printed by JUNAAB online. The 12-traditions runner translates the English long form faithfully, sentence by sentence, nothing added or dropped. Because of that, on the /12-traditions/ page the line "reproduced here in full — both forms, word for word — from Alcoholics Anonymous, 4th Edition" becomes: "…a forma curta na redação da JUNAAB (A.A. do Brasil) e a forma longa em nossa tradução fiel do texto em inglês de <i>Alcoholics Anonymous</i>, 4ª edição…" — never claim the long form is an official Portuguese text.

## The Twelve Concepts, short form — as in i18n/pt/core.json (the /aa-info/ page) **[nossa]**
JUNAAB prints the Concepts in its Manual de Serviço (since the 9th edition, 2016) but not online, so the short form in core.json is our faithful translation. Use exactly those sentences wherever a Concept is quoted in full. Its fixed terms are JUNAAB's [aa.org.br, boletim CAHIST 24]: o Direito de Decisão, o Direito de Participação, o Direito de Apelação, o Direito de Petição; a Conferência de Serviços Gerais; a Junta de Serviços Gerais; os custódios.

## Prayers — one wording, everywhere
- **Serenity Prayer** [aa.org.br/oracao-da-serenidade, from Viver Sóbrio and Na Opinião do Bill]: "Concedei-nos, Senhor, a serenidade necessária para aceitar as coisas que não podemos modificar, coragem para modificar aquelas que podemos e sabedoria para distinguir umas das outras."
- **Third Step prayer** (English p. 63) **[nossa]**: "Deus, eu me ofereço a Ti, para que edifiques comigo e faças comigo o que quiseres. Liberta-me da escravidão do ego, para que eu possa cumprir melhor a Tua vontade. Afasta minhas dificuldades, para que a vitória sobre elas seja testemunho, para aqueles a quem eu possa ajudar, do Teu Poder, do Teu Amor e do Teu modo de vida. Que eu possa sempre fazer a Tua vontade!"
- **Seventh Step prayer** (English p. 76) **[nossa]**: "Meu Criador, estou agora disposto a que Tu tenhas tudo de mim, o bom e o mau. Peço que agora removas de mim cada um dos defeitos de caráter que me impedem de ser útil a Ti e aos meus semelhantes. Dá-me forças, ao sair daqui, para cumprir a Tua vontade. Amém."
- A prayer quoted in part uses these words, cut ("Deus, eu me ofereço a Ti, para que edifiques comigo e faças comigo o que quiseres"; "Meu Criador, estou agora disposto a que Tu tenhas tudo de mim, o bom e o mau").
- Any other line the English quotes from the Big Book: translate it faithfully, and use the same Portuguese each time the same English line comes back in your batch (search your file before you write it again).

## Site words
| English | Portuguese |
|---|---|
| Daily Reflection / Daily Tradition | Reflexão diária / Tradição diária |
| Recovery Einstein's Big Book perspective | o olhar de Recovery Einstein a partir do Livro Azul |
| Read today's official reflection at aa.org → | Leia a reflexão oficial de hoje em aa.org → |
| Meetings Map / Online Meetings | Mapa de reuniões / Reuniões on-line |
| Find a meeting | Encontre uma reunião |
| a question to sit with | uma pergunta para refletir |
| Talk to Recovery Einstein | Converse com Recovery Einstein |
| You're not alone | Você não está sozinho |
| Donate — keep it free | Doar — mantenha gratuito |
| free | gratuito / grátis |
| Not verified yet | Ainda não verificado |
