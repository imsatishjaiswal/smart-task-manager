import { GoogleGenerativeAI } from '@google/generative-ai';
import { Task } from './types';

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

function buildPrompt(tasks: Task[]): string {
    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const taskList = tasks.map((t, i) => {
        const parts = [`${i + 1}. [${t.priority.toUpperCase()}] ${t.title}`];
        if (t.description) parts.push(`   Description: ${t.description}`);
        if (t.due_date) parts.push(`   Due: ${t.due_date}`);
        return parts.join('\n');
    }).join('\n\n');

    return `Today is ${today}.

You are a smart productivity assistant. Below are the user's pending tasks.
Write a concise, friendly, and actionable daily briefing in plain English (3–5 short paragraphs).

Your briefing should:
- Greet the user and mention today's date
- Highlight the most urgent or high-priority tasks first
- Group related tasks if possible
- End with a motivating closing line

Pending Tasks:
${taskList}

Write the briefing now:`;
}

export async function generateBriefing(tasks: Task[]): Promise<string> {
    const model = getClient().getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(buildPrompt(tasks));
    const text = result.response.text();
    if (!text) throw new Error('Empty response from Gemini');
    return text;
}