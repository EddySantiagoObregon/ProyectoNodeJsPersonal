import { Router } from "express";
import {
    realizarVenta
} from "../controllers/venta.controller.js";

const router = Router();
 
// GET An TipoProducto
router.post("/realizar", realizarVenta);

 

export default router;
