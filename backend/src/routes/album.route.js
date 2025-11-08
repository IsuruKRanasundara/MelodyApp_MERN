import {Router} from "express";
import { listAlbums, getAlbum } from "../controllers/album.controller.js";
const router = Router();

router.get('/', listAlbums);
router.get('/:id', getAlbum);

export default router;
