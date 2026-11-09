from dr3_extract import *
import collections
def role(v):
    if re.match(r'AA Daily Reflection (March|April|May|June|July) \d+ — ',v): return 'title'
    if v.endswith(SUF): return 'meta'
    if re.match(r'<0>Home</0> / <1>Daily Reflection</1> / <2>',v): return 'bc'
    if re.fullmatch(r'(March|April|May|June|July) \d+',v): return 'date'
    if re.match(r"Recovery Einstein's Big Book perspective on the AA Daily Reflection for ",v): return 'redesc'
    if v.startswith('— '): return 'src'
    if v=='<0>Talk to Recovery Einstein →</0>': return 'talk'
    if v.startswith('<0>𝕏 Post'): return 'share'
    if v.startswith('<0><1>← Previous'): return 'nav'
    if v.startswith('What is the AA Daily Reflection for '): return 'faq'
    if v.startswith('The theme for ') and ' is “' in v[:40]: return 'ans1'
    if v.endswith(')') and '(Big Book: ' in v: return 'ans2'
    if v.isupper() or re.fullmatch(r"[A-Z0-9 .,'’:!?&\-—“”\"]+",v): return 'caps'
    if v.endswith('?') and len(v)<400: return 'q'
    if len(v)>250: return 'body'
    return 'other'
if __name__=='__main__':
    c=collections.Counter(); oth=[]
    R=[]
    for i,(k,v) in enumerate(items):
        r=role(v); R.append(r); c[r]+=1
        if r in('other',): oth.append((i,v[:150]))
    print(c)
    for o in oth: print(o)
