// Fun Projects index. projects.html reads this to build the list (10 projects per page, newest first).
// Loaded via <script> (not fetch) so the pages also work when opened directly from disk.
//
// To add a project:
//   1. Copy projects/mindflex/ to projects/<slug>/ and write the page in its index.html
//      (its images go in the same folder, so they are referenced by file name alone).
//   2. Add an entry at the TOP of the list below.
//
// `slug`    short unique id: the folder name (lowercase letters, numbers, hyphens).
// `title`   shown in the list.  `summary`  two to four sentences.
// `meta`    one line under the summary, e.g. "Tools / methods · Course or context · Year".
// `image`   thumbnail: a file name in projects/<slug>/, or a path with "/" (e.g. "img/project-placeholder.svg").
// `imageAlt` optional description of the thumbnail.
// `url`     optional; use it only for a project that lives elsewhere (otherwise the page is projects/<slug>/).

window.PROJECTS = [
	{
		slug: "mindflex",
		title: "MindFlex AI",
		summary: "People use generative AI for a wide range of purposes, yet general-purpose interfaces offer little support for matching tools to needs. This project designs a system that (1) supports intuitive model selection, (2) helps users articulate their information needs through guided dialogue, and (3) provides accurate citations, with the overarching goal of mitigating over-reliance on AI.",
		meta: "UX research · Interviews · Generative AI design",
		image: "MainStream.gif",
		imageAlt: "MindFlex AI mode selection screen",
	},
];
