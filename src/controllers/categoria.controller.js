import { pool } from "../db.js";

export const getCategoria = async (req, res) => {
  try {
    console.log("Hola");
    const [rows] = await pool.query("SELECT * FROM categoria");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};