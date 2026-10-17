// Course list for courses.html, shown two ways: by department or by term.
// Add each course once here; both views are built from this list.
//
//   code:    optional course code; left out when the source has none
//   page:    optional course page (e.g. "courses/inls881.html"); the title links to it when set
//   dept:    "lis" | "psych" | "stats" | "other"
//   field:   for dept "other" only, the sub-heading (e.g. "Education")
//   program: the degree/school heading used in the by-term view
//   school:  short school name shown next to the course in the by-department view
//   term:    "Spring 2026", "Summer 2026", "Fall 2026", ...
//   grade:   optional, shown in the right-hand column (e.g. "A", "A-", "P"); a dash is shown until it is filled in

// University of Maryland, College Park (UMD) MLIS coursework, from the unofficial transcript (as of Oct 16, 2026).
// The non-credit English course (UMEI005) is left out. "S" is a satisfactory thesis-research grade.
var UMD_PROGRAM = "MLIS, Library and Information Science — University of Maryland, College Park";
function umd(term, code, title, grade) {
	return { code: code, title: title, dept: "lis", program: UMD_PROGRAM, school: "UMD", term: term, grade: grade };
}

// Jeonbuk National University (JBNU) coursework, from the official scholastic record (issued Nov 28, 2025).
// The record has no course codes, so these entries have none. Semesters: 1st = Spring, 2nd = Fall.
// Non-credit career, counseling and volunteer pass/fail items are left out.
var JBNU_PROGRAM = "BLIS in Library and Information Science, BA in Psychology (Minor: Statistics) — Jeonbuk National University";
function jbnu(term, dept, title, grade, field) {
	return { title: title, dept: dept, field: field, program: JBNU_PROGRAM, school: "JBNU", term: term, grade: grade };
}
var CS = "Computer and Data Science";

