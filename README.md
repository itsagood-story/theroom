# The Room

A guide to finding your people. A curated list of networking communities for founders, marketers, fractional leaders, creatives, and executives, curated by Gina Clementi of [Goodstory](https://itsagoodstory.com).

Plain HTML, CSS, and JavaScript. No build step, no tracking, no database.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page: header, intro, filters, Brand of You section, footer |
| `styles.css` | Goodstory look: cream, blue, red, lavender, green; Editorial New + Neue Montreal |
| `app.js` | Search, filters, grouping by focus, shareable filter links |
| `communities.json` | The list itself. This is the only file you edit to add or change a group |
| `DATA-REVIEW.md` | Open questions from the source spreadsheet |
| `goodstory-wordmark.png`, `goodstory-peace.png`, `goodstory-badge.png` | Brand marks |
| `*.woff` | PP Editorial New Ultralight (+ italic) and PP Neue Montreal Book/Medium, web-compressed |

## Add or edit a group

Open `communities.json` on GitHub, click the pencil, and copy an existing entry:

```json
{
  "id": "mixing-board",
  "name": "Mixing Board",
  "description": "Curated community for senior communications and PR professionals.",
  "url": "https://mixingboard.co",
  "categories": ["Comms and PR"],
  "fee": "free",
  "joining": "referral",
  "women": false,
  "note": null
}
```

- `fee`: `free`, `paid`, or `unknown` (shows "Fee not listed")
- `joining`: `open`, `referral`, or `unknown` (shows "Joining details not listed")
- `women`: `true` adds the Women-focused tag and filter
- `categories`: the first one decides which section the group sits in. A new category name creates a new section and filter automatically.
- `note`: your own comment, shown as "Gina's note". Use `null` for none.
- `description` and `url` can be `null`.

Commit. The site updates in a minute or two.

## Publish on GitHub Pages

1. Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.
2. The URL appears at the top of that page, normally `https://itsagood-story.github.io/theroom/`.

Pages on a **private** repository needs a paid GitHub plan. On GitHub Free, make the repository public first (Settings → General → Danger Zone → Change visibility).

To use a Goodstory subdomain (for example `room.itsagoodstory.com`), add it under Settings → Pages → Custom domain and add the CNAME record GitHub shows you at your domain registrar. Don't touch the root-domain records that point to Showit.

## Preview locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly from disk won't load the list.

## Fonts

PP Editorial New and PP Neue Montreal are licensed fonts from Pangram Pangram. Check that your license covers web use before the repo goes public.
