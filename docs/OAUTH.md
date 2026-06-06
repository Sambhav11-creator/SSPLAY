# SSPLAY OAuth Setup (Google & GitHub)

## Google

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create **OAuth 2.0 Client ID** (Web application).
3. **Authorized redirect URI:**
   ```
   http://localhost:5000/api/auth/google/callback
   ```
4. Add to `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

## GitHub

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
2. **Authorization callback URL:**
   ```
   http://localhost:5000/api/auth/github/callback
   ```
3. Add to `server/.env`:
   ```env
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
   ```

## Production

Set callback URLs to your Railway API host, e.g.:

- `https://your-api.railway.app/api/auth/google/callback`
- `https://your-api.railway.app/api/auth/github/callback`

Set `CLIENT_URL` to your Vercel frontend URL.

## Flow

1. User clicks **Continue with Google/GitHub** on login or register.
2. Browser hits `GET /api/auth/{provider}` → redirect to provider.
3. Provider redirects to `GET /api/auth/{provider}/callback`.
4. API creates/links user, issues JWT, redirects to `{CLIENT_URL}/auth/callback?token=...`.
5. Frontend stores token and loads `/home`.

Check configured providers: `GET /api/auth/providers`
