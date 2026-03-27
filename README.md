# Health check

curl http://localhost:4000/health

# Create a task

curl -X POST http://localhost:4000/tasks \
 -H "Content-Type: application/json" \
 -d '{"title":"Fix login bug","priority":"high"}'

# Get all tasks

curl http://localhost:4000/tasks

# Delete a task (replace 1 with actual id)

curl -X DELETE http://localhost:4000/tasks/1

# Get AI briefing

curl http://localhost:4000/tasks/summary

```

---

## 📁 Final Folder Structure
```

backend/
├── src/
│ ├── types.ts ← TypeScript types
│ ├── db.ts ← SQLite database setup
│ ├── ai.ts ← Gemini AI integration
│ ├── routes.ts ← All API routes
│ └── index.ts ← Express app entry point
├── .env ← Your real keys (DO NOT commit)
├── .env.example ← Safe template for GitHub
├── package.json
└── tsconfig.json
