import { pool } from "../db.js";

export const createProducto = async (req, res) => {
    try {
     
      const {nombre, idCategoria, idTipo, descripcion, precio_venta, precio_compra, stock, estado } = req.body; 
      const [rows] = await pool.query(
        "INSERT INTO producto (id, nombre, idCategoria, idTipo, descripcion, precio_venta, precio_compra, stock, estado, fecha_creacion) VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, now())",
        [nombre, idCategoria, idTipo, descripcion, precio_venta, precio_compra, stock, estado]
      );
      res.status(201).json({ id: rows.insertId, nombre, idCategoria, idTipo, descripcion, precio_venta, precio_compra, stock, estado });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };


  export const getProducto = async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM producto");
      res.json(rows);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

  export const updateProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, idCategoria, idTipo, descripcion, precio_venta, precio_compra, stock, estado } = req.body;
      console.log(  [nombre, idCategoria, idTipo, descripcion, precio_venta, precio_compra, stock, estado, id]);
      const [result] = await pool.query(
        "UPDATE producto SET nombre = ?, idCategoria = ?, idTipo = ?, descripcion = ?, precio_venta = ?, precio_compra = ?, stock = ?, estado = ? WHERE id = ?",
        [nombre, idCategoria, idTipo, descripcion, precio_venta, precio_compra, stock, estado, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      res.status(200).json({ id, nombre, idCategoria, idTipo, descripcion, precio_venta, precio_compra, stock, estado });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };
  export const ingresarProducto = async (req, res) => {
    try {
      const { id } = req.params;
      let { cantidad_producto } = req.body;
  
     
      // Verificar que cantidad_actual sea un número válido
      if (isNaN(cantidad_producto)) {
        return res.status(400).json({ message: "cantidad_actual debe ser un número válido" });
      }
  
      const [rows] = await pool.query("SELECT stock FROM producto WHERE id = ?", [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      const { stock } = rows[0];
      const stockActual = stock + cantidad_producto;
  
      // Actualizar el stock en la base de datos
      await pool.query("UPDATE producto SET stock = ? WHERE id = ?", [stockActual, id]);
  
      res.json({ stockActual });
    } catch (error) {
      console.error("Error en ingresarProducto:", error);
      return res.status(500).json({ message: "Ocurrió un error al procesar la solicitud" });
    }
  };