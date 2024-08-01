import { pool } from "../db.js";

// Crear usuario
export const createUsuario = async (req, res) => {
    try {
        const { usuario, correo, contraseña, estado } = req.body; 
        const [rows] = await pool.query(
            "INSERT INTO usuario (id, usuario, correo, contraseña, estado) VALUES (null, ?, ?, ?, ?)",
            [usuario, correo, contraseña, estado]
        );
        res.status(201).json({ id: rows.insertId, usuario, correo, estado });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM usuario");
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, correo, contraseña, estado } = req.body;
        const [result] = await pool.query(
            "UPDATE usuario SET  contraseña = ? WHERE correo = ? and contraseña = ?",
            [usuario, correo, contraseña, estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ id, usuario, correo, estado });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM usuario WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const loginUsuario = async (req, res) => {
    try {
      const { usuario, contrasena } = req.body;
  
      // Verificar si el usuario existe en la base de datos
      const [rows] = await pool.query('SELECT * FROM usuario WHERE usuario = ?', [usuario]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const user = rows[0];
  
      // Comparar la contraseña ingresada con la contraseña almacenada
      const validPassword = contrasena == user.contrasena;
      if (!validPassword) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
 
  
      res.status(200).json({ message: 'exitoso', usuario: user.usuario });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  };