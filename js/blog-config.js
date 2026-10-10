// Settings for the blog's hearts and comments. Fill these in after the one-time setup
// described in the README ("Blog: hearts and comments"). Until then the blog works, with:
//   - hearts saved only in the visitor's own browser (no counts shown), and
//   - a "comments will open soon" note instead of the comment box.

window.BLOG_CONFIG = {
	// Hearts: the address of the deployed worker (see worker/). Example:
	//   "https://blog-hearts.your-account.workers.dev"
	// Leave "" until it is deployed.
	heartsEndpoint: "",

	// Comments: giscus (GitHub Discussions). Get the four values from https://giscus.app
	giscus: {
		repo: "subinseo-research/researcher_profile",
		repoId: "R_kgDOVBnwCg",
		category: "Blog comments",
		categoryId: "DIC_kwDOVBnwCs4DHdzE",
	},
};
