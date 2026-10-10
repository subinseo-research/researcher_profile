// Blog post index. blog.html reads this to build the list (10 posts per page, newest first).
// Loaded via <script> (not fetch) so the pages also work when opened directly from disk.
//
// To add a post:
//   1. Copy blog/next-generation/ to blog/<slug>/ and write the post in its index.html
//      (the post's images go in the same folder, so they are referenced by file name alone).
//   2. Add an entry at the TOP of the list below.
//   3. Add the slug to ALLOWED_SLUGS in worker/wrangler.toml and run `npx wrangler deploy` (hearts only).
//
// `slug`    short unique id: the folder name and the post's data-slug (lowercase letters, numbers, hyphens).
// `title`   shown in the list.  `date`  "YYYY-MM-DD" (shown as "Mon DD, YYYY"; any other text is shown as is).
// `summary` one or two lines for the list.  `url`  optional; use it only for a post hosted elsewhere.

window.POSTS = [
	{
		slug: "next-generation",
		title: "What Comes After Generative AI Search?",
		date: "Mon DD, YYYY",
		summary: "By finding the gaps through UX research on generative AI, could we lead the way in proposing the next generation of systems?",
	},
];
