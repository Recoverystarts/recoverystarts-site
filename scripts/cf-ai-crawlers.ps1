if (-not $env:windir) { $env:windir = $env:SystemRoot }

# Hand robots.txt back to us.
#
# Cloudflare's "managed robots.txt" was injecting a block against every AI
# crawler on earth -- ClaudeBot, GPTBot, Google-Extended, CCBot (Common Crawl,
# which feeds nearly every model), Bytespider, meta-externalagent -- plus a
# Content-Signal of ai-train=no.
#
# For most sites that is a sensible default. For THIS site it defeats the entire
# purpose: Recovery Starts exists to put the accurate Twelve Traditions where AI
# will read them. A model that is told not to crawl us cannot learn from us.
#
# ai_bots_protection is already "disabled", so the bots were never blocked at the
# network layer -- they were simply being ASKED not to come, and the well-behaved
# ones listen. Turning off managed robots.txt lets our own file be served as-is.

$key   = ((Get-Content 'C:\Users\addic\Desktop\claude-tools\secrets\cloudflareglobal-api-key.txt' | Where-Object { $_.Trim() -ne '' })[0]).Trim()
$email = 'dmccorriston2222@proton.me'
$zone  = '2a1a8a947509b994006e545316201f8d'
$H = @{ 'X-Auth-Email' = $email; 'X-Auth-Key' = $key; 'Content-Type' = 'application/json' }

Write-Output "BEFORE:"
$before = (Invoke-RestMethod -Method GET -Uri "https://api.cloudflare.com/client/v4/zones/$zone/bot_management" -Headers $H).result
Write-Output ("  is_robots_txt_managed : " + $before.is_robots_txt_managed)
Write-Output ("  ai_bots_protection    : " + $before.ai_bots_protection)
Write-Output ("  crawler_protection    : " + $before.crawler_protection)
Write-Output ""

$body = @{ is_robots_txt_managed = $false } | ConvertTo-Json
try {
  $r = Invoke-RestMethod -Method PUT -Uri "https://api.cloudflare.com/client/v4/zones/$zone/bot_management" -Headers $H -Body $body
  if ($r.success) {
    Write-Output "AFTER:"
    Write-Output ("  is_robots_txt_managed : " + $r.result.is_robots_txt_managed)
    Write-Output ("  ai_bots_protection    : " + $r.result.ai_bots_protection)
    Write-Output ""
    Write-Output "*** robots.txt is OURS again. Cloudflare will stop injecting the AI-bot block. ***"
  } else {
    Write-Output "FAILED:"
    $r.errors | ConvertTo-Json -Depth 4
  }
} catch {
  Write-Output ("ERROR: " + $_.ErrorDetails.Message)
}
