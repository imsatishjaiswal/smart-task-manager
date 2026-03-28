import { useState } from "react";
import { createTask, CreateTaskPayload, Priority, Task } from "../lib/api";
import { Plus, ChevronDown } from "lucide-react";

interface Props {
  onTaskAdded: (task: Task) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--paper)",
  border: "1px solid var(--border)",
  padding: "10px 12px",
  fontSize: "13px",
  color: "var(--ink)",
  outline: "none",
  fontFamily: "var(--font-body)",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  color: "var(--muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "4px",
  fontFamily: "var(--font-mono)",
};

export default function AddTaskForm({ onTaskAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CreateTaskPayload>({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const task = await createTask({
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        priority: form.priority,
        due_date: form.due_date || undefined,
      });
      onTaskAdded(task);
      setForm({ title: "", description: "", priority: "medium", due_date: "" });
      setOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid var(--border)" }}>
      {/* Toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "none",
          border: "none",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--ink)",
          transition: "background 0.2s",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={15} /> Add New Task
        </span>
        <ChevronDown
          size={15}
          color="var(--muted)"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {/* Form */}
      {open && (
        <form
          onSubmit={handleSubmit}
          className="animate-fade-in"
          style={{
            borderTop: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {error && (
            <p
              style={{
                fontSize: "12px",
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {error}
            </p>
          )}

          <div>
            <label style={labelStyle}>Title *</label>
            <input
              style={inputStyle}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              maxLength={200}
              autoFocus
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <input
              style={inputStyle}
              placeholder="Optional details…"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                style={inputStyle}
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as Priority,
                  }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input
                type="date"
                style={inputStyle}
                value={form.due_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, due_date: e.target.value }))
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "var(--ink)",
                color: "var(--paper)",
                border: "none",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "background 0.2s",
              }}
            >
              {loading ? "Adding…" : "Add Task"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "13px",
                color: "var(--muted)",
                padding: "10px 12px",
                transition: "color 0.15s",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
