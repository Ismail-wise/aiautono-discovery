# AI AUTONO Discovery

Standalone client discovery and scope-approval application for SME automation projects.

## What is included
- Business profile intake
- One-department-first assessment
- Department-specific plain-language questions
- Tooltips for every question
- Save/continue draft in the browser
- Structured discovery analysis endpoint
- Current workflow, problems, recommended automation, future workflow
- Included / excluded scope and assumptions
- Customer approval step
- Starter admin dashboard
- Responsive AI AUTONO-style UI

## Run locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000.

## Production connections to add next
1. Database (PostgreSQL/Supabase recommended) for client/project storage.
2. Authentication for admin and customer portals.
3. AI provider API for deeper analysis and follow-up questions.
4. Email delivery and approval notifications.
5. PDF generation and audit trail.

## Safety
Keep API keys only in `.env.local` or your hosting provider's secret manager. Do not commit secrets.
