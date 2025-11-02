import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.listen(3000, () => console.log("Servidor corriendo en el puerto 3000"));
