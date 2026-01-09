export default async function handler(req, res) {
  const backendBase = "http://13.205.145.22:3000"; // EC2 backend
  const url = backendBase + req.url.replace("/api/backend", "");

  const response = await fetch(url, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      ...(req.headers.cookie && { cookie: req.headers.cookie })
    },
    body: req.method === "GET" ? null : JSON.stringify(req.body)
  });

  const data = await response.text();
  res.status(response.status).send(data);
}
