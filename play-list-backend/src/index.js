import { app } from "./config/server.js";
import youtubeRoutes from "./routes/youtube.routes.js";
import historyRoutes from "./routes/history.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cron from "node-cron";
import { runCleanup } from "./controllers/history.controller.js";
import logger from "./config/logger.js";

app.use(youtubeRoutes);
app.use(historyRoutes);
app.use(errorHandler);
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

const cleanupDays = parseInt(process.env.CLEANUP_DAYS || "7", 10);
cron.schedule("0 * * * *", () => {
  try {
    runCleanup(cleanupDays);
  } catch (e) {
    logger.error({ error: e.message });
  }
});
