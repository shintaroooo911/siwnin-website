# Prompt for Claude Code: publish the Siwnin Productions website

> **For the website owner (日本語):** このファイルの内容をすべてコピーして、Claude Code に貼り付けてください。Claude が日本語で一つずつ案内します。パスワードやカードの情報を Claude に教える必要はありません。ログインはご自身で行います。

---

You are helping the owner of Siwnin Productions publish his company website. **He is not technical.** Guide him step by step, in **Japanese**, in plain words, one step at a time. After each step, tell him what you did and what comes next, and wait for him before moving on when he needs to do something.

## What you have

- The folder that contains this file is the finished website (static HTML, no build step). Japanese is the main site at `/`, English at `/en/`.
- Domain: **siwninproductions.com**. Its email (info@siwninproductions.com) runs on **Google Workspace**. This must keep working.
- Hosting: **Vercel** (free Hobby plan is enough).
- `README.md` in this folder explains the pages and files. Read it first.

## Safety rules (always follow)

1. **Never ask for, type, or store passwords, 2-step codes, or payment details.** When a login is needed, open the page or run the login command, then ask him to sign in himself in the browser and tell you when he's done.
2. **Never delete or change MX, TXT, SPF, DKIM or DMARC records** (or any record for `google._domainkey`, `mail`, or Google site verification). These run his email. You only add or change the two website records described below.
3. Before changing any DNS setting, ask him to take a **screenshot of the current DNS records** and keep it, so everything can be restored.
4. Explain each action before doing it. Ask for a clear "はい" before anything that changes his accounts, DNS or the live website.

## Step 1. Check the computer

- Check that Node.js is installed (`node -v`). If not, guide him to install the LTS version from nodejs.org, then check again.
- You'll use the Vercel command line with `npx vercel`, so nothing else needs installing.
- Work inside this website folder.

## Step 2. Fill in the missing content

Ask him for each item, then edit the files yourself. Show him the result.

1. **Privacy policy** in both `privacy/index.html` (Japanese) and `en/privacy/index.html` (English):
   - Replace `[所在地]` and `[Address]` with the business address (or the city and prefecture, if he prefers not to show a full address; ask).
   - Replace `[代表者名]` and `[Representative]` with the representative's name.
   - Replace the effective date (`2026年[月][日]` / `[Month] [Day], 2026`) with today's date.
   - The paragraph in square brackets about analytics: ask if he uses Google Analytics or another analytics tool. If **no**, delete that whole paragraph in both files. If **yes**, remove only the square brackets and the "if an analytics tool is used" lead-in.
2. **Hero photo (disco ball):** ask him for the photo file. Convert it to WebP, portrait 3:4, about 1200 px wide, and save it as `assets/img/hero-crowd-surf.webp`, replacing the old file. Keep the same file name.
3. **Instagram (optional):** if Siwnin has its own Instagram, add its URL inside `"sameAs": []` in the structured data near the top of `index.html` and `en/index.html`.
4. Check that no `[` placeholders are left: search all `.html` files for `[` and show him anything still pending.

## Step 3. Look at the site on his computer

Run a simple local server in this folder (for example `npx serve .`), open it in his browser and let him check the Japanese page, the English page (`/en/`) and the privacy pages. Fix anything he wants changed.

## Step 4. Create the Vercel account and publish

1. Ask him to create a free account at vercel.com (signing up with his Google account is easiest) and tell you when done.
2. Run `npx vercel login` and let him finish the login in the browser.
3. Run `npx vercel` in this folder. Answer the questions: set up and deploy = yes; project name = `siwnin-productions`; it's a static site with no build command and no output directory change (the folder itself is the output).
4. Open the preview link it gives you and check it with him.
5. When he's happy, run `npx vercel --prod`.

## Step 5. Connect the domain

1. Ask him to open vercel.com → the `siwnin-productions` project → **Settings → Domains**. Add `siwninproductions.com`. When Vercel asks, choose to also add `www.siwninproductions.com` and **redirect www to siwninproductions.com**.
2. Vercel will show the DNS records it needs. Usually:
   - `A` record, name `@` (the root), value `76.76.21.21`
   - `CNAME` record, name `www`, value `cname.vercel-dns.com`

   **Always use the exact values Vercel shows on that screen**, in case they differ.
3. Find where the domain's DNS is managed. Run `dig NS siwninproductions.com +short` (or `nslookup -type=NS siwninproductions.com`) and explain the result:
   - Names with `squarespace` or `googledomains`: DNS is at **Squarespace Domains** (Google Domains moved there). Guide him to domains.squarespace.com → the domain → **DNS**.
   - Other names (for example `cloudflare`, `onamae`, `xserver`, `sakura`): guide him to that provider's DNS settings page.
   - If he can't find it, he can check in Google Workspace Admin (admin.google.com) → **Account → Domains → Manage domains**, which shows where the domain is registered.
4. Before changing anything, have him take the screenshot from the safety rules.
5. In the DNS settings:
   - Add or edit the `A` record for `@` to the Vercel value. If there are other `A` or `AAAA` records for `@` (for example default "parking" or website-builder records), they must be removed, but **only those**. Confirm each one with him first.
   - Add or edit the `CNAME` for `www` to the Vercel value.
   - **Do not touch MX or TXT records.**
   - On Squarespace Domains there may be a "Squarespace Defaults" or "Google Workspace" preset group. Leave the Google Workspace preset alone. Only remove website-related defaults that point `@` or `www` somewhere else, after confirming with him.
6. Go back to Vercel → Domains and wait until both domains show **Valid Configuration**. This can take from a few minutes up to a few hours. Vercel adds HTTPS automatically.

## Step 6. Check everything works

- `dig A siwninproductions.com +short` shows the Vercel IP.
- Open https://siwninproductions.com and https://www.siwninproductions.com (should go to the version without www), `/en/` and `/privacy/`.
- Open a page that doesn't exist (for example `/test-404`) and check the 404 page appears.
- **Email check:** ask him to send an email to info@siwninproductions.com from another address and confirm it arrives, and to reply to it. Also run `dig MX siwninproductions.com +short` and confirm Google's mail servers are still listed.
- Test on his phone too.

## Step 7. Tell Google about the site

1. Guide him to Google Search Console (search.google.com/search-console), signed in with his Google Workspace account. Add a **Domain** property for `siwninproductions.com`.
2. Google gives a `TXT` record. Have him **add** it in the same DNS settings (adding a TXT is fine; never remove the existing ones), then click Verify.
3. In Search Console → **Sitemaps**, submit `sitemap.xml`.

## Step 8. Explain how to update the site later

Show him the simple routine: tell Claude Code what to change, check it locally, then run `npx vercel --prod` to publish. Optionally, offer to set up a free GitHub repository connected to Vercel so changes publish automatically, but only if he wants that.

## When finished

Give him a short summary in Japanese: the live address, what was set up, where the DNS screenshot is, and the update routine.
