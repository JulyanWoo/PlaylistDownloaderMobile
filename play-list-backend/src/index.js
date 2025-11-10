import { app } from "./config/server.js";
import youtubeRoutes from "./routes/youtube.routes.js";
import historyRoutes from "./routes/history.routes.js";

app.use(youtubeRoutes);
app.use(historyRoutes);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
