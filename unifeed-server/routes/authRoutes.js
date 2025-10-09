import express from "express";
import { googleRegisterController, emailRegisterController } from "../controllers/authController.js";

const router = express.Router();

router.post("/google-register", googleRegisterController);
router.post("/email-register", emailRegisterController);

export default router;
