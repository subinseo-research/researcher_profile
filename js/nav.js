// Hamburger button + side menu, shared by every page. Load in <head> so the
// open/closed state is set before the first paint. Edit NAV_LINKS to change the menu.
// Works from pages in subfolders too (blog/<post>/, projects/<project>/): links are resolved
// against the site root, found from this script's own address.
//
// - The menu starts closed on every page. Opening it with the button on a wide
//   screen docks it and pushes the page right.
// - Moving the mouse to the left edge opens it temporarily; leaving closes it.
//   Clicking the button while it is hover-opened keeps it open.
// - Narrow screens: always starts closed and opens over the page.
//
// Also, links to other websites (http/https) open in a new tab, on every page, including links
// the page builds later (publication lists, etc.). mailto: and links within this site are unchanged.

(function () {
	var NAV_LINKS = [
		{ href: "index.html", label: "Home" },
		{ href: "aboutme.html", label: "About Me" },
		{ href: "aoi.html", label: "Areas of Interest", also: ["aoi-sub.html", "concept-map.html"] },
		{ href: "papers/CV.pdf", label: "CV" },
		{ href: "courses.html", label: "Coursework" },
		{ href: "publications.html", label: "Publications", also: ["publications/"] },
		{ href: "projects.html", label: "Fun Projects", also: ["projects/"] },
		{ href: "blog.html", label: "Blog", also: ["blog/"] },
	];

	// Site root, e.g. "https://example.org/site/" (this script lives at <root>js/nav.js)
	var ROOT = document.currentScript.src.replace(/js\/nav\.js[^/]*$/, "");

	var root = document.documentElement;
	var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
	// This page's path below the site root. An "also" entry ending in "/" matches a whole folder.
	var current = location.href.slice(ROOT.length).split(/[?#]/)[0] || "index.html";
	function isCurrent(item) {
		if (item.href === current) return true;
		return (item.also || []).some(function (p) {
			return p.slice(-1) === "/" ? current.indexOf(p) === 0 : p === current;
		});
	}
	var hoverOpened = false;
	var button;

	function isOpen() {
		return root.classList.contains("menu-open");
	}

	function setOpen(open, byHover) {
		hoverOpened = open && !!byHover;
		root.classList.toggle("menu-open", open);
		root.classList.toggle("menu-hover", hoverOpened);
		if (button) {
			button.setAttribute("aria-expanded", String(open));
			button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
		}
	}

	// Set the initial state before the body renders, with transitions off.
	root.classList.add("menu-no-anim");
	setOpen(false);

	function build() {
		button = document.createElement("button");
		button.className = "menu-button";
		button.type = "button";
		button.setAttribute("aria-controls", "side-menu");
		button.innerHTML = "<span></span><span></span><span></span>";
		setOpen(isOpen());

		var backdrop = document.createElement("div");
		backdrop.className = "menu-backdrop";

		var edge = document.createElement("div");
		edge.className = "menu-edge";

		var panel = document.createElement("nav");
		panel.className = "side-menu";
		panel.id = "side-menu";
		panel.setAttribute("aria-label", "Main menu");

		var name = document.createElement("a");
		name.className = "side-menu-name";
		name.href = ROOT + "index.html";
		name.textContent = "Subin Seo";
		panel.appendChild(name);

		NAV_LINKS.forEach(function (item) {
			var a = document.createElement("a");
			a.href = ROOT + item.href;
			a.textContent = item.label;
			if (isCurrent(item)) {
				a.className = "active";
				a.setAttribute("aria-current", "page");
			}
			panel.appendChild(a);
		});

		button.addEventListener("click", function () {
			if (hoverOpened) setOpen(true); // pin it
			else setOpen(!isOpen());
		});
		backdrop.addEventListener("click", function () {
			setOpen(false);
		});

		// Hover-to-open from the left edge.
		edge.addEventListener("mouseenter", function () {
			if (canHover.matches && !isOpen()) setOpen(true, true);
		});
		function leave(e) {
			if (!hoverOpened) return;
			var to = e.relatedTarget;
			if (to && (panel.contains(to) || button.contains(to))) return;
			setOpen(false);
		}
		panel.addEventListener("mouseleave", leave);
		button.addEventListener("mouseleave", leave);

		document.body.prepend(edge, button, backdrop, panel);

		// Re-enable transitions after the first paint.
		requestAnimationFrame(function () {
			requestAnimationFrame(function () {
				root.classList.remove("menu-no-anim");
			});
		});
	}

	// Decided at click time, so links added to the page by scripts are covered too.
	document.addEventListener("click", function (e) {
		var a = e.target.closest && e.target.closest("a[href]");
		if (!a || a.target) return;
		if (!/^https?:$/.test(a.protocol) || a.host === location.host) return;
		a.target = "_blank";
		a.rel = (a.rel ? a.rel + " " : "") + "noopener noreferrer";
	}, true);

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") setOpen(false);
	});

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", build);
	} else {
		build();
	}
})();
