// Renders window.PUBLICATIONS and the tag filter (from js/data.js) into a container.

(function () {
	var LINK_LABELS = {
		pdf: "PDF",
		website: "Website",
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

	function renderPub(pub) {
		var article = el("article", "pub");

		var thumbCell = el("div");
		if (pub.image) {
			var img = el("img", "pub-thumb");
			img.src = fileUrl(pub, pub.image);
			img.alt = "";
			thumbCell.appendChild(img);
		}
		article.appendChild(thumbCell);

		var body = el("div");

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

		var tags = (pub.tags || []).filter(function (key) {
			return window.TAGS[key];
		});
		if (tags.length) {
			var tagRow = el("div", "pub-tags");
			tags.forEach(function (key) {
				var t = el("a", "tag", window.TAGS[key]);
				t.href = "publications.html?tag=" + encodeURIComponent(key);
				tagRow.appendChild(t);
			});
			body.appendChild(tagRow);
		}

		article.appendChild(body);
		return article;
	}

	// options.limit: show only the first N. options.groupByYear: insert year headings.
	// options.tag: show only papers with this tag.
	window.renderPublications = function (container, options) {
		options = options || {};
		var pubs = window.PUBLICATIONS.filter(function (pub) {
			return !options.tag || (pub.tags || []).indexOf(options.tag) !== -1;
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
	window.renderTagFilter = function (container, active) {
		var all = el("a", active ? null : "active", "All");
		all.href = "publications.html";
		container.appendChild(all);

		Object.keys(window.TAGS).forEach(function (key) {
			var a = el("a", key === active ? "active" : null, window.TAGS[key]);
			a.href = "publications.html?tag=" + encodeURIComponent(key);
			container.appendChild(a);
		});
	};
})();
