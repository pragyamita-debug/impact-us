# ImpactUs — Website

Get discovered. Get chosen. ImpactUs turns a candidate's CV into a discoverable personal website, ranks it on Google with SEO + digital marketing (Premium expert guidance), and guarantees their first interview.

Plain HTML / CSS / JS — no build step.

## Pages (each nav tab opens its own page)
| Nav tab | File | Content |
|---|---|---|
| Home | `index.html` | Clean hero, "search your name" hook, and the **ImpactUs Playbook**: a flip-book (problem, program, how it works, video, stories, Google proof, FAQ, apply). Home-only styles in `css/home.css`; flip logic in `js/main.js` |
| Program | `program.html` | 3-step path, proof / visibility / outreach deep-dives, Starter vs Premium |
| Success Stories | `success-stories.html` | Smith, Sandra, Kabir cards (click → story popup), Proof + Visibility + Network |
| How It Works | `how-it-works.html` | Animated 25-sec walkthrough player synced to 5 steps (`?play=1` autoplays) |
| About | `about.html` | Our Mission + 3 pillars |
| FAQ | `faq.html` | Accordion |
| Apply Now (button) | `apply.html` | Application form, QR code, "Only 30 spots left" (`?plan=Premium` preselects plan) |

Every page shares `css/styles.css` and `js/main.js`, and ends with a "next page" call-to-action band. When editing the menu or footer, change it on all 7 pages.

## Colours
One light theme: soft pink background, magenta accents, deep navy headings. The colour tokens are at the top of `css/styles.css` (`:root`).

## Things to plug in
1. **Application form** — in `js/main.js`, set `FORM_ENDPOINT` to a Formspree / Google Apps Script URL to receive submissions. Until then the form validates and shows a thank-you message, but nothing is sent.
2. **QR code** — `assets/img/qr.jpg` is the one from the deck; replace it if the destination changes.
3. **Program length** — the FAQ "How long does the program take?" answer is intentionally general; add exact duration when confirmed.

## Run / publish
Open `index.html` in a browser. To publish: GitHub → Settings → Pages → Deploy from branch → `main` / root.

## Photo credits
Home page photos (`assets/img/ref-*.jpg`) are free photos from Unsplash (Unsplash License):
- Hero: https://unsplash.com/photos/Y4zNMW3pQAs
- Video cover: https://unsplash.com/photos/gxat5nfmNRc
- Smith: https://unsplash.com/photos/TTOSniPxVmY
- Sandra: https://unsplash.com/photos/DmGzwwuLPG8
- Kabir: https://unsplash.com/photos/xbQpVuU3Y-c
