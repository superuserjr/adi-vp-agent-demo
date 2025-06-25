# VP Agent Demo - Execution Plan

## Alignment with JD Requirements
This plan builds exactly what the job posting asks for as the application:
- **Agent 1**: Summarizes the job description (with JSON output)
- **Agent 2**: Drafts intro email in VP's voice (using writing samples)  
- **Agent 3**: Posts both to public GitHub repo (smart folder organization)
- **Tech Stack**: LangChain.js with OpenAI (unified TypeScript stack)
- **Agent Framework**: LangChain.js for orchestration
- **Rapid Shipping**: MVP in < 1 week, matching their "ship daily" culture
- **Full-Stack**: Next.js + Vercel deployment (exactly what they asked for!)
- **Single Language**: TypeScript throughout (backend via API routes)

## Architecture Decision: JavaScript/TypeScript Only
We're using 100% JavaScript/TypeScript because:
- They explicitly mention "Vercel" in the JD
- Single language = faster development
- Next.js API Routes replace backend
- One-click Vercel deployment
- Shows modern full-stack skills

## Real-time Updates: Polling (not WebSockets)
For MVP, we'll use SWR with 1-second polling:
- Simpler to implement
- Good enough for < 2 min operations
- Works everywhere (no firewall issues)
- Can upgrade to WebSockets later if needed

## Development Approach: Local First, Vercel Ready
1. **Start Local** - Get everything working locally first
2. **Use GitHub CLI** - Leverage existing `gh` auth for local development
3. **Deploy Later** - Once working, deploy to Vercel with GitHub token

## Quick Start Checklist
- [ ] Run `./quickstart.sh` to set up project (first time)
- [ ] Configure `.env.local` with `OPENAI_API_KEY`
- [ ] Run `./quickstart.sh` again to start the app
- [ ] Test all features locally
- [ ] Deploy to Vercel when ready

## Phase 1: Foundation (Day 0.5)
**Goal:** Project scaffold and core infrastructure

### Setup
- [ ] Create Next.js 14 app with TypeScript: `npx create-next-app@latest --typescript --tailwind --app`
- [ ] Install LangChain.js: `npm install langchain @langchain/openai zod`
- [ ] Install utilities: `npm install @vercel/kv react-dropzone swr`
- [ ] Set up Tailwind CSS + shadcn/ui components
- [ ] Configure environment variables in `.env.local`

### Project Structure
- [ ] Create API routes in `app/api/`
- [ ] Set up agent modules in `lib/agents/`
- [ ] Create shared types in `types/`
- [ ] Set up GitHub auth checker utility

### DevOps
- [ ] Configure Vercel project
- [ ] Set up GitHub repository
- [ ] Enable Vercel automatic deployments

## Phase 2: Core Agents (Days 1-2)
**Goal:** Implement and test all three agents

### Day 1: JD Summarizer Agent
- [ ] Implement in `lib/agents/jd-summarizer.ts` using LangChain.js
- [ ] Use `ChatOpenAI` with `gpt-4o` model
- [ ] Add Zod schema for structured output (max 300 words validation)
- [ ] JSON output format: `{summary: string, key_requirements: string[], company_context: string}`
- [ ] Create API route: `app/api/agents/summarize/route.ts`
- [ ] Test with sample JDs

### Day 2: VP Email Draft Agent
- [ ] Implement in `lib/agents/email-drafter.ts` with few-shot examples
- [ ] Dynamic sample ingestion using TypeScript
- [ ] Use LangChain.js prompt templates for style matching
- [ ] JSON output: `{email_body: string, subject: string, confidence_score: number}`
- [ ] Create API route: `app/api/agents/draft/route.ts`
- [ ] Test with 3-5 writing samples

## Phase 3: GitHub Integration (Day 3)
**Goal:** Smart repository organization

### GitHub Publisher Agent
- [ ] Implement in `lib/agents/github-publisher.ts`
- [ ] **Local development**: Use `gh` CLI via Node.js child_process
- [ ] **Vercel deployment**: Use Octokit with GitHub token
- [ ] Environment detection: `process.env.VERCEL ? useOctokit() : useGhCLI()`
- [ ] Folder structure: `submissions/{company_slug}/`
- [ ] File naming: `role_summary.md`, `intro_email.md`, `resume.pdf`
- [ ] Branch creation: `submit/{company_slug}-{YYYYMMDD}`
- [ ] Auto-generate folder README with metadata
- [ ] JSON output: `{repo_url: string, pr_url: string, commit_sha: string, files_created: string[]}`
- [ ] Create API route: `app/api/agents/publish/route.ts`

## Phase 4: API & Orchestration (Day 4)
**Goal:** Connect agents with Next.js API Routes

### API Routes
- [ ] `POST /api/submit` - Accept JD, samples, resume
- [ ] `GET /api/status/[taskId]` - Poll job status with agent results
- [ ] `POST /api/retry` - Retry specific agent
- [ ] `PUT /api/update` - Update agent output (after preview edit)
- [ ] `POST /api/approve` - Approve and trigger GitHub push
- [ ] `DELETE /api/sample` - Remove samples
- [ ] State storage:
  - [ ] Local: In-memory Map or localStorage
  - [ ] Vercel: Use Vercel KV (add when deploying)
- [ ] Error handling with proper status codes

### Agent Pipeline
- [ ] Orchestration logic in `lib/orchestrator.ts`
- [ ] Parallel agent execution using Promise.all
- [ ] Result aggregation with TypeScript types
- [ ] Client-side state management with SWR

## Phase 5: Frontend UI (Day 5)
**Goal:** Beautiful, functional interface

### Upload Interface
- [ ] Company name input (with slug preview)
- [ ] JD upload (file or paste)
- [ ] Resume upload (PDF)
- [ ] Writing samples manager
  - [ ] File upload (PDF, TXT, MD)
  - [ ] Paste raw text with title
  - [ ] Drag-and-drop support for multiple files
  - [ ] Sample list with preview & remove buttons
  - [ ] Client-side character/word count
  - [ ] Local storage persistence

### Status Dashboard
- [ ] Real-time progress updates using SWR (1-second polling)
- [ ] Preview panel for generated content
  - [ ] JD summary preview with edit capability
  - [ ] Email draft preview with edit capability
  - [ ] Side-by-side comparison view
- [ ] Retry button for each agent
- [ ] Success state with GitHub PR link
- [ ] Error handling with clear messages
- [ ] Local storage for draft state (localStorage)

## Phase 6: Polish & Demo (Day 5.5)
**Goal:** Production-ready MVP

### Testing
- [ ] End-to-end workflow test
- [ ] Error case handling
- [ ] Performance optimization

### Documentation
- [ ] API documentation
- [ ] User guide
