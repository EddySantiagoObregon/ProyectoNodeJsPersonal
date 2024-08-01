import express from "express";
import morgan from "morgan";
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

// Importar rutas
import employeesRoutes from "./routes/employees.routes.js";
import tipoRoutes from "./routes/tipoproducto.routes.js";
import categoria from "./routes/categoria.routes.js";
import producto from "./routes/producto.routes.js";
import venta from "./routes/venta.routes.js";
import login from "./routes/login.routes.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Configurar la carpeta de vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Servir archivos estáticos
app.use('/login', express.static(path.join(__dirname, 'views/login')));


// Routes
app.use("/api/tipo", tipoRoutes);
app.use("/api/categoria", categoria);
app.use("/api/producto", producto);
app.use("/", indexRoutes);
app.use("/api", employeesRoutes); 
app.use("/api/venta", venta); 
app.use("/api/login", login);

// Ruta para renderizar login.html
app.get('/login', (req, res) => { 
  console.log("Accediendo a /login");
  res.render('login/login'); // Asumiendo que login.html está en la carpeta 'views' directamente
});

// Middleware para manejar 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

 

export default app;
