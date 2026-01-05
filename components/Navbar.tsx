"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #eee",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link href="/" style={{ fontWeight: 700 }}>
          Vibe App
        </Link>
        <Link href="/app">Dashboard</Link>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {user ? (
          <>
            <span style={{ fontFamily: "monospace" }}>{user.email}</span>
            <button onClick={logout} style={{ padding: "0.4rem 0.8rem" }}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
