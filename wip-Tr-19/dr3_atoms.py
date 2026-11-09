from dr3_model import *
import html
def strip_wrap(v,r):
    if r=='meta': return v[:-len(SUF)]
    if r=='ans1':
        m=re.match(r'^The theme for (\w+ \d+) is “(.*?)” (.*)$',v,re.S); return m.group(3)
    if r=='ans2':
        j=v.rindex(' (Big Book: '); return v[:j]
    return v
def themes():
    T=[]
    for k,v in items:
        m=re.match(r'AA Daily Reflection (\w+ \d+) — (.*)$',v)
        if m: T.append(html.unescape(m.group(2)))
    return sorted(set(T),key=lambda x:x)
SENT_ROLES=('meta','ans1','ans2','body','other')
def sentence_list():
    S=[];seen=set()
    for (k,v),r in zip(items,R):
        if r in SENT_ROLES:
            if r=='other' and (v.startswith('<0>') or v.startswith('AA Daily') or v.startswith('All ') or v in('July','June','March','May') ): continue
            for s in split_sents(strip_wrap(v,r)):
                if s not in seen: seen.add(s);S.append(s)
    return S
def questions():
    Q=[];seen=set()
    for (k,v),r in zip(items,R):
        if r=='q' and v not in seen: seen.add(v);Q.append(v)
    return Q
if __name__=='__main__':
    S=sentence_list();T=themes();Q=questions()
    print(len(S),sum(map(len,S)),len(T),len(Q),sum(map(len,Q)))
