from dr3_classify import *
R=[role(v) for k,v in items]
tit=[i for i,r in enumerate(R) if r=='title']
wins=[(0,tit[0])]+[(a,b) for a,b in zip(tit,tit[1:]+[len(items)])]
def day_of(a,b):
    w=[(i,items[i][1],R[i]) for i in range(a,b)]
    return w
if __name__=='__main__':
    for a,b in wins:
        w=day_of(a,b)
        rs=[r for i,v,r in w]
        t=items[a][1][:60] if R[a]=='title' else 'PRE'
        has=lambda x: x in rs
        miss=[x for x in ('title','meta','bc','date','caps','redesc','body','q','talk','share','nav','faq','ans1','ans2') if not has(x)]
        extra=[ (i,r) for i,v,r in w if r in('other','src')]
        if miss or [r for r in rs if r=='other']: print(a,b,t,'MISSING',miss,'other',[ (i,r) for i,v,r in w if r=='other'])
