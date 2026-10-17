// Renders window.PUBLICATIONS and the tag filter (from js/data.js) into a container.

(function () {
	var LINK_LABELS = {
		pdf: "PDF",
		website: "Link",
		code: "Code",
		data: "Data",
		slides: "Slides",
		video: "Video",
		talk: "Talk",
	};

	function el(tag, className, text) {
		var node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== undefined) node.textContent = text;
		return node;
	}

	// A bare file name ("paper.pdf") lives in publications/<slug>/; anything with a "/" is used as written.
	function fileUrl(pub, value) {
		if (!value || !pub.slug || value.indexOf("/") !== -1) return value;
		return "publications/" + pub.slug + "/" + value;
	}

	function renderPub(pub, featured) {
		var article = el("article", featured ? "pub pub-featured" : "pub");

		var thumbCell = el("div");
		if (pub.image) {
			var img = el("img", "pub-thumb");
			img.src = fileUrl(pub, pub.image);
			img.alt = "";
			thumbCell.appendChild(img);
		}
		article.appendChild(thumbCell);

		var body = el("div");

		// Area tags sit above the title.
		var tags = (pub.tags || []).filter(function (key) {
			return window.TAGS[key];
		});
		if (tags.length) {
			var tagRow = el("div", "pub-tags");
			tags.forEach(function (key) {
				var t = el("a", "tag tag-" + key, window.TAGS[key]);
				t.href = "publications.html?tag=" + encodeURIComponent(key);
				tagRow.appendChild(t);
				// This paper's sub-areas of the area, right after it
				var subs = (window.SUBTAGS && window.SUBTAGS[key]) || {};
				(pub.subtags || []).forEach(function (subKey) {
					if (!subs[subKey]) return;
					var st = el("a", "tag tag-subarea", subs[subKey]);
					st.href = "publications.html?tag=" + encodeURIComponent(key) + "&sub=" + encodeURIComponent(subKey);
					tagRow.appendChild(st);
				});
			});
			body.appendChild(tagRow);
		}

		var title = el("div", "pub-title");
		var titleLink = fileUrl(pub, pub.links && (pub.links.pdf || pub.links.website));
		if (titleLink) {
			var a = el("a", null, pub.title);
			a.href = titleLink;
			title.appendChild(a);
		} else {
			title.textContent = pub.title;
		}
		body.appendChild(title);

		var authors = el("div", "pub-authors");
		pub.authors.forEach(function (name, i) {
			if (i > 0) authors.appendChild(document.createTextNode(", "));
			var span = el("span", name === window.SITE.owner ? "me" : null, name);
			authors.appendChild(span);
		});
		body.appendChild(authors);

		var venue = el("div", "pub-venue");
		var venueText = pub.venue + " " + pub.year;
		if (pub.venueUrl) {
			var v = el("a", null, venueText);
			v.href = pub.venueUrl;
			venue.appendChild(v);
		} else {
			venue.textContent = venueText;
		}
		if (pub.award) venue.appendChild(el("span", "award", pub.award));
		body.appendChild(venue);

		var links = el("div", "pub-links");
		Object.keys(LINK_LABELS).forEach(function (key) {
			var url = fileUrl(pub, pub.links && pub.links[key]);
			if (!url) return;
			var link = el("a", null, LINK_LABELS[key]);
			link.href = url;
			links.appendChild(link);
		});
		if (links.childNodes.length) body.appendChild(links);

		if (featured && pub.summary) body.appendChild(el("p", "pub-summary", pub.summary));

		article.appendChild(body);
		return article;
	}

	// options.featured: show just one paper, large: the first one marked `featured: true`,
	// otherwise the newest (first in the list).
	// options.limit: show only the first N. options.groupByYear: insert year headings.
	// options.tag: show only papers with this tag; options.sub: and this sub-area (needs a tag).
	window.renderPublications = function (container, options) {
		options = options || {};
		if (options.featured) {
			var pick = window.PUBLICATIONS.filter(function (pub) { return pub.featured; })[0] || window.PUBLICATIONS[0];
			if (pick) container.appendChild(renderPub(pick, true));
			return;
		}
		var pubs = window.PUBLICATIONS.filter(function (pub) {
			if (options.tag && (pub.tags || []).indexOf(options.tag) === -1) return false;
			return !options.sub || (pub.subtags || []).indexOf(options.sub) !== -1;
		}).slice(0, options.limit || undefined);
		var lastYear = null;

		if (!pubs.length) {
			container.appendChild(el("p", "meta", "No papers in this area yet."));
			return;
		}

		pubs.forEach(function (pub) {
			if (options.groupByYear && pub.year !== lastYear) {
				container.appendChild(el("h2", "year-heading", String(pub.year)));
				lastYear = pub.year;
			}
			container.appendChild(renderPub(pub));
		});
	};

	// "All" plus one button per tag; `active` is the current tag key (or null).
	// If the active tag has sub-areas, a second row of buttons follows; `activeSub` is the current
	// sub-area key (or null), and clicking it again clears it.
	window.renderTagFilter = function (container, active, activeSub) {
		var all = el("a", active ? null : "active", "All");
		all.href = "publications.html";
		container.appendChild(all);

		Object.keys(window.TAGS).forEach(function (key) {
			var a = el("a", key === active ? "active" : null, window.TAGS[key]);
			a.href = "publications.html?tag=" + encodeURIComponent(key);
			container.appendChild(a);
		});

		var subs = active && window.SUBTAGS && window.SUBTAGS[active];
		if (!subs) return;
		var row = el("nav", "tag-filter sub-filter");
		row.setAttribute("aria-label", "Filter by sub-area");
		Object.keys(subs).forEach(function (key) {
			var isActive = key === activeSub;
			var a = el("a", isActive ? "active" : null, subs[key]);
			a.href = "publications.html?tag=" + encodeURIComponent(active) +
				(isActive ? "" : "&sub=" + encodeURIComponent(key));
			row.appendChild(a);
		});
		container.after(row);
	};
})();
