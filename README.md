# Colab agency website draft

Spanish agency portfolio built as a lightweight static site. Inspiration: KOTA's expressive scale, Fabrica's project presentation, and VIEW SOURCE's atmospheric motion. The visuals and implementation are original.

## Preview

Run `python3 -m http.server 8766 --bind 127.0.0.1 --directory dist` from this folder.

## Content

Andy approved Ajitate, Lockpoint, and CENIA as portfolio entries on 2026-10-17. Screenshots show the actual live websites. Source evidence is in `../../output/portfolio-assets/portfolio-sources.json`.

The wordmark is a draft typographic treatment. No exploratory symbol has been adopted as the final logo. Team biographies, testimonials, and performance figures are omitted because none were provided.

## Contact limitation

The contact form prepares a message in the browser and allows the visitor to copy it. It does not send or store enquiries. An explicit preview note explains that the agency contact destination is pending. Connect the confirmed agency WhatsApp number or email before a public launch.

## Motion and accessibility

Native WebGL renders decorative linked forms. It stops when offscreen or the tab is hidden. Reduced-motion preferences and a persistent pause control stop animation. CSS artwork remains as fallback when WebGL is unavailable. The menu, service disclosures, and project dialogs use keyboard-accessible controls.

## Hosting

New owner-private Sites draft. The existing public inspiration board is a separate site and remains unchanged.
