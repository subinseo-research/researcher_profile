// Interactive concept map for concept-map.html. No libraries: a small force layout
// drawn into an <svg id="cmap">, with drag, hover highlighting, and click-for-details.
//
// Edit CONCEPTS and LINKS below to change the map.
//   group: "core" | "hci" | "ir" | "bridge"  (sets the color)
//   size:  "core" | "hub"  (optional; bigger circle)
//   label: use "\n" for a line break

(function () {
	var CONCEPTS = [
		{ id: "hsb", label: "Human Search\nBehavior", group: "core", size: "core",
			desc: "How people look for, evaluate, and use information when they search." },

		{ id: "hci", label: "HCI", group: "hci", size: "hub",
			desc: "Human-computer interaction: designing and studying how people use computing systems." },
		{ id: "ir", label: "Information Retrieval", group: "ir", size: "hub",
			desc: "Finding relevant material in large collections, and the systems that do it." },

		{ id: "studies", label: "User Studies", group: "hci",
			desc: "Controlled experiments, interviews, and log analyses that observe real searchers." },
		{ id: "cogload", label: "Cognitive Load", group: "hci",
			desc: "The mental effort a search task or interface demands from the user." },
		{ id: "trust", label: "Trust & Credibility", group: "hci",
			desc: "How users decide whether a result or an AI-generated answer is believable." },
		{ id: "interface", label: "Search Interfaces", group: "hci",
			desc: "Result pages, answer panels, citations, and other ways results are presented." },

		{ id: "query", label: "Query Formulation", group: "ir",
			desc: "How people turn an information need into words, and reformulate when results miss." },
		{ id: "relevance", label: "Relevance Judgment", group: "ir",
			desc: "How users and systems decide whether a document answers the need." },
		{ id: "ranking", label: "Ranking", group: "ir",
			desc: "Ordering results so the most useful appear first." },
		{ id: "rag", label: "Retrieval-Augmented\nGeneration", group: "ir",
			desc: "Language models that answer using retrieved sources, often with citations." },

		{ id: "seeking", label: "Information Seeking", group: "bridge",
			desc: "The broader process of recognizing a need and pursuing information to meet it." },
		{ id: "learning", label: "Search as Learning", group: "bridge",
			desc: "Searching as a way of building knowledge, not only of finding facts." },
		{ id: "genai", label: "Generative\nAI Search", group: "bridge",
			desc: "Search experiences where an AI model writes the answer instead of only listing links." },
		{ id: "conversational", label: "Conversational\nSearch", group: "bridge",
			desc: "Multi-turn search through dialogue, with follow-up questions and clarification." },
	];

	var LINKS = [
		["hsb", "hci"], ["hsb", "ir"], ["hsb", "seeking"], ["hsb", "learning"],
		["hci", "studies"], ["hci", "cogload"], ["hci", "trust"], ["hci", "interface"],
		["ir", "query"], ["ir", "relevance"], ["ir", "ranking"], ["ir", "rag"],
		["seeking", "query"], ["seeking", "relevance"], ["learning", "cogload"],
		["genai", "rag"], ["genai", "trust"], ["genai", "interface"], ["genai", "hsb"],
		["conversational", "genai"], ["conversational", "query"], ["studies", "relevance"],
	];

	var GROUP_LABELS = { core: "Core", hci: "HCI", ir: "IR", bridge: "Bridging" };
	var RADIUS = { core: 44, hub: 30, normal: 17 };
	var LINE_HEIGHT = 18;
	var RELATED_URL = "publications.html?tag=main";
	var SVG_NS = "http://www.w3.org/2000/svg";

	var svg = document.getElementById("cmap");
	var info = document.getElementById("cmap-info");
	var legend = document.getElementById("cmap-legend");
	var shuffleButton = document.getElementById("cmap-shuffle");
	if (!svg) return;

	// Wider canvas on desktop, taller on phones, so labels stay readable.
	var narrow = svg.clientWidth < 600;
	var W = narrow ? 600 : 960;
	var H = narrow ? 820 : 600;
	svg.setAttribute("viewBox", "0 0 " + W + " " + H);

	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var byId = {};
	var nodes = CONCEPTS.map(function (c) {
		var n = Object.assign({}, c, { x: W / 2, y: H / 2, vx: 0, vy: 0, fixed: false, neighbors: [] });
		n.r = RADIUS[c.size || "normal"];
		n.lines = c.label.split("\n");
		n.name = n.lines.join(" ");
		// Box around circle + label, used to keep labels from overlapping.
		var longest = Math.max.apply(null, n.lines.map(function (t) { return t.length; }));
		n.boxW = Math.max(n.r * 2, longest * 8.2) + 18;
		n.boxH = n.r * 2 + n.lines.length * LINE_HEIGHT + 14;
		n.boxDy = (n.lines.length * LINE_HEIGHT) / 2; // box center sits below the circle center
		byId[n.id] = n;
		return n;
	});
	var links = LINKS.map(function (pair) {
		var a = byId[pair[0]], b = byId[pair[1]];
		a.neighbors.push(b.id);
		b.neighbors.push(a.id);
		return { a: a, b: b };
	});

	// ---------- Initial positions ----------

	function seedPositions(randomize) {
		var hubs = narrow
			? { hci: [W / 2, H * 0.22], ir: [W / 2, H * 0.78] }
			: { hci: [W * 0.25, H / 2], ir: [W * 0.75, H / 2] };
		var counts = {}, seen = {};
		nodes.forEach(function (n) {
			counts[n.group] = (counts[n.group] || 0) + 1;
		});
		nodes.forEach(function (n) {
			var i = (seen[n.group] = (seen[n.group] || 0) + 1);
			var angle = (i / counts[n.group]) * Math.PI * 2 + (randomize ? Math.random() * 6 : 0);
			if (n.id === "hsb") {
				n.x = W / 2;
				n.y = H / 2;
			} else if (hubs[n.id]) {
				n.x = hubs[n.id][0];
				n.y = hubs[n.id][1];
			} else if (n.group === "bridge") {
				n.x = W / 2 + Math.cos(angle) * 170;
				n.y = H / 2 + Math.sin(angle) * 170;
			} else {
				var hub = hubs[n.group];
				n.x = hub[0] + Math.cos(angle) * 130;
				n.y = hub[1] + Math.sin(angle) * 130;
			}
			n.vx = n.vy = 0;
		});
		byId.hsb.fixed = true; // keep the core concept in the middle
	}

	// ---------- Force layout ----------

	var alpha = 1;
	var running = false;

	function linkLength(l) {
		if (l.a.size === "core" || l.b.size === "core") return 190;
		if (l.a.size === "hub" || l.b.size === "hub") return 130;
		return 150;
	}

	function tick() {
		var i, j, a, b, dx, dy, d2, d, f;

		// Repulsion between every pair
		for (i = 0; i < nodes.length; i++) {
			for (j = i + 1; j < nodes.length; j++) {
				a = nodes[i];
				b = nodes[j];
				dx = b.x - a.x;
				dy = b.y - a.y;
				d2 = Math.max(dx * dx + dy * dy, 400);
				f = (24000 * alpha) / d2;
				d = Math.sqrt(d2);
				a.vx -= (dx / d) * f;
				a.vy -= (dy / d) * f;
				b.vx += (dx / d) * f;
				b.vy += (dy / d) * f;
			}
		}

		// Springs along links
		links.forEach(function (l) {
			dx = l.b.x - l.a.x;
			dy = l.b.y - l.a.y;
			d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
			f = ((d - linkLength(l)) / d) * 0.06 * alpha;
			l.a.vx += dx * f;
			l.a.vy += dy * f;
			l.b.vx -= dx * f;
			l.b.vy -= dy * f;
		});

		nodes.forEach(function (n) {
			if (n.fixed) {
				n.vx = n.vy = 0;
				return;
			}
			// Gentle pull toward the center
			n.vx += (W / 2 - n.x) * 0.002 * alpha;
			n.vy += (H / 2 - n.y) * 0.002 * alpha;
			n.vx = Math.max(-20, Math.min(20, n.vx * 0.6));
			n.vy = Math.max(-20, Math.min(20, n.vy * 0.6));
			n.x += n.vx;
			n.y += n.vy;
		});

		resolveOverlaps();
		nodes.forEach(keepInside);

		alpha *= 0.985;
	}

	// Push apart any two nodes whose circle+label boxes overlap.
	function resolveOverlaps() {
		var i, j, a, b, dx, dy, ox, oy, sign, wa, wb;
		for (i = 0; i < nodes.length; i++) {
			for (j = i + 1; j < nodes.length; j++) {
				a = nodes[i];
				b = nodes[j];
				dx = b.x - a.x;
				dy = b.y + b.boxDy - (a.y + a.boxDy);
				ox = (a.boxW + b.boxW) / 2 - Math.abs(dx);
				oy = (a.boxH + b.boxH) / 2 - Math.abs(dy);
				if (ox <= 0 || oy <= 0) continue;
				// A fixed node does not move; the other one takes the whole push.
				wa = a.fixed ? 0 : b.fixed ? 1 : 0.5;
				wb = b.fixed ? 0 : a.fixed ? 1 : 0.5;
				if (ox < oy) {
					sign = dx < 0 ? -1 : 1;
					a.x -= sign * ox * wa;
					b.x += sign * ox * wb;
				} else {
					sign = dy < 0 ? -1 : 1;
					a.y -= sign * oy * wa;
					b.y += sign * oy * wb;
				}
			}
		}
	}

	function keepInside(n) {
		var halfW = n.boxW / 2;
		n.x = Math.max(halfW, Math.min(W - halfW, n.x));
		n.y = Math.max(n.r + 6, Math.min(H - (n.boxH / 2 + n.boxDy), n.y));
	}

	function run() {
		if (running) return;
		running = true;
		(function frame() {
			tick();
			draw();
			if (alpha > 0.01) requestAnimationFrame(frame);
			else running = false;
		})();
	}

	function reheat(value) {
		alpha = Math.max(alpha, value);
		if (reduceMotion) {
			while (alpha > 0.01) tick();
			draw();
		} else {
			run();
		}
	}

	// ---------- Drawing ----------

	var linkLayer = document.createElementNS(SVG_NS, "g");
	var nodeLayer = document.createElementNS(SVG_NS, "g");
	svg.appendChild(linkLayer);
	svg.appendChild(nodeLayer);

	links.forEach(function (l) {
		l.el = document.createElementNS(SVG_NS, "line");
		l.el.setAttribute("class", "cmap-link");
		linkLayer.appendChild(l.el);
	});

	nodes.forEach(function (n) {
		var g = document.createElementNS(SVG_NS, "g");
		g.setAttribute("class", "cmap-node group-" + n.group + (n.size ? " size-" + n.size : ""));
		g.setAttribute("tabindex", "0");
		g.setAttribute("role", "button");
		g.setAttribute("aria-label", n.name);

		var circle = document.createElementNS(SVG_NS, "circle");
		circle.setAttribute("r", n.r);
		g.appendChild(circle);

		var text = document.createElementNS(SVG_NS, "text");
		text.setAttribute("text-anchor", "middle");
		n.lines.forEach(function (line, i) {
			var tspan = document.createElementNS(SVG_NS, "tspan");
			tspan.setAttribute("x", 0);
			tspan.setAttribute("y", n.r + 17 + i * LINE_HEIGHT);
			tspan.textContent = line;
			text.appendChild(tspan);
		});
		g.appendChild(text);

		nodeLayer.appendChild(g);
		n.el = g;
		attachEvents(n);
	});

	function draw() {
		links.forEach(function (l) {
			l.el.setAttribute("x1", l.a.x);
			l.el.setAttribute("y1", l.a.y);
			l.el.setAttribute("x2", l.b.x);
			l.el.setAttribute("y2", l.b.y);
		});
		nodes.forEach(function (n) {
			n.el.setAttribute("transform", "translate(" + n.x + "," + n.y + ")");
		});
	}

	// ---------- Highlight and selection ----------

	var selectedId = null;

	function highlight(id) {
		svg.classList.toggle("has-focus", !!id);
		nodes.forEach(function (n) {
			var lit = !!id && (n.id === id || byId[id].neighbors.indexOf(n.id) !== -1);
			n.el.classList.toggle("lit", lit);
			n.el.classList.toggle("selected", n.id === selectedId);
		});
		links.forEach(function (l) {
			l.el.classList.toggle("lit", !!id && (l.a.id === id || l.b.id === id));
		});
	}

	function select(id) {
		selectedId = id;
		highlight(id);
		renderInfo();
	}

	function renderInfo() {
		info.textContent = "";
		if (!selectedId) {
			var hint = document.createElement("p");
			hint.className = "meta";
			hint.textContent = "Click a concept to read about it. Drag concepts to rearrange the map.";
			info.appendChild(hint);
			return;
		}
		var n = byId[selectedId];

		var title = document.createElement("h2");
		title.textContent = n.name;
		info.appendChild(title);

		var chip = document.createElement("span");
		chip.className = "cmap-chip group-" + n.group;
		chip.textContent = GROUP_LABELS[n.group];
		info.appendChild(chip);

		var desc = document.createElement("p");
		desc.textContent = n.desc;
		info.appendChild(desc);

		var conn = document.createElement("p");
		conn.className = "cmap-connections";
		conn.appendChild(document.createTextNode("Connected to: "));
		n.neighbors.forEach(function (nid, i) {
			if (i > 0) conn.appendChild(document.createTextNode(", "));
			var b = document.createElement("button");
			b.type = "button";
			b.textContent = byId[nid].name;
			b.addEventListener("click", function () {
				select(nid);
			});
			conn.appendChild(b);
		});
		info.appendChild(conn);

		var more = document.createElement("a");
		more.href = RELATED_URL;
		more.innerHTML = "See the related papers &rarr;";
		info.appendChild(more);
	}

	// ---------- Pointer and keyboard ----------

	function toSvgPoint(e) {
		var pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		return pt.matrixTransform(svg.getScreenCTM().inverse());
	}

	function attachEvents(n) {
		var dragging = false, moved = 0, last = null, wasFixed = false;

		n.el.addEventListener("pointerdown", function (e) {
			dragging = true;
			moved = 0;
			last = toSvgPoint(e);
			wasFixed = n.fixed;
			n.fixed = true;
			n.el.setPointerCapture(e.pointerId);
			n.el.classList.add("dragging");
			e.preventDefault();
		});
		n.el.addEventListener("pointermove", function (e) {
			if (!dragging) return;
			var p = toSvgPoint(e);
			moved += Math.abs(p.x - last.x) + Math.abs(p.y - last.y);
			last = p;
			n.x = p.x;
			n.y = p.y;
			keepInside(n);
			reheat(0.3);
			draw();
		});
		function end() {
			if (!dragging) return;
			dragging = false;
			n.fixed = wasFixed;
			n.el.classList.remove("dragging");
			if (moved < 4) select(selectedId === n.id ? null : n.id);
		}
		n.el.addEventListener("pointerup", end);
		n.el.addEventListener("pointercancel", end);

		n.el.addEventListener("pointerenter", function () {
			if (!dragging) highlight(n.id);
		});
		n.el.addEventListener("pointerleave", function () {
			if (!dragging) highlight(selectedId);
		});
		n.el.addEventListener("keydown", function (e) {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				select(n.id);
			}
		});
	}

	svg.addEventListener("pointerdown", function (e) {
		if (e.target === svg) select(null);
	});

	if (shuffleButton) {
		shuffleButton.addEventListener("click", function () {
			seedPositions(true);
			reheat(1);
		});
	}

	// ---------- Legend ----------

	if (legend) {
		Object.keys(GROUP_LABELS).forEach(function (g) {
			var item = document.createElement("span");
			item.className = "cmap-chip group-" + g;
			item.textContent = GROUP_LABELS[g];
			legend.appendChild(item);
		});
	}

	seedPositions(false);
	renderInfo();
	draw();
	reheat(1);
})();
