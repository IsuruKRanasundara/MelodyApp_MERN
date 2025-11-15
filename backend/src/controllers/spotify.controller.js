import { resolveSpotifyLink, fetchTrack, fetchAlbum, fetchPlaylist ,getSongs} from '../services/spotify.service.js';

// POST /api/spotify/resolve { url }
export async function postResolve(req, res) {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Missing url in body' });
    }
    try {
        const data = await resolveSpotifyLink(url);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
export  async function getSong(req, res) {
    try {
        const song = await getSongs();
        res.json(song);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
export async function getTrack(req, res) {
    try {
        const track = await fetchTrack(req.params.id);
        res.json({ type: 'track', songs: [track ? {
            id: track.id,
            title: track.name,
            artists: track.artists.map(a => ({ id: a.id, name: a.name })),
            album: track.album ? { id: track.album.id, name: track.album.name, image: track.album.images?.[0]?.url } : null,
            duration_ms: track.duration_ms,
            preview_url: track.preview_url,
            spotifyUrl: track.external_urls?.spotify
        } : null] });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getAlbum(req, res) {
    try {
        const album = await fetchAlbum(req.params.id);
        const songs = album.tracks.items.map(item => ({
            id: item.id,
            title: item.name,
            artists: item.artists.map(a => ({ id: a.id, name: a.name })),
            album: { id: album.id, name: album.name, image: album.images?.[0]?.url },
            duration_ms: item.duration_ms,
            preview_url: item.preview_url,
            spotifyUrl: item.external_urls?.spotify
        }));
        res.json({ type: 'album', album: { id: album.id, name: album.name, image: album.images?.[0]?.url }, songs });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getPlaylist(req, res) {
    try {
        const playlist = await fetchPlaylist(req.params.id);
        const songs = playlist.tracks.items.filter(it => it.track).map(it => ({
            id: it.track.id,
            title: it.track.name,
            artists: it.track.artists.map(a => ({ id: a.id, name: a.name })),
            album: it.track.album ? { id: it.track.album.id, name: it.track.album.name, image: it.track.album.images?.[0]?.url } : null,
            duration_ms: it.track.duration_ms,
            preview_url: it.track.preview_url,
            spotifyUrl: it.track.external_urls?.spotify
        }));
        res.json({ type: 'playlist', playlist: { id: playlist.id, name: playlist.name, image: playlist.images?.[0]?.url }, songs });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
