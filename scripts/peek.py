import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
H = r"C:\Users\addic\recovery-einstein\historian-sources"

t = open(f"{H}\\p-17_aa_traditions.txt", encoding="utf-8").read()
flat = re.sub(r"\s+", " ", t)

print("=" * 78)
print("P-17 — the club-manager / 'fair living' region, RAW")
print("=" * 78)
for needle in ["fair living", "making money out of A.A", "club manager", "manager"]:
    i = flat.lower().find(needle.lower())
    if i == -1:
        print(f"\n[not found: {needle}]")
        continue
    print(f"\n--- \"{needle}\" ---")
    print(flat[max(0, i - 500): i + 700])
    break
