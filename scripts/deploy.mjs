/**
 * Manual deploy to the `gh-pages` branch.
 *
 * Exists because GitHub Actions is unavailable on this account (billing
 * lock), while branch-based Pages still works fine. Once Actions is usable
 * again, `.github/workflows/deploy.yml` takes over and this becomes optional.
 *
 * Approach: initialise a throwaway repo inside `out/`, push it as an orphan
 * `gh-pages`, then delete it. The real repo's index, branch and working tree
 * are never touched, so this can't leave your source checkout in a strange
 * state if it fails halfway.
 *
 *   npm run deploy
 */
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const BRANCH = "gh-pages";

const run = (args, cwd) =>
  execFileSync("git", args, { cwd, stdio: "pipe", encoding: "utf8" }).trim();

function fail(message) {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

// --- preflight -------------------------------------------------------------

try {
  execFileSync("git", ["--version"], { stdio: "ignore" });
} catch {
  fail("git isn't on your PATH. Open a new terminal, or install it from git-scm.com.");
}

if (!existsSync(outDir)) {
  fail("No out/ directory. Run `npm run build` first.");
}

for (const required of ["index.html", "CNAME", ".nojekyll"]) {
  if (!existsSync(join(outDir, required))) {
    fail(
      `out/${required} is missing — refusing to deploy.\n` +
        (required === "CNAME"
          ? "    Without it the custom domain reverts to *.github.io."
          : required === ".nojekyll"
            ? "    Without it Jekyll strips _next/, breaking every script and style."
            : "    The build looks incomplete."),
    );
  }
}

// Resolve the push URL from the real repo so credentials and remote stay
// in one place rather than being hardcoded here.
let remote;
try {
  remote = run(["remote", "get-url", "origin"], root);
} catch {
  fail("No `origin` remote configured on this repository.");
}

// --- publish ---------------------------------------------------------------

// Clear any leftovers from an interrupted previous run.
rmSync(join(outDir, ".git"), { recursive: true, force: true });

console.log(`\n  Publishing out/ to ${BRANCH} on ${remote}`);

try {
  run(["init", "-q", "-b", BRANCH], outDir);
  // Reuse the parent repo's identity so commits aren't attributed oddly.
  for (const key of ["user.name", "user.email"]) {
    try {
      run(["config", key, run(["config", key], root)], outDir);
    } catch {
      // Falls back to the machine's global identity.
    }
  }

  run(["add", "-A"], outDir);
  run(["commit", "-q", "-m", `Deploy ${new Date().toISOString()}`], outDir);
  // Force: this branch is build output, so its history is disposable.
  run(["push", "--force", "--quiet", remote, `${BRANCH}:${BRANCH}`], outDir);

  console.log(`  ✓ Pushed to ${BRANCH}\n`);
} catch (error) {
  const detail = error.stderr?.toString().trim() || error.message;
  fail(`Deploy failed:\n\n${detail}`);
} finally {
  // Always clean up, so out/ stays a plain build artefact.
  rmSync(join(outDir, ".git"), { recursive: true, force: true });
}
