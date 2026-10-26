# Wedding invitation

Arabic wedding invitation built with React and Vite.

## Local preview

Use Node.js 22 or later and the pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The envelope matches the supplied ivory and gold stationery reference. The
opening lasts 1.9 seconds: the seal and flap open directly onto the actual
invitation, without an intermediate card. Visitors who prefer reduced motion get a
short transition. Artwork is bundled locally and the envelope layers use SVG
clipping and CSS animation.

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
