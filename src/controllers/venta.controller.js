import { pool } from "../db.js";

export const realizarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    let totalVenta = 0.0;
    let { producto, total_venta } = req.body;
    await pool.query("CALL get_next_sequence_value(@next_value);");
    const [rows] = await pool.query("SELECT @next_value AS next_value;");

    const codigo = rows[0].next_value;
    let codFact = "FAC" + formatToFourDigits(Number(codigo));

    console.log(codFact);

    for (const pro of producto) {
      console.log(pro);
      const cantidad = pro.cantidad_venta;
      const precio = pro.precio;
      const total = (cantidad * precio).toFixed(2);
      totalVenta += parseFloat(total);

      const [stockPro] = await pool.query(
        "SELECT stock FROM producto WHERE id = ?",
        [pro.id]
      );
      const { stock } = stockPro[0];
      if (stockPro.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      } else if (stock > cantidad) {
        const stockActual = stock - cantidad;
        // Insertar cada producto en la base de datos
        const [result] = await pool.query(
          "INSERT INTO venta (id, codigo, cantidad, total, total_venta, fecha, idProducto) VALUES (null, ?, ?, ?, null, now(), ?);",
          [codFact, cantidad, total, pro.id]
        );
        console.log(`Producto insertado con ID: ${result.insertId}`);
        await pool.query("UPDATE producto SET stock = ? WHERE id = ?", [
          stockActual,
          pro.id,
        ]);
      } else {
        return res.status(500).json({
          message: "No hay cantidad en el stock del producto seleccionado",
        });
      }
    }
    const [result] = await pool.query(
      "UPDATE venta SET total_venta = IFNULL(?, total_venta)  WHERE codigo = ?",
      [totalVenta, codFact]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Eror al actualizar producto" });

    const [resultPro] = await pool.query(
      "SELECT CONCAT(cat.nombre, ' ', tip.nombre, ' ', pro.nombre) as nombre, ven.codigo, ven.cantidad, ven.total, ven.total_venta, ven.fecha FROM venta ven INNER JOIN producto pro ON ven.idProducto = pro.id INNER JOIN categoria cat ON cat.id = pro.idCategoria INNER JOIN tipo tip ON tip.id = pro.idTipo WHERE ven.codigo = ?;",
      [codFact]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Eror al consultar la factura" });

    res.json({ resultPro });
  } catch (error) {
    console.error("Error en ingresarProducto:", error);
    return res
      .status(500)
      .json({ message: "Ocurrió un error al procesar la solicitud" });
  }
};

function formatToFourDigits(number) {
  let str = number.toString();
  return str.padStart(4, "0");
}
