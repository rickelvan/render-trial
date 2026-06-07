import { Router } from "express";
import { TaskStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const tasksRouter = Router();

const VALID_STATUSES = new Set<string>(Object.values(TaskStatus));

tasksRouter.get("/", async (_req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch tasks",
    });
  }
});

tasksRouter.post("/", async (req, res) => {
  const { title, description, status } = req.body ?? {};

  if (!title || typeof title !== "string" || !title.trim()) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  if (status !== undefined && !VALID_STATUSES.has(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description:
          typeof description === "string" ? description.trim() || null : null,
        status: status ?? TaskStatus.TODO,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to create task",
    });
  }
});

tasksRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body ?? {};

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    res.status(400).json({ error: "Title must be a non-empty string" });
    return;
  }

  if (status !== undefined && !VALID_STATUSES.has(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && {
          description:
            typeof description === "string" ? description.trim() || null : null,
        }),
        ...(status !== undefined && { status }),
      },
    });
    res.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task";
    if (message.includes("Record to update not found")) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(500).json({ error: message });
  }
});

tasksRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    if (message.includes("Record to delete does not exist")) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(500).json({ error: message });
  }
});
