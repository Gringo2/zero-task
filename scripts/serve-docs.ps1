$port = 8000
$maxPort = 8050

while ($port -le $maxPort) {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    try {
        $listener.Start()
        $listener.Stop()
        Write-Host "Found available port: $port" -ForegroundColor Cyan
        break
    } catch {
        Write-Host "Port $port is in use, trying next..." -ForegroundColor Yellow
        $port++
    }
}

if ($port -gt $maxPort) {
    Write-Error "Could not find an available port between 8000 and $maxPort"
    exit 1
}

Write-Host "Starting MkDocs server on http://localhost:$port" -ForegroundColor Green
python -m mkdocs serve -a localhost:$port
