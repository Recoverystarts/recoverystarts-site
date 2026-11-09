import json,re,sys
ROOT='/home/user/recoverystarts-site/'
d=json.load(open(ROOT+'i18n/batches/daily-reflection-3.json'))
items=list(d.items())
ABBR=('Dr.','Mr.','Mrs.','St.','A.A.','vs.','Jr.','No.','Bill W.','p.','pp.','a.m.','p.m.','etc.')
def split_sents(t):
    # protect placeholders
    parts=re.split(r'(?<=[.!?])(["\'”’)]?)\s+(?=[A-Z“‘"\'(<\d—])',t)
    # re.split with capture group returns [seg, sep-char, seg, ...]
    out=[];cur=''
    i=0
    while i<len(parts):
        seg=parts[i]; cur+=seg
        if i+1<len(parts):
            cur+=parts[i+1]
            # abbreviation check
            if any(cur.endswith(a) for a in ABBR) or re.search(r'\b[A-Z]\.$',cur):
                cur+=' '
            else:
                out.append(cur);cur=''
        i+=2
    if cur: out.append(cur)
    return out
SUF=" Read Einstein's Big Book take on today's AA reflection."
if __name__=='__main__':
    bodies=[(i,k,v) for i,(k,v) in enumerate(items) if len(v)>250 and not v.startswith('All ') ]
    print(len(bodies))
    bad=0
    for i,k,v in bodies:
        s=split_sents(v)
        if ' '.join(s)!=v: print('ROUNDTRIP FAIL',i); bad+=1
    print('bad',bad)
