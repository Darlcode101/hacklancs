# HackLancs

Landing page for HackLancs, a student hackathon at Lancaster University. Served at [hacklancs.com](https://hacklancs.com).

Plain HTML, CSS and JavaScript with no build step. Open `index.html`, or run a local server:

```bash
python3 -m http.server 4173
```

## Layout

- `index.html`: all the page content. Event details still to be confirmed are marked with `TODO` comments.
- `css/style.css`: styles. `--px` is the size of one art pixel and is shared by the artwork and the UI borders.
- `js/scene.js`: draws the pixel art (hero landscape, chest sprites, aqueduct deck, canal water) on canvases at whole-number scale.
- `js/site.js`: mobile menu and Tito sign-up (`TITO_EVENT`).

## Before launch

- Confirm the venue building and the schedule (date is set: Saturday 6 March 2027).
- Confirm the answers in the FAQs (eligibility, cost, team size).
- Set `TITO_EVENT` in `js/site.js` to the event's Tito path to turn on sign-up.
- Set up the `hello@` and `sponsors@` mailboxes on hacklancs.com.
- Add real prizes and sponsor logos.
