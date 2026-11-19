<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Build manager CSV exports with the browser-safe report-csv module; quote cells and neutralize formula prefixes to safely export user-entered data.
- Gate every ad tag (Meta Pixel in src/lib/meta-pixel.ts) on `canTrack("advertising")` from src/lib/consent.ts; the banner and settings live in src/components/app/cookie-banner.tsx so visitor choices control all tracking in one place.
- App email uses the managed synchronous send helper and a fixed per-feature template; never create an email queue or generic sending endpoint, to keep recipients and delivery handling controlled.
