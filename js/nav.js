// Hamburger button + side menu, shared by every page. Load in <head> so the
// open/closed state is set before the first paint. Edit NAV_LINKS to change the menu.
//
// - The menu starts closed on every page. Opening it with the button on a wide
//   screen docks it and pushes the page right.
// - Moving the mouse to the left edge opens it temporarily; leaving closes it.
//   Clicking the button while it is hover-opened keeps it open.
// - Narrow screens: always starts closed and opens over the page.

(function () {
	var NAV_LINKS = [
		{ href: "index.html", label: "Home" },
		{ href: "aboutme.html", label: "About Me" },
		{ href: "papers/CV.pdf", label: "CV" },
		{ href: "courses.html", label: "Coursework" },
		{ href: "publications.html", label: "Publications" },
		{ href: "aoi.html", label: "Areas of Interest", also: ["aoi-sub.html", "concept-map.html"] },
		{ href: "projects.html", label: "Fun Projects" },
		{ href: "blog.html", label: "Blog" },
	];

	var root = document.documentElement;
	var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
	var current = location.pathname.split("/").pop() || "index.html";
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
		name.href = "index.html";
		name.textContent = "Subin Seo";
		panel.appendChild(name);

		NAV_LINKS.forEach(function (item) {
			var a = document.createElement("a");
			a.href = item.href;
			a.textContent = item.label;
			if (item.href === current || (item.also || []).indexOf(current) !== -1) {
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

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") setOpen(false);
	});

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", build);
	} else {
		build();
	}
})();
