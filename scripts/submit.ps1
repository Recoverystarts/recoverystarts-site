if (-not $env:windir) { $env:windir = $env:SystemRoot }

$key   = ((Get-Content 'C:\Users\addic\Desktop\claude-tools\secrets\cloudflareglobal-api-key.txt' | Where-Object { $_.Trim() -ne '' })[0]).Trim()
$email = 'dmccorriston2222@proton.me'
$zone  = '2a1a8a947509b994006e545316201f8d'
$H = @{ 'X-Auth-Email' = $email; 'X-Auth-Key' = $key; 'Content-Type' = 'application/json' }

Write-Output '=== 1. Purge the edge cache (so the new robots.txt + nav go live) ==='
$r = Invoke-RestMethod -Method POST -Uri "https://api.cloudflare.com/client/v4/zones/$zone/purge_cache" -Headers $H -Body '{"purge_everything":true}'
if ($r.success) { Write-Output '  PURGED' } else { Write-Output '  FAILED' }

Start-Sleep -Seconds 6

Write-Output ''
Write-Output '=== 2. robots.txt as the world now sees it ==='
$bust = [guid]::NewGuid().ToString()
$rb = (Invoke-WebRequest -Uri "https://recoverystarts.com/robots.txt?cb=$bust" -UseBasicParsing).Content

$bots = @('ClaudeBot','GPTBot','CCBot','Google-Extended','Bytespider','meta-externalagent','Amazonbot','Applebot-Extended')
$blocked = @()
foreach ($b in $bots) {
  if ($rb -match ("User-agent:\s*" + [regex]::Escape($b) + "\s*[\r\n]+Disallow:\s*/")) { $blocked += $b }
}
if ($blocked.Count -eq 0) {
  Write-Output '  NO AI CRAWLER IS BLOCKED. The door is open.'
} else {
  Write-Output ('  STILL BLOCKED: ' + ($blocked -join ', '))
}
if ($rb -match 'ai-train=yes') { Write-Output '  Content-Signal: ai-train=yes   (models may learn from this)' }
if ($rb -match 'ai-input=yes') { Write-Output '  Content-Signal: ai-input=yes   (models may cite this in answers)' }
if ($rb -match 'Disallow: /scripts/') { Write-Output '  /scripts/ /tests/ /data/ excluded from indexing' }

Write-Output ''
Write-Output '=== 3. IndexNow - tell the engines the pages exist, right now ==='
$indexKey = 'd4af37recoverystarts2026'
$sitemap = (Invoke-WebRequest -Uri "https://recoverystarts.com/sitemap.xml?cb=$bust" -UseBasicParsing).Content
$urls = [regex]::Matches($sitemap, '<loc>(.*?)</loc>') | ForEach-Object { $_.Groups[1].Value }
Write-Output ('  sitemap has ' + $urls.Count + ' URLs')

$payload = @{
  host        = 'recoverystarts.com'
  key         = $indexKey
  keyLocation = "https://recoverystarts.com/$indexKey.txt"
  urlList     = $urls
} | ConvertTo-Json -Depth 3

try {
  $resp = Invoke-WebRequest -Method POST -Uri 'https://api.indexnow.org/indexnow' -Body $payload -ContentType 'application/json; charset=utf-8' -UseBasicParsing -TimeoutSec 60
  Write-Output ('  IndexNow: HTTP ' + [int]$resp.StatusCode)
  if ([int]$resp.StatusCode -eq 200 -or [int]$resp.StatusCode -eq 202) {
    Write-Output ('  SUBMITTED ' + $urls.Count + ' URLs to Bing, Yandex, Seznam, Naver.')
  }
} catch {
  Write-Output ('  IndexNow error: ' + $_.Exception.Message)
  if ($_.ErrorDetails.Message) { Write-Output ('  ' + $_.ErrorDetails.Message) }
}

Write-Output ''
Write-Output '=== 4. Google ==='
Write-Output '  Google retired the sitemap-ping endpoint in 2023. It discovers'
Write-Output '  the sitemap through robots.txt, which declares it:'
if ($rb -match 'Sitemap: https://recoverystarts.com/sitemap.xml') {
  Write-Output '    Sitemap: https://recoverystarts.com/sitemap.xml   [declared - Google will find it]'
}
