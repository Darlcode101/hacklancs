# HackLancs

Landing page for HackLancs, a student hackathon at Lancaster University. Served at [hacklancs.com](https://hacklancs.com).

Plain HTML, CSS and JavaScript with no build step. Open `index.html`, or run a local server:

```bash
python3 -m http.server 4173
```

## Layout

- `index.html`: all the page content. Event details still to be confirmed are marked with `TODO` comments.
- `css/style.css`: styles. `--px` is the size of one art pixel and is shared by the artwork and the UI borders.
- `js/scene.js`: draws the pixel art (hero landscape, chest and gate sprites, aqueduct deck) on canvases at whole-number scale.
- `js/site.js`: mobile menu.

## Before launch

- Confirm dates, venue building and the schedule.
- Confirm the answers in the FAQs (eligibility, cost, team size).
- Replace the "register interest" email link with the application form.
- Set up the `hello@` and `sponsors@` mailboxes on hacklancs.com.
- Add real prizes and sponsor logos.
