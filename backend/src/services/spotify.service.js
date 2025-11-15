// Service for interacting with Spotify Web API given a public Spotify URL.
// Supports track, album, and playlist links. Uses Client Credentials flow.
// Environment variables required:
//   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
// Node 18+ has global fetch; if unavailable we attempt to import node-fetch dynamically.

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

let cachedToken = { accessToken: null, expiresAt: 0 }; // Unix ms

function ensureFetch() {
    if (typeof fetch !== 'function') {
        return import('node-fetch').then(mod => mod.default);
    }
    return Promise.resolve(fetch);
}

export function parseSpotifyUrl(url) {
    // Examples:
    // https://open.spotify.com/track/{id}?
    // https://open.spotify.com/album/{id}
    // https://open.spotify.com/playlist/{id}
    try {
        const u = new URL(url);
        if (!u.hostname.includes('spotify.com')) return null;
        const segments = u.pathname.split('/').filter(Boolean);
        if (segments.length < 2) return null;
        const type = segments[0];
        const id = segments[1];
        if (!['track', 'album', 'playlist'].includes(type)) return null;
        return { type, id };
    } catch (e) {
        return null;
    }
}

async function getAccessToken() {
    const now = Date.now();
    if (cachedToken.accessToken && now < cachedToken.expiresAt - 5000) {
        return cachedToken.accessToken;
    }
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error('Spotify credentials missing (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET)');
    }
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const f = await ensureFetch();
    const resp = await f(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=client_credentials'
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Spotify token error: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    cachedToken.accessToken = data.access_token;
    cachedToken.expiresAt = now + data.expires_in * 1000; // seconds to ms
    return cachedToken.accessToken;
}

function normalizeTrack(track) {
    return {
        id: track.id,
        title: track.name,
        artists: track.artists.map(a => ({ id: a.id, name: a.name })),
        album: track.album ? { id: track.album.id, name: track.album.name, image: track.album.images?.[0]?.url } : null,
        duration_ms: track.duration_ms,
        preview_url: track.preview_url,
        spotifyUrl: track.external_urls?.spotify
    };
}
export async function getSongs() {
    const token = await getAccessToken();
    const f = await ensureFetch();
    const limit = 10; // Set your desired limit here
    const url = `${SPOTIFY_API_BASE}/search?q=sankaDineth&type=track&limit=${limit}`;
    const resp = await f(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Spotify get songs error: ${resp.status} ${text}`);
    }
    return resp.json();

}

export async function fetchById(type, id) {
    const token = await getAccessToken();
    const f = await ensureFetch();
    const plural = type === 'track' ? 'tracks' : `${type}s`; // playlist -> playlists, album -> albums
    const url = `${SPOTIFY_API_BASE}/${plural}/${id}`;
    const resp = await f(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Spotify ${type} fetch error: ${resp.status} ${text}`);
    }
    return resp.json();
}

export async function fetchTrack(id) { return fetchById('track', id); }
export async function fetchAlbum(id) { return fetchById('album', id); }
export async function fetchPlaylist(id) { return fetchById('playlist', id); }

export async function resolveSpotifyLink(url) {
    const parsed = parseSpotifyUrl(url);
    if (!parsed) {
        throw new Error('Invalid or unsupported Spotify URL');
    }
    const { type, id } = parsed;
    if (type === 'track') {
        const track = await fetchById('track', id);
        return { type: 'track', songs: [normalizeTrack(track)] };
    }
    if (type === 'album') {
        const album = await fetchById('album', id);
        const songs = album.tracks.items.map(item => normalizeTrack({
            ...item,
            album: album,
            artists: item.artists
        }));
        return { type: 'album', album: { id: album.id, name: album.name, image: album.images?.[0]?.url }, songs };
    }
    if (type === 'playlist') {
        const playlist = await fetchById('playlist', id);
        const songs = playlist.tracks.items
            .filter(it => it.track)
            .map(it => normalizeTrack(it.track));
        return { type: 'playlist', playlist: { id: playlist.id, name: playlist.name, image: playlist.images?.[0]?.url }, songs };
    }
    throw new Error('Unsupported type');
}
