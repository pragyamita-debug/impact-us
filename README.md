# ImpactUs — Website

Get discovered. Get chosen. ImpactUs turns a candidate's CV into a discoverable personal website, ranks it on Google with SEO + digital marketing (Premium expert guidance), and guarantees their first interview.

Plain HTML / CSS / JS — no build step.

## Tabs / sections
| Nav tab | Section id | Content |
|---|---|---|
| Home | `#home` | Hero "You have the skills. But can the world notice it?" + 264 million problem band |
| Program | `#program` | 3-step path (Build Profile → Grow Network → Land First Interview), proof / visibility / outreach deep-dives, Starter vs Premium |
| Success Stories | `#stories` | Smith, Sandra, Kabir cards (click → story popup), Proof + Visibility + Network |
| How It Works | `#how` | Animated 25-sec walkthrough player synced to 5 steps |
| About | `#about` | Our Mission + 3 pillars |
| FAQ | `#faq` | Accordion |
| Apply Now | `#apply` | Application form, QR code, "Only 30 spots left" |

## Three colour themes
Switch with the three dots in the navbar (remembered per visitor), or by URL:
- `index.html?theme=midnight` — dark + orange
- `index.html?theme=lavender` — light lavender + orange/purple
- `index.html?theme=sage` — cream + green/amber

To fix one theme as the default, change `data-theme="midnight"` on the `<html>` tag in `index.html`. Colours live at the top of `css/styles.css`.

## Things to plug in
1. **Application form** — in `js/main.js`, set `FORM_ENDPOINT` to a Formspree / Google Apps Script URL to receive submissions. Until then the form validates and shows a thank-you message, but nothing is sent.
2. **QR code** — `assets/img/qr.jpg` is the one from the deck; replace it if the destination changes.
3. **Program length** — the FAQ "How long does the program take?" answer is intentionally general; add exact duration when confirmed.

## Run / publish
Open `index.html` in a browser. To publish: GitHub → Settings → Pages → Deploy from branch → `main` / root.
