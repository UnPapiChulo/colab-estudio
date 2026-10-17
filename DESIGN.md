# CoLab design decisions

- Never use decorative northeast-pointing arrows. Andy explicitly rejected them on 2026-10-17. Use plain labels or purpose-specific conversation, plus and grid symbols.
- Current revision explores charcoal, white and silver. This is a candidate brand direction requested for review, not an adopted final identity. Client websites retain their own colors.
- The signature hero is a conversation beside a glass browser illustration, with a silver lens. It replaces the chain sculpture. Keep text level and unscaled for clarity; the old WebGL file is unused.
- Keep the header continuously fixed; size and glass background respond continuously to scrolling. Never switch absolute/fixed at a threshold.
- No animation pause control in the footer. Respect the operating system's reduced-motion preference and stop offscreen decorative loops and live previews.
- Homepage: selected work, services, studio, process, questions, contact. Feature at most three projects; the complete portfolio belongs on its own page.
- Selected work uses equal-size aligned cards, level previews and consistent metadata. No staggered Lockpoint card or full-width CENIA card.
- Project catalog: search, sector filters, pagination, individual project pages. Add verified projects to `content/projects.json` and rebuild.
- Real project hero animations play automatically when visible. No “Ver en movimiento” controls. At most three visible previews on desktop, one on mobile. Sandboxed, non-interactive frames unload offscreen or on a hidden tab. Reduced-motion and data-saving users get screenshot posters.
- The marquee uses two identical, non-shrinking groups, each at least as wide as the viewport, moving exactly one group width per loop.
- Contact requires the person's name, business and email; WhatsApp is optional. Delivery remains a labeled preview until the agency destination is confirmed.
- Motion should clarify collaboration and project quality, with readable Spanish and real work as the focus. Avoid fabricated claims, testimonials, team details and decorative clutter.
