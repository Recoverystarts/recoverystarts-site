const fs = require("fs");
const BB = JSON.parse(fs.readFileSync("functions/_lib/big-book-text.json", "utf8"));
const p564 = BB.find((e) => String(e.l) === "564").t;

console.log("=== BIG BOOK p.564 — RAW, exactly as our source has it ===\n");
const i = p564.toLowerCase().indexOf("voluntary");
console.log(JSON.stringify(p564.slice(Math.max(0, i - 60), i + 90)));
console.log("\n  ^ note how the OCR broke the word.\n");

const COA = fs.readFileSync("C:\\Users\\addic\\recovery-einstein\\historian-sources\\aa_comes_of_age.txt", "utf8");
console.log("=== AA COMES OF AGE — 'peril had been averted' — RAW ===\n");
const j = COA.toLowerCase().indexOf("real peril had");
console.log(JSON.stringify(COA.slice(Math.max(0, j - 160), j + 60).replace(/\s+/g, " ")));
console.log("\n  ^ the OCR mangled 'been averted' into 'beelsaverted'. The QUOTE IS REAL.\n");

console.log("=== AA COMES OF AGE — the 1940 dinner line — RAW ===\n");
const k = COA.toLowerCase().indexOf("without any thought of financial");
console.log(JSON.stringify(COA.slice(Math.max(0, k - 220), k + 90).replace(/\s+/g, " ")));
console.log("\n  BOOK SAYS   : 'without any thought of financial income or reward'");
console.log("  READING SAYS: 'without any thought of financial reward'");
console.log("  -> WORDS DROPPED FROM A QUOTATION. This one is a real misquote.\n");
