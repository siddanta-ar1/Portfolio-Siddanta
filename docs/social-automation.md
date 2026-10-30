# Social automation

Publish any portfolio entry to your socials from **`/admin` → Share**. Every post links to
`https://<your-site>/p/<id>`, a page with that project's own image and title in its Open Graph
tags, so link previews look right everywhere.

| Platform | How | Fully automatic? |
|---|---|---|
| LinkedIn (personal profile) | Posts API | ✅ Yes, after one-time OAuth |
| Facebook **Page** | Graph API | ✅ Yes. Personal profiles can't be posted to by any API. |
| Instagram (Business/Creator) | Graph API content publishing | ✅ Yes. Needs a JPEG image or a video. |
| X | API v2 `POST /2/tweets` | ✅ If your X developer plan allows writes |
| TikTok | Content Posting API | ⚠️ Private-only until TikTok audits your app |
| Medium | Legacy API token, otherwise the import tool | ⚠️ Usually manual: Medium no longer issues API tokens |
| Google Sites | Embed `/embed` once | ✅ Updates by itself, nothing to post |

All credentials are **server-side env vars**. Never prefix them with `NEXT_PUBLIC_`.
Add them in Vercel → Project → Settings → Environment Variables (and `.env.local` for local dev),
then redeploy.

---

## 0. Required: the publish secret

```
SOCIAL_ADMIN_SECRET=<long random string, 16+ chars>
```

Generate one with `openssl rand -base64 32`. You type it into the Share panel; it's what stops
anyone else from posting as you. Publishing is disabled until it's set.

Optional: `NEXT_PUBLIC_SITE_URL=https://siddantasodari.com.np` so links point at your real domain
(defaults to `https://siddanta.vercel.app`).

## 1. LinkedIn

1. Create an app at <https://www.linkedin.com/developers/apps> (it needs a LinkedIn Page to attach to; any page you admin works).
2. Products tab: add **Share on LinkedIn** and **Sign In with LinkedIn using OpenID Connect**.
3. Auth tab: use the **OAuth 2.0 token generator** (Tools → Token Generator) with scopes `openid profile w_member_social`.
4. Get your member id: `curl -H "Authorization: Bearer <token>" https://api.linkedin.com/v2/userinfo`. The `sub` field is the id.

```
LINKEDIN_ACCESS_TOKEN=...
LINKEDIN_AUTHOR_URN=urn:li:person:<sub>
# optional; defaults to two months before the current month (YYYYMM)
LINKEDIN_API_VERSION=
```

Tokens last ~60 days, so regenerate and update the env var when posts start returning 401.

## 2. Facebook Page + Instagram

Instagram must be a **Business or Creator** account linked to a Facebook Page.

1. Create an app at <https://developers.facebook.com/apps> (type: Business).
2. Open the **Graph API Explorer**, select your app, and request: `pages_show_list`, `pages_read_engagement`,
   `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`, `business_management`.
3. Swap the short-lived user token for a long-lived one (Access Token Debugger → *Extend*), then call
   `GET /me/accounts`. The `access_token` of your Page there is a **Page token that doesn't expire**.
4. Get the Instagram id: `GET /<page-id>?fields=instagram_business_account`.

While the app is in Development mode it can post to accounts you admin, which is all you need here,
so app review isn't necessary.

```
FACEBOOK_PAGE_ID=...
FACEBOOK_PAGE_ACCESS_TOKEN=...      # the Page token from /me/accounts
INSTAGRAM_USER_ID=...               # instagram_business_account.id
INSTAGRAM_ACCESS_TOKEN=...          # the same Page token works
META_GRAPH_VERSION=v23.0            # optional
```

Instagram needs a public **JPEG** image or a video. PNG/WebP project images will be rejected.

## 3. X

1. <https://developer.x.com> → create a Project + App.
2. User authentication settings: **Read and write**. Then regenerate the Access Token & Secret
   (tokens made before the permission change stay read-only).
3. Make sure your plan allows posting (`POST /2/tweets`). X changes its API pricing often, so check before relying on it.

```
X_API_KEY=...
X_API_SECRET=...
X_ACCESS_TOKEN=...
X_ACCESS_TOKEN_SECRET=...
```

## 4. TikTok

1. Create an app at <https://developers.tiktok.com>, add **Content Posting API** with **Direct Post**, scope `video.publish`.
2. **Verify your domain** (URL properties) for your portfolio domain. Media is served from
   `https://<your-site>/media/...`, which proxies Supabase storage, because TikTok only pulls from verified domains.
3. Run the OAuth flow once for your account to get a **refresh token** (valid ~1 year). The app exchanges it
   for a fresh access token on every post.

```
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
TIKTOK_REFRESH_TOKEN=...
TIKTOK_PRIVACY_LEVEL=SELF_ONLY      # keep until TikTok approves your audit, then PUBLIC_TO_EVERYONE
```

Until the audit passes, TikTok forces every API post to private. Open it in the app and switch it to public.

## 5. Medium

Medium stopped issuing integration tokens. If you already have one (Settings → Security and apps →
Integration tokens), set it and posts are created as **drafts** with your portfolio as the canonical URL:

```
MEDIUM_INTEGRATION_TOKEN=...
MEDIUM_PUBLISH_STATUS=draft         # or public / unlisted
```

Without a token, Share returns a link to <https://medium.com/p/import>. Paste the project URL there and
Medium imports it as a story with the canonical link set.

## 6. Google Sites

Google Sites has no posting API. Do this once:
**Insert → Embed → By URL →** `https://<your-site>/embed`

It shows your latest 12 startups, full-stack projects, awards and research, and refreshes every minute.

## Fallback: RSS automations

`https://<your-site>/feed.xml` is an RSS feed of every entry. If a platform's API is out of reach
(for example, X pricing or a TikTok audit), connect the feed to IFTTT, Zapier, Make or Buffer with an
"RSS → post" recipe.

## Testing safely

**Preview** in the Share panel is a dry run: it shows exactly what each platform will receive and
posts nothing. **Publish** asks for a second click before anything goes out. From a terminal:

```bash
curl -X POST https://<your-site>/api/social \
  -H "Authorization: Bearer $SOCIAL_ADMIN_SECRET" -H "Content-Type: application/json" \
  -d '{"projectId": 9301, "platforms": ["linkedin","x"], "dryRun": true}'
```
