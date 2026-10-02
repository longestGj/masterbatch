# GE acceptance preview on 152.70.109.64

This is an internal review copy of the in-progress P001 homepage. The existing domain and its current site are unchanged.

## Access

The Ubuntu server runs `ge-masterbatch-acceptance` from `/srv/ge-acceptance`. WordPress binds only to `127.0.0.1:18087` on that server. From the owner's Windows computer, start a tunnel and leave it running:

```powershell
ssh -N -L 127.0.0.1:18087:127.0.0.1:18087 -i "$env:USERPROFILE/.ssh/1901-GE-deploy.key" -o BatchMode=yes -o ExitOnForwardFailure=yes ubuntu@152.70.109.64
```

Then visit `http://127.0.0.1:18087/` or `/wp-admin/`. The admin account is the same one in this project's private local `.env` at the time of the 2026-10-02 snapshot. The browser address is loopback because the SSH tunnel carries traffic to the server IP. The server firewall and Compose port binding do not expose the review site to the public Internet.

Stop the tunnel with Ctrl+C in its terminal. Stopping it does not stop the server containers.

## Current snapshot and recovery

The initial restore used the local `backups/staging-source-20261002-191404/` SQL and uploads archives and the matching Theme/mu-plugin bundle under `backups/acceptance-bundle-20261002-1920/`. These ignored local paths contain private data. The server has a private copy of the source SQL, uploads archive, Theme and Compose configuration under `/srv/ge-acceptance`. Do not put these archives or `.env` in Git.

The database URL was changed with WP-CLI from `http://127.0.0.1:18086` to `http://127.0.0.1:18087`, skipping GUIDs. Local protections remain active: `SITE_STARTER_LOCAL`, mail interception, noindex/nofollow and disabled sitemap.

For a later refresh, first back up the current acceptance database and uploads together, preserve any edits made in its editor, and compare them with the new source snapshot. Do not re-import the original SQL over editor changes. Before a restore, inspect the exact server project and volume identities; do not use `down -v`.

## Checks on 2026-10-02

- Remote containers: database healthy; WordPress running on loopback port 18087.
- Homepage: HTTP 200, nine modules, one H1, all images loaded, expected title and canonical, no old port URLs, no horizontal overflow at 1440/768/390px.
- Admin login: successful through the tunnel; missing page: HTTP 404.
- Review protection: `X-Robots-Tag: noindex, nofollow` and matching robots meta.

P001 remains `BUILDING`. Product/detail/document destinations, inquiry handling, final visual approval, public URL migration and public release are not accepted by this preview.
