# Project History

Patch-note style notes for the major changes made during the Windows XP portfolio migration.

## 2026-06-30

### Resume And Publications Refresh

- Updated the embedded XP resume window to match the latest `Resume 2026.docx` wording, ordering, education details, and project bullets.
- Re-exported the downloadable resume PDF at `public/assets/resume/Brandon-Han-Resume-2026.pdf`.
- Added a Windows XP-style `Publications` desktop folder with five verified research publication links.
- Added an Explorer-inspired publications window with menu, toolbar, address bar, task pane, scrollable publication shortcuts, and a status bar.
- Added a local `publications.svg` folder icon so the desktop reads as an XP folder without pulling in external assets.
- Improved desktop icon placement so newly added icons avoid overlapping a returning visitor's existing `localStorage` icon positions.

### Verification Notes

- Rebuilt the site with `npm run build`.
- Browser-checked the Publications folder locally on desktop and mobile viewport widths.
- Confirmed the Publications folder renders all five links with the expected publisher/preprint URLs.

## 2026-06-03

### Desktop Interactions And XP Apps

- Added movable desktop icons on desktop/fine-pointer viewports, including persisted per-browser icon positions through `localStorage`.
- Added Windows-style drag selection on the desktop so users can highlight multiple icons with a cursor selection box.
- Kept mobile intentionally touch-native: desktop icons stay tap-friendly, windows remain fullscreen, and desktop-only drag/selection behavior is disabled on phone-sized/coarse-pointer screens.
- Added a reusable interactive app lifecycle hook for XP windows so apps can mount behaviors and clean up timers/listeners when closed or when the shell is restarted.
- Added XP-style Paint with canvas drawing, colors, tool selection, brush sizing, undo/redo, clear, and image save support.
- Added XP-style Minesweeper with Beginner/Intermediate/Expert presets, first-click-safe generation, flagging, chording, timer, mine counter, reset states, and a mobile-friendly flag mode.
- Added small local SVG icons for Paint and Minesweeper without adding runtime dependencies or large media assets.

### Security And Privacy Cleanup

- Removed the phone number from the visible resume window mockup and Contact Me window, including the `tel:` link.
- Confirmed the built site no longer renders the phone number in the XP Resume or Contact windows.
- Ran a quick security pass covering dependency audit, contact endpoint behavior, risky frontend patterns, and build output searches.
- Tightened the contact endpoint debug path so optional debug responses no longer expose sender or recipient email addresses in public JSON.
- Verified the downloadable resume PDF still contains the phone number and intentionally left that PDF asset unchanged for a later resume-file refresh.

### Verification Notes

- Rebuilt the site with `npm run build`.
- Ran `npm audit --audit-level=moderate` and confirmed `0 vulnerabilities`.
- Ran `git diff --check` and confirmed no whitespace errors.
- Browser-checked desktop icon dragging, icon position persistence after reload, drag selection, Start menu app launch, Paint, Minesweeper, mobile fullscreen windows, and mobile Minesweeper flag mode.

## 2026-05-29

### Contact Form With Resend

- Replaced the Contact Me form's `mailto:` submit behavior with a Vercel serverless endpoint at `api/contact.js`.
- Added `resend` as a production dependency and set the project Node engine to `>=20`.
- Added form validation for visitor email and message content before calling the endpoint.
- Added a hidden honeypot field named `company` to quietly ignore simple bot submissions.
- Configured the endpoint to send portfolio messages to `brandonh4n@gmail.com` through Resend with the visitor's email as `Reply-To`.
- Added server-side request size limits, malformed JSON handling, and generic public error responses.
- Added defensive environment-variable normalization so pasted quotes or `KEY=` prefixes in Vercel settings do not break the endpoint.
- Added defensive sender normalization after Resend rejected the initial `From` value; the endpoint now extracts a valid sender from `CONTACT_FROM_EMAIL` or falls back to `contact@thehanbrand.dev`.
- Confirmed live Resend delivery with successful deployed endpoint responses of `{"ok":true}`.

### Resend DNS And Vercel Setup

- Added Resend DNS records for `thehanbrand.dev` in Namecheap.
- Confirmed the Resend domain reached verified status and is ready to send email.
- Added the production Vercel environment variables for Resend contact delivery:
  - `RESEND_API_KEY`
  - `CONTACT_TO_EMAIL`
  - `CONTACT_FROM_EMAIL`
- Added optional debug support through `CONTACT_DEBUG_ERRORS`, intended only for temporary troubleshooting.

### Contact And Profile Link Fixes

- Updated the Start menu GitHub link to `https://github.com/hanbrand`.
- Updated the resume window and Contact Me window GitHub links to `https://github.com/hanbrand`.
- Verified the embedded PDF GitHub link already pointed to `https://www.github.com/hanbrand/`.
- Added a welcome-screen prompt directing users to click the profile icon to explore.
- Removed the visible About Me reference to the removed My Projects desktop item.
- Confirmed the Contact Me form renders correctly in the XP window and shows friendly success/error status text.

### Resume And About Updates

- Replaced the website resume PDF with the revised `Resume 2026.pdf` from Google Drive.
- Verified the copied PDF hash matched the source file.
- Updated the About Me copy to describe chaotic data pipelines, applied AI, LLM bias auditing, and agent workflows/tools.
- Rebuilt and redeployed the site after the resume and About copy updates.

### Boot Experience

- Replaced the static-looking boot loading image with a CSS-based animated XP-style loading bar.
- Verified the boot loader visibly moves on both local preview and the live deployment.
- Kept the Windows XP login flow and startup sound behavior intact.

## 2026-05-28

### Windows XP Portfolio Migration

- Archived the old retro resume website before replacing it:
  - Branch: `archive/retro-site-2026-05-28`
  - Tag: `old-site-before-xp-migration-2026-05-28`
  - Local bundle: `retro-resume-portfolio-before-xp-2026-05-28.bundle`
- Replaced the old React/shadcn retro resume app in `Resume Website/retro-resume-portfolio` with the drafted Windows XP portfolio from `Windows XP Resume`.
- Preserved the existing GitHub repo and deployment identity so the current Vercel project and live domain could continue to work.
- Copied only deployable XP source files and public assets, excluding `node_modules`, `dist`, and draft-only source folders.
- Verified the migrated site locally with production build and browser checks.
- Pushed the replacement to `main`, allowing Vercel to deploy the XP portfolio to:
  - `https://www.thehanbrand.dev`
  - `https://thehanbrand.dev`

### Verification Notes

- Repeatedly verified production builds with `npm run build`.
- Ran `npm audit --audit-level=moderate` after dependency changes and confirmed `0 vulnerabilities`.
- Used the local preview server and browser checks for the boot flow, login screen, desktop icons, Start menu, resume window, contact window, mobile viewport, and key asset loading.
- Confirmed live Vercel deployments after each major change.
