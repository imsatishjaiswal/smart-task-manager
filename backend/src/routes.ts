import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { getDb } from './db';
import { Task, CreateTaskBody } from './types';
import { generateBriefing } from './ai';

const router = Router();

// GET /tasks
router.get('/', (_req: Request, res: Response) => {
    try {
        const tasks = getDb()
            .prepare('SELECT * FROM tasks ORDER BY created_at DESC')
            .all() as Task[];
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
    }
});

// POST /tasks
router.post('/',
    [
        body('title').trim().notEmpty().withMessage('Title is required')
            .isLength({ max: 200 }).withMessage('Title max 200 chars'),
        body('priority').optional().isIn(['low', 'medium', 'high']),
        body('due_date').optional().isISO8601().withMessage('Invalid date format'),
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ success: false, errors: errors.array() });
            return;
        }
        const { title, description, priority = 'medium', due_date }: CreateTaskBody = req.body;
        try {
            const stmt = getDb().prepare(
                `INSERT INTO tasks (title, description, priority, due_date)
         VALUES (@title, @description, @priority, @due_date)`
            );
            const result = stmt.run({
                title,
                description: description ?? null,
                priority,
                due_date: due_date ?? null,
            });
            const task = getDb()
                .prepare('SELECT * FROM tasks WHERE id = ?')
                .get(result.lastInsertRowid) as Task;
            res.status(201).json({ success: true, data: task });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to create task' });
        }
    }
);

// PATCH /tasks/:id/status
router.patch('/:id/status',
    [
        param('id').isInt({ min: 1 }),
        body('status').isIn(['pending', 'done']),
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ success: false, errors: errors.array() });
            return;
        }
        try {
            const info = getDb()
                .prepare('UPDATE tasks SET status = ? WHERE id = ?')
                .run(req.body.status, req.params.id);
            if (info.changes === 0) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }
            const task = getDb()
                .prepare('SELECT * FROM tasks WHERE id = ?')
                .get(req.params.id) as Task;
            res.json({ success: true, data: task });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to update task' });
        }
    }
);

// DELETE /tasks/:id
router.delete('/:id',
    [param('id').isInt({ min: 1 })],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ success: false, errors: errors.array() });
            return;
        }
        try {
            const info = getDb()
                .prepare('DELETE FROM tasks WHERE id = ?')
                .run(req.params.id);
            if (info.changes === 0) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }
            res.json({ success: true, message: 'Task deleted' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to delete task' });
        }
    }
);

// GET /tasks/summary  ← AI briefing
router.get('/summary', async (_req: Request, res: Response) => {
    try {
        const pending = getDb()
            .prepare("SELECT * FROM tasks WHERE status = 'pending' ORDER BY priority DESC, due_date ASC")
            .all() as Task[];

        if (pending.length === 0) {
            res.json({
                success: true,
                data: { briefing: "🎉 You have no pending tasks. Enjoy your day!" },
            });
            return;
        }

        const briefing = await generateBriefing(pending);
        res.json({ success: true, data: { briefing } });
    } catch (err: any) {
        const isRateLimit = err?.message?.toLowerCase().includes('quota')
            || err?.message?.toLowerCase().includes('rate');
        res.status(isRateLimit ? 429 : 502).json({
            success: false,
            message: isRateLimit
                ? 'AI rate limit reached. Please wait and try again.'
                : 'AI briefing unavailable. Please try again later.',
        });
    }
});

export default router;