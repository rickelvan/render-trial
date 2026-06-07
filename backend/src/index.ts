import cors from "cors";
import express from "express";
import path from "path";
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

// Serve frontend
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Task Board API listening on port ${port}`);
});
