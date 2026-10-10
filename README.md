# Researcher Profile

Personal academic website. Plain HTML/CSS/JS, no build step. Layout inspired by
[Amy X. Zhang's homepage](https://homes.cs.washington.edu/~axz/).

## Structure

```
index.html          Home: portrait, bio, latest publications, contact, news
aboutme.html        Longer bio and education
publications.html   All publications, grouped by year
aoi.html            Areas of Interest
concept-map.html    Interactive concept map for the main research area (data in js/concept-map.js)
projects.html       Fun Projects
courses.html        Coursework
blog.html           Blog
css/style.css       All styles
js/data.js          Publication data (edit this to add papers)
js/publications.js  Renders publications from js/data.js
js/blog.js          Blog table of contents, hearts, comment counts, comment box
js/blog-config.js   Blog settings (heart server address, giscus values)
worker/             Heart counter server (Cloudflare Worker); deployed separately
img/                Portrait, paper thumbnails, favicon
papers/             CV.pdf and paper PDFs
```

## Editing

- **Profile text, news, contact:** edit `index.html` directly.
- **Publications:** add an entry to the top of `window.PUBLICATIONS` in `js/data.js`.
  Both the home page (latest 20) and the publications page update automatically.
- **Research-area tags:** define tags in `window.TAGS` in `js/data.js` and add their keys to a paper's `tags`.
  `publications.html?tag=<key>` shows only that area's papers; the Areas of Interest page links there.
- **Photo:** replace `img/profile.jpg` (used by `index.html` and `aboutme.html`).
- **CV:** put your CV at `papers/CV.pdf`.

## Blog: hearts and comments

Blog posts have a floating table of contents (built automatically from the `h2`/`h3` headings), heart
buttons, comment counts, and a comment box. The table of contents works as is. Hearts and comments need
a one-time setup, because a static site cannot store visitors' data. Until you do it, hearts are saved
only in each visitor's own browser (no counts shown) and the comment box shows "Comments will open soon."

**Writing a post:** copy `blog-next-generation.html`, follow the comment at the top of that file, and add
the post to `blog.html`. Each post needs a short unique `data-slug`.

**Comments (giscus, free, uses GitHub Discussions; visitors comment with a GitHub account):**
1. Push this site to the public repo `subinseo-research/researcher_profile`.
2. In the repo: Settings -> General -> Features -> turn on Discussions.
3. In Discussions, create a category named `Blog comments` (type: Announcements, so only giscus can start threads).
4. Install the giscus app on the repo: https://github.com/apps/giscus
5. Open https://giscus.app, enter the repo and category, and copy the four values it shows
   (`repo`, `repoId`, `category`, `categoryId`) into `js/blog-config.js`.

**Hearts (no login; your own tiny free server on Cloudflare Workers):**
1. Make a free Cloudflare account, then in the `worker/` folder run `npx wrangler login`.
2. Run `npx wrangler kv namespace create HEARTS` and paste the printed `id` into `worker/wrangler.toml`.
3. In `worker/wrangler.toml`, check `ALLOWED_ORIGINS` (your site address) and list every post slug in `ALLOWED_SLUGS`.
4. Run `npx wrangler deploy`, copy the address it prints into `heartsEndpoint` in `js/blog-config.js`.

Hearts are a casual "like": one per browser, so clearing browser data lets a visitor heart again.
When you add a post, add its slug to `ALLOWED_SLUGS` and run `npx wrangler deploy` again.

## Preview

Open `index.html` in a browser. No server needed.

## Deploy (GitHub Pages)

Repository settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
