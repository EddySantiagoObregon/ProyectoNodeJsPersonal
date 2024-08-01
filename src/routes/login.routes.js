import { Router } from "express";
import {
    loginUsuario,
} from "../controllers/usuario.controller.js";

const router = Router();
 
//Post of product
router.post("/start", loginUsuario);
export default router;
