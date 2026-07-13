if (-not $env:windir) { $env:windir = $env:SystemRoot }

# Pull the A.A. pamphlets we're allowed to quote, and extract their text so the
# quotation gate (scripts/audit-readings.js) can actually verify against them.
#
# A source we cannot grep is a source we cannot quote — every quotation has to be
# checkable, character for character, against the real text.

$dst = 'C:\Users\addic\recovery-einstein\historian-sources'
New-Item -ItemType Directory -Path $dst -Force | Out-Null

$pamphlets = @(
  @{ name = 'p-17_aa_traditions';          url = 'https://aaws.widen.net/content/zypyan1fnw/pdf/p-17_aa_traditions_online.pdf' },
  @{ name = 'p-43_traditions_illustrated'; url = 'https://aaws.widen.net/content/fkzmhdgxkh/pdf/p-43_traditions_illustrated_online.pdf' },
  @{ name = 'p-44_aa_legacy_of_service';   url = 'https://aaws.widen.net/content/krwi6ptv9a/pdf/p-44_aa_legacy_of_service_online.pdf' }
)

foreach ($p in $pamphlets) {
  $pdf = Join-Path $dst ($p.name + '.pdf')
  Invoke-WebRequest -Uri $p.url -OutFile $pdf -UseBasicParsing
  $kb = [math]::Round((Get-Item $pdf).Length / 1KB)
  Write-Output ("downloaded: " + $p.name + ".pdf  (" + $kb + " KB)")
}

Write-Output ''
Write-Output 'Now extracting text...'
