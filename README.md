# Wonderlab website

Static, multi-page website built with HTML, CSS and vanilla JavaScript. There is no build step, database or custom backend.

## Preview locally

From this folder, run:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Stop the server with `Ctrl+C`. Opening `index.html` directly also works for browsing, but a local server is recommended for checking form behaviour.

The contact form posts to Web3Forms. A locally served static site can submit to the hosted service, but delivery is not verified until a real test submission is made and received by Wonderlab. Do not send test enquiries during automated QA.

## Update confirmed content

Edit `assets/content.js` for shared brand and contact details. Replace clearly labelled placeholders in the relevant page only after the owner confirms the details. The privacy page is deliberately marked for review before publication.

The header, footer and favicon use the supplied original logo at `assets/wonderlab-logo.jpeg` directly, without editing or cropping it. Recreated SVG logo variants and an approximate SVG favicon were removed.

## SEO before publication

`sitemap.template.xml` is a template. After the production domain is confirmed, replace `PRODUCTION_DOMAIN`, save it as `sitemap.xml`, and submit its public URL to the search engine tools in use. The site intentionally has no canonical URLs until that hostname is confirmed. `robots.txt` allows public pages to be crawled; the privacy placeholder is marked noindex in its page metadata.

## Pages

- `index.html` — Home
- `our-approach.html` — Our Approach
- `programmes.html` — Primary Maths and Science, Primary 3–6
- `class-schedules.html` — Class Schedules
- `our-teacher.html` — Mrs Jayakody
- `trial-classes.html` — Trial Classes
- `contact.html` — Contact / Enquire Now
- `privacy-policy.html` — Privacy Policy placeholder

The site uses Google Fonts when a connection is available and falls back to system fonts otherwise. Stock imagery is stored locally under `assets/photos`. Mrs Jayakody’s profile uses a labelled illustration placeholder until an approved portrait is supplied.

The site includes five locally stored Pexels education photos as representative stock imagery, clearly captioned as not depicting Wonderlab. Image source and photographer credits are recorded in `assets/photos/credits.md`. The homepage carousel and image lightbox work without a library. A video placeholder is shown until approved Wonderlab video footage is supplied; there is no false play control.

Trial QR and WhatsApp placeholders must be replaced only after Wonderlab supplies an approved QR code and WhatsApp contact link. Available trial slots and timings are shared directly after a request.

The 2027 fee and semester material is draft-only and must not be distributed. Its hidden development scaffold remains empty pending accurate transcription and approval of the supplied source document.
