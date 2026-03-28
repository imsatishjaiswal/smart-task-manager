import { useEffect, useState } from "react";
import { fetchTasks, Task } from "./lib/api";
import TaskCard from "./components/TaskCard";
import AddTaskForm from "./components/AddTaskForm";
import Briefing from "./components/Briefing";
import { ClipboardList } from "lucide-react";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch(() =>
        setError("Could not connect to backend. Is it running on port 4000?"),
      )
      .finally(() => setLoading(false));
  }, []);

  const pending = tasks.filter((t) => t.status === "pending");
  const done = tasks.filter((t) => t.status === "done");

  const handleTaskAdded = (task: Task) => setTasks((prev) => [task, ...prev]);
  const handleDelete = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));
  const handleStatusChange = (updated: Task) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  return (
    <div style={{ minHeight: "100vh", padding: "48px 16px" }}>
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "2px solid var(--ink)",
            paddingBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "42px",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Daily Dispatch
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted)",
              marginTop: "6px",
            }}
          >
            Your smart task manager — powered by Gemini AI
          </p>
        </div>

        {/* AI Briefing */}
        <Briefing />

        {/* Add Task */}
        <AddTaskForm onTaskAdded={handleTaskAdded} />

        {/* Task List */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
              }}
            >
              Pending — {pending.length}
            </h2>
          </div>

          {loading && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{
                    height: "52px",
                    background: "var(--surface)",
                    marginBottom: "1px",
                  }}
                />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "16px",
                background: "rgba(200,75,49,0.05)",
                border: "1px solid rgba(200,75,49,0.2)",
              }}
            >
              <p style={{ fontSize: "13px", color: "var(--accent)" }}>
                ⚠️ {error}
              </p>
            </div>
          )}

          {!loading && !error && pending.length === 0 && (
            <div
              style={{
                padding: "32px 16px",
                textAlign: "center",
                border: "1px dashed var(--border)",
              }}
            >
              <ClipboardList
                size={24}
                color="var(--border)"
                style={{ margin: "0 auto 8px" }}
              />
              <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                No pending tasks. Add one above!
              </p>
            </div>
          )}

          {!loading &&
            pending.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}

          {/* Done Section */}
          {done.length > 0 && (
            <div style={{ marginTop: "32px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  marginBottom: "12px",
                }}
              >
                Completed — {done.length}
              </p>
              {done.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "16px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--muted)",
            }}
          >
            Smart Task Manager · Built for Rubico Tech
          </p>
        </div>
      </div>
    </div>
  );
}
