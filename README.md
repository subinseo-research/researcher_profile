# Researcher Profile

Personal academic website. Plain HTML/CSS/JS, no build step.

## Structure

Each kind of content has a short list in `data/` (one entry per item) and one folder per item holding
its page and files, so the site stays tidy however many posts, projects, or papers there are.
The list pages are built from the data files; they show 10 posts or projects per page (`?page=2`, ...).

```
index.html          Home: portrait, bio, latest publications, contact, news
aboutme.html        Longer bio and education
publications.html   All publications, grouped by year
aoi.html            Areas of Interest
concept-map.html    Interactive concept map for the main research area (data in js/concept-map.js)
projects.html       Fun Projects (list)
courses.html        Coursework
blog.html           Blog (list)

data/publications.js  Publication list (edit this to add papers)
data/projects.js      Project list
data/blog.js          Blog post list

blog/<slug>/          One folder per post: index.html plus the post's images
projects/<slug>/      One folder per project: index.html plus its images
publications/<slug>/  One folder per paper: PDF, thumbnail, slides...

css/style.css       All styles
js/publications.js  Renders the publication list
js/lists.js         Renders the blog and project lists (with page links)
js/blog.js          Blog table of contents, hearts, comment counts, comment box
js/blog-config.js   Blog settings (heart server address, giscus values)
js/nav.js           Side menu (works from subfolders too)
worker/             Heart counter server (Cloudflare Worker); deployed separately
img/                Portrait, favicon, shared images
papers/             CV.pdf and the research / teaching statements
```

## Editing

- **Profile text, news, contact:** edit `index.html` directly.
- **Publications:** add an entry to the top of `window.PUBLICATIONS` in `data/publications.js`, with a short
  unique `slug`, and put the paper's files in `publications/<slug>/`. In the entry, a bare file name
  (`pdf: "paper.pdf"`, `image: "thumb.png"`) means a file in that folder. Both the home page (latest 20)
  and the publications page update automatically.
- **Projects:** copy `projects/mindflex/` to `projects/<slug>/`, write the page, and add an entry to the top
  of `window.PROJECTS` in `data/projects.js`.
- **Blog posts:** see "Writing a post" below.
- **Research-area tags:** define tags in `window.TAGS` in `data/publications.js` and add their keys to a paper's `tags`.
  `publications.html?tag=<key>` shows only that area's papers; the Areas of Interest page links there.
- **Photo:** replace `img/profile.jpg` (used by `index.html` and `aboutme.html`).
- **CV:** put your CV at `papers/CV.pdf`.

## Blog: hearts and comments

Blog posts have a floating table of contents (built automatically from the `h2`/`h3` headings), heart
buttons, comment counts, and a comment box. The table of contents works as is. Hearts and comments need
a one-time setup, because a static site cannot store visitors' data. Until you do it, hearts are saved
only in each visitor's own browser (no counts shown) and the comment box shows "Comments will open soon."

**Writing a post:** copy the folder `blog/next-generation/` to `blog/<your-slug>/`, follow the comment at the
top of its `index.html`, and add an entry at the top of `data/blog.js`. The slug is the folder name and the
post's `data-slug`.

**Comments (giscus, free, uses GitHub Discussions; visitors comment with a GitHub account):**
1. Push this site to the public repo `subinseo-research/researcher_profile`.
2. In the repo: Settings -> General -> Features -> turn on Discussions.
3. In Discussions, create a category named `Blog comments` (type: Announcements, so only giscus can start threads).
4. Install the giscus app on the repo: https://github.com/apps/giscus
5. Put the four values (`repo`, `repoId`, `category`, `categoryId`) in `js/blog-config.js`. You can look up the ids at
   https://giscus.app, or read them from `https://giscus.app/api/discussions/categories?repo=OWNER/REPO`.
   (Done for this site.)

The comment box works as soon as these values are set. Comment *counts* (on the blog list and under each post)
are read through the heart server below, because giscus's own API refuses requests from other websites.

**Hearts (no login; your own tiny free server on Cloudflare Workers):**
1. Make a free Cloudflare account, then in the `worker/` folder run `npx wrangler login`.
2. Run `npx wrangler kv namespace create HEARTS` and paste the printed `id` into `worker/wrangler.toml`.
3. In `worker/wrangler.toml`, check `ALLOWED_ORIGINS` (your site address), list every post slug in `ALLOWED_SLUGS`,
   and keep `GISCUS_REPO` / `GISCUS_CATEGORY` in step with `js/blog-config.js`.
4. Run `npx wrangler deploy`, copy the address it prints into `heartsEndpoint` in `js/blog-config.js`.

Hearts are a casual "like": one per browser, so clearing browser data lets a visitor heart again.
When you add a post, add its slug to `ALLOWED_SLUGS` and run `npx wrangler deploy` again.

## Preview

Open `index.html` in a browser. No server needed.

## Deploy (GitHub Pages)

Repository settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
