// Renders the blog list (window.POSTS, from data/blog.js) and the project list (window.PROJECTS,
// from data/projects.js), 10 per page. The page number is the ?page=N part of the address.
// Links point at <folder>/index.html (not just the folder) so they also work when opened from disk.

(function () {
	var PER_PAGE = 10;
	var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var COMMENT_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z"/></svg>';

	function el(tag, className, text) {
		var node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== undefined) node.textContent = text;
		return node;
	}

	// "2026-03-14" -> "Mar 14, 2026"; anything else is returned unchanged.
	function formatDate(value) {
		var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
		if (!m) return value || "";
		return MONTHS[Number(m[2]) - 1] + " " + Number(m[3]) + ", " + m[1];
	}

	// A bare file name lives in projects/<slug>/; anything with a "/" is used as written.
	function projectFile(project, value) {
		if (!value || value.indexOf("/") !== -1) return value;
		return "projects/" + project.slug + "/" + value;
	}

	// One page of `items`, chosen by ?page=N, plus the page numbers for the pager.
	function pageOf(items) {
		var pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE));
		var n = parseInt(new URLSearchParams(location.search).get("page"), 10);
		var page = Math.min(Math.max(n || 1, 1), pageCount);
		return { items: items.slice((page - 1) * PER_PAGE, page * PER_PAGE), page: page, pageCount: pageCount };
	}

	// "Newer" / "Older" links around the page number; nothing at all if there is only one page.
	function renderPager(container, page, pageCount) {
		if (pageCount < 2) return;
		var nav = el("nav", "pager");
		nav.setAttribute("aria-label", "Pages");
		function link(label, target) {
			var a = el("a", null, label);
			a.href = target === 1 ? location.pathname : "?page=" + target;
			return a;
		}
		if (page > 1) nav.appendChild(link("← Newer", page - 1));
		nav.appendChild(el("span", "pager-info", "Page " + page + " of " + pageCount));
		if (page < pageCount) nav.appendChild(link("Older →", page + 1));
		container.appendChild(nav);
	}

	function renderPost(post) {
		var href = post.url || "blog/" + post.slug + "/index.html";
		var article = el("article", "post");
		article.setAttribute("data-slug", post.slug);
		article.appendChild(el("span", "meta", formatDate(post.date)));

		var title = el("h2", "post-title");
		var a = el("a", null, post.title);
		a.href = href;
		title.appendChild(a);
		article.appendChild(title);
		article.appendChild(el("p", null, post.summary));

		// Hearts and comment counts are filled in by js/blog.js
		var stats = el("div", "post-stats");
		var heart = el("button", "heart-btn");
		heart.type = "button";
		heart.setAttribute("data-slug", post.slug);
		stats.appendChild(heart);
		var count = el("a", "comment-count");
		count.href = href + "#comments";
		count.setAttribute("data-slug", post.slug);
		count.hidden = true;
		count.innerHTML = COMMENT_SVG + '<span class="comment-num"></span>';
		stats.appendChild(count);
		article.appendChild(stats);
		return article;
	}

	window.renderPosts = function (container) {
		var posts = window.POSTS || [];
		if (!posts.length) {
			container.appendChild(el("p", "meta", "No posts yet."));
			return;
		}
		var p = pageOf(posts);
		p.items.forEach(function (post) {
			container.appendChild(renderPost(post));
		});
		renderPager(container, p.page, p.pageCount);
	};

	function renderProject(project) {
		var article = el("article", "pub pub-wide-thumb");

		var thumbCell = el("div");
		if (project.image) {
			var img = el("img", "pub-thumb");
			img.src = projectFile(project, project.image);
			img.alt = project.imageAlt || "";
			img.loading = "lazy";
			thumbCell.appendChild(img);
		}
		article.appendChild(thumbCell);

		var body = el("div");
		var title = el("div", "pub-title");
		var a = el("a", null, project.title);
		a.href = project.url || "projects/" + project.slug + "/index.html";
		title.appendChild(a);
		body.appendChild(title);
		body.appendChild(el("div", null, project.summary));
		if (project.meta) body.appendChild(el("div", "meta", project.meta));
		article.appendChild(body);
		return article;
	}

	window.renderProjects = function (container) {
		var projects = window.PROJECTS || [];
		if (!projects.length) {
			container.appendChild(el("p", "meta", "No projects yet."));
			return;
		}
		var p = pageOf(projects);
		p.items.forEach(function (project) {
			container.appendChild(renderProject(project));
		});
		renderPager(container, p.page, p.pageCount);
	};
})();
