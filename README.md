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

Revision 3 explores white, charcoal and silver with an original HTML/CSS glass-browser conversation in the hero. Level text, CSS chat bubbles, a silver lens, seamless marquee and scroll-linked process line replace the old chain. `dist/refinement.css` overrides the retained baseline styles. The unused original sculpture source remains for reference. No footer pause control is present, per Andy's request. Motion does not depend on Framer or a paid component library.

## Hosting

Owner-private Site `appgprj_6ad3c96449888191b8fb76f4933b2787`. Preserve its audience. The public inspiration board is separate and unchanged. Sources under the repository's top-level `sources/` are read-only.
