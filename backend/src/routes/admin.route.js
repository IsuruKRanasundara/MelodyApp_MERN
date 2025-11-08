import {Router} from "express";
import { createAdmin, getAdminStatus,deleteAdmin } from "../controllers/admin.controller.js";
const router = Router();

router.post("/", createAdmin);
router.delete("/:id", deleteAdmin);
router.get("/status/:id", getAdminStatus);
export default router;