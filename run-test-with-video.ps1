param(
    [Parameter(Mandatory=$false)]
    [string]$SpecFile = "./test/features/authentication/blank-fields-validation.feature",
    
    [Parameter(Mandatory=$false)]
    [string]$VideoDir = "./videos",

    [Parameter(Mandatory=$false)]
    [int]$AppiumStartupTimeoutSeconds = 120
)

# Create videos folder
if (-not (Test-Path $VideoDir)) {
    New-Item -ItemType Directory -Path $VideoDir -Force | Out-Null
    Write-Host "[+] Videos folder created: $VideoDir"
}

# Generate video filename
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$videoFile = Join-Path $VideoDir "test_$timestamp.mp4"
$appiumStdOutLogFile = Join-Path $VideoDir "appium_$timestamp.stdout.log"
$appiumStdErrLogFile = Join-Path $VideoDir "appium_$timestamp.stderr.log"

Write-Host "========================================="
Write-Host "Starting test recording..."
Write-Host "========================================="
Write-Host "Spec:  $SpecFile"
Write-Host "Video: $videoFile"
Write-Host ""

# Wake the device and start scrcpy recording before Appium so startup failures are captured too.
Write-Host "[*] Waking Android device before recording..."
adb shell input keyevent KEYCODE_WAKEUP | Out-Null
Start-Sleep -Seconds 1

Write-Host "[*] Starting scrcpy..."
$scrcpyArgs = @(
    "--record=$videoFile",
    "--no-window",
    "--stay-awake",
    "--disable-screensaver",
    "--video-bit-rate=8M",
    "--max-fps=30"
)
$scrcpyProcess = Start-Process -FilePath "scrcpy" -ArgumentList $scrcpyArgs -PassThru -NoNewWindow
$scrcpyPID = $scrcpyProcess.Id
Write-Host "[+] scrcpy started (PID: $scrcpyPID)"

# Give scrcpy a moment to connect and begin writing the file.
Start-Sleep -Seconds 3

# Start Appium server
Write-Host "[*] Starting Appium server..."
$appiumProcess = Start-Process -FilePath "cmd.exe" -ArgumentList @("/c", "appium --port 4723 --relaxed-security") -PassThru -NoNewWindow -RedirectStandardOutput $appiumStdOutLogFile -RedirectStandardError $appiumStdErrLogFile
Write-Host "[*] Appium stdout log: $appiumStdOutLogFile"
Write-Host "[*] Appium stderr log: $appiumStdErrLogFile"

# Wait for Appium to be ready
$pollIntervalSeconds = 2
$maxAttempts = [math]::Ceiling($AppiumStartupTimeoutSeconds / $pollIntervalSeconds)
$attempt = 0
$appiumReady = $false
while ($attempt -lt $maxAttempts -and -not $appiumReady) {
    if ($appiumProcess.HasExited) {
        Write-Error "Appium process exited early with code $($appiumProcess.ExitCode)."
        if (Test-Path $appiumStdOutLogFile) {
            Write-Host "--- Last Appium stdout log lines ---"
            Get-Content -Path $appiumStdOutLogFile -Tail 80
        }
        if (Test-Path $appiumStdErrLogFile) {
            Write-Host "--- Last Appium stderr log lines ---"
            Get-Content -Path $appiumStdErrLogFile -Tail 80
        }
        exit 1
    }

    try {
        $response = Invoke-WebRequest -Uri 'http://127.0.0.1:4723/status' -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "[+] Appium server is ready!"
            $appiumReady = $true
            break
        }
    } catch {
        # Ignore transient status errors while Appium is still loading drivers.
    }

    $attempt++
    Write-Host "[*] Waiting for Appium... (attempt $attempt/$maxAttempts)"
    Start-Sleep -Seconds $pollIntervalSeconds
}
if (-not $appiumReady) {
    Write-Error "Appium server failed to start within $AppiumStartupTimeoutSeconds seconds"
    if (Test-Path $appiumStdOutLogFile) {
        Write-Host "--- Last Appium stdout log lines ---"
        Get-Content -Path $appiumStdOutLogFile -Tail 80
    }
    if (Test-Path $appiumStdErrLogFile) {
        Write-Host "--- Last Appium stderr log lines ---"
        Get-Content -Path $appiumStdErrLogFile -Tail 80
    }
    exit 1
}

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

# Stop scrcpy and wait for the encoder to finalize the MP4.
if ($null -ne $scrcpyPID) {
    try {
        Stop-Process -Id $scrcpyPID -Force -ErrorAction Stop
        Wait-Process -Id $scrcpyPID -Timeout 10 -ErrorAction SilentlyContinue
        Write-Host "[+] scrcpy stopped"
    } catch {
        Write-Warning "Could not stop scrcpy cleanly: $($_.Exception.Message)"
    }
}

# Stop Appium
if ($null -ne $appiumProcess -and -not $appiumProcess.HasExited) {
    Stop-Process -Id $appiumProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "[+] Appium stopped"
}

# Wait for file to be written and finalized.
Start-Sleep -Seconds 2

# Verify video was created and is not empty.
if (Test-Path $videoFile) {
    $videoItem = Get-Item $videoFile
    $fileSize = [math]::Round(($videoItem.Length / 1MB), 2)
    if ($videoItem.Length -gt 0) {
        Write-Host ""
        Write-Host "========================================="
        Write-Host "[OK] Video recorded successfully"
        Write-Host "Path: $videoFile"
        Write-Host "Size: $fileSize MB"
        Write-Host "========================================="
    } else {
        Write-Host ""
        Write-Host "[!] Video file was created but is empty: $videoFile"
    }
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
