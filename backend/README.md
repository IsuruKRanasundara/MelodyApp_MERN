# Melodify Backend

This is a minimal backend scaffold for the Melodify music app. It includes:

- Google OAuth 2.0 authentication (Passport) which issues a JWT to clients.
- JWT-protected endpoints
- Song uploads (stored to local `uploads/` directory via `multer`)
- Playlists creation and retrieval

Endpoints implemented (matching the provided Postman collection shape):

- POST /auth/google -> starts Google OAuth (redirect)
- GET /auth/google/callback -> Google OAuth callback, returns JSON { token, user }
- GET /auth/me -> returns authenticated user (needs Bearer token)

- GET /songs -> list songs
- POST /songs/upload -> upload song file (multipart form, field `file`) and metadata. Protected (Bearer token)

- POST /playlists -> create playlist (protected)
- GET /playlists/user -> get user playlists (protected)

Quick start

1. Copy `.env.example` to `.env` and fill in values (MongoDB, Google credentials, JWT secret).
2. Install dependencies:

```powershell
npm install
```

3. Start in development mode:

```powershell
npm run dev
```

4. Use the Google OAuth flow by visiting:

```
http://localhost:5000/auth/google
```

Notes and next steps
- In production you should redirect after OAuth to a frontend URL and avoid returning tokens directly in the response.
- Consider storing uploaded files in cloud storage (S3, Google Cloud Storage) and serving via CDN.
- Add more validation and tests.
