import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health";
import { tasksRouter } from "./routes/tasks";

const app = express();
const port = Number(process.env.PORT) || 3001;

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.use(healthRouter);
app.use("/api/tasks", tasksRouter);

app.listen(port, () => {
  console.log(`Task Board API listening on port ${port}`);
});
