# 금호고 스쿨메이트 로컬 웹 서버 실행 스크립트 (Windows PowerShell 내장 HTTP 리스너)
$port = 8080
$url = "http://localhost:$port/"
$folder = $PSScriptRoot

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($url)
    $listener.Start()
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host " [금호고 스쿨메이트] 로컬 웹 서버가 정상 실행되었습니다." -ForegroundColor Green
    Write-Host " 브라우저 주소: $url" -ForegroundColor Yellow
    Write-Host " 종료하려면 터미널에서 Ctrl+C 를 누르세요." -ForegroundColor Gray
    Write-Host "====================================================" -ForegroundColor Cyan

    Start-Process $url

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "index.html"
        }

        $filePath = Join-Path $folder $localPath
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "서버 실행 중 오류가 발생했거나 종료되었습니다: $_" -ForegroundColor Red
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
    }
}
