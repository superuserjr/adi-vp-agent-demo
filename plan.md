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

## Updated Staged Development Plan

### Stage 1: Basic Frontend + First Agent ✅ COMPLETED
- [x] Create Next.js 14 app with TypeScript
- [x] Install LangChain.js and dependencies
- [x] Build minimal UI with JD input (copy/paste)
- [x] Implement JD Summarizer agent with GPT-4o
- [x] Create `/api/summarize` route
- [x] Display results in UI
- [x] Add error handling
- [x] **Test Point**: Can paste JD → get summary ✅

### Stage 2: Add Email Drafter (NEXT)
- [ ] Add writing samples section to UI
  - [ ] Copy/paste text input with "Add Sample" button
  - [ ] List of added samples with delete option
  - [ ] Character/word count display
- [ ] Implement Email Drafter agent in `lib/agents/email-drafter.ts`
  - [ ] Use writing samples for style matching
  - [ ] Generate VP-level professional emails
  - [ ] Return confidence score
- [ ] Create `/api/draft` route
- [ ] Update UI to show both JD summary and email draft
- [ ] **Test Point**: Can add samples + JD → get summary + email

### Stage 3: GitHub Integration
- [ ] Add company name input field
- [ ] Implement GitHub Publisher agent
  - [ ] Local: Use `gh` CLI via child_process
  - [ ] Vercel: Use Octokit with GitHub token
  - [ ] Smart folder structure: `submissions/{company}/`
- [ ] Create `/api/publish` route
- [ ] Show PR link on success
- [ ] **Test Point**: Full workflow creates GitHub PR

### Stage 4: Polish & Enhancement
- [ ] Add real-time status updates (SWR polling)
- [ ] Preview/edit capabilities before submission
- [ ] Resume upload (PDF support)
- [ ] Retry functionality for each agent
- [ ] Improve error messages
- [ ] Add loading states and transitions

## Technical Implementation Details

### Completed Components

#### Frontend (app/page.tsx)
- Clean, minimal interface
- Textarea for job description input
- Real-time display of analysis results
- Error handling with user-friendly messages

#### API Routes
- `/api/summarize` - Processes job descriptions with JD Summarizer

#### Agents
- `lib/agents/jd-summarizer.ts` - GPT-4o powered analysis
  - Extracts summary (max 300 words)
  - Identifies 5-7 key requirements
  - Provides company context

#### Configuration
- TypeScript paths fixed (`@/*` → `["./*"]`)
- Environment variables configured (.env.local)
- Tailwind CSS configured

### Next Steps for Parallel Work

If another agent is working on later stages, they should focus on:

1. **Stage 3 Prerequisites**:
   - Review `lib/agents/github-publisher.ts` stub
   - Ensure GitHub CLI is authenticated locally
   - Plan folder structure for submissions

2. **Stage 4 Components**:
   - Design preview panel component
   - Plan SWR implementation for status polling
   - Consider UI/UX for edit functionality

3. **Shared Types**:
   - Review `types/index.ts` for data structures
   - Ensure consistency across agents

### Environment & Dependencies

**Installed packages:**
- Next.js 14 with TypeScript
- @langchain/openai
- zod (for schema validation)
- SWR (for future polling)
- react-dropzone (for future file uploads)
- @vercel/kv (for future state management)

**Required environment variables:**
- `OPENAI_API_KEY` ✅ (configured)
- `GITHUB_TOKEN` (needed for Vercel deployment)

### Testing Instructions

**Current functionality (Stage 1):**
1. Server running at http://localhost:3000
2. Paste any job description
3. Click "Analyze Job Description"
4. View structured analysis results

**API testing:**
```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"jobDescription": "Your JD text here"}'
```

## Notes for Parallel Development

- All agents should follow the established TypeScript patterns
- Use the types defined in `types/index.ts`
- API routes should return consistent JSON structures
- Keep UI minimal and clean per requirements
- Test each stage independently before integration
