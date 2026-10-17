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

Andy approved Ajitate, Lockpoint and CENIA. Images are from the actual sites. Play controls load one live public preview at a time, preserving original hero animations. Embedded sites are sandboxed and non-interactive in cards. Preview frames unload when offscreen or the tab is hidden. External availability may affect live previews; images remain available.

The original WebGL sculpture uses higher-resolution two-sample rendering for smoother edges. It respects reduced motion and stops when offscreen or hidden. No footer pause control is present, per Andy's request. Motion does not depend on Framer or a paid component library.

## Hosting

Owner-private Site `appgprj_6ad3c96449888191b8fb76f4933b2787`. Preserve its audience. The public inspiration board is separate and unchanged. Sources under the repository's top-level `sources/` are read-only.
