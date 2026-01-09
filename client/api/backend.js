export default async function handler(req, res) {
  // ✅ Handle preflight here — DO NOT forward to backend
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(200).end();
  }

  const BACKEND_URL = "http://13.205.145.22:3000";
  const targetUrl =
    BACKEND_URL + req.url.replace("/api/backend", "");

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      ...(req.headers.cookie ? { cookie: req.headers.cookie } : {})
    },
    body: req.method === "GET" ? null : JSON.stringify(req.body)
  });

  const data = await response.text();
  res.status(response.status).send(data);
}
