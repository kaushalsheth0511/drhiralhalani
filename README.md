# drhiralhalani.com

Static bilingual (English / Gujarati) website for Dr. Hiral Halani Sheth,
Consultant Neurologist, Rajkot.

## Structure

    index.html              Home
    about.html              Profile, training timeline, academics, gallery
    nerve-muscle.html       Neuromuscular conditions (the special interest)
    emg-ncv.html            EMG / NCV / RNS / EEG — what the tests are
    neurology-care.html     Stroke, epilepsy, headache, vertigo, Parkinson's, dementia, MS, sleep
    health-library.html     Renders assets/data/library.json — the updatable section
    contact.html            Location, timings, what to bring, map
    404.html
    assets/css/style.css    Design system
    assets/js/site.js       Language toggle, nav, nerve-trace signature, reveals
    assets/js/library.js    Health library renderer
    assets/data/library.json  ← the only file to edit to publish an article
    wrangler.jsonc          Cloudflare Workers static-assets config

## Deploy

    npx wrangler deploy

## Editing

See EDITING-GUIDE.md.

## Notes

- No build step, no framework, no external JS dependencies. Fonts load from Google Fonts.
- Language choice is stored in the browser and persists across pages.
- The waveform in the hero and the section dividers is a nerve-conduction trace
  generated in JavaScript (assets/js/site.js), not an image.
