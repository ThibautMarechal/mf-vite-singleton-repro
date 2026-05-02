# Reproduction: `excludeSharedSubDependencies` removes `singleton: true` packages

Minimal reproduction for [module-federation/vite#680](https://github.com/module-federation/vite/issues/680).

## The bug

`excludeSharedSubDependencies` is a dev-mode heuristic in `@module-federation/vite` that
auto-removes shared packages that are sub-dependencies of other shared packages, to prevent
initialization-order issues (e.g. `lit` + `lit-html`).

However, it has no guard for `singleton: true`, so it also removes packages the user
explicitly declared as singletons. In this repo, `company-sdk` lists `react` in its own
`dependencies`. When both `company-sdk` and `react` (with `singleton: true`) appear in the
MF shared config, `react` and `react-dom` are silently auto-excluded from the shared map.

The result: host and remote each load their own React instance, and any hook call from a
remote component (`useState`, `useContext`, etc.) throws:

```
Uncaught TypeError: Cannot read properties of null (reading 'useState')
```

## Structure

```
packages/
  company-sdk/       # simulates a company SDK — has "react" in its dependencies
apps/
  host/              # Vite host, loads RemoteButton via Module Federation
  remote/            # Vite remote, exposes Button.tsx (uses useState)
```

## Steps to reproduce

```bash
pnpm install

# Terminal 1 — start the remote on :5001
pnpm dev:remote

# Terminal 2 — start the host on :5173
pnpm dev:host
```

1. Open `http://localhost:5173` in the browser.
2. Open the browser console.
3. Observe the MF warning in the **terminal running the host**:
   ```
   [MF warn] "react" is a dependency of shared package "company-sdk" and is also
   shared separately. [...] Auto-excluding "react" from shared modules for dev mode.
   ```
4. The remote `<Button>` fails to render and the console shows a hook error.

## Expected behaviour

`react` and `react-dom` are declared `singleton: true` — they must never be
auto-excluded, regardless of what other shared packages list in their `dependencies`.

## Fix

Add a `singleton: true` guard alongside the existing `import: false` guard in
`excludeSharedSubDependencies`:

```diff
-if (shared[depKey]?.shareConfig.import === false) {
+if (shared[depKey]?.shareConfig.singleton === true || shared[depKey]?.shareConfig.import === false) {
   continue;
 }
```

See the fix PR: [module-federation/vite#681](https://github.com/module-federation/vite/pull/681)
