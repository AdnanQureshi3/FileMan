export default async function handler(req, res) {
  // ✅ Stop preflight here
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const BACKEND_URL = "http://13.205.145.22:3000";

  // ✅ CORRECT path rewrite (THIS fixes 405)
  const path = req.url.replace(/^\/api\/backend/, "");
  const targetUrl = BACKEND_URL + path;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...(req.headers["content-type"]
        ? { "content-type": req.headers["content-type"] }
        : {}),
      ...(req.headers.cookie ? { cookie: req.headers.cookie } : {})
    },
    body: req.method === "GET" || req.method === "HEAD"
      ? null
      : JSON.stringify(req.body)
  });

  const data = await response.text();
  res.status(response.status).send(data);
}
