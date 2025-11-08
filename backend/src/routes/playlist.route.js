import { Router } from 'express';
import { createPlaylist, getUserPlaylists, getPlaylist } from '../controllers/playlist.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, createPlaylist);
router.get('/user', authenticate, getUserPlaylists);
router.get('/:id', authenticate, getPlaylist);

export default router;
