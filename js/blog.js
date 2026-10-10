// Blog features, shared by the blog list (blog.html) and every post page:
//   - floating table of contents on post pages (built from the headings)
//   - heart buttons (one per post) with counts when the heart server is configured
//   - comment counts (read through the heart server) and the comment box (giscus) when configured
// Markup hooks:
//   [data-slug="my-post"]     on each post (list row or post article)
//   .heart-btn[data-slug]     a heart button; .comment-count[data-slug] a comment-count link
//   #toc-list                 empty <ol> to fill;  #giscus-box  where the comment box goes

(function () {
	var CFG = window.BLOG_CONFIG || {};
	var G = CFG.giscus || {};
	var HEARTS = (CFG.heartsEndpoint || "").replace(/\/$/, "");
	var COMMENTS_READY = !!(G.repo && G.repoId && G.category && G.categoryId);

	var HEART_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.4 2.7 5 6 5c2 0 3.3 1 4 2.2h4C14.7 6 16 5 18 5c3.3 0 5.1 3.4 3.6 6.7C19.5 16.4 12 21 12 21z"/></svg>';

	function store(key, value) {
		try {
			if (value === undefined) return localStorage.getItem(key);
			localStorage.setItem(key, value);
		} catch (e) {
			return null;
		}
	}

	function visitorId() {
		var id = store("blog-visitor");
		if (!id) {
			id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
			store("blog-visitor", id);
		}
		return id;
	}

	// ---------- Hearts ----------

	var counts = {}; // slug -> number (only when the server is configured and reachable)

	function render(slug) {
		var on = store("blog-heart:" + slug) === "1";
		document.querySelectorAll('.heart-btn[data-slug="' + slug + '"]').forEach(function (btn) {
			btn.classList.toggle("is-on", on);
			btn.setAttribute("aria-pressed", String(on));
			btn.setAttribute("aria-label", on ? "Remove your heart" : "Heart this post");
			var num = btn.querySelector(".heart-num");
			num.textContent = typeof counts[slug] === "number" ? String(counts[slug]) : "";
		});
	}

	function toggleHeart(slug) {
		var was = store("blog-heart:" + slug) === "1";
		store("blog-heart:" + slug, was ? "0" : "1");
		if (typeof counts[slug] === "number") counts[slug] = Math.max(0, counts[slug] + (was ? -1 : 1));
		render(slug);
		if (!HEARTS) return;
		fetch(HEARTS + "/hearts/" + encodeURIComponent(slug), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: was ? "remove" : "add", visitor: visitorId() }),
		}).then(function (r) {
			if (!r.ok) throw new Error("bad response");
			return r.json();
		}).then(function (data) {
			counts[slug] = data.count;
			render(slug);
		}).catch(function () {
			// Server unreachable: undo the visible change so the number never lies.
			store("blog-heart:" + slug, was ? "1" : "0");
			if (typeof counts[slug] === "number") counts[slug] = Math.max(0, counts[slug] + (was ? 1 : -1));
			render(slug);
		});
	}

	function initHearts() {
		var buttons = document.querySelectorAll(".heart-btn[data-slug]");
		if (!buttons.length) return;
		var slugs = [];
		buttons.forEach(function (btn) {
			btn.innerHTML = HEART_SVG + '<span class="heart-num"></span>';
			var slug = btn.getAttribute("data-slug");
			if (slugs.indexOf(slug) === -1) slugs.push(slug);
			btn.addEventListener("click", function () {
				toggleHeart(slug);
			});
		});
		slugs.forEach(render);
		if (!HEARTS) return;
		fetch(HEARTS + "/hearts?slugs=" + slugs.map(encodeURIComponent).join(","))
			.then(function (r) { return r.ok ? r.json() : Promise.reject(); })
			.then(function (data) {
				slugs.forEach(function (s) {
					if (typeof data[s] === "number") counts[s] = data[s];
				});
				slugs.forEach(render);
			})
			.catch(function () {});
	}

	// ---------- Comment counts ----------

	function setCommentCount(slug, n) {
		document.querySelectorAll('.comment-count[data-slug="' + slug + '"]').forEach(function (el) {
			el.querySelector(".comment-num").textContent = String(n);
			el.hidden = false;
		});
	}

	function initCommentCounts() {
		var els = document.querySelectorAll(".comment-count[data-slug]");
		// Counts come from the heart server (it reads giscus for us); without it, no number is shown.
		if (!els.length || !HEARTS) return;
		var slugs = [];
		els.forEach(function (el) {
			var slug = el.getAttribute("data-slug");
			if (slugs.indexOf(slug) === -1) slugs.push(slug);
		});
		fetch(HEARTS + "/comments?slugs=" + slugs.map(encodeURIComponent).join(","))
			.then(function (r) { return r.ok ? r.json() : Promise.reject(); })
			.then(function (data) {
				slugs.forEach(function (s) {
					if (typeof data[s] === "number") setCommentCount(s, data[s]);
				});
			})
			.catch(function () {});
	}

	// ---------- Comment box (giscus) ----------

	function initComments() {
		var box = document.getElementById("giscus-box");
		if (!box) return;
		var post = document.querySelector("[data-slug]");
		if (!post) return;
		if (!COMMENTS_READY) {
			box.innerHTML = '<p class="meta">Comments will open soon.</p>';
			return;
		}
		var s = document.createElement("script");
		s.src = "https://giscus.app/client.js";
		s.async = true;
		s.crossOrigin = "anonymous";
		var attrs = {
			"data-repo": G.repo,
			"data-repo-id": G.repoId,
			"data-category": G.category,
			"data-category-id": G.categoryId,
			"data-mapping": "specific",
			"data-term": post.getAttribute("data-slug"),
			"data-strict": "1",
			"data-reactions-enabled": "0",
			"data-emit-metadata": "0",
			"data-input-position": "top",
			"data-theme": "light",
			"data-lang": "en",
			"data-loading": "lazy",
		};
		Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
		box.appendChild(s);
	}

	// ---------- Floating table of contents ----------

	function initToc() {
		var list = document.getElementById("toc-list");
		if (!list) return;
		var heads = Array.prototype.slice.call(document.querySelectorAll(".post-body h2, .post-body h3, .comments > h2"));
		var toc = list.closest(".toc");
		if (heads.length < 2) {
			if (toc) toc.hidden = true;
			return;
		}
		var used = {};
		var links = heads.map(function (h) {
			var id = h.id;
			if (!id) {
				id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
				var base = id, n = 2;
				while (used[id] || document.getElementById(id)) id = base + "-" + n++;
				h.id = id;
			}
			used[id] = true;
			var li = document.createElement("li");
			if (h.tagName === "H3") li.className = "toc-sub";
			var a = document.createElement("a");
			a.href = "#" + id;
			a.textContent = h.textContent.trim();
			li.appendChild(a);
			list.appendChild(li);
			return a;
		});

		function spy() {
			var current = 0;
			heads.forEach(function (h, i) {
				if (h.getBoundingClientRect().top <= 140) current = i;
			});
			// At the very bottom, the last section is the current one
			if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = heads.length - 1;
			links.forEach(function (a, i) {
				a.classList.toggle("is-current", i === current);
				if (i === current) a.setAttribute("aria-current", "true");
				else a.removeAttribute("aria-current");
			});
		}
		// A handful of headings, so recomputing on every scroll event is cheap
		window.addEventListener("scroll", spy, { passive: true });
		window.addEventListener("resize", spy);
		spy();
	}

	function start() {
		initToc();
		initHearts();
		initCommentCounts();
		initComments();
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
	else start();
})();
