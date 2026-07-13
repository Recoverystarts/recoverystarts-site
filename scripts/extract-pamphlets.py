"""
extract-pamphlets.py — turn the A.A. pamphlet PDFs into searchable text.

A source we cannot grep is a source we cannot quote. Every quotation in the
readings has to be checkable, character for character, against the real text —
that's what scripts/audit-readings.js does, and it fails the build otherwise.

So the pamphlets we're allowed to quote have to exist as plain text next to the
books.
"""
import glob
import os
import sys

try:
    from pypdf import PdfReader
except ImportError:
    os.system(f'"{sys.executable}" -m pip install pypdf --quiet')
    from pypdf import PdfReader

SRC = r"C:\Users\addic\recovery-einstein\historian-sources"

for pdf in sorted(glob.glob(os.path.join(SRC, "p-*.pdf"))):
    name = os.path.basename(pdf)
    try:
        reader = PdfReader(pdf)
        text = "\n".join((p.extract_text() or "") for p in reader.pages)
        out = pdf.replace(".pdf", ".txt")
        with open(out, "w", encoding="utf-8") as f:
            f.write(text)
        words = len(text.split())
        print(f"  {os.path.basename(out):42s} {len(reader.pages):3d} pages  {words:6,d} words")
        for probe in ["nonprofessional", "no other affiliation", "Tradition Eight",
                      "professionalism", "fees or hire", "special workers"]:
            if probe.lower() in text.lower():
                print(f"       contains: \"{probe}\"")
    except Exception as e:
        print(f"  {name}: FAILED — {e}")

print("\nPamphlet text is now greppable next to the books.")
