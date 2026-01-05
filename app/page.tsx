import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "3rem 1.5rem", maxWidth: 960, margin: "0 auto" }}>
      <section style={{ marginTop: "3rem" }}>
        <h1 style={{ fontSize: 44, lineHeight: 1.1, margin: 0 }}>
          Vibe App
        </h1>
        <p style={{ marginTop: "1rem", fontSize: 18, opacity: 0.85 }}>
          A minimal SaaS starter: Supabase auth, protected dashboard, and per-user Projects CRUD.
        </p>

        <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href="/login"
            style={{
              display: "inline-block",
              padding: "0.7rem 1rem",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Log in
          </Link>

          <Link
            href="/app"
            style={{
              display: "inline-block",
              padding: "0.7rem 1rem",
              border: "1px solid #111",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Go to Dashboard →
          </Link>
        </div>

        <div style={{ marginTop: "2.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {[
            { title: "Auth", desc: "Magic link login with Supabase." },
            { title: "Protected routes", desc: "/app requires login." },
            { title: "Projects CRUD", desc: "Create, list, delete—per user." },
            { title: "RLS policies", desc: "Users can only access their own data." },
          ].map((x) => (
            <div
              key={x.title}
              style={{
                border: "1px solid #eee",
                borderRadius: 14,
                padding: "1rem",
              }}
            >
              <div style={{ fontWeight: 700 }}>{x.title}</div>
              <div style={{ marginTop: "0.5rem", opacity: 0.85 }}>{x.desc}</div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: "2.5rem", opacity: 0.7 }}>
          Tip: if you’re already logged in, clicking “Go to Dashboard” takes you straight in.
        </p>
      </section>
    </main>
  );
}
