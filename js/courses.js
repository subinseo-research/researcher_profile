// Course list for courses.html, shown two ways: by department or by term.
// Add each course once here; both views are built from this list.
//
//   dept:    "lis" | "psych" | "stats" | "other"
//   field:   for dept "other" only, the sub-heading (e.g. "Education")
//   program: the degree/school heading used in the by-term view
//   school:  short school name shown next to the course in the by-department view
//   term:    "Spring 2026", "Summer 2026", "Fall 2026", ...

window.COURSES = [
	{ code: "INLS 000", title: "[Course Title]", dept: "lis",
		program: "PhD, Information and Library Science — UNC Chapel Hill", school: "UNC", term: "Fall 2026" },
	{ code: "PSYC 000", title: "[Course Title]", dept: "psych",
		program: "PhD, Information and Library Science — UNC Chapel Hill", school: "UNC", term: "Fall 2026" },

	{ code: "LIS 000", title: "[Course Title]", dept: "lis",
		program: "[Previous Degree, Major] — [University]", school: "[University]", term: "Spring 2024" },
	{ code: "PSY 000", title: "[Course Title]", dept: "psych",
		program: "[Previous Degree, Major] — [University]", school: "[University]", term: "Spring 2024" },
	{ code: "STAT 000", title: "[Course Title]", dept: "stats",
		program: "[Previous Degree, Major] — [University]", school: "[University]", term: "Fall 2023" },
	{ code: "STAT 000", title: "[Course Title]", dept: "stats",
		program: "[Previous Degree, Major] — [University]", school: "[University]", term: "Fall 2023" },
	{ code: "EDU 000", title: "[Course Title]", dept: "other", field: "Education",
		program: "[Previous Degree, Major] — [University]", school: "[University]", term: "Fall 2023" },
	{ code: "CS 000", title: "[Course Title]", dept: "other", field: "Computer Science",
		program: "[Previous Degree, Major] — [University]", school: "[University]", term: "Spring 2023" },
];

(function () {
	var DEPTS = [
		{ key: "lis", label: "Library and Information Science" },
		{ key: "psych", label: "Psychology" },
		{ key: "stats", label: "Statistics" },
		{ key: "other", label: "Others" },
	];
	var SEASON = { winter: 0, spring: 1, summer: 2, fall: 3 };

	// "Fall 2026" -> 20263, so newer terms sort higher.
	function termKey(term) {
		var m = /^(\w+)\s+(\d{4})$/.exec(term || "");
		if (!m) return 0;
		return Number(m[2]) * 10 + (SEASON[m[1].toLowerCase()] || 0);
	}

	function el(tag, className, text) {
		var node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== undefined) node.textContent = text;
		return node;
	}

	function courseList(courses, meta) {
		var ul = el("ul", "course-list");
		courses.forEach(function (c) {
			var li = el("li");
			li.appendChild(el("span", "course-code", c.code));
			li.appendChild(document.createTextNode(" "));
			li.appendChild(el("span", "course-title", c.title));
			var m = meta(c);
			if (m) {
				li.appendChild(document.createTextNode(" "));
				li.appendChild(el("span", "meta", m));
			}
			ul.appendChild(li);
		});
		return ul;
	}

	// Group items by key(item), keeping first-seen order.
	function groupBy(items, key) {
		var groups = [], index = {};
		items.forEach(function (item) {
			var k = key(item);
			if (!(k in index)) {
				index[k] = groups.length;
				groups.push({ key: k, items: [] });
			}
			groups[index[k]].items.push(item);
		});
		return groups;
	}

	function newestFirst(courses) {
		return courses.slice().sort(function (a, b) {
			return termKey(b.term) - termKey(a.term);
		});
	}

	function renderByDept(container) {
		var courses = newestFirst(window.COURSES);
		DEPTS.forEach(function (dept) {
			var inDept = courses.filter(function (c) { return c.dept === dept.key; });
			if (!inDept.length) return;

			var section = el("section", "course-group");
			section.appendChild(el("h2", "mini-header", dept.label));
			var meta = function (c) { return c.school + ", " + c.term; };

			if (dept.key === "other") {
				groupBy(inDept, function (c) { return c.field || "Other"; }).forEach(function (g) {
					section.appendChild(el("h3", "course-term", g.key));
					section.appendChild(courseList(g.items, meta));
				});
			} else {
				section.appendChild(courseList(inDept, meta));
			}
			container.appendChild(section);
		});
	}

	function renderByTerm(container) {
		var courses = newestFirst(window.COURSES);
		groupBy(courses, function (c) { return c.program; }).forEach(function (program) {
			var section = el("section", "course-group");
			section.appendChild(el("h2", "mini-header", program.key));
			groupBy(program.items, function (c) { return c.term; }).forEach(function (term) {
				section.appendChild(el("h3", "course-term", term.key));
				section.appendChild(courseList(term.items, function () { return ""; }));
			});
			container.appendChild(section);
		});
	}

	// Slide toggle; the chosen view is kept in the URL (#by-term) so it survives reloads.
	window.initCourses = function (toggle, container) {
		var buttons = toggle.querySelectorAll("[data-view]");

		function show(view) {
			toggle.setAttribute("data-active", view);
			buttons.forEach(function (b) {
				b.setAttribute("aria-checked", String(b.getAttribute("data-view") === view));
			});
			container.textContent = "";
			if (view === "term") renderByTerm(container);
			else renderByDept(container);
		}

		buttons.forEach(function (b) {
			b.addEventListener("click", function () {
				var view = b.getAttribute("data-view");
				history.replaceState(null, "", view === "term" ? "#by-term" : location.pathname + location.search);
				show(view);
			});
		});

		show(location.hash === "#by-term" ? "term" : "dept");
	};
})();
