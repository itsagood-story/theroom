# Good Connections · Goodstory

A responsive directory with 40 communities from `Networking Community Groups.xlsx`. Plain HTML, CSS, JavaScript and JSON. No package installation, build step, login, database or third-party tracking.

## Preview locally

Open a terminal in this folder and run:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Keep the terminal running while viewing. Opening `index.html` directly from disk does not allow the browser to fetch the JSON data.

## Publish on GitHub Pages

1. Create a repository named `goodconnections` in the GitHub account that should own it. Public repositories support Pages on GitHub Free; private repository support depends on the plan.
2. Upload the **contents** of this folder to the repository’s `main` branch. `index.html` must be at the root, with `styles.css`, `app.js` and `communities.json` and the image/font files alongside it. Include `.nojekyll` when using Git.
3. Open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, then **main** and **/(root)**. Save.
4. Wait for the Pages deployment to finish. The Pages settings show the published URL, normally `https://YOUR-ACCOUNT.github.io/goodconnections/`.
5. Open the published page and check a search, a filter, a community detail and its external link. The Suggest a community button opens an email draft to Gina; it does not silently send or store a submission.

All site asset paths are relative, so the same files work at a repository subpath or a custom domain. No GitHub Actions workflow is required.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Optional Goodstory subdomain

Choose the desired subdomain, then add it in the repository’s Pages settings and follow GitHub’s domain verification and DNS instructions. No domain has been assumed or configured. Do not change the existing Showit website’s root-domain records.

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Edit communities

Edit `communities.json`, then commit the change. The page reads that file directly. No rebuild is required.

- `id`: unique lowercase identifier; keep it stable so bookmarked details keep working.
- `name`, `description`, `url`: source facts. Use `null` for an unavailable description or URL.
- `categories`: visible source categories; these populate the category filter automatically.
- `pathways`: one or more of `founders`, `fractional`, `marketing`, `women`, `executive`, `speaking`. Only assign pathways supported by the source. The industry pathway focuses the category selector.
- `notes`: Gina’s actual comments. An empty array displays an honest missing-note message in details.
- `fee`, `referral`, `location`: display labels that also populate filters. Preserve unspecified information and conflicts.
- `goodFor`: currently the source description, or the source categories where no description exists. Replace only with approved editorial copy.
- `sourceRows`, `fees`, `referrals`: provenance and original source values. These help resolve conflicts.

Use `node validate.mjs` to check the structure and safe link schemes after editing. Node is optional and not needed to run the site.

Search covers names, descriptions, categories, notes, fees, referral status and location. Search terms and filters combine. The URL preserves the search/filter choices and open community, allowing readers to bookmark or share the current view.

## Editorial and data decisions

See `DATA-REVIEW.md` for the three source issues and mapping rules. There are 51 populated source rows, including repeat listings. Nine duplicate rows are merged; two ambiguous rows are held out, yielding 40 published communities. No facts were copied from earlier assistant examples.

Women-focused communities are not necessarily women-led; the public label uses the term supported by the workbook. Most locations were not supplied. Blank fees, notes and URLs remain missing rather than inferred.

The current design follows the supplied Goodstory Brand Guidelines PDF: red #eb3416, blue #33509e, lavender #dcd0e7, green #1b5125 and neutral #eaeae7. The actual wordmarks and peace icon were extracted from the PDF. PP Neue Montreal and PP Editorial New font files were located in the owner’s local font library and are included alongside the site files. Confirm the existing font license covers web embedding before publishing those files; system fallback fonts are defined. The header is typographic, without a stock photograph. Gina’s introduction and personal-branding invitation are included as requested.

Gina’s public contact address was taken from Goodstory’s website. Change both the email link and adjacent address in `index.html` if submissions should go elsewhere.

## Files

- `index.html`: editorial wrapper and accessible controls.
- `styles.css`: responsive layout, blue/white palette, mobile pathways and detail panel.
- `app.js`: search, filters, safe rendering, bookmark state, native modal with keyboard focus handling.
- `communities.json`: published source dataset.
- `DATA-REVIEW.md`: source issues to resolve.
- `validate.mjs`: optional data and asset validation.

## Deployment

Repository: https://github.com/itsagood-story/goodconnections

This flat folder layout lets every site file be uploaded together through GitHub’s browser uploader. Upload all files without nesting them inside another folder.
