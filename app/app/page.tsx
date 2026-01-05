"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type Project = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadProjects(uid: string) {
    setErrorMsg(null);
    const { data, error } = await supabase
      .from("projects")
      .select("id,user_id,title,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setProjects(data ?? []);
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      const session = data.session;
      if (!session) {
        router.replace("/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
      loadProjects(session.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
      else setUser(session.user);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const trimmed = title.trim();
    if (!trimmed) return;

    setBusy(true);
    setErrorMsg(null);

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      title: trimmed,
    });

    setBusy(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setTitle("");
    await loadProjects(user.id);
  }

  async function deleteProject(id: string) {
    if (!user) return;
    setBusy(true);
    setErrorMsg(null);

    const { error } = await supabase.from("projects").delete().eq("id", id);

    setBusy(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    await loadProjects(user.id);
  }

  if (loading) return <main style={{ padding: "2rem" }}>Loading...</main>;

  return (
    <main style={{ padding: "2rem", maxWidth: 720 }}>
      <h1>Dashboard</h1>
      <p style={{ marginTop: "0.5rem" }}>
        Logged in as <b>{user?.email}</b>
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>My Projects</h2>

        <form
          onSubmit={createProject}
          style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New project title"
            style={{ flex: 1, padding: "0.6rem" }}
          />
          <button disabled={busy} style={{ padding: "0.6rem 1rem" }}>
            {busy ? "..." : "Create"}
          </button>
        </form>

        {errorMsg && (
          <p style={{ marginTop: "1rem", color: "crimson" }}>
            Error: {errorMsg}
          </p>
        )}

        <ul style={{ marginTop: "1rem", paddingLeft: "1.2rem" }}>
          {projects.map((p) => (
            <li key={p.id} style={{ marginBottom: "0.75rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <span>
                  <b>{p.title}</b>{" "}
                  <span style={{ opacity: 0.7, fontSize: 12 }}>
                    {new Date(p.created_at).toLocaleString()}
                  </span>
                </span>
                <button disabled={busy} onClick={() => deleteProject(p.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {projects.length === 0 && !errorMsg && (
          <p style={{ marginTop: "1rem", opacity: 0.7 }}>
            No projects yet. Create your first one.
          </p>
        )}
      </section>
    </main>
  );
}
