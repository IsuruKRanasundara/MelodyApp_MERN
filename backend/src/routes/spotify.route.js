import { Router } from 'express';
import { postResolve, getTrack, getAlbum, getPlaylist,getSong } from '../controllers/spotify.controller.js';

const router = Router();

router.post('/resolve', postResolve);
router.get('/track/:id', getTrack);
router.get('/album/:id', getAlbum);
router.get('/playlist/:id', getPlaylist);
router.get('/songs', getSong);
export default router;
