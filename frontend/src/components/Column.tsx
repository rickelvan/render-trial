import { TaskCard } from "./TaskCard";
import type { Task, TaskStatus } from "../types";

interface ColumnProps {
  label: string;
  status: TaskStatus;
  tasks: Task[];
  onMove: (task: Task, direction: "prev" | "next") => void;
  onDelete: (id: string) => void;
}

export function Column({ label, status, tasks, onMove, onDelete }: ColumnProps) {
  return (
    <section className="column" data-status={status}>
      <header className="column-header">
        <h2>{label}</h2>
        <span className="column-count">{tasks.length}</span>
      </header>
      <div className="column-body">
        {tasks.length === 0 ? (
          <p className="column-empty">No tasks here yet.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
