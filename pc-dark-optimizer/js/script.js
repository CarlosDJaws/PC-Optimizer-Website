// --- Splash Screen Logic ---
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // Show splash for 3 seconds
    setTimeout(() => {
        // Start fading out the splash screen
        splash.classList.add('splash-fade-out');

        // After the fade-out animation (1s), hide splash and show main content
        setTimeout(() => {
            splash.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, 1000);
    }, 3000);
});


// --- Main Application Logic ---
function generateAndDownload() {
    // This batch script includes a self-elevation mechanism and a final pause.
    const scriptContent = `@echo off
:: Section 1: Check for administrator privileges and self-elevate if needed.
>nul 2>&1 "%SYSTEMROOT%\\system32\\cacls.exe" "%SYSTEMROOT%\\system32\\config\\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    powershell.exe -NoProfile -Command "Start-Process -FilePath '%~s0' -Verb RunAs"
    exit
)

:: Section 2: Execute the main PowerShell optimization commands.
:: This part only runs if the script has administrator rights.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "& {
    # Function to write a styled header
    function Write-Header {
        param ([string]$Title)
        Write-Host ''
        Write-Host '=============================================================================' -ForegroundColor Green
        Write-Host "            $Title" -ForegroundColor Green
        Write-Host '=============================================================================' -ForegroundColor Green
        Write-Host ''
    }

    Write-Header -Title 'Administrator privileges confirmed. Starting optimization...'
    
    # Task 1: CLEANING TEMPORARY FILES
    Write-Header -Title '1. Cleaning up temporary files'
    try {
        Write-Host '   - Cleaning user Temp, Windows Temp, and Prefetch folders...' -ForegroundColor Yellow
        Get-ChildItem -Path $env:TEMP, $env:windir\\Temp, $env:windir\\Prefetch -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host 'SUCCESS: Temporary files cleared.'
    } catch {
        Write-Host 'An error occurred during temp file cleanup, but we are continuing.' -ForegroundColor Yellow
    }

    # Task 2: REPAIRING SYSTEM FILES
    Write-Header -Title '2. Scanning and repairing system files'
    Write-Host 'STEP 1 of 2: Running System File Checker (SFC)...' -ForegroundColor Yellow
    Write-Host 'This process may take some time. Please be patient.'
    sfc /scannow

    Write-Host ''
    Write-Host 'STEP 2 of 2: Running Deployment Image Servicing and Management (DISM)...' -ForegroundColor Yellow
    Write-Host 'This tool will repair the underlying system image. This can also take a while.'
    Dism /Online /Cleanup-Image /RestoreHealth
    Write-Host 'SUCCESS: System file repair tools have finished.'

    # Task 3: OPTIMIZING DRIVES
    Write-Header -Title '3. Optimizing drive C:'
    try {
        Optimize-Volume -DriveLetter C -Verbose
        Write-Host 'SUCCESS: Drive optimization is complete.'
    } catch {
        Write-Host 'Could not optimize drive C:. An error occurred.' -ForegroundColor Red
    }

    # Task 4: FLUSH DNS CACHE
    Write-Header -Title '4. Flushing DNS Cache'
    Clear-DnsClientCache
    Write-Host 'SUCCESS: DNS cache has been flushed.'

    # --- COMPLETION MESSAGE ---
    Write-Host ''
    Write-Host '=============================================================================' -ForegroundColor Cyan
    Write-Host '        All optimization tasks are complete!' -ForegroundColor Cyan
    Write-Host ''
    Write-Host ' It is recommended to RESTART your computer now to ensure all changes' -ForegroundColor Cyan
    Write-Host ' take effect properly.' -ForegroundColor Cyan
    Write-Host '=============================================================================' -ForegroundColor Cyan
    Write-Host ''
    Read-Host 'Press ENTER to exit.'
}"

:: Section 3: Final pause to ensure the window stays open if PowerShell fails.
echo.
echo The script has finished or encountered an error.
pause
`;

    // Create a Blob from the script content
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Optimize.bat';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Provide user feedback
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = 'Download started! Please follow the instructions above.';
    setTimeout(() => {
        feedbackEl.textContent = '';
    }, 5000);
}
