# MIT License
# Adapted from https://github.com/dreamsavior/portable-python-maker

param ($source, $destination, $pythonVersion)

if (!$source) {
    $source = 'https://www.python.org/ftp/python/3.10.8/python-3.10.8-embed-amd64.zip'
}

if (!$pythonVersion) {
    $source -match '.+\/python-(\d+)\.(\d+)\..+'
    $Matches
    $pythonMajorVersion = "python$($Matches[1])"
    $pythonVersion = "python$($Matches[1])$($Matches[2])"
}

if (!$destination) {
    $destination = '.\'
}


"You're installing $($pythonVersion) into $($destination)"

New-Item -ItemType Directory -Force -Path "$($destination)"

# Destination to save the file
$package = "$($destination)embedpython.zip"

#Download the file
"Downloading package from $($source)"
Invoke-WebRequest -Uri $source -OutFile $package
Expand-Archive -Path $package -DestinationPath $destination


"Writing $($pythonVersion)._pth"

"Lib/site-packages
.\$($pythonVersion).zip
.

# Uncomment to run site.main() automatically
import site
" | Out-File -FilePath "$($destination)$($pythonVersion)._pth" -encoding ASCII


"Creating DLLs dir"
mkdir "$($destination)DLLs"

"copy python.exe to $($pythonMajorVersion).exe"
cp "$($destination)python.exe" "$($destination)$($pythonMajorVersion).exe"


"Installing PIP"
"You will see some warning about the $($destination)Scripts folder not on your SYSTEM PATH. That is NORMAL!"
Invoke-WebRequest -OutFile "$($destination)get-pip.py" "https://bootstrap.pypa.io/get-pip.py"
& "$($destination)python.exe" "$($destination)get-pip.py"

"Installing pyserial"
& "$($destination)python.exe" -m pip install pyserial


"Cleaning up"
Remove-Item -Path "$($package)" -Confirm:$false -Force
Remove-Item -Path "$($destination)get-pip.py" -Confirm:$false -Force

"Done!"
