import { Router } from "express";
import {
    createProducto,
    getProducto,
    ingresarProducto,
    updateProducto
} from "../controllers/producto.controller.js";

const router = Router();
 
//Post of product
router.post("/create", createProducto);

router.get("/all", getProducto);
router.put("/update/:id", updateProducto);
router.put("/enterproduct/:id", ingresarProducto);
export default router;
