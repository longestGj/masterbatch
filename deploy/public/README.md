# Public IP preview: 152.70.109.64

On 2026-10-02 the owner directed that the server be open to everyone. The in-progress homepage is available at `https://152.70.109.64/`, and the owner subsequently authorized the About page at `https://152.70.109.64/about/`. The existing `www.gemasterbatch.com` site and its DNS were not changed. This is public access to the current preview, not acceptance of the incomplete buyer journeys or `RELEASED` Page Specs.

The Ubuntu host uses Nginx for HTTPS and proxies to the same WordPress Compose project on `127.0.0.1:18087`. The MariaDB port is private. Oracle Cloud ingress and the host firewall permit TCP 80/443. Port 80 serves Let's Encrypt challenges and redirects other requests to HTTPS. The IP certificate is issued by Let's Encrypt and has a six-day lifetime; the Certbot snap renewal timer and a deploy hook that reloads Nginx are installed. The WordPress administrator password was rotated before exposure; its private copy is in `.local/public-admin-credentials.txt` on the owner's Windows workspace, outside Git.

The public URL was changed with WP-CLI serialized `search-replace` from `http://127.0.0.1:18087` to `https://152.70.109.64` after a dry run, skipping GUIDs. The paired pre-change backup is under `/srv/ge-acceptance/backups/pre-public-20261002/`; a post-change snapshot is under `/srv/ge-acceptance/backups/public-20261002/` and was also copied to the ignored local `backups/public-20261002/` directory. Both downloaded file hashes match the server copies. The source snapshot and Theme bundle remain available separately. Preserve any editor changes and back up current data before any future import or rollback.

Current safeguards remain deliberate: noindex/nofollow, disabled sitemap, intercepted mail and no working inquiry receiver. These are not production release checks. Public visitors can reach homepage links that lead to unbuilt pages; the P001 local review recorded 22 planned paths returning 404. No contact form or document delivery is asserted.

Public smoke checks: HTTPS certificate accepted by a browser without bypassing TLS validation; homepage HTTP 200, nine modules, one H1, images present and no horizontal overflow at 1440/768/390px; canonical points to the HTTPS IP; admin login with the rotated password passed; unknown page and sitemap returned 404. Certbot's simulated renewal and deploy hook succeeded. See P001 for scope and limitations.

The About page was added later on 2026-10-02 with `deploy/public/prepare-about.cjs` and `deploy/public/import-about.php`. The import checks exact page/media identity and refuses adoption of an existing slug or stable page record. A separate pre/post database, uploads and Theme snapshot is in `/srv/ge-acceptance/backups/pre-about-20261002/` and `/srv/ge-acceptance/backups/post-about-20261002/`; verified post-deploy copies are in ignored local `backups/post-about-20261002/`. The public page and editor passed scoped checks, but its five body destinations currently return 404. See P003 for the observed scope and limits.

Operational checks:

```sh
sudo docker compose -f /srv/ge-acceptance/compose.yaml ps
sudo nginx -t
sudo systemctl status snap.certbot.renew.timer
sudo /snap/bin/certbot renew --dry-run --run-deploy-hooks
```

The public Nginx site configuration is `deploy/public/nginx.conf`, installed at `/etc/nginx/sites-available/ge-public`. The reload hook is `deploy/public/reload-nginx.sh`, installed at `/etc/letsencrypt/renewal-hooks/deploy/ge-nginx-reload.sh`. If renewal or HTTPS fails, fix those before promoting new content. Do not reset database volumes or re-import the old acceptance snapshot over live editor changes.
