"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Project, ProjectLink } from "@/types/project";
import { getPlaceholderByCategory } from "@/lib/placeholder";

// ── Supabase client (client-side) ─────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// ── Constants ─────────────────────────────────────────────────────────────
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";

const CATEGORIES = [
  "STARTUPS",
  "FULL-STACK",
  "QUANTUM",
  "COMMUNITY",
  "RESEARCH",
  "AWARDS",
  "CERTIFICATIONS",
  "CONTRIBUTIONS",
  "EXPERIENCE",
  "ABOUT",
];

// ── Types ─────────────────────────────────────────────────────────────────
interface FormState {
  title: string;
  category: string;
  year: string;
  description: string;
  image_url: string;
  image_urls: string[];
  video_url: string;
  links: ProjectLink[];
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "STARTUPS",
  year: new Date().getFullYear().toString(),
  description: "",
  image_url: "",
  image_urls: [],
  video_url: "",
  links: [],
};

// ── Main component ────────────────────────────────────────────────────────
export default function AdminPage() {
  // Auth
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // View: "list" | "form"
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  // Async states
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<string | null>(null);

  // Flash message
  const [flash, setFlash] = useState("");

  // ── Hydrate auth from sessionStorage ────────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "true") setAuthed(true);
  }, []);

  // ── Load projects ────────────────────────────────────────────────────────
  const loadProjects = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });
    if (!error && data) setProjects(data as Project[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadProjects();
  }, [authed, loadProjects]);

  // ── Flash helper ─────────────────────────────────────────────────────────
  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 3500);
  };

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "true");
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    setPwInput("");
  };

  // ── Form helpers ──────────────────────────────────────────────────────────
  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setView("form");
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category,
      year: p.year,
      description: p.description,
      image_url: p.image_url ?? "",
      image_urls: p.image_urls ?? [],
      video_url: p.video_url ?? "",
      links: p.links ?? [],
    });
    setView("form");
  };

  const cancelForm = () => {
    setView("list");
    setEditingId(null);
  };

  // ── Image upload to Supabase Storage ─────────────────────────────────────
  const uploadFile = async (
    file: File,
    slotKey: string,
  ): Promise<string | null> => {
    if (!supabase) return null;
    setUploadingIdx(slotKey);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("project-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("project-images").getPublicUrl(data.path);
      return publicUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      showFlash("Upload failed. Check storage bucket permissions.");
      return null;
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleMainImageFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "main");
    if (url) setField("image_url", url);
    e.target.value = "";
  };

  const handleGalleryImageFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, `gallery-${index}`);
    if (url) {
      const next = [...form.image_urls];
      next[index] = url;
      setField("image_urls", next);
    }
    e.target.value = "";
  };

  // ── Video upload to Supabase Storage ───────────────────────────────────
  const uploadVideoFile = async (
    file: File,
  ): Promise<string | null> => {
    if (!supabase) return null;
    setUploadingIdx("video");
    try {
      const ext = file.name.split(".").pop() ?? "mp4";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("project-videos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("project-videos").getPublicUrl(data.path);
      return publicUrl;
    } catch (err) {
      console.error("Video upload failed:", err);
      showFlash("Video upload failed. Check storage bucket permissions.");
      return null;
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleVideoFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadVideoFile(file);
    if (url) setField("video_url", url);
    e.target.value = "";
  };

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      year: form.year.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      image_urls: form.image_urls.filter((u) => u.trim() !== ""),
      video_url: form.video_url.trim() || null,
      links: form.links.filter((l) => l.url.trim() !== ""),
    };

    const { error } = editingId
      ? await supabase.from("projects").update(payload).eq("id", editingId)
      : await supabase.from("projects").insert([payload]);

    setSaving(false);

    if (error) {
      showFlash(`Error: ${error.message}`);
    } else {
      await loadProjects();
      setView("list");
      showFlash(editingId ? "Project updated." : "Project created.");
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!supabase) return;
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      showFlash(`Delete failed: ${error.message}`);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showFlash("Project deleted.");
    }
  };

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Login
  // ════════════════════════════════════════════════════════════════════════
  if (!authed) {
    return (
      <div className="admin-login-wrap">
        <form onSubmit={handleLogin} className="admin-login-card">
          <div>
            <p className="admin-login-heading">Portfolio CMS</p>
            <h1 className="admin-login-title">Admin</h1>
          </div>

          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              autoFocus
              value={pwInput}
              onChange={(e) => {
                setPwInput(e.target.value);
                setAuthError("");
              }}
              placeholder="Enter password"
              className="admin-input"
            />
            {authError && <p className="admin-error">{authError}</p>}
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              style={{ width: "100%" }}
            >
              Sign in
            </button>
          </div>

          <p className="admin-hint">
            Set <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> in{" "}
            <code>.env.local</code>
          </p>
        </form>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Form (Create / Edit)
  // ════════════════════════════════════════════════════════════════════════
  if (view === "form") {
    return (
      <div className="admin-page">
        {/* Topbar */}
        <header className="admin-topbar">
          <button
            className="admin-btn admin-btn-ghost"
            onClick={cancelForm}
          >
            ← Back
          </button>
          <span className="admin-topbar-title">
            {editingId ? "Edit Project" : "New Project"}
          </span>
          {flash && <span className="admin-flash">{flash}</span>}
          <button
            className="admin-btn admin-btn-primary"
            form="project-form"
            type="submit"
            disabled={saving || uploadingIdx !== null}
          >
            {saving
              ? "Saving…"
              : uploadingIdx
                ? "Uploading…"
                : editingId
                  ? "Update"
                  : "Create"}
          </button>
        </header>

        {/* Form body */}
        <div className="admin-form-body">
          <form id="project-form" onSubmit={handleSave}>
            {/* ── Basic info ── */}
            <div className="admin-form-section">
              <h2 className="admin-section-title">Basic Info</h2>

              <div className="admin-form-field">
                <label className="admin-label">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="e.g. KKhane — Food Startup"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label className="admin-label">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    className="admin-select"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-field">
                  <label className="admin-label">Year *</label>
                  <input
                    required
                    value={form.year}
                    onChange={(e) => setField("year", e.target.value)}
                    placeholder="2025"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-field">
                <label className="admin-label">Short Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="One or two sentences about this project…"
                  className="admin-textarea"
                />
              </div>
            </div>

            {/* ── Primary image ── */}
            <div className="admin-form-section">
              <h2 className="admin-section-title">Primary Image</h2>

              <div className="admin-form-field">
                <label className="admin-label">Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setField("image_url", e.target.value)}
                  placeholder="https://…"
                  className="admin-input"
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <label className="admin-upload-btn" style={{ cursor: "pointer" }}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleMainImageFile}
                  />
                  {uploadingIdx === "main" ? "Uploading…" : "↑ Upload file"}
                </label>
                <span className="admin-label" style={{ marginBottom: 0, opacity: 0.2 }}>
                  Uploads to Supabase Storage
                </span>
              </div>

              {/* Preview */}
              {form.image_url && (
                <div className="admin-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image_url}
                    alt="preview"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderByCategory(form.category);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setField("image_url", "")}
                    className="admin-preview-remove"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Placeholder preview */}
              {!form.image_url && (
                <div className="admin-preview" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPlaceholderByCategory(form.category)}
                    alt="placeholder preview"
                    style={{ opacity: 0.15 }}
                  />
                  <span className="admin-label" style={{ position: "absolute", marginBottom: 0 }}>
                    No image — placeholder will be shown
                  </span>
                </div>
              )}
            </div>

            {/* ── Gallery images ── */}
            <div className="admin-form-section">
              <h2 className="admin-section-title">
                Additional Images <span className="admin-optional">(gallery)</span>
              </h2>

              {form.image_urls.map((url, i) => (
                <div key={i} className="admin-multi-row">
                  <div style={{ flex: 1 }}>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const next = [...form.image_urls];
                        next[i] = e.target.value;
                        setField("image_urls", next);
                      }}
                      placeholder="https://…"
                      className="admin-input"
                      style={{ marginBottom: 4 }}
                    />
                    <label className="admin-upload-btn" style={{ cursor: "pointer" }}>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleGalleryImageFile(e, i)}
                      />
                      {uploadingIdx === `gallery-${i}` ? "Uploading…" : "↑ Upload file"}
                    </label>
                  </div>
                  {url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt=""
                      className="admin-gallery-thumb"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setField("image_urls", form.image_urls.filter((_, j) => j !== i))
                    }
                    className="admin-remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => setField("image_urls", [...form.image_urls, ""])}
              >
                + Add image
              </button>
            </div>

            {/* ── Video ── */}
            <div className="admin-form-section">
              <h2 className="admin-section-title">
                Video <span className="admin-optional">(optional)</span>
              </h2>

              <div className="admin-form-field">
                <label className="admin-label">Video URL</label>
                <input
                  type="url"
                  value={form.video_url}
                  onChange={(e) => setField("video_url", e.target.value)}
                  placeholder="https://youtube.com/watch?v=… or direct video link"
                  className="admin-input"
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <label className="admin-upload-btn" style={{ cursor: "pointer" }}>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    style={{ display: "none" }}
                    onChange={handleVideoFile}
                  />
                  {uploadingIdx === "video" ? "Uploading…" : "↑ Upload video"}
                </label>
                <span className="admin-label" style={{ marginBottom: 0, opacity: 0.2 }}>
                  Max 50 MB · mp4, webm, mov
                </span>
              </div>

              {/* Video preview */}
              {form.video_url && (
                <div className="admin-preview" style={{ height: 240 }}>
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    src={form.video_url}
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setField("video_url", "")}
                    className="admin-preview-remove"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* ── Links ── */}
            <div className="admin-form-section">
              <h2 className="admin-section-title">
                Links <span className="admin-optional">(optional)</span>
              </h2>

              {form.links.map((link, i) => (
                <div key={i} className="admin-multi-row">
                  <input
                    value={link.label}
                    onChange={(e) => {
                      const next = [...form.links];
                      next[i] = { ...next[i], label: e.target.value };
                      setField("links", next);
                    }}
                    placeholder="Label (e.g. Live Site)"
                    className="admin-input"
                    style={{ maxWidth: 160, flexShrink: 0 }}
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const next = [...form.links];
                      next[i] = { ...next[i], url: e.target.value };
                      setField("links", next);
                    }}
                    placeholder="https://…"
                    className="admin-input"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setField("links", form.links.filter((_, j) => j !== i))
                    }
                    className="admin-remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() =>
                  setField("links", [...form.links, { label: "", url: "" }])
                }
              >
                + Add link
              </button>
            </div>

            {/* ── Bottom submit ── */}
            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={saving || uploadingIdx !== null}
              >
                {saving ? "Saving…" : editingId ? "Update Project" : "Create Project"}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={cancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: Project List
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="admin-page">
      {/* Topbar */}
      <header className="admin-topbar">
        <div style={{ flex: 1 }}>
          <span className="admin-topbar-subtitle">Portfolio CMS</span>
          <div className="admin-topbar-title" style={{ marginTop: 2 }}>
            Projects
          </div>
        </div>

        {flash && <span className="admin-flash">{flash}</span>}

        <button className="admin-btn admin-btn-primary" onClick={startCreate}>
          + New Project
        </button>

        <button className="admin-btn admin-btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Content */}
      <div className="admin-content">
        {!supabase && (
          <div className="admin-warning">
            <strong>Supabase not configured.</strong> Add{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code>.env.local</code> to connect.
          </div>
        )}

        {loading ? (
          <div className="admin-empty">
            <span className="admin-empty-text">Loading…</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">◻</div>
            <p className="admin-empty-text">No projects yet.</p>
            <button
              className="admin-btn admin-btn-primary"
              onClick={startCreate}
            >
              Create your first project
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <p className="admin-stats">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>

            {/* Table header */}
            <div className="admin-table-header">
              <span>Img</span>
              <span>Title</span>
              <span>Category</span>
              <span>Year</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>

            {/* Rows */}
            <div className="admin-rows">
              {projects.map((p) => {
                const thumb =
                  p.image_url?.trim()
                    ? p.image_url
                    : getPlaceholderByCategory(p.category);

                return (
                  <div key={p.id} className="admin-row">
                    {/* Thumbnail */}
                    <div className="admin-row-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={p.title}
                        onError={(e) => {
                          e.currentTarget.src = getPlaceholderByCategory(p.category);
                        }}
                      />
                    </div>

                    {/* Title + description */}
                    <div style={{ minWidth: 0 }}>
                      <p className="admin-row-title">{p.title}</p>
                      {p.description && (
                        <p className="admin-row-desc">{p.description}</p>
                      )}
                    </div>

                    {/* Category */}
                    <span className="admin-row-category">{p.category}</span>

                    {/* Year */}
                    <span className="admin-row-year">{p.year}</span>

                    {/* Actions */}
                    <div className="admin-row-actions">
                      <button
                        className="admin-btn admin-btn-ghost"
                        onClick={() => startEdit(p)}
                        style={{ padding: "6px 12px" }}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(p.id, p.title)}
                        style={{ padding: "6px 12px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
