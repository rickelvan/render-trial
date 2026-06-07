import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createTask,
  deleteTask,
  fetchDbHealth,
  fetchHealth,
  fetchTasks,
  updateTask,
} from "./api";
import { getNextStatus, TaskBoard } from "./components/TaskBoard";
import type { Task } from "./types";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>("checking");
  const [dbStatus, setDbStatus] = useState<string>("checking");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const health = await fetchHealth();
      setApiStatus(health.status);
    } catch {
      setApiStatus("error");
    }

    try {
      const dbHealth = await fetchDbHealth();
      setDbStatus(dbHealth.database);
    } catch {
      setDbStatus("disconnected");
    }
  }, []);

  useEffect(() => {
    void loadTasks();
    void checkHealth();
  }, [loadTasks, checkHealth]);

  async function handleCreate(title: string, description: string) {
    const task = await createTask({
      title,
      description: description || undefined,
    });
    setTasks((prev) => [...prev, task]);
  }

  async function handleMove(task: Task, direction: "prev" | "next") {
    const status = getNextStatus(task.status, direction);
    const updated = await updateTask(task.id, { status });
    setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  }

  async function handleDelete(id: string) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Render Trial</p>
          <h1>Task Board</h1>
          <p className="subtitle">
            Full-stack demo with React, Express, and PostgreSQL.
          </p>
        </div>
        <div className="status-pills">
          <span className={`pill pill-${apiStatus === "ok" ? "ok" : "bad"}`}>
            API: {apiStatus}
          </span>
          <span className={`pill pill-${dbStatus === "connected" ? "ok" : "bad"}`}>
            DB: {dbStatus}
          </span>
        </div>
      </header>

      {error && (
        <div className="banner banner-error" role="alert">
          {error}
          <button type="button" className="btn btn-ghost" onClick={() => void loadTasks()}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p className="loading">Loading tasks…</p>
      ) : (
        <TaskBoard
          tasks={tasks}
          onCreate={handleCreate}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
