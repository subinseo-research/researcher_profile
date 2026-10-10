// Site data. Edit this file to add publications; index.html and publications.html both read from it.
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
// `tags`: zero or more keys from window.TAGS.
// Leave a link empty ("") or delete it to hide its button.
window.PUBLICATIONS = [
	{
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
