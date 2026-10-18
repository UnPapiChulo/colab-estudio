# CoLab design decisions

- Never use decorative northeast-pointing arrows. Andy explicitly rejected them on 2026-10-17. Use plain labels or purpose-specific conversation, plus and grid symbols.
- Current revision retains charcoal, white and silver with restrained mist blue and lavender accents. Color belongs in the glass art, service illustration, process states and contact section; core typography and main buttons stay dark. This is a candidate brand direction, not an adopted final identity. Client websites retain their own colors.
- The signature hero is a conversation beside a glass browser illustration, with a silver lens. It replaces the chain sculpture. Keep text level and unscaled for clarity; the old WebGL file is unused.
- Keep the header continuously fixed; size and glass background respond continuously to scrolling. Never switch absolute/fixed at a threshold.
- No animation pause control in the footer. Respect the operating system's reduced-motion preference and stop offscreen decorative loops and live previews.
- Homepage: selected work, services, studio, process, questions, contact. Feature at most three projects; the complete portfolio belongs on its own page.
- Selected work uses equal-size aligned cards, level previews and consistent metadata. No staggered Lockpoint card or full-width CENIA card.
- Project catalog: search, sector filters, pagination, individual project pages. Add verified projects to `content/projects.json` and rebuild.
- Real project hero animations play automatically when visible. No “Ver en movimiento” controls. At most three visible previews on desktop, one on mobile. Sandboxed, non-interactive frames unload offscreen or on a hidden tab. Reduced-motion and data-saving users get screenshot posters.
- Do not use decorative asterisk emoji; Andy and Sergio requested their removal.
- No scrolling text strip or black marquee bar between the hero and selected projects. Andy requested removal of the entire strip.
- Contact requires the person's name, business and email; WhatsApp is optional. Delivery remains a labeled preview until the agency destination is confirmed.
- Motion should clarify collaboration and project quality, with readable Spanish and real work as the focus. Avoid fabricated claims, testimonials, team details and decorative clutter.

- Decorative motion pauses offscreen and when the page is hidden. The services illustration uses small floating design/code/web panels, and the process highlights stages according to scroll progress. Keep text level and preserve reduced-motion support.
