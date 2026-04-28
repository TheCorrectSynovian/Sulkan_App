# Sulkan Website

This repository contains the **static website** for **Sulkan** — the project hub for downloads, documentation, the Shader Pack API, and official shaderpacks.

It is **not** the Sulkan mod source code.

## What’s inside

- `index.html` — landing page
- `versions.html` — downloads (platform links + direct `.jar` + archived releases)
- `documentation.html` — install + usage guide
- `shaderpack-api.html` — Shader Pack API reference
- `showcase.html` — screenshot gallery
- `spdownloads.html` / `spdownloaderpage.html` — official shaderpack downloads (Basepack)
- `downloads/Stable/` — direct stable `.jar` hosting
- `downloads/All Releases/` — direct archive `.jar` hosting
- `shaderpacks/` — official shaderpack zips/assets

## Direct downloads (hosted in this repo)

- Stable builds live in `downloads/Stable/`
- Archived builds live in `downloads/All Releases/`

The site reads these folders via JSON indexes:

- `downloads/Stable/index.json`
- `downloads/All Releases/index.json`

If you add/remove jars, regenerate the indexes:

```bash
python3 tools/generate-download-index.py
```

## Community & support

- Discord: `https://discord.gg/9wXEBAmDNS`
- Ko-fi: `https://ko-fi.com/mravatin`

## Modpack policy (short version)

You may include Sulkan in modpacks **as long as**:

- You **credit** Sulkan, and
- You **link back** to an official page (this website, CurseForge, or Modrinth).

Full rules: `terms.html`

## Local preview

Any static file server works. Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.
