#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script para ejecutar pruebas con grabación de pantalla usando scrcpy
.DESCRIPTION
    Inicia scrcpy para grabar la pantalla del dispositivo, ejecuta las pruebas
    y guarda el video en la carpeta de videos.
.EXAMPLE
    .\run-with-recording.ps1 -SpecFile "test/features/authentication/blank-fields-validation.feature"
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$SpecFile = "./test/features/authentication/blank-fields-validation.feature",
    
    [Parameter(Mandatory=$false)]
    [string]$VideoDir = "./videos"
)

# Crear carpeta de videos si no existe
if (-not (Test-Path $VideoDir)) {
    New-Item -ItemType Directory -Path $VideoDir -Force | Out-Null
    Write-Host "[+] Carpeta de videos creada: $VideoDir"
}

# Timestamp para el nombre del video
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$videoFile = Join-Path $VideoDir "test_$timestamp.mp4"

Write-Host "=============================================="
Write-Host "Iniciando grabacion de pruebas..."
Write-Host "=============================================="
Write-Host "Spec:  $SpecFile"
Write-Host "Video: $videoFile"
Write-Host ""

# Start scrcpy recording before Appium so startup failures are captured too.
Write-Host "[*] Iniciando scrcpy..."
$scrcpyProcess = Start-Process -FilePath "scrcpy" -ArgumentList "--record=$videoFile", "--no-window", "--stay-awake" -PassThru -NoNewWindow
$scrcpyPID = $scrcpyProcess.Id
Write-Host "[+] scrcpy iniciado (PID: $scrcpyPID)"

# Esperar a que scrcpy se conecte y comience a escribir el archivo.
Start-Sleep -Seconds 3

# Ejecutar las pruebas
Write-Host ""
Write-Host "[*] Ejecutando pruebas..."
Write-Host ""

try {
    npm run android:usb -- --spec $SpecFile
    $testResult = $LASTEXITCODE
} catch {
    $testResult = 1
    Write-Host "[!] Error ejecutando pruebas: $_"
}

# Esperar un poco para que scrcpy termine de grabar
Write-Host ""
Write-Host "[*] Finalizando grabacion..."
Start-Sleep -Seconds 2

# Detener scrcpy
Stop-Process -Id $scrcpyPID -Force -ErrorAction SilentlyContinue
Write-Host "[+] scrcpy detenido"

# Esperar a que se escriba el archivo
Start-Sleep -Seconds 1

# Verificar si el video se grabó
if (Test-Path $videoFile) {
    $fileSize = [math]::Round((Get-Item $videoFile).Length / 1MB, 2)
    Write-Host ""
    Write-Host "=============================================="
    Write-Host "Video grabado exitosamente"
    Write-Host "Ruta: $videoFile"
    Write-Host "Tamano: $fileSize MB"
    Write-Host "=============================================="
} else {
    Write-Host ""
    Write-Host "[!] El archivo de video no se encontro en: $videoFile"
}

Write-Host ""
if ($testResult -eq 0) {
    Write-Host "[OK] Pruebas completadas exitosamente"
} else {
    Write-Host "[ERROR] Las pruebas fallaron (Exit Code: $testResult)"
}

exit $testResult
