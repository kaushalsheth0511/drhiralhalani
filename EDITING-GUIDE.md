# Editing guide — drhiralhalani.com

Everything on this site is plain HTML, CSS and JavaScript. There is no database, no
login and no build step. To change something, edit the file and re-upload it.

---

## 1. Adding a health library article

This is the one part designed to be updated regularly, and it is the only file you
need to touch to publish a new article.

**File:** `assets/data/library.js`

Open it, find the `"articles": [` line (it sits inside `window.LIBRARY = { ... };`), and copy an existing block. Paste your copy
directly after the opening `[` so the newest article appears first, then edit the text.

A block looks like this:

```json
    {
      "id": "short-name-with-dashes",
      "category": "nerve-muscle",
      "updated": "2026-09",
      "title_en": "The headline in English",
      "title_gu": "ગુજરાતીમાં મથાળું",
      "summary_en": "One line that appears in italics at the top.",
      "summary_gu": "ઉપર ત્રાંસા અક્ષરે દેખાતી એક લીટી.",
      "body_en": [
        "First paragraph in English.",
        "Second paragraph in English."
      ],
      "body_gu": [
        "ગુજરાતીમાં પહેલો ફકરો.",
        "ગુજરાતીમાં બીજો ફકરો."
      ]
    },
```

Rules that matter:

- `category` must be exactly one of: `nerve-muscle`, `emg`, `stroke`, `general`.
  (To add a new category, add it to the `categories` list at the top of the same file.)
- `id` must be unique and use only lowercase letters, numbers and dashes.
- Every block except the **last** one must end with a comma after its closing `}`.
- Each paragraph in `body_en` / `body_gu` is a separate line in quotes, separated by commas.
- Do not use straight double quotes (`"`) inside the text — they break the file.
  Use a single quote or rephrase.
- Both languages are required. If Gujarati is not ready yet, the English text is
  shown as a fallback, but it is better to publish both together.

**Before uploading**, check your work: open `health-library.html` in a browser by
double-clicking it. If your article appears, the file is valid. If the page shows a
loading error, a comma or a quote is out of place — the browser console (F12) will
name the line number.

Do not delete the first line (`window.LIBRARY = {`) or the last (`};`). Everything you
edit sits between them.

---

## 2. Changing text elsewhere on the site

Every visible piece of text on the site appears in the HTML like this:

```html
<h3 data-en="English text" data-gu="ગુજરાતી લખાણ">English text</h3>
```

There are three copies of the text: the `data-en` attribute, the `data-gu` attribute,
and the text between the tags. **Edit `data-en` and `data-gu`.** The text between the
tags is only what shows for a moment before JavaScript loads — keep it matching the
English, but it is not critical.

To change a phone number or address everywhere, use your editor's find-and-replace
across all `.html` files.

---

## 3. Replacing a photo

Put the new image in `assets/img/` and keep the same filename as the one it replaces
— then nothing else needs editing. Before uploading, resize it to about 1000 pixels
wide and save as JPEG at around 80% quality, so pages stay fast.

Current images and where they appear:

| File | Used on |
|---|---|
| `dr-hiral-hero.jpg` | Home page hero |
| `dr-hiral-portrait.jpg` | About page |
| `mentor-chamber.jpg` | Home page — training section |
| `masterclass-faculty.jpg` | About gallery, home Instagram tiles |
| `felicitation.jpg` | About gallery |
| `pg-crash-course.jpg` | About gallery |
| `stroke-unit.jpg` | Neurology care — stroke section, home tiles |
| `world-stroke-day.jpg` | Neurology care — prevention, home tiles |
| `dr-hiral-headshot.jpg` | Spare — not currently placed |
| `synergy-logo.jpg` | Spare — not currently placed |

---

## 4. The animated signs

The animations on the health library page (stroke facial weakness, Bell's palsy, arm
drift, myasthenic ptosis, Parkinson's rest tremor, essential tremor, ataxia,
hemiballismus, bradykinesia) are drawn in SVG and animated in CSS. They live directly
in `health-library.html`, with the motion rules in `assets/css/motion.css`.

To change the wording under an animation, edit the `data-en` and `data-gu` attributes
in that card. To change how a movement looks, edit the matching `@keyframes` block in
`motion.css` — the keyframe names describe the sign (`armDrift`, `ptosisFatigue`,
`dysmetria`, `fling`, `tapDecrement`, and so on).

Adding a new sign is a bigger job than adding an article; ask for it rather than
attempting it in a text editor.

---

## 5. Publishing changes

The site is a folder of static files. Deploy it the same way as the Arham site:

```bash
npx wrangler deploy
```

`wrangler.jsonc` is already configured. After deploying, hard-refresh the page
(Ctrl+Shift+R, or Cmd+Shift+R on a Mac) to see changes past the browser cache.

---

## 6. Things to update when details change

- **Medical council registration number** — not yet on the site. When you have it,
  add it to the footer block in each HTML file.
- **OPD timings** — currently "Monday to Saturday · 11:00 AM – 5:00 PM, Sunday closed",
  on `contact.html`, in the hero caption on `index.html`, and in the structured data
  block at the top of `index.html`.
- **Google reviews** — three are quoted on `index.html`. To swap one, edit the
  `<blockquote class="quote">` block.
- **Instagram tiles** — three static images linking to the profile, on `index.html`.
  Replace the image files to refresh them.
