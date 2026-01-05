"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 已登录就直接进 /app
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/app");
    });
  }, [router]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
      },
    });

    setLoading(false);

    if (error) setStatus(`Login failed: ${error.message}`);
    else setStatus("Check your email for the magic link.");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 520 }}>
      <h1>Login</h1>
      <p>We’ll send you a magic link.</p>

      <form onSubmit={signIn} style={{ marginTop: "1rem" }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ width: "100%", padding: "0.6rem" }}
        />
        <button
          disabled={loading}
          style={{ marginTop: "1rem", padding: "0.6rem 1rem" }}
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </form>

      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </main>
  );
}
