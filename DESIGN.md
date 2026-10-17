# CoLab design decisions

- Never use decorative northeast-pointing arrows. Andy explicitly rejected them on 2026-10-17. Use plain labels or purpose-specific conversation, plus, play and grid symbols.
- Keep the chrome / liquid-glass sculpture and the violet/lime palette. Render at high resolution with sampled edge smoothing.
- Keep the header continuously fixed; size and glass background respond continuously to scrolling. Never switch absolute/fixed at a threshold.
- No animation pause control in the footer. Respect the operating system's reduced-motion preference and stop offscreen rendering.
- Homepage: selected work, services, studio, process, questions, contact. Feature at most three projects; the complete portfolio belongs on its own page.
- Project catalog: search, sector filters, pagination, individual project pages. Add verified projects to `content/projects.json` and rebuild.
- Real project hero animations use an on-demand embedded public site, one active preview at a time. Static posters remain for loading and offline/unavailable sources. This preserves the current client animation without a separate video recording.
- Contact requires the person's name, business and email; WhatsApp is optional. Delivery remains a labeled preview until the agency destination is confirmed.
