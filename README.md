# Wonderlab website

Static, multi-page website built with HTML, CSS and vanilla JavaScript. There is no build step, database or custom backend.

## Preview locally

From this folder, run:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Stop the server with `Ctrl+C`. Opening `index.html` directly also works for browsing, but a local server is recommended for checking form behaviour.

Contact enquiries currently use the confirmed Wonderlab email address. A website form remains unavailable until its destination and data handling are approved.

## Update confirmed content

Edit `assets/content.js` for shared brand and contact details. Approval-dependent details stay out of public page content until Wonderlab confirms them. The privacy page redirects to Contact and remains noindex until the approved policy is supplied.

Uma's exact original logo at `assets/brand/original/wonderlabLogo.jpeg` is the authoritative brand master. Header and footer use that JPEG directly at its 2:1 aspect ratio, on white surfaces, without cropping, recolouring, background removal, filters or redrawing. The earlier oval assets are retained as unused history. Favicons are contain-resized copies of the complete original artwork on square white canvases; no separate symbol is invented. Social metadata also references the original JPEG.

## SEO before publication

The existing GitHub Pages configuration and release instruction confirm `https://wonderlab.sg/`. Content pages use matching HTTPS canonical/social URLs, approved logo preview artwork and `sitemap.xml`. `robots.txt` advertises the sitemap. The privacy redirect stays noindex. The original sitemap template is retained as a reference.

## Pages

- `index.html` — Home
- `our-approach.html` — Our Approach
- `programmes.html` — Primary Science, Primary 3–6
- `class-schedules.html` — Class Schedules
- `our-teacher.html` — Mrs Jayakody
- `trial-classes.html` — Trial Classes
- `contact.html` — Contact / Enquire Now
- `privacy-policy.html` — Privacy Policy placeholder

The site uses Google Fonts when a connection is available and falls back to system fonts otherwise. Stock imagery is stored locally under `assets/photos`. Mrs Jayakody’s profile uses a labelled illustration placeholder until an approved portrait is supplied.

The site includes five locally stored Pexels education photos as representative stock imagery, clearly captioned as not depicting Wonderlab. Image source and photographer credits are recorded in `assets/photos/credits.md`. The retained carousel/lightbox code has no external library dependency. Empty gallery/video sections are not shown. Do not add footage or claims until approved.

Trial QR and WhatsApp controls remain hidden until Wonderlab supplies an approved QR code and WhatsApp contact link. Available trial options and timings are shared directly after an enquiry.

The 2027 fee and semester material is draft-only and must not be distributed. Its hidden development scaffold remains empty pending accurate transcription and approval of the supplied source document.

## Phase 2 local continuation

The final shared style layer is `assets/phase2.css`, loaded after the retained stylesheets. It applies the approved palette, larger mobile touch targets, responsive programme cards and a 1000px navigation breakpoint. Shared navigation keeps closed mobile links out of the focus order and closes on Escape, outside click, focus leaving the header or a breakpoint change.

Programme learning-focus descriptions use the supplied client brief, without topic inventories, fees, dates or outcome guarantees. Final curriculum/copy sign-off and the experiments safety/feasibility review are still required before publication.

Canonical and social metadata now use the confirmed release origin. No temporary visualization paths are referenced. Experiments copy is preserved behind `hidden` approval gates until curriculum-owner confirmation; do not remove those gates without that approval.

Original photos and logo artwork are retained. Responsive WebP sources use 480px, 960px and 1600px variants with JPEG fallbacks; see `assets/photos/credits.md`. The hero remains eager/high priority, and supporting photos remain lazy-loaded. No enquiry form or approved policy has been added; the earlier dormant form handler is preserved for future review.

Run source checks with no additional dependencies:

```powershell
python scripts/check-site.py
node --check assets/site.js
node --check assets/content.js
node --check assets/media.js
git diff --check
```

The Python check covers HTML nesting, IDs, local links and fragments, image attributes, SVG semantics, metadata, JSON-LD, CSS delimiters/resources and approval guards. It is not a full standards validator or accessibility certification. Also review real iPhone Safari and Android Chrome, keyboard focus, 200% text scaling, reduced motion, image crops, external map/booking destinations and approved hosting before release. Local viewport emulation does not replace real-device testing.

## Approved branding and release

`assets/phase3.css` is loaded after Phase 2. It refines typography, header/footer proportions, buttons, focus indicators and image framing. The later local correction uses Uma's supplied original JPEG and supersedes the oval redesign. `assets/original-brand.css` is loaded last for original-logo presentation, neutral card highlights and mobile programme/trial refinements. These corrections are pending review and have not been deployed. No proposal previews, client documents, temporary reports, backups or credentials belong in the release commit.

The launch offer is Primary 3–6 Science only, as specified in the developer brief; Maths is not advertised. Pending schedules, fees, trial terms, WhatsApp/QR and social details remain absent. Teacher credentials and portrait, experiments safety/syllabus mapping, privacy/DPO details and any future form provider require separate sign-off. GitHub Pages hosting and business ownership arrangements remain the client's responsibility; this release does not change DNS or email records.

Publishing is through a reviewed pull request from `wonderlab-science-update` to `main`. Verify Pages deployment success for the merged SHA, then verify the live pages and assets. For rollback, revert the release merge through a reviewed PR; do not force-push. Use the source repository, not a downloaded generated page, for maintenance.
