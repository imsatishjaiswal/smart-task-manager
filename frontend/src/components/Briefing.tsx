import { useState } from "react";
import { fetchSummary } from "../lib/api";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export default function Briefing() {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setBriefing("");
    try {
      const text = await fetchSummary();
      setBriefing(text);
    } catch (err: any) {
      setError(err.message || "Failed to generate briefing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid var(--border)" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h2
          style={{
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Sparkles size={15} color="var(--accent)" />
          AI Daily Briefing
        </h2>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--ink)",
            color: "var(--paper)",
            border: "none",
            padding: "7px 14px",
            fontSize: "12px",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "background 0.2s",
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={12} className="animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles size={12} /> Generate Briefing
            </>
          )}
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "16px", minHeight: "80px" }}>
        {!briefing && !error && !loading && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted)",
              fontStyle: "italic",
            }}
          >
            Click "Generate Briefing" to get an AI summary of your pending
            tasks.
          </p>
        )}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[80, 90, 65].map((w, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  height: "12px",
                  background: "var(--border)",
                  borderRadius: "4px",
                  width: `${w}%`,
                }}
              />
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              color: "var(--accent)",
            }}
          >
            <AlertCircle
              size={15}
              style={{ marginTop: "2px", flexShrink: 0 }}
            />
            <p style={{ fontSize: "13px" }}>{error}</p>
          </div>
        )}

        {briefing && (
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.8,
              color: "var(--ink)",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              whiteSpace: "pre-wrap",
            }}
          >
            {briefing}
          </p>
        )}
      </div>
    </div>
  );
}
