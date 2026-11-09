WIP for trlang1 line Tr-19 (daily-reflection-3). NOT part of the delivery: the delivery branch is claude/trlang1-Tr-19 (i18n/tr/daily-reflection-3.json only).
Engine: dr3_extract.py (sentence splitter), dr3_classify.py (segment roles), dr3_model.py, dr3_atoms.py (sentence_list()/themes()/questions()).
Done: themes_tr.txt (94), questions_tr.txt (94), sents_tr_0.txt (sentences 0-94 of sentence_list(), format "n|turkish").
Next: translate sentence_list()[95:] into sents_tr_1.txt, ... then write dr3_build.py (compose every segment from sentences + templates: title/meta/bc/date/caps/redesc/src/nav/faq/ans1/ans2, month pages, related-link lists).
Run scripts with cwd = this directory (they read i18n/batches/daily-reflection-3.json from /home/user/recoverystarts-site/; edit ROOT if different).