window.COURSES = [
	{ code: "INLS 881", page: "courses/inls881.html", title: "Introduction to Doctoral Studies in ILS", dept: "lis",
		program: "PhD, Information and Library Science — UNC Chapel Hill", school: "UNC", term: "Fall 2026" },
	{ code: "PSYC 831", page: "courses/psyc831.html", title: "Item Response Theory", dept: "psych",
		program: "PhD, Information and Library Science — UNC Chapel Hill", school: "UNC", term: "Fall 2026" },
	{ code: "PSYC 746", page: "courses/psyc746.html", title: "Human Memory", dept: "psych",
		program: "PhD, Information and Library Science — UNC Chapel Hill", school: "UNC", term: "Fall 2026" },

	umd("Spring 2026", "INST639T", "Social and Psychological Impacts of AI", "A+"),
	umd("Spring 2026", "INST798", "Seminar in Research Methods — Experimental Methods", "A"),

	umd("Fall 2025", "INST728F", "Generative AI in UX", "A+"),
	umd("Fall 2025", "INST878D", "Governing Algorithms and Algorithmic Governance", "A-"),
	umd("Fall 2025", "INST878O", "Computer-Supported Cooperative Work (CSCW)", "A"),

	umd("Spring 2025", "INST798", "Seminar in Research Methods — Mixed Methods", "A"),
	umd("Spring 2025", "LBSC631", "Achieving Organizational Excellence", "A"),
	umd("Spring 2025", "LBSC671", "Information Lifecycle", "A"),

	umd("Fall 2024", "LBSC602", "Serving Information Needs", "A+"),
	umd("Fall 2024", "INST600", "Foundations for Library and Information Science", "A+"),

	jbnu("Fall 2023", "stats", "Regression Analysis 1", "B+"),
	jbnu("Fall 2023", "psych", "Laboratory in Cognitive Neuroscience", "A+"),
	jbnu("Fall 2023", "psych", "Psychology & Marketing", "A+"),
	jbnu("Fall 2023", "psych", "Psychology of Vocation and Career Consulting", "A+"),

	jbnu("Spring 2023", "lis", "Understanding Data Driven Society", "A+"),
	jbnu("Spring 2023", "stats", "Exploratory Data Analysis", "A0"),
	jbnu("Spring 2023", "stats", "Linear Algebra", "B+"),
	jbnu("Spring 2023", "psych", "Social Psychology", "A+"),
	jbnu("Spring 2023", "psych", "Statistics of Psychology", "A+"),
	jbnu("Spring 2023", "other", "Artificial Intelligence", "A0", CS),

	jbnu("Fall 2022", "lis", "Introduction to Database", "A+"),
	jbnu("Fall 2022", "lis", "Text Information Analysis", "A+"),
	jbnu("Fall 2022", "stats", "Introduction to Big Data", "A+"),
	jbnu("Fall 2022", "stats", "Machine Learning", "A+"),
	jbnu("Fall 2022", "lis", "Text Mining", "A+"),
	jbnu("Fall 2022", "psych", "Adult Development", "A+"),
	jbnu("Fall 2022", "psych", "General Psychology", "A+"),

	jbnu("Fall 2021", "lis", "Information Services", "A+"),
	jbnu("Fall 2021", "lis", "Data Visualization", "A+"),
	jbnu("Fall 2021", "psych", "Abnormal Psychology", "A+"),
	jbnu("Fall 2021", "psych", "Cognitive Psychology Capstone Design", "A+"),
	jbnu("Fall 2021", "psych", "Developmental Psychology", "A0"),
	jbnu("Fall 2021", "psych", "Psychology of Learning", "A+"),
	jbnu("Fall 2021", "psych", "Research Methods in Psychology", "A+"),

	jbnu("Spring 2021", "lis", "Information Retrieval", "A+"),
	jbnu("Spring 2021", "lis", "Access to Cultural Contents", "A0"),
	jbnu("Spring 2021", "lis", "Information Media", "A0"),
	jbnu("Spring 2021", "lis", "Information Resource Management", "A0"),
	jbnu("Spring 2021", "psych", "Introduction to Neuroscience", "A+"),
	jbnu("Spring 2021", "psych", "Psychology of Personality", "A+"),

	jbnu("Spring 2020", "other", "Introduction to Computer Programming", "A+", CS),
	jbnu("Spring 2020", "lis", "Information Materials Organization 1", "A0"),
	jbnu("Spring 2020", "lis", "Computer Information Processing", "B+"),
	jbnu("Spring 2020", "lis", "Education of Book Reading", "B+"),
	jbnu("Spring 2020", "lis", "Web Database Searching", "B+"),

	jbnu("Fall 2019", "other", "Understanding & Usage of Big Data", "A0", CS),
	jbnu("Fall 2019", "lis", "Introduction to Library & Information Science", "A0"),
	jbnu("Fall 2019", "lis", "Introduction to Information Management", "A+"),
	jbnu("Fall 2019", "stats", "Introduction to Statistics", "B0"),

	jbnu("Spring 2019", "psych", "Introduction to Modern Psychology", "A0"),
	jbnu("Spring 2019", "lis", "Utilization of Library Data", "A+"),
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
			var main = el("span", "course-main");
			main.appendChild(el("span", "course-code", c.code));
			main.appendChild(document.createTextNode(" "));
			var title = el("span", "course-title");
			if (c.page) {
				var link = el("a", "", c.title);
				link.href = c.page;
				title.appendChild(link);
			} else {
				title.textContent = c.title;
			}
			main.appendChild(title);
			var m = meta(c);
			if (m) {
				main.appendChild(document.createTextNode(" "));
				main.appendChild(el("span", "meta", m));
			}
			li.appendChild(main);
			// Right-hand column for the grade
			li.appendChild(el("span", c.grade ? "course-grade" : "course-grade is-empty", c.grade || "–"));
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
			var heading = el("h2", "mini-header", program.key);
			// The program names are long; the overview shows just the school
			heading.setAttribute("data-toc", program.items[0].school);
			section.appendChild(heading);
			groupBy(program.items, function (c) { return c.term; }).forEach(function (term) {
				section.appendChild(el("h3", "course-term", term.key));
				section.appendChild(courseList(term.items, function () { return ""; }));
			});
			container.appendChild(section);
		});
	}

	// Floating overview: one entry per top heading (discipline, or degree program) and per sub-heading
	// (field, or term), highlighting the section being read. Hidden by CSS on narrow screens.
	var spyHeads = [], spyLinks = [], spyPicked = null;

	function mark(current) {
		spyLinks.forEach(function (a, i) {
			a.classList.toggle("is-current", i === current);
			if (i === current) a.setAttribute("aria-current", "true");
			else a.removeAttribute("aria-current");
		});
	}

	function spy() {
		if (!spyHeads.length) return;
		if (spyPicked !== null) return mark(spyPicked);
		var current = 0;
		spyHeads.forEach(function (h, i) {
			if (h.getBoundingClientRect().top <= 140) current = i;
		});
		if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = spyHeads.length - 1;
		mark(current);
	}

	function buildOverview(container, toc) {
		var list = toc.querySelector("ol");
		list.textContent = "";
		spyHeads = Array.prototype.slice.call(container.querySelectorAll("h2.mini-header, h3.course-term"));
		spyPicked = null;
		spyLinks = spyHeads.map(function (h, i) {
			h.id = "course-section-" + i;
			var li = el("li", h.tagName === "H3" ? "toc-sub" : "");
			var a = el("a", "", h.getAttribute("data-toc") || h.textContent);
			a.href = "#" + h.id;
			a.addEventListener("click", function (e) {
				e.preventDefault();
				var offset = parseFloat(getComputedStyle(h).scrollMarginTop) || 0;
				var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
				window.scrollTo({
					top: h.getBoundingClientRect().top + window.pageYOffset - offset,
					behavior: reduce ? "auto" : "smooth",
				});
				spyPicked = i;
				mark(i);
			});
			li.appendChild(a);
			list.appendChild(li);
			return a;
		});
		toc.hidden = false;
		spy();
	}

	// Slide toggle; the chosen view is kept in the URL (#by-term) so it survives reloads.
	window.initCourses = function (toggle, container, toc) {
		var buttons = toggle.querySelectorAll("[data-view]");

		function show(view) {
			toggle.setAttribute("data-active", view);
			buttons.forEach(function (b) {
				b.setAttribute("aria-checked", String(b.getAttribute("data-view") === view));
			});
			container.textContent = "";
			if (view === "term") renderByTerm(container);
			else renderByDept(container);
			if (!toc) return;
			buildOverview(container, toc);
		}

		buttons.forEach(function (b) {
			b.addEventListener("click", function () {
				var view = b.getAttribute("data-view");
				history.replaceState(null, "", view === "term" ? "#by-term" : location.pathname + location.search);
				show(view);
			});
		});

		// Once the reader scrolls by hand, go back to following the scroll position
		["wheel", "touchstart", "keydown"].forEach(function (type) {
			window.addEventListener(type, function () { spyPicked = null; }, { passive: true });
		});
		window.addEventListener("scroll", spy, { passive: true });
		window.addEventListener("resize", spy);

		show(location.hash === "#by-term" ? "term" : "dept");
	};
})();
