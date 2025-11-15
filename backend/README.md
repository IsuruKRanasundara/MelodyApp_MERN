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

## Spotify Link Resolver

You can resolve a public Spotify URL (track, album, playlist) into normalized song metadata via:

`POST /api/spotify/resolve`

Body:

```json
{ "url": "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp" }
```

Response (track example):

```json
{
	"type": "track",
	"songs": [
		{
			"id": "3n3Ppam7vgaVa1iaRUc9Lp",
			"title": "Mr. Brightside",
			"artists": [{ "id": "0C0XlULifJtAgn6ZNCW2eu", "name": "The Killers" }],
			"album": { "id": "5B4PYA7wNN4WdEXdIJu58a", "name": "Hot Fuss", "image": "https://i.scdn.co/image/..." },
			"duration_ms": 222075,
			"preview_url": "https://p.scdn.co/mp3-preview/...",
			"spotifyUrl": "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp"
		}
	]
}
```

Album responses include `album` plus `songs` (array). Playlist responses include `playlist` plus `songs`.

Additional direct endpoints:

- `GET /api/spotify/track/:id` -> returns `{ type: 'track', songs: [ ...1 track... ] }`
- `GET /api/spotify/album/:id` -> returns `{ type: 'album', album, songs: [...] }`
- `GET /api/spotify/playlist/:id` -> returns `{ type: 'playlist', playlist, songs: [...] }`

Testing (PowerShell examples):

```powershell
curl -X POST http://localhost:5000/api/spotify/resolve -H 'Content-Type: application/json' -d '{"url":"https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp"}'

curl http://localhost:5000/api/spotify/track/3n3Ppam7vgaVa1iaRUc9Lp
```

Environment variables required:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

Obtain credentials by creating a Spotify application at: https://developer.spotify.com/dashboard

Edge cases handled:
- Invalid URL or unsupported type -> 400 with error message.
- Missing credentials -> 400 with descriptive error.
- Token errors -> 400 with upstream status text.

Next ideas: map resolved songs into your local Song model or allow importing playlist/album directly.

## Seed sample data

To quickly test GET endpoints, seed the database with example users, albums, songs, and a playlist.

1. Ensure your `.env` has a valid `MONGO_URI`.
2. Run:

```powershell
npm run seed
```

This will output inserted IDs. Then try:

```powershell
# Songs list
curl http://localhost:5000/api/songs

# Get one song by id (replace <id>)
curl http://localhost:5000/api/songs/<id>

# Albums
curl http://localhost:5000/api/albums

# Playlists for a user (if protected, include Authorization header)
```

The seed creates:
- 2 users: alice@example.com, bob@example.com (password: password123)
- 2 albums with 3 songs total
- 1 playlist referencing those songs
