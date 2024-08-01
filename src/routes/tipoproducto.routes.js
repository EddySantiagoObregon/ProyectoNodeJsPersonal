import { Router } from "express";
import {
  getTipo
} from "../controllers/tipoproducto.controller.js";

const router = Router();
 
// GET An TipoProducto
router.get("/all", getTipo);

 

export default router;
