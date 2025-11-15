import {Router} from "express";
import { listAlbums, getAlbum ,createAlbum} from "../controllers/album.controller.js";
const router = Router();

router.get('/', listAlbums);
router.get('/:id', getAlbum);
router.post('/', createAlbum);

export default router;
