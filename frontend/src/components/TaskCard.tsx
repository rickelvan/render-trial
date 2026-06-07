import type { Task } from "../types";
import { STATUS_ORDER } from "../types";

interface TaskCardProps {
  task: Task;
  onMove: (task: Task, direction: "prev" | "next") => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const statusIndex = STATUS_ORDER.indexOf(task.status);
  const canMovePrev = statusIndex > 0;
  const canMoveNext = statusIndex < STATUS_ORDER.length - 1;

  return (
    <article className="task-card">
      <div className="task-card-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>
      <div className="task-card-actions">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!canMovePrev}
          onClick={() => onMove(task, "prev")}
          aria-label={`Move "${task.title}" to previous column`}
        >
          ←
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!canMoveNext}
          onClick={() => onMove(task, "next")}
          aria-label={`Move "${task.title}" to next column`}
        >
          →
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete "${task.title}"`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
