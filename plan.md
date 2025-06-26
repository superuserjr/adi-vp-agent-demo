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

### Stage 2: Add Email Drafter ✅ COMPLETED
- [x] Add writing samples section to UI
  - [x] Copy/paste text input with "Add Sample" button
  - [x] List of added samples with delete option
  - [x] Character/word count display
- [x] Implement Email Drafter agent in `lib/agents/email-drafter.ts`
  - [x] Use writing samples for style matching
  - [x] Generate VP-level professional emails
  - [x] Return confidence score
- [x] Create `/api/draft` route
- [x] Update UI to show both JD summary and email draft
- [x] Add resume input for better personalization
- [x] Auto-extract company name from JD
- [x] **Test Point**: Can add samples + JD → get summary + email ✅

### Stage 3: GitHub Integration ✅ COMPLETED
- [x] Add company name input field (auto-populated)
- [x] Implement GitHub Publisher agent
  - [x] Local: Use `gh` CLI via child_process
  - [x] Smart folder structure: `submissions/{company}/`
  - [x] Create PR with all materials
- [x] Create `/api/publish` route
- [x] Add publish button after email generation
- [x] Show PR link on success
- [x] **Test Point**: Full workflow creates GitHub PR ✅

### Stage 4: Enhanced UX & Intelligence (UPDATED)

#### 4A: Multi-Step Wizard UI
Transform the single-page form into a guided wizard:

1. **Step 1: Job Description**
   - Full-screen focus on JD input
   - Show real-time extraction preview (company, role title)
   - "Analyze" button → animated processing
   - Display key insights before proceeding

2. **Step 2: Resume**
   - Show extracted keywords from JD
   - Highlight matching skills in resume (real-time)
   - Suggest missing keywords
   - "Match Score" indicator

3. **Step 3: Writing Samples**
   - Smart sample suggestions based on JD
   - "Tone Analyzer" showing detected style
   - Minimum/recommended sample count
   - Preview how AI sees your voice

4. **Step 4: Review & Edit**
   - Side-by-side: JD Summary | Email Draft
   - In-line editing capabilities
   - "Regenerate" buttons for each section
   - Keyword highlighting in email
   - Match score between email and JD

5. **Step 5: Publish**
   - Final preview of all materials
   - Choose branch name
   - Add custom notes
   - One-click GitHub submission

#### 4B: Enhanced Agent Intelligence

**Keyword Extraction Agent** (New)
```typescript
interface KeywordAnalysis {
  technical_skills: string[];
  soft_skills: string[];
  industry_terms: string[];
  action_verbs: string[];
  priority_keywords: string[]; // Top 10 most important
}
```

**Resume Optimizer Agent** (New)
- Analyzes resume against extracted keywords
- Suggests which experiences to emphasize
- Identifies gaps
- Provides "fit score"

**Email Enhancement Pipeline**
1. Extract keywords from JD
2. Analyze resume for keyword matches
3. Pass both to email drafter
4. Email drafter ensures keyword integration
5. Final "keyword density" check

#### 4C: Additional Agentic Features

1. **Smart Suggestions**
   - "Your resume is missing 'LangChain' - consider adding if you have experience"
   - "This JD emphasizes 'rapid shipping' - your Sample 2 demonstrates this well"
   - "Confidence tip: Add a writing sample about technical leadership"

2. **Competitive Analysis**
   - "This role is similar to 3 others you've applied to"
   - "Key differentiator: They want daily shipping"
   - "Unique requirement: Edge AI focus"

3. **Application Tracking**
   - Dashboard showing all applications
   - Status tracking (applied, interviewed, rejected, offer)
   - Analytics on success rates
   - A/B testing different email styles

4. **Learning Agent**
   - Tracks which emails get responses
   - Learns your successful patterns
   - Improves suggestions over time
   - Personal "application coach"

### Implementation Priority

**Must Have (Stage 4 MVP):**
- Multi-step wizard UI
- Keyword extraction & highlighting
- Basic review/edit capability
- Progress indicator

**Nice to Have (v2):**
- Resume optimizer
- Smart suggestions
- Application tracking
- Learning capabilities

### Technical Approach

**State Management:**
- Use React Context or Zustand for wizard state
- Persist progress in localStorage
- Allow back/forward navigation

**UI Components:**
- Step indicator component
- Animated transitions between steps
- Keyboard navigation (Enter to continue)
- Mobile-responsive wizard

**Agent Enhancements:**
- Add keyword extractor to JD summarizer
- Pass keywords through agent pipeline
- Update email drafter to use keywords
- Add validation/scoring endpoints

## Notes for Implementation

- Keep each step focused and uncluttered
- Show clear value at each stage
- Make it feel "smart" with real-time feedback
- Ensure smooth transitions
- Add personality/encouragement ("Great resume!", "Strong writing sample!")
- Consider adding example data for demo purposes

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
