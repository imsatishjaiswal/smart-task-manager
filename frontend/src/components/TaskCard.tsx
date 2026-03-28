import { useState } from "react";
import { Task, deleteTask, updateTaskStatus } from "../lib/api";
import { Trash2, CheckCircle, Circle, Calendar } from "lucide-react";

interface Props {
  task: Task;
  onDelete: (id: number) => void;
  onStatusChange: (task: Task) => void;
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    transition: "background 0.2s",
  },
  title: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: 1.4,
  },
  description: {
    fontSize: "12px",
    color: "var(--muted)",
    marginTop: "2px",
  },
  dueDate: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    color: "var(--muted)",
    marginTop: "4px",
    fontFamily: "var(--font-mono)",
  },
  iconBtn: {
    background: "none",
    border: "none",
    padding: "2px",
    color: "var(--muted)",
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
    marginTop: "1px",
    flexShrink: 0,
  },
};

const tagStyle = (priority: string): React.CSSProperties => {
  const map: Record<string, React.CSSProperties> = {
    high: {
      border: "1px solid #c84b31",
      color: "#c84b31",
      background: "rgba(200,75,49,0.05)",
    },
    medium: {
      border: "1px solid rgba(15,15,15,0.3)",
      color: "rgba(15,15,15,0.6)",
      background: "rgba(15,15,15,0.04)",
    },
    low: {
      border: "1px solid rgba(138,128,112,0.4)",
      color: "var(--muted)",
      background: "rgba(138,128,112,0.05)",
    },
  };
  return {
    ...map[priority],
    fontSize: "10px",
    fontFamily: "var(--font-mono)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "1px 6px",
    flexShrink: 0,
  };
};

export default function TaskCard({ task, onDelete, onStatusChange }: Props) {
  const [hovering, setHovering] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const isDone = task.status === "done";

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
      onDelete(task.id);
    } catch {
      alert("Failed to delete task");
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const updated = await updateTaskStatus(
        task.id,
        isDone ? "pending" : "done",
      );
      onStatusChange(updated);
    } catch {
      alert("Failed to update task");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className="animate-slide-in"
      style={{
        ...styles.card,
        background: hovering && !isDone ? "var(--surface)" : "transparent",
        opacity: isDone ? 0.5 : 1,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Toggle */}
      <button
        style={{
          ...styles.iconBtn,
          color: isDone ? "rgba(15,15,15,0.3)" : "var(--muted)",
        }}
        onClick={handleToggle}
        disabled={toggling}
        title={isDone ? "Mark pending" : "Mark done"}
      >
        {isDone ? <CheckCircle size={17} /> : <Circle size={17} />}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              ...styles.title,
              textDecoration: isDone ? "line-through" : "none",
              color: isDone ? "var(--muted)" : "var(--ink)",
            }}
          >
            {task.title}
          </span>
          <span style={tagStyle(task.priority)}>{task.priority}</span>
        </div>

        {task.description && (
          <p style={styles.description}>{task.description}</p>
        )}

        {task.due_date && (
          <p style={styles.dueDate}>
            <Calendar size={11} />
            {new Date(task.due_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        style={{
          ...styles.iconBtn,
          opacity: hovering ? 1 : 0,
          color: deleting ? "var(--accent)" : "var(--muted)",
        }}
        onClick={handleDelete}
        disabled={deleting}
        title="Delete task"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
