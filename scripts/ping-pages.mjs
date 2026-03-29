const BASE = process.env.BASE_URL || "http://localhost:3000";

const ROUTES = [
  "/",
  "/dashboard",
  "/account",
  "/account/signin",
  "/account/signup",
  "/account/profile",
  "/courses",
  "/calendar",
  "/inbox",
  "/labs",
  "/labs/lab1",
  "/labs/lab2",
  "/labs/lab2/tailwind",
  "/labs/lab3",
  "/labs/lab5",
  "/courses/1234",
  "/courses/1234/home",
  "/courses/1234/modules",
  "/courses/1234/assignments",
  "/courses/1234/assignments/123",
  "/courses/1234/grades",
  "/courses/1234/people",
  "/courses/1234/people/table",
  "/courses/1234/piazza",
  "/courses/1234/quizzes",
  "/courses/1234/zoom",
];

async function ping(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "PingScript" },
    });
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: "ERR", ok: false, error: err.message };
  }
}

console.log("Pinging", BASE, "\n");
for (const path of ROUTES) {
  const full = `${BASE}${path}`;
  const { status, ok } = await ping(full);
  const icon = ok || status === 307 || status === 308 ? "✓" : "✗";
  console.log(`${icon} ${status} ${path}`);
}
console.log("\nDone.");
