# Solar Portal - Persistent Server Launcher
# Servers run as independent Windows processes - survive terminal/tab close

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendPath  = Join-Path $ProjectRoot "backend"

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   Solar Portal - Persistent Server Launcher   " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# --- Kill old processes on ports 8000, 5173, 5174 ---
Write-Host "" 
Write-Host "[*] Stopping old servers on ports 8000 / 5173 / 5174 ..." -ForegroundColor Yellow
foreach ($port in @(8000, 5173, 5174)) {
    $result = netstat -ano | Select-String ":$port\s"
    foreach ($line in $result) {
        $parts = $line -split '\s+'
        $pid_ = $parts[-1]
        if ($pid_ -match '^\d+$' -and $pid_ -ne '0') {
            Stop-Process -Id ([int]$pid_) -Force -ErrorAction SilentlyContinue
        }
    }
}
Start-Sleep -Seconds 2

# --- Detect venv ---
$venvPython = Join-Path $BackendPath "venv\Scripts\python.exe"
$pythonExe  = if (Test-Path $venvPython) { $venvPython } else { "python" }
Write-Host "[*] Using Python: $pythonExe" -ForegroundColor Gray

# --- Start Django Backend as independent process ---
Write-Host "[*] Starting Django backend  -> http://localhost:8000" -ForegroundColor Green
$backendLog = Join-Path $ProjectRoot "backend.log"
$proc1 = Start-Process -FilePath $pythonExe `
    -ArgumentList "manage.py runserver 0.0.0.0:8000" `
    -WorkingDirectory $BackendPath `
    -RedirectStandardOutput $backendLog `
    -RedirectStandardError  "$ProjectRoot\backend_error.log" `
    -WindowStyle Hidden `
    -PassThru

# Save PID so we can stop it later
$proc1.Id | Out-File (Join-Path $ProjectRoot ".backend.pid") -Force

# --- Start React (Vite) Frontend as independent process ---
Write-Host "[*] Starting React  frontend -> http://localhost:5174" -ForegroundColor Green
$frontendLog = Join-Path $ProjectRoot "frontend.log"
$proc2 = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c npm run dev > `"$frontendLog`" 2>&1" `
    -WorkingDirectory $ProjectRoot `
    -WindowStyle Hidden `
    -PassThru

$proc2.Id | Out-File (Join-Path $ProjectRoot ".frontend.pid") -Force

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   Servers started! (Running in background)    " -ForegroundColor Green
Write-Host ""
Write-Host "   Frontend : http://localhost:5174             " -ForegroundColor White
Write-Host "   Backend  : http://localhost:8000             " -ForegroundColor White
Write-Host ""
Write-Host "   Backend PID  : $($proc1.Id)" -ForegroundColor Gray
Write-Host "   Frontend PID : $($proc2.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "   Logs: backend.log / frontend.log            " -ForegroundColor Gray
Write-Host "   Stop: Run stop-servers.ps1                  " -ForegroundColor Gray
Write-Host "=================================================" -ForegroundColor Cyan

# --- Live tail logs for 30 seconds so user can verify ---
Write-Host ""
Write-Host "[Watching logs for 30s - servers stay alive after you close this window...]" -ForegroundColor Yellow
Write-Host ""
$timer = 0
while ($timer -lt 30) {
    Start-Sleep -Seconds 2
    $timer += 2

    # Show last 3 lines of each log
    if (Test-Path $backendLog) {
        $bl = Get-Content $backendLog -Tail 3 -ErrorAction SilentlyContinue
        $bl | ForEach-Object { Write-Host "[Backend]  $_" -ForegroundColor DarkCyan }
    }
    if (Test-Path $frontendLog) {
        $fl = Get-Content $frontendLog -Tail 3 -ErrorAction SilentlyContinue
        $fl | ForEach-Object { Write-Host "[Frontend] $_" -ForegroundColor DarkGreen }
    }
}
Write-Host ""
Write-Host "[Done watching. Both servers are still running in background!]" -ForegroundColor Green
