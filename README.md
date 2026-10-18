# Colab agency website

Spanish agency website with an original KOTA / Fabrica / VIEW SOURCE-inspired direction.

## Build and preview

Run `python3 scripts/build.py` to generate the homepage, portfolio catalog and individual project pages. Run `python3 -m http.server 8766 --bind 127.0.0.1 --directory dist` for preview. JavaScript and CSS are served directly.

- Edit `src/home.html` for homepage content.
- Edit `content/projects.json` for verified projects. Homepage is capped at three featured projects; catalog paginates by twelve.
- Edit `scripts/build.py` for shared headers, cards, catalog and project templates.
- Frontend code and assets are in `dist/`.
- Read `DESIGN.md` for user-approved design constraints.

## Contact

`dist/contact-config.js` accepts a confirmed WhatsApp number or email. It contains no credentials. Both are currently unset: the form prepares and copies a local message and does not send or store it. A configured destination exposes an explicit WhatsApp/email continuation link; it is not an automatic server-delivered enquiry. A shared inbox integration can be added after Andy and Sergio choose their contact setup.

## Portfolio and motion

Andy approved Ajitate, Lockpoint and CENIA. Images are from the actual sites. Visible cards automatically load their original public websites to preserve hero motion. Embedded sites are sandboxed and non-interactive. Up to three desktop previews or one mobile preview can run at once. Frames unload offscreen or when the tab is hidden; reduced-motion/data-saving settings retain posters. Third-party availability affects live previews.

Revision 4 builds on white, charcoal and silver with mist blue and lavender accents with an original HTML/CSS glass-browser conversation in the hero. Level text, CSS chat bubbles, an iridescent lens, seamless marquee, floating service panels and scroll-linked process highlights replace the old chain. `dist/refinement.css` overrides the retained baseline styles. The unused original sculpture source remains for reference. No footer pause control is present, per Andy's request. Motion does not depend on Framer or a paid component library.

## GitHub copy and deployment

This repository preserves the existing website and its four original source commits. It is a separate working copy from the ChatGPT Sites preview; pushing here does not update that preview.

The website needs no Node.js packages, API keys, database or paid animation library. Python 3 is sufficient to build and preview it. Keep the font license files with the assets.

For hosting at a domain root:

```sh
python3 scripts/build_pages.py
python3 -m http.server 8766 --bind 127.0.0.1 --directory _site
```

For a GitHub Pages project address, use the repository name as the base path:

```sh
python3 scripts/build_pages.py --base-path /colab-estudio/ --site-url https://YOUR-ACCOUNT.github.io/colab-estudio/
```

Deploy the generated `_site/` directory. The build adjusts internal navigation, assets and social URL metadata for the deployment path without changing the original root-relative source. `_site/` is generated and excluded from Git.

### GitHub Pages automation

`.github/workflows/pages.yml` builds and deploys the website on pushes to `main`, and can also be started manually from Actions. Enable **Settings → Pages → Source → GitHub Actions** before running it. GitHub Pages must be supported by the repository's visibility and account plan.

The workflow reads the site's actual base path and URL from GitHub Pages, builds all five pages, and uploads only `_site/`. Edit source files, run the build locally, and push to `main` to publish changes. No personal access token or external hosting credentials are needed by this workflow.

Repository visibility and website publication are separate decisions. This draft retains `noindex,nofollow` metadata, but that is not access control. The contact form still only prepares a local message; configure a real destination before using it to collect enquiries.

The `.openai/hosting.json` file belongs to the original Sites integration and contains no credentials. The inspiration board and workspace reference material are not part of this repository.
