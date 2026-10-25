# Dependencies

## get-platformio.py

It is not a direct copy from platformio. Had to add a custom pio installer base TMP directory.

## macOS (darwin_x64 / darwin_arm64)

The portable Python and git bundled with the macOS builds are not committed to
the repository. They are downloaded by:

```bash
./dependencies/download-mac-dependencies.sh x64
./dependencies/download-mac-dependencies.sh arm64
```

CI runs this before packaging. Run it once locally if you want the packaged
app (or `npm start`) to use the bundled tools instead of the system ones.

Sources, pinned by version and sha256 inside the script:

- Python: https://github.com/astral-sh/python-build-standalone/releases
  (relocatable CPython, `install_only` builds), plus `pyserial` and
  `setuptools` installed into its site-packages. `setuptools` is required on
  Python >= 3.12 because the PlatformIO installer imports `distutils`.
- git: https://github.com/desktop/dugite-native/releases

## windows_amd64

Portable Python and PortableGit are committed to the repository.

git comes from https://github.com/desktop/dugite-native/releases
