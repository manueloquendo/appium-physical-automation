param(
    [Parameter(Mandatory = $false)]
    [string]$Token,

    [Parameter(Mandatory = $false)]
    [string]$TeamId,

    [Parameter(Mandatory = $false)]
    [string]$SpaceId,

    [Parameter(Mandatory = $false)]
    [string]$SpaceName,

    [Parameter(Mandatory = $false)]
    [string]$ListName,

    [Parameter(Mandatory = $false)]
    [switch]$SkipValidation
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Invoke-ClickUpGet {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Uri,

        [Parameter(Mandatory = $true)]
        [hashtable]$Headers
    )

    return Invoke-RestMethod -Method Get -Uri $Uri -Headers $Headers
}

function Write-Section {
    param([string]$Text)

    Write-Host ""
    Write-Host "==== $Text ====" -ForegroundColor Cyan
}

try {
    if ([string]::IsNullOrWhiteSpace($Token)) {
        $Token = Read-Host 'Paste your ClickUp Personal API Token'
    }

    if ([string]::IsNullOrWhiteSpace($Token)) {
        throw 'Token is required.'
    }

    $headers = @{ Authorization = $Token }

    Write-Section 'Teams'
    $teamsResponse = Invoke-ClickUpGet -Uri 'https://api.clickup.com/api/v2/team' -Headers $headers
    $teams = @($teamsResponse.teams)

    if ($teams.Count -eq 0) {
        throw 'No teams found for this token.'
    }

    $teams | Select-Object id, name | Format-Table -AutoSize

    if ([string]::IsNullOrWhiteSpace($TeamId)) {
        if ($teams.Count -eq 1) {
            $TeamId = [string]$teams[0].id
            Write-Host "Using only available team id: $TeamId" -ForegroundColor Yellow
        } else {
            $TeamId = Read-Host 'Enter Team ID'
        }
    }

    if ([string]::IsNullOrWhiteSpace($TeamId)) {
        throw 'Team ID is required.'
    }

    Write-Section "Spaces for team $TeamId"
    $spacesResponse = Invoke-ClickUpGet -Uri "https://api.clickup.com/api/v2/team/$TeamId/space?archived=false" -Headers $headers
    $spaces = @($spacesResponse.spaces)

    if ($spaces.Count -eq 0) {
        throw 'No spaces found in this team.'
    }

    $spaces | Select-Object id, name | Format-Table -AutoSize

    if ([string]::IsNullOrWhiteSpace($SpaceId)) {
        if (-not [string]::IsNullOrWhiteSpace($SpaceName)) {
            $matchedSpace = $spaces | Where-Object { $_.name -eq $SpaceName } | Select-Object -First 1
            if ($null -eq $matchedSpace) {
                throw "SpaceName '$SpaceName' was not found."
            }

            $SpaceId = [string]$matchedSpace.id
            Write-Host "Using space id from name '$SpaceName': $SpaceId" -ForegroundColor Yellow
        } else {
            $SpaceId = Read-Host 'Enter Space ID (or rerun with -SpaceName "Your Space")'
        }
    }

    if ([string]::IsNullOrWhiteSpace($SpaceId)) {
        throw 'Space ID is required.'
    }

    $selectedSpace = $spaces | Where-Object { [string]$_.id -eq $SpaceId } | Select-Object -First 1
    $selectedSpaceName = if ($null -ne $selectedSpace) { [string]$selectedSpace.name } else { '(unknown space)' }

    $allLists = New-Object System.Collections.Generic.List[object]

    Write-Section "Direct lists in space $SpaceId"
    try {
        $spaceListsResponse = Invoke-ClickUpGet -Uri "https://api.clickup.com/api/v2/space/$SpaceId/list?archived=false" -Headers $headers
        $spaceLists = @($spaceListsResponse.lists)

        foreach ($list in $spaceLists) {
            $allLists.Add([PSCustomObject]@{
                ListId   = [string]$list.id
                ListName = [string]$list.name
                Space    = $selectedSpaceName
                Folder   = '(no folder)'
            })
        }
    } catch {
        Write-Warning "Could not fetch direct space lists: $($_.Exception.Message)"
    }

    Write-Section "Folders in space $SpaceId"
    $folders = @()
    try {
        $foldersResponse = Invoke-ClickUpGet -Uri "https://api.clickup.com/api/v2/space/$SpaceId/folder?archived=false" -Headers $headers
        $folders = @($foldersResponse.folders)
        if ($folders.Count -gt 0) {
            $folders | Select-Object id, name | Format-Table -AutoSize
        } else {
            Write-Host 'No folders found in this space.'
        }
    } catch {
        Write-Warning "Could not fetch folders: $($_.Exception.Message)"
    }

    foreach ($folder in $folders) {
        try {
            $folderListsResponse = Invoke-ClickUpGet -Uri "https://api.clickup.com/api/v2/folder/$($folder.id)/list?archived=false" -Headers $headers
            $folderLists = @($folderListsResponse.lists)

            foreach ($list in $folderLists) {
                $allLists.Add([PSCustomObject]@{
                    ListId   = [string]$list.id
                    ListName = [string]$list.name
                    Space    = $selectedSpaceName
                    Folder   = [string]$folder.name
                })
            }
        } catch {
            Write-Warning "Could not fetch lists for folder '$($folder.name)': $($_.Exception.Message)"
        }
    }

    Write-Section 'Candidate lists'
    $outputLists = @($allLists.ToArray())

    if (-not [string]::IsNullOrWhiteSpace($ListName)) {
        $outputLists = @($outputLists | Where-Object { $_.ListName -like "*$ListName*" })
        Write-Host "Filtering by ListName contains: $ListName" -ForegroundColor Yellow
    }

    if ($outputLists.Count -eq 0) {
        throw 'No lists found with current filters.'
    }

    $outputLists | Sort-Object Space, Folder, ListName | Format-Table -AutoSize

    $selectedListId = Read-Host 'Copy a ListId from the table above and paste it here'
    if ([string]::IsNullOrWhiteSpace($selectedListId)) {
        throw 'ListId is required.'
    }

    if (-not $SkipValidation) {
        Write-Section "Validating list id $selectedListId"
        $validated = Invoke-ClickUpGet -Uri "https://api.clickup.com/api/v2/list/$selectedListId" -Headers $headers
        Write-Host "OK - List ID is valid" -ForegroundColor Green
        Write-Host "Name: $($validated.name)"
        Write-Host "URL:  $($validated.url)"
    }

    Write-Section 'Use this in GitHub'
    Write-Host "CLICKUP_LIST_ID = $selectedListId" -ForegroundColor Green
    Write-Host 'Update the GitHub secret with this exact value.' -ForegroundColor Green
}
catch {
    Write-Error ("{0}" -f $_.Exception.Message)
    exit 1
}
