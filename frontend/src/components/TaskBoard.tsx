import { FormEvent, useState } from "react";
import { Column } from "./Column";
import type { Task, TaskStatus } from "../types";
import { COLUMNS, STATUS_ORDER } from "../types";

interface TaskBoardProps {
  tasks: Task[];
  onCreate: (title: string, description: string) => Promise<void>;
  onMove: (task: Task, direction: "prev" | "next") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskBoard({ tasks, onCreate, onMove, onDelete }: TaskBoardProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onCreate(title, description);
      setTitle("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  function tasksForStatus(status: TaskStatus) {
    return tasks.filter((task) => task.status === status);
  }

  return (
    <div className="task-board">
      <form className="add-task-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Adding…" : "Add Task"}
          </button>
        </div>
      </form>

      <div className="columns">
        {COLUMNS.map((column) => (
          <Column
            key={column.status}
            label={column.label}
            status={column.status}
            tasks={tasksForStatus(column.status)}
            onMove={onMove}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export function getNextStatus(
  current: TaskStatus,
  direction: "prev" | "next"
): TaskStatus {
  const index = STATUS_ORDER.indexOf(current);
  const nextIndex = direction === "prev" ? index - 1 : index + 1;
  return STATUS_ORDER[nextIndex];
}
