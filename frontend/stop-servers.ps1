# Solar Portal - Stop Servers
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[*] Stopping Solar servers..." -ForegroundColor Yellow

# Stop via saved PIDs
foreach ($pidFile in @(".backend.pid", ".frontend.pid")) {
    $full = Join-Path $ProjectRoot $pidFile
    if (Test-Path $full) {
        $pid_ = [int](Get-Content $full -Raw).Trim()
        Stop-Process -Id $pid_ -Force -ErrorAction SilentlyContinue
        Write-Host "    Stopped PID $pid_" -ForegroundColor Green
        Remove-Item $full -Force
    }
}

# Also kill by port just in case
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

Write-Host "[*] All Solar servers stopped." -ForegroundColor Green
