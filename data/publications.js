// Publication data. Edit this file to add papers; index.html and publications.html both read from it.
// Loaded via <script> (not fetch) so the pages also work when opened directly from disk.

window.SITE = {
	// Your name as it appears in author lists; matching authors are highlighted.
	owner: "Subin Seo",
};

// Research-area tags. The key goes in a paper's `tags`; the label is shown on the site.
// Link to a filtered list with publications.html?tag=<key>.
window.TAGS = {
	main: "HCI",
	sub: "Bibliometrics",
};

// Sub-areas, shown as a second row of buttons when their area is selected. Keyed by the area's key;
// the sub-area key goes in a paper's `subtags`. Link: publications.html?tag=<key>&sub=<subkey>.
window.SUBTAGS = {
	main: {
		search: "Search Behavior",
		participants: "Human participants",
		genai: "Generative AI",
		system: "System development",
		health: "Health informatics",
	},
};

// Newest first. Only `title`, `authors`, `venue`, and `year` are required.
// `slug`: a short unique id (lowercase letters, numbers, hyphens). Each paper's files live in
//   publications/<slug>/ (PDF, thumbnail, slides...). With a slug, `image` and the `links` can be just a
//   file name inside that folder (e.g. image: "thumb.png", pdf: "paper.pdf"). A value that contains a "/"
//   or starts with "http" is used as written (e.g. "img/paper-placeholder.svg", "https://github.com/...").
// `featured`: true on the one paper to show large on the home page (default: the first paper in the list).
// `summary`: optional one or two sentences, shown only under the featured paper on the home page.
// `tags`: zero or more keys from window.TAGS.
// Leave a link empty ("") or delete it to hide its button.
window.PUBLICATIONS = [
	{
		slug: "diamond-open-access",
		title: "Mapping the Landscape of Diamond Open Access Journals with Journal Impact Factor",
		authors: ["E. Chung", "J. Andrews", "Subin Seo", "J. Yoon"],
		venue: "Journal of Scholarly Publishing",
		venueUrl: "",
		year: 2026,
		award: "",
		tags: ["sub"],
		image: "thumb.png",
		links: {
			website: "https://utppublishing.com/doi/abs/10.3138/jsp-2025-0067",
		},
	},
	{
		slug: "chatbot-health-misinformation",
		title: "The Role of Chatbot AI as an Intermediary for Processing Health Misinformation",
		authors: ["Subin Seo"],
		venue: "iConference 2026 Proceedings (poster)",
		venueUrl: "",
		year: 2026,
		award: "",
		tags: ["main"],
		subtags: ["genai", "health"],
		image: "thumb.png",
		links: {
			website: "https://www.ideals.illinois.edu/items/139995",
		},
	},
	{
		slug: "landscapes-funded-research",
		title: "Landscapes of Information Science and Library Science Research: Comparing Funded and Non-Funded Research from 2008 to 2023",
		authors: ["J. Yoon", "J. Andrews", "Subin Seo", "E. Chung"],
		venue: "Journal of Documentation",
		venueUrl: "",
		year: 2025,
		award: "",
		tags: ["sub"],
		image: "thumb.png",
		links: {
			website: "https://doi.org/10.1108/JD-07-2025-0190",
		},
	},
	{
		slug: "awareness-to-action",
		title: "From Awareness to Action: Ambient Display and Customizable Attention Signals for Self-regulated Smartphone Usage",
		authors: ["J. Zheng", "Subin Seo", "E. K. Choe"],
		venue: "Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies (IMWUT)",
		venueUrl: "",
		year: 2025,
		award: "",
		tags: ["main"],
		subtags: ["participants", "system"],
		image: "thumb.png",
		links: {
			website: "https://doi.org/10.1145/3749507",
		},
	},
];
