import {Router} from "express";
import { topSongs, totalPlays } from "../controllers/stats.controller.js";
const router = Router();

router.get('/top', topSongs);
router.get('/total-plays', totalPlays);

export default router;
