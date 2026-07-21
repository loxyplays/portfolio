"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  clearToken,
  getToken,
  loadContent,
  latestDeployRun,
  saveContent,
  setToken as persistToken,
  verifyToken,
  REPO_OWNER,
  REPO_NAME,
  type GitHubUser,
} from "@/lib/github";
import type { SiteContent } from "@/lib/data";
import { Button, Field, TextInput } from "@/components/admin/Fields";
import {
  SiteEditor,
  AboutEditor,
  ProjectsEditor,
  SkillsEditor,
  ExperienceEditor,
  ContactEditor,
} from "@/components/admin/Editors";

/**
 * Content editor for the site.
 *
 * There is no backend — the site is a static export. Saving commits
 * `content/content.json` to the repo via the GitHub API, which triggers the
 * deploy workflow. Edits therefore go live in about a minute, not instantly,
 * and the panel says so rather than pretending otherwise.
 */

const TABS = [
  { id: "site", label: "Site" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type DeployRun = {
  status: string;
  conclusion: string | null;
  html_url: string;
} | null;

export default function AdminPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);

  const [content, setContent] = useState<SiteContent | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const [tab, setTab] = useState<TabId>("site");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ url: string } | null>(null);
  const [deploy, setDeploy] = useState<DeployRun>(null);

  /* ---------------------------------------------------------------- */
  /* Session                                                           */
  /* ---------------------------------------------------------------- */

  const boot = useCallback(async (t: string) => {
    setBusy(true);
    setError(null);
    try {
      const u = await verifyToken(t);
      const { data, sha: fileSha } = await loadContent<SiteContent>(t);
      setUser(u);
      setContent(data);
      setSha(fileSha);
      setTokenState(t);
      persistToken(t);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setTokenState(null);
    } finally {
      setBusy(false);
    }
  }, []);

  // Restore a previous session. localStorage is client-only, hence the effect.
  useEffect(() => {
    const stored = getToken();
    if (stored) void boot(stored);
  }, [boot]);

  // Warn before losing unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const signOut = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
    setContent(null);
    setSha(null);
    setDirty(false);
  };

  /* ---------------------------------------------------------------- */
  /* Editing                                                           */
  /* ---------------------------------------------------------------- */

  const update = (patch: Partial<SiteContent>) => {
    setContent((prev) => (prev ? { ...prev, ...patch } : prev));
    setDirty(true);
    setSaved(null);
  };

  const save = async () => {
    if (!token || !content || !sha) return;
    setBusy(true);
    setError(null);
    try {
      const res = await saveContent(
        token,
        content,
        sha,
        `Update site content via admin panel`,
      );
      setSha(res.sha);
      setDirty(false);
      setSaved({ url: res.commitUrl });

      // Give Actions a moment to register the run, then start reporting on it.
      window.setTimeout(async () => {
        const run = await latestDeployRun(token);
        setDeploy(run);
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setBusy(false);
    }
  };

  const refreshDeploy = async () => {
    if (!token) return;
    setDeploy(await latestDeployRun(token));
  };

  /* ---------------------------------------------------------------- */
  /* Sign-in                                                           */
  /* ---------------------------------------------------------------- */

  if (!token || !content) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-bright">
          Site admin
        </h1>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
          Edits are committed to{" "}
          <span className="text-bright">
            {REPO_OWNER}/{REPO_NAME}
          </span>{" "}
          and published by the deploy workflow.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <Field
            label="GitHub personal access token"
            hint="Stored in this browser only. Never sent anywhere except github.com."
          >
            <TextInput
              type="password"
              value={tokenInput}
              placeholder="github_pat_..."
              onChange={setTokenInput}
            />
          </Field>

          {error && (
            <p className="mt-4 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.8125rem] leading-relaxed text-bright/80">
              {error}
            </p>
          )}

          <div className="mt-5">
            <Button
              variant="primary"
              disabled={busy || tokenInput.trim().length < 10}
              onClick={() => void boot(tokenInput.trim())}
            >
              {busy ? "Checking…" : "Unlock"}
            </Button>
          </div>
        </div>

        <details className="mt-6 text-[0.8125rem] text-muted">
          <summary className="cursor-pointer text-bright">
            How to create the token
          </summary>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
            <li>
              Open{" "}
              <a
                className="text-bright underline underline-offset-4"
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fine-grained tokens → Generate new
              </a>
              .
            </li>
            <li>
              Under <strong>Repository access</strong>, choose{" "}
              <em>Only select repositories</em> and pick{" "}
              <strong>
                {REPO_OWNER}/{REPO_NAME}
              </strong>
              .
            </li>
            <li>
              Under <strong>Permissions → Repository permissions</strong>, set{" "}
              <strong>Contents</strong> to <em>Read and write</em>. Add{" "}
              <strong>Actions</strong> as <em>Read-only</em> if you want deploy
              status here. Leave everything else alone.
            </li>
            <li>Generate, copy, and paste it above.</li>
          </ol>
          <p className="mt-3 leading-relaxed text-faint">
            Scoping it to this one repository matters: the token lives in this
            browser&apos;s localStorage, so if it ever leaked, the worst anyone
            could do is edit this site. Revoke it any time from the same page.
          </p>
        </details>
      </main>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Editor                                                            */
  /* ---------------------------------------------------------------- */

  const editorProps = { content, update };

  return (
    <main className="min-h-screen pb-24">
      {/* Toolbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-void/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-bright text-[0.625rem] font-bold text-void">
              {content.site.initials}
            </span>
            <span className="text-[0.875rem] font-semibold text-bright">Admin</span>
          </div>

          {dirty && (
            <span className="rounded-full border border-white/15 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.1em] text-muted">
              Unsaved
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="text-[0.75rem] text-dim transition-colors hover:text-bright"
            >
              View site
            </Link>
            {user && (
              <span className="hidden text-[0.75rem] text-faint sm:inline">
                {user.login}
              </span>
            )}
            <Button onClick={signOut}>Sign out</Button>
            <Button variant="primary" disabled={busy || !dirty} onClick={() => void save()}>
              {busy ? "Saving…" : "Save & publish"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-4xl overflow-x-auto px-5 pb-2">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors " +
                  (tab === t.id
                    ? "bg-bright text-void"
                    : "text-muted hover:bg-white/[0.06] hover:text-bright")
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-6">
        {/* Status messages */}
        {error && (
          <p className="mb-5 rounded-xl border border-white/20 bg-white/[0.05] px-4 py-3 text-[0.8125rem] leading-relaxed text-bright/85">
            {error}
          </p>
        )}

        {saved && (
          <div className="mb-5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[0.8125rem] text-muted">
            <p className="text-bright">Saved and building.</p>
            <p className="mt-1 leading-relaxed">
              Changes appear on the live site in about a minute, once the deploy
              finishes.{" "}
              <a
                href={saved.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bright underline underline-offset-4"
              >
                View commit
              </a>
              {deploy && (
                <>
                  {" · "}
                  <a
                    href={deploy.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bright underline underline-offset-4"
                  >
                    Deploy: {deploy.conclusion ?? deploy.status}
                  </a>
                </>
              )}{" "}
              <button
                type="button"
                onClick={() => void refreshDeploy()}
                className="text-dim underline underline-offset-4 hover:text-bright"
              >
                refresh
              </button>
            </p>
          </div>
        )}

        {tab === "site" && <SiteEditor {...editorProps} />}
        {tab === "about" && <AboutEditor {...editorProps} />}
        {tab === "projects" && <ProjectsEditor {...editorProps} />}
        {tab === "skills" && <SkillsEditor {...editorProps} />}
        {tab === "experience" && <ExperienceEditor {...editorProps} />}
        {tab === "contact" && <ContactEditor {...editorProps} />}
      </div>
    </main>
  );
}
