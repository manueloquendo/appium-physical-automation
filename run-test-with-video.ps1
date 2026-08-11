param(
    [Parameter(Mandatory=$false)]
    [string]$SpecFile = "./test/features/authentication/blank-fields-validation.feature",
    
    [Parameter(Mandatory=$false)]
    [string]$VideoDir = "./videos"
)

# Create videos folder
if (-not (Test-Path $VideoDir)) {
    New-Item -ItemType Directory -Path $VideoDir -Force | Out-Null
    Write-Host "[+] Videos folder created: $VideoDir"
}

# Generate video filename
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$videoFile = Join-Path $VideoDir "test_$timestamp.mp4"

Write-Host "========================================="
Write-Host "Starting test recording..."
Write-Host "========================================="
Write-Host "Spec:  $SpecFile"
Write-Host "Video: $videoFile"
Write-Host ""

# Start Appium server
Write-Host "[*] Starting Appium server..."
$appiumProcess = Start-Process cmd.exe -ArgumentList '/c appium --port 4723 --relaxed-security' -PassThru -NoNewWindow

# Wait for Appium to be ready
$maxAttempts = 30
$attempt = 0
$appiumReady = $false
while ($attempt -lt $maxAttempts -and -not $appiumReady) {
    try {
        $response = Invoke-WebRequest -Uri 'http://127.0.0.1:4723/status' -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "[+] Appium server is ready!"
            $appiumReady = $true
            break
        }
    } catch {
        $attempt++
        Write-Host "[*] Waiting for Appium... (attempt $attempt/$maxAttempts)"
        Start-Sleep -Seconds 1
    }
}
if (-not $appiumReady) {
    Write-Error "Appium server failed to start within 30 seconds"
    exit 1
}

# Start scrcpy recording in background
Write-Host "[*] Starting scrcpy..."
$scrcpyProcess = Start-Process -FilePath "scrcpy" -ArgumentList "--record=$videoFile", "--no-window" -PassThru -NoNewWindow
$scrcpyPID = $scrcpyProcess.Id
Write-Host "[+] scrcpy started (PID: $scrcpyPID)"

# Wait for scrcpy to stabilize
Start-Sleep -Seconds 3

# Run tests
Write-Host ""
Write-Host "[*] Running tests..."
Write-Host ""

try {
    npm run android:usb -- --spec $SpecFile
    $testResult = $LASTEXITCODE
} catch {
    $testResult = 1
    Write-Host "[!] Error running tests: $_"
}

# Wait for scrcpy to finish recording
Write-Host ""
Write-Host "[*] Stopping recording..."
Start-Sleep -Seconds 2

# Stop scrcpy
Stop-Process -Id $scrcpyPID -Force -ErrorAction SilentlyContinue
Write-Host "[+] scrcpy stopped"

# Stop Appium
if ($null -ne $appiumProcess -and -not $appiumProcess.HasExited) {
    Stop-Process -Id $appiumProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "[+] Appium stopped"
}

# Wait for file to be written
Start-Sleep -Seconds 1

# Verify video was created
if (Test-Path $videoFile) {
    $fileSize = [math]::Round((Get-Item $videoFile).Length / 1MB, 2)
    Write-Host ""
    Write-Host "========================================="
    Write-Host "[OK] Video recorded successfully"
    Write-Host "Path: $videoFile"
    Write-Host "Size: $fileSize MB"
    Write-Host "========================================="
} else {
    Write-Host ""
    Write-Host "[!] Video file not found: $videoFile"
}

Write-Host ""
if ($testResult -eq 0) {
    Write-Host "[OK] Tests completed successfully"
} else {
    Write-Host "[ERROR] Tests failed (Exit Code: $testResult)"
}

exit $testResult
