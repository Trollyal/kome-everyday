# Kome · Everyday, your way

A small, iPhone-first companion for flexible Japanese-inspired meals and returning to strength training. The entire interface, calculations, reference data and app logic live in **one self-contained `index.html`**. No framework, install step, server, account, analytics, remote database or API is needed.

**[Open Kome](https://trollyal.github.io/kome-everyday/)** · [Automatic deployment](https://github.com/Trollyal/kome-everyday/actions/workflows/pages.yml)

## Use it

- **Today:** choose a meal, keep the familiar rice/chicken foundation, try a transparent portion preset and see the real two-meal arithmetic. Add optional daily snacks below.
- **Meals:** edit either meal independently. The three vegetable tiers add together; rice and chicken stay fixed unless you explicitly change them. Each slider has a synchronized numeric input. See the ingredient breakdown, pantry picker and quick mixes, or copy one meal to both slots.
- **Cook this:** get weighed ingredients and short cooking steps. Nabe and the small-cooker experiment have distinct guidance. Chicken must reach **74°C** in its thickest pieces. Cooker capacity is not verified, and no universal water amount is prescribed.
- **Move:** open A or B, choose equipment-friendly alternatives, optionally check two sets and note a session or walking minutes. No schedule, streak or required tracking.
- **Guide:** plan 1–14 two-meal days, copy shopping quantities, divide a chicken pack into freezer portions, and consult storage, rice measures and sources.
- **Settings:** follow the device theme or choose light/dark, edit or hide provisional targets, replace generic nutrition with product labels, export/import backups, or reset data.

The generic starting meal is **75 g dry rice + 175 g raw boneless skinless chicken thigh + 400 g standard-tier raw vegetables + 5 g oil**, approximately **735 kcal and 42 g protein**. Two such meals are about **1,470 kcal and 84 g protein before snacks**. These estimates do not automatically meet an energy or protein reference. Targets are adjustable starting estimates, not a prescription. Nutrition can vary substantially by product and preparation.

## iPhone Home Screen and offline use

1. Open the deployed **HTTPS** site in Safari while connected.
2. Use **Share → Add to Home Screen** (Share may be within the More menu).
3. Enable **Open as Web App** if shown, then tap **Add**.
4. Open Kome and wait for **“Ready for offline visits”** at the bottom. Reopen once while connected if it asks you to finish setup.
5. Try opening it in airplane mode before relying on it away from a connection.

The optional `manifest.webmanifest` and install icons supply app metadata. A tiny `sw.js` caches only the static shell, using relative URLs compatible with a GitHub Pages project subpath. Later offline navigations fall back to the cached app. External source links still require a connection. Cache and storage retention are controlled by the browser/OS and cannot be guaranteed indefinitely. Shell updates install together and activate after old app tabs are closed; reopen online to receive them.

Safari-specific installation, safe-area appearance and standalone-mode lifecycle need a real iPhone check. Chromium viewport emulation does not prove iOS Safari behavior. See [Apple’s installation guide](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios).

## Local file and development

Download just `index.html` and open it in a browser that supports local HTML. The app’s UI, artwork and calculators are inline and work without a network. `file://` storage support varies; a visible notice appears if saving is denied. A local HTML file **cannot register a service worker**, and downloading it is not a dependable route to installing an iPhone Home Screen app.

For full localhost behavior, from this folder run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. No package installation or build is needed. Make changes directly to `index.html`. If the shell changes, also increment the cache version in `sw.js` so offline users receive a consistent update. Other files are optional install/offline support, docs, tests and deployment configuration.

## Privacy and backups

All selections and optional exercise entries stay in `localStorage` on the current origin/device. Nothing is submitted remotely. Visiting the public host still makes ordinary static web requests to GitHub; Kome adds no analytics or third-party requests. Source links open only on request.

Use **Settings → Export backup** to download a versioned JSON file. Keep it privately, such as in Files/iCloud Drive. On another phone or browser, use **Import backup**, inspect the confirmation and choose whether to replace existing data. Invalid, oversized, non-finite, out-of-range and incompatible backups are rejected before any replacement. Imported display strings are discarded; app labels are never taken from JSON. Exported data includes meals, snacks, theme, assumptions, pantry, shopping settings, exercise choices, set checks and session entries.

A Safari tab and Home Screen app may have separate storage. Export from the context you actually use, and import into the new one. Browser cleanup, reinstalling, moving origins and private-browsing sessions may lose data. If saving is unavailable, calculators remain usable and export still works for the current session. Do not commit exported backups or private context; `.gitignore` excludes common backup/handoff names, and the Pages workflow stages only an explicit list of public runtime files.

## Tests and deployment

Node.js is needed only for development tests, not for running the app:

```sh
node --test tests/core.test.cjs
```

If the environment restricts test subprocesses:

```sh
node --test --test-isolation=none tests/core.test.cjs
```

The tests extract and execute the actual inline math/validation code. They cover the meal and snack arithmetic, independent vegetable tiers, fixed anchors, editable assumptions, pack remainders, zero/max boundaries, backup round trips, invalid input, untrusted labels, relative service-worker registration and shell assets. They add no runtime dependency.

Release verification: all 12 core tests passed. Browser checks passed locally and on the hosted HTTPS site in Chromium at 320, 375, 390, 430, 768 and 1100 px, including both themes, reduced motion, keyboard slider input, labeled controls, backup export/import and rejection, resets, clipboard fallback, storage denial, standalone-file use and offline reload under the real project subpath. No application console errors were observed. Real-device iPhone/Safari and screen-reader testing remain unverified.

The GitHub Actions workflow tests `main`, stages only `index.html`, `sw.js`, manifest, icons and `.nojekyll`, then deploys with official Pages actions. In **Settings → Pages**, choose **GitHub Actions** as the source. Subsequent pushes to `main` publish automatically after checks pass. A new public repository and Pages site can also be initialized with:

```sh
gh repo create YOUR_ACCOUNT/UNUSED_NAME --public --source=. --remote=origin
git push -u origin main
gh api --method POST repos/YOUR_ACCOUNT/UNUSED_NAME/pages -f build_type=workflow
gh workflow run pages.yml
```

This recipe requires your configured GitHub authorization; no credentials belong in the source. The app does not rely on a particular account or hardcoded deployment path.

## Sources and limitations

- [USDA FoodData Central](https://fdc.nal.usda.gov/): generic food composition. The initial values are rounded planning references, not claims of identical composition for every product. Raw chicken trimming, sauces, skyr and whey vary; use the package label. Vegetable tiers (25 / 40 / 85 kcal per 100 g) are intentional averages. Listed kcal need not equal 4P + 4C + 9F because of rounding, fibre conventions and reference variation.
- [USDA chicken storage and preparation](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/poultry/chicken-farm-table): poultry temperature, chilling and thawing. Raw chicken/marinade lasts only 1–2 days at ≤4°C, or the earlier package use-by; freeze promptly. Never delay-start raw poultry.
- [Food Standards Agency rice guidance](https://www.gov.uk/government/publications/home-food-fact-checker/home-food-fact-checker#rice): cool rice ideally within an hour, refrigerate, consume within 24 hours and reheat once until steaming throughout. A mixed rice/chicken meal follows this stricter rice rule.
- [WHO physical activity guidelines](https://www.who.int/publications/i/item/9789240015128): build gradually towards 150–300 minutes of moderate movement and strengthening on at least two days. The A/B plan is a general starting template with equipment alternatives, not injury rehabilitation.
- [MDN service workers](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) and [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): hosted offline behavior and deployment.

The small Siguro RC-R301W cooker guidance is deliberately a **capacity experiment**, not a manufacturer-verified procedure. Its allowed minimum batch, water requirements and suitability for mixed dishes must come from the manual and your own safe testing. Prefer separately precooked chicken for late-addition programmes; never assume a late CLAYPOT prompt safely cooks raw poultry. Use a food thermometer.

Clipboard and download APIs can vary by Safari context. A text-selection dialog is provided when automatic copying is unavailable. Import/export provides portability without a server. Kome intentionally has no weigh-in, body measurements, notifications, account, running programme or moral score for food.
