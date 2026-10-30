"use client";

import { useCallback, useEffect, useState } from "react";
import { Project } from "@/types/project";

interface PlatformStatus {
  id: string;
  label: string;
  configured: boolean;
}

interface Preview {
  platform: string;
  configured: boolean;
  text: string;
}

interface Result {
  platform: string;
  status: "posted" | "draft" | "manual" | "skipped" | "error";
  url?: string;
  message?: string;
}

interface SharePanelProps {
  project: Project;
  onClose: () => void;
}

const SECRET_KEY = "social_admin_secret";

const STATUS_COLOR: Record<Result["status"], string> = {
  posted: "#16a34a",
  draft: "#2563eb",
  manual: "#a16207",
  skipped: "#6b7280",
  error: "#dc2626",
};

function readSecret(): string {
  try {
    return sessionStorage.getItem(SECRET_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function SharePanel({ project, onClose }: SharePanelProps) {
  const [secret, setSecret] = useState(readSecret);
  const [platforms, setPlatforms] = useState<PlatformStatus[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const call = useCallback(
    async (method: "GET" | "POST", body?: object) => {
      const res = await fetch("/api/social", {
        method,
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
      return data;
    },
    [secret],
  );

  const loadStatus = useCallback(async () => {
    if (!secret) return;
    setError("");
    try {
      const data = await call("GET");
      try {
        sessionStorage.setItem(SECRET_KEY, secret);
      } catch {
        // storage blocked — the secret just won't be remembered
      }
      setPlatforms(data.platforms);
      setSelected(data.platforms.filter((p: PlatformStatus) => p.configured && p.id !== "google-sites").map((p: PlatformStatus) => p.id));
    } catch (err) {
      setPlatforms([]);
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [call, secret]);

  useEffect(() => {
    if (readSecret()) loadStatus();
    // only on open — later loads happen via the Connect button
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    setConfirming(false);
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const preview = async () => {
    setBusy(true);
    setError("");
    setResults([]);
    try {
      const data = await call("POST", { projectId: project.id, platforms: selected, text, dryRun: true });
      setPreviews(data.previews);
      setLink(data.link);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setBusy(false);
  };

  const publish = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    setBusy(true);
    setError("");
    try {
      const data = await call("POST", { projectId: project.id, platforms: selected, text });
      setResults(data.results);
      setLink(data.link);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setBusy(false);
  };

  const labelOf = (id: string) => platforms.find((p) => p.id === id)?.label ?? id;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && !busy && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowY: "auto",
        padding: "5vh 16px",
      }}
    >
      <div className="admin-login-card" style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="admin-topbar-subtitle">Share to socials</span>
            <div className="admin-topbar-title" style={{ marginTop: 2 }}>{project.title}</div>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={onClose} disabled={busy}>
            Close
          </button>
        </div>

        {/* Secret */}
        <div className="admin-form-field">
          <label className="admin-label">Social admin secret</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="admin-input"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadStatus()}
              placeholder="SOCIAL_ADMIN_SECRET"
              autoComplete="off"
            />
            <button className="admin-btn admin-btn-ghost" onClick={loadStatus} disabled={!secret || busy}>
              Connect
            </button>
          </div>
          <p className="admin-hint">Server-side secret, separate from the admin password. Remembered for this tab only.</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {platforms.length > 0 && (
          <>
            {/* Platforms */}
            <div className="admin-form-field">
              <label className="admin-label">Platforms</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {platforms.map((p) => (
                  <label
                    key={p.id}
                    className="admin-btn admin-btn-ghost"
                    style={{ padding: "6px 12px", opacity: p.configured ? 1 : 0.45, cursor: p.configured ? "pointer" : "not-allowed" }}
                    title={p.configured ? "" : "Add this platform's env vars to enable it"}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      disabled={!p.configured || busy}
                      onChange={() => toggle(p.id)}
                      style={{ marginRight: 6 }}
                    />
                    {p.label}
                    {!p.configured && " · not set up"}
                  </label>
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="admin-form-field">
              <label className="admin-label">
                Post text <span className="admin-optional">(empty = title + description)</span>
              </label>
              <textarea
                className="admin-textarea"
                rows={5}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setConfirming(false);
                }}
                placeholder={project.description ? `${project.title}\n\n${project.description}` : project.title}
              />
              <p className="admin-hint">Each platform adds the link and hashtags, and X trims to 280 characters.</p>
            </div>

            <div className="admin-form-actions" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="admin-btn admin-btn-ghost" onClick={preview} disabled={busy || selected.length === 0}>
                Preview
              </button>
              <button
                className={`admin-btn ${confirming ? "admin-btn-danger" : "admin-btn-primary"}`}
                onClick={publish}
                disabled={busy || selected.length === 0}
              >
                {busy ? "Working…" : confirming ? `Confirm: post publicly to ${selected.length}` : "Publish"}
              </button>
            </div>
          </>
        )}

        {/* Dry-run previews */}
        {previews.length > 0 && results.length === 0 && (
          <div className="admin-form-section" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p className="admin-section-title">Preview · links to {link}</p>
            {previews.map((p) => (
              <div key={p.platform}>
                <p className="admin-label">{labelOf(p.platform)}</p>
                <pre className="admin-textarea" style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: 12 }}>
                  {p.text}
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="admin-form-section" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p className="admin-section-title">Results</p>
            {results.map((r) => (
              <div key={r.platform} style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <strong style={{ minWidth: 110 }}>{labelOf(r.platform)}</strong>
                <span style={{ color: STATUS_COLOR[r.status], textTransform: "uppercase", fontSize: 11, fontWeight: 700 }}>
                  {r.status}
                </span>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
                    Open ↗
                  </a>
                )}
                {r.message && <span className="admin-hint" style={{ flexBasis: "100%" }}>{r.message}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
