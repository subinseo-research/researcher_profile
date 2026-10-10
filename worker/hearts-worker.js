// Heart counter for the blog: a tiny Cloudflare Worker backed by one KV namespace.
//
//   GET  /hearts?slugs=a,b       -> { "a": 12, "b": 3 }
//   POST /hearts/<slug>          body { "action": "add" | "remove", "visitor": "<random id>" }
//                                -> { "slug": "a", "count": 13, "hearted": true }
//
// One heart per visitor id (a random id the browser keeps in localStorage). This is a casual
// "like" button, not a vote: clearing browser storage gives a visitor a new id.
// Settings come from wrangler.toml [vars]: ALLOWED_ORIGINS and ALLOWED_SLUGS.

const SLUG = /^[a-z0-9][a-z0-9-]{0,59}$/;
const VISITOR = /^[A-Za-z0-9-]{8,64}$/;

function list(value) {
	return (value || "").split(",").map((s) => s.trim()).filter(Boolean);
}

function json(body, status, cors) {
	return new Response(JSON.stringify(body), {
		status: status || 200,
		headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...cors },
	});
}

export default {
	async fetch(request, env) {
		const origin = request.headers.get("Origin") || "";
		const allowedOrigins = list(env.ALLOWED_ORIGINS);
		const allowedSlugs = list(env.ALLOWED_SLUGS);

		// Only the listed sites may call this; everyone else gets no CORS header.
		const cors = allowedOrigins.includes(origin)
			? { "Access-Control-Allow-Origin": origin, "Vary": "Origin", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" }
			: {};

		if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
		if (origin && !cors["Access-Control-Allow-Origin"]) return json({ error: "origin not allowed" }, 403, cors);

		const url = new URL(request.url);
		const kv = env.HEARTS;

		// Read counts for several posts at once.
		if (request.method === "GET" && url.pathname === "/hearts") {
			const slugs = list(url.searchParams.get("slugs")).filter((s) => SLUG.test(s) && allowedSlugs.includes(s)).slice(0, 50);
			const out = {};
			for (const slug of slugs) out[slug] = Number((await kv.get(`count:${slug}`)) || 0);
			return json(out, 200, cors);
		}

		// Comment counts. The browser cannot ask giscus directly (its API only allows requests from
		// giscus.app), so this worker asks on the site's behalf and caches the answer for 5 minutes.
		if (request.method === "GET" && url.pathname === "/comments") {
			const slugs = list(url.searchParams.get("slugs")).filter((s) => SLUG.test(s) && allowedSlugs.includes(s)).slice(0, 50);
			const out = {};
			if (env.GISCUS_REPO && env.GISCUS_CATEGORY) {
				for (const slug of slugs) {
					const api = "https://giscus.app/api/discussions?repo=" + encodeURIComponent(env.GISCUS_REPO) +
						"&term=" + encodeURIComponent(slug) + "&category=" + encodeURIComponent(env.GISCUS_CATEGORY) + "&strict=false&first=1";
					try {
						const data = await (await fetch(api, { cf: { cacheTtl: 300, cacheEverything: true } })).json();
						if (data && data.discussion && typeof data.discussion.totalCommentCount === "number") {
							out[slug] = data.discussion.totalCommentCount + (Number(data.discussion.totalReplyCount) || 0);
						} else if (data && /not found/i.test(data.error || "")) {
							out[slug] = 0; // nobody has commented yet, so no discussion exists
						}
					} catch (e) {
						// leave this post out; the page then shows no number rather than a wrong one
					}
				}
			}
			return json(out, 200, cors);
		}

		// Add or remove this visitor's heart.
		const match = url.pathname.match(/^\/hearts\/([^/]+)$/);
		if (request.method === "POST" && match) {
			const slug = match[1];
			if (!SLUG.test(slug) || !allowedSlugs.includes(slug)) return json({ error: "unknown post" }, 404, cors);

			let payload;
			try {
				payload = await request.json();
			} catch (e) {
				return json({ error: "invalid json" }, 400, cors);
			}
			if (!VISITOR.test(payload.visitor || "") || !["add", "remove"].includes(payload.action)) {
				return json({ error: "invalid request" }, 400, cors);
			}

			const mark = `h:${slug}:${payload.visitor}`;
			const had = (await kv.get(mark)) !== null;
			let count = Number((await kv.get(`count:${slug}`)) || 0);

			if (payload.action === "add" && !had) {
				await kv.put(mark, "1");
				count += 1;
				await kv.put(`count:${slug}`, String(count));
			} else if (payload.action === "remove" && had) {
				await kv.delete(mark);
				count = Math.max(0, count - 1);
				await kv.put(`count:${slug}`, String(count));
			}
			return json({ slug, count, hearted: payload.action === "add" }, 200, cors);
		}

		return json({ error: "not found" }, 404, cors);
	},
};
