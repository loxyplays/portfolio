/**
 * Minimal GitHub Contents API client for the admin panel.
 *
 * The site is a static export with no backend, so "saving" means committing
 * `content/content.json` straight to the repo. The push triggers the existing
 * Actions workflow, which rebuilds and publishes — changes are live in roughly
 * a minute rather than instantly.
 *
 * Auth is a fine-grained personal access token supplied by the user and kept
 * in localStorage. That is the only option available to a page with no server
 * (GitHub's OAuth device flow can't be completed from a browser — its token
 * endpoint sends no CORS headers). Scope the token to this one repository with
 * Contents: read and write and nothing else, so a leaked token can do no more
 * than edit this site's copy.
 */

export const REPO_OWNER = "loxyplays";
export const REPO_NAME = "portfolio";
export const CONTENT_PATH = "content/content.json";
export const BRANCH = "main";

const API = "https://api.github.com";
const TOKEN_KEY = "portfolio-admin-token";

export type GitHubUser = { login: string; avatar_url: string };

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/** Turn a GitHub error response into something worth showing a human. */
async function describeError(res: Response, fallback: string) {
  let detail = "";
  try {
    const body = (await res.json()) as { message?: string };
    detail = body.message ?? "";
  } catch {
    /* non-JSON error body */
  }

  if (res.status === 401) {
    return "That token was rejected. It may be expired, revoked, or mistyped.";
  }
  if (res.status === 403) {
    return `Token lacks permission. It needs "Contents: Read and write" on ${REPO_OWNER}/${REPO_NAME}.${detail ? ` (${detail})` : ""}`;
  }
  if (res.status === 404) {
    return `Couldn't find ${REPO_OWNER}/${REPO_NAME}. If the token is fine-grained, check this repo is in its "Repository access" list.`;
  }
  if (res.status === 409) {
    return "The file changed on GitHub since you loaded it. Reload the page to pick up the newer version before saving.";
  }
  return detail ? `${fallback}: ${detail}` : fallback;
}

/** Verify a token and return who it belongs to. */
export async function verifyToken(token: string): Promise<GitHubUser> {
  const res = await fetch(`${API}/user`, { headers: headers(token) });
  if (!res.ok) throw new Error(await describeError(res, "Couldn't verify token"));
  return (await res.json()) as GitHubUser;
}

/**
 * Base64 helpers that survive non-ASCII.
 *
 * The content is full of em dashes and curly apostrophes, and raw `btoa`
 * throws on anything outside Latin-1 — so round-trip through UTF-8 bytes.
 */
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  // Chunked to avoid blowing the argument limit on large payloads.
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

function decodeBase64(b64: string): string {
  const binary = atob(b64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export type LoadedContent<T> = {
  data: T;
  /** Blob SHA — GitHub requires it to update the file, and it's how
   *  concurrent edits are detected rather than silently overwritten. */
  sha: string;
};

export async function loadContent<T>(token: string): Promise<LoadedContent<T>> {
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}?ref=${BRANCH}&t=${Date.now()}`,
    { headers: headers(token), cache: "no-store" },
  );
  if (!res.ok) throw new Error(await describeError(res, "Couldn't load content"));

  const body = (await res.json()) as { content: string; sha: string };
  return { data: JSON.parse(decodeBase64(body.content)) as T, sha: body.sha };
}

export async function saveContent<T>(
  token: string,
  data: T,
  sha: string,
  message: string,
): Promise<{ sha: string; commitUrl: string }> {
  const json = `${JSON.stringify(data, null, 2)}\n`;

  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}`,
    {
      method: "PUT",
      headers: { ...headers(token), "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: encodeBase64(json),
        sha,
        branch: BRANCH,
      }),
    },
  );

  if (!res.ok) throw new Error(await describeError(res, "Couldn't save"));

  const body = (await res.json()) as {
    content: { sha: string };
    commit: { html_url: string };
  };
  return { sha: body.content.sha, commitUrl: body.commit.html_url };
}

/** Most recent deploy run, so the panel can report when edits are live. */
export async function latestDeployRun(token: string) {
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/deploy.yml/runs?per_page=1&t=${Date.now()}`,
    { headers: headers(token), cache: "no-store" },
  );
  if (!res.ok) return null;

  const body = (await res.json()) as {
    workflow_runs: {
      status: string;
      conclusion: string | null;
      html_url: string;
      created_at: string;
    }[];
  };
  return body.workflow_runs?.[0] ?? null;
}
