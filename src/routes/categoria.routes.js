import { Router } from "express";
import {
  getCategoria
} from "../controllers/categoria.controller.js";

const router = Router();
 
// GET An TipoProducto
router.get("/all", getCategoria);

 

export default router;
