# Solar Administration Portal - Persistent Server Launcher
# Run this script once. Both servers will keep running even after tab/terminal closes.

$ProjectRoot = $PSScriptRoot
$BackendPath  = Join-Path $ProjectRoot "backend"
$FrontendPath = $ProjectRoot

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Solar Portal - Starting Servers (Persistent Mode)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# --- Kill any existing processes on our ports ---
Write-Host "`n[*] Cleaning up old processes on ports 8000 & 5173/5174..." -ForegroundColor Yellow
$ports = @(8000, 5173, 5174)
foreach ($port in $ports) {
    $pids = netstat -ano | Select-String ":$port " | ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object -Unique
    foreach ($p in $pids) {
        if ($p -match '^\d+$' -and $p -ne '0') {
            try { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } catch {}
        }
    }
}
Start-Sleep -Seconds 1

# --- Start Django Backend ---
Write-Host "`n[*] Starting Django backend on http://localhost:8000 ..." -ForegroundColor Green
$backendJob = Start-Job -Name "SolarBackend" -ScriptBlock {
    param($path)
    Set-Location $path
    # Activate venv if it exists
    $venv = Join-Path $path "venv\Scripts\Activate.ps1"
    if (Test-Path $venv) { & $venv }
    python manage.py runserver 0.0.0.0:8000 2>&1
} -ArgumentList $BackendPath

# --- Start React Frontend ---
Write-Host "[*] Starting React (Vite) frontend on http://localhost:5173 ..." -ForegroundColor Green
$frontendJob = Start-Job -Name "SolarFrontend" -ScriptBlock {
    param($path)
    Set-Location $path
    npm run dev 2>&1
} -ArgumentList $FrontendPath

Write-Host "`n=====================================================" -ForegroundColor Cyan
Write-Host "  Both servers are running in the background!" -ForegroundColor Green
Write-Host "" 
Write-Host "  Frontend : http://localhost:5173" -ForegroundColor White
Write-Host "  Backend  : http://localhost:8000" -ForegroundColor White
Write-Host "" 
Write-Host "  To see logs    : Receive-Job -Name SolarBackend"  -ForegroundColor Gray
Write-Host "                   Receive-Job -Name SolarFrontend" -ForegroundColor Gray
Write-Host "  To stop servers: Stop-Job SolarBackend, SolarFrontend" -ForegroundColor Gray
Write-Host "=====================================================" -ForegroundColor Cyan

# Keep monitoring and print live output
Write-Host "`n[Live Logs - Press Ctrl+C to stop watching (servers keep running)...]`n" -ForegroundColor Yellow
while ($true) {
    $bOut = Receive-Job -Name "SolarBackend"  -ErrorAction SilentlyContinue
    $fOut = Receive-Job -Name "SolarFrontend" -ErrorAction SilentlyContinue
    if ($bOut) { $bOut | ForEach-Object { Write-Host "[Backend]  $_" -ForegroundColor DarkCyan } }
    if ($fOut) { $fOut | ForEach-Object { Write-Host "[Frontend] $_" -ForegroundColor DarkGreen } }
    Start-Sleep -Seconds 2
}
