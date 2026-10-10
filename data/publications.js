// Publication data. Edit this file to add papers; index.html and publications.html both read from it.
// Loaded via <script> (not fetch) so the pages also work when opened directly from disk.

window.SITE = {
	// Your name as it appears in author lists; matching authors are highlighted.
	owner: "Subin Seo",
};

// Research-area tags. The key goes in a paper's `tags`; the label is shown on the site.
// Link to a filtered list with publications.html?tag=<key>.
window.TAGS = {
	main: "Human search behavior / HCI & IR",
	sub: "Bibliometrics, science of science in LIS",
};

// Newest first. Only `title`, `authors`, `venue`, and `year` are required.
// `slug`: a short unique id (lowercase letters, numbers, hyphens). Each paper's files live in
//   publications/<slug>/ (PDF, thumbnail, slides...). With a slug, `image` and the `links` can be just a
//   file name inside that folder (e.g. image: "thumb.png", pdf: "paper.pdf"). A value that contains a "/"
//   or starts with "http" is used as written (e.g. "img/paper-placeholder.svg", "https://github.com/...").
// `tags`: zero or more keys from window.TAGS.
// Leave a link empty ("") or delete it to hide its button.
window.PUBLICATIONS = [
	{
		slug: "paper-one",
		title: "Paper Title One",
		authors: ["Subin Seo", "Coauthor A", "Coauthor B"],
		venue: "CHI",
		venueUrl: "",
		year: 2026,
		award: "Best Paper",
		tags: ["main"],
		image: "img/paper-placeholder.svg",
		links: {
			pdf: "papers/paper1.pdf",
			website: "",
			code: "",
			data: "",
			slides: "",
			video: "",
		},
	},
	{
		slug: "paper-two",
		title: "Paper Title Two",
		authors: ["Coauthor C", "Subin Seo"],
		venue: "CSCW",
		venueUrl: "",
		year: 2025,
		award: "",
		tags: ["sub"],
		image: "img/paper-placeholder.svg",
		links: {
			pdf: "",
			website: "",
			code: "https://github.com/",
		},
	},
];
