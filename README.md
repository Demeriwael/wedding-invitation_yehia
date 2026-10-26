# Wedding invitation

Arabic wedding invitation built with React and Vite.

## Local preview

Use Node.js 22 or later and the pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The envelope opening lasts 3.8 seconds: seal release, flap unfolding, invitation
lift, and page reveal. Visitors who prefer reduced motion get a short transition.

## Cloudflare Workers deployment

The existing Worker is `wedding-invitation-yehia`. Its Git integration deploys
pushes to `main` with these settings:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Build command | `pnpm run build` |
| Deploy command | `npx wrangler deploy` |

`wrangler.jsonc` explicitly serves `dist/public` as a single-page application.
The Express bundle in `dist/index.js` is for Node hosting and is not the Worker
entrypoint. No Cloudflare Vite plugin or automatic project setup is needed.

Validate locally before pushing:

```sh
pnpm check
pnpm build
pnpm exec wrangler deploy --dry-run
```

For a manual deployment from an authenticated local environment:

```sh
pnpm build
pnpm exec wrangler deploy
```

The unused analytics placeholder was removed because no analytics endpoint or
website ID was configured.
