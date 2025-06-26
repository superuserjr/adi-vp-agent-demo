# VP Agent Demo - AI-Powered Job Application Assistant

An intelligent workflow that automates the creation of personalized VP-level job applications by analyzing job descriptions, matching your writing style, and organizing everything in GitHub.

> **Built for the Analog Devices VP Edge AI "Vibe Coder" Role** - This project implements the exact application requirements: summarize JD → draft VP-style email → post to GitHub

## 🎯 What This Does

This project creates an agentic workflow that:
1. **Analyzes job descriptions** - Extracts key requirements and company context
2. **Drafts personalized emails** - Mimics your VP-level communication style using your writing samples
3. **Organizes applications** - Automatically commits to GitHub with smart folder structure

Perfect for executives who want to maintain a personal touch while scaling their outreach.

## 🏗️ Architecture

```mermaid
graph TD
    Browser[Browser] -->|Multi-Step Wizard| Next[Next.js App]
    
    Next --> Wizard[Wizard UI]
    Next --> API[API Routes]
    
    Wizard --> Step1[Step 1: JD Analysis]
    Wizard --> Step2[Step 2: Resume Upload]
    Wizard --> Step3[Step 3: Writing Samples]
    Wizard --> Step4[Step 4: Review & Edit]
    Wizard --> Step5[Step 5: Submit to GitHub]
    
    API --> LangChain[LangChain.js]
    
    LangChain --> Agent1[JD Summarizer]
    LangChain --> Agent2[Email Drafter]  
    LangChain --> Agent3[GitHub Publisher]
    
    Agent1 -->|JSON| Memory[In-Memory State]
    Agent2 -->|JSON| Memory
    Agent3 -->|gh CLI| GitHub[GitHub Repo]
    
    OpenAI[OpenAI GPT-4o] -.->|API| LangChain
    
    Vercel[Vercel Platform] -->|Deploy| Next
```

## 🚀 Key Features

### 🧙 Multi-Step Wizard Interface
The application guides you through a seamless 5-step process:

1. **Step 1: Job Description Analysis**
   - Paste the job description
   - Real-time extraction of company name and role
   - Instant analysis of key requirements
   - Smart keyword extraction

2. **Step 2: Resume Upload**
   - Upload your resume (PDF format)
   - Automatic text extraction
   - Match analysis against JD requirements

3. **Step 3: Writing Samples**
   - Add multiple writing samples (copy/paste or file upload)
   - Support for LinkedIn articles
   - Style analysis to capture your voice
   - Minimum 2 samples recommended

4. **Step 4: Review & Edit**
   - Side-by-side preview of all content
   - Edit JD summary and email draft inline
   - Regenerate individual sections
   - Ensure perfect alignment before submission

5. **Step 5: Submit to GitHub**
   - One-click publishing
   - Creates organized folder structure
   - Opens PR for review
   - Complete application history

### Smart Job Description Analysis
- Extracts key responsibilities, requirements, and company culture
- Generates concise summaries (max 300 words)
- Identifies strategic priorities and leadership expectations
- JSON output for easy integration:
  ```json
  {
    "summary": "Concise role overview...",
    "key_requirements": ["GenAI expertise", "Rapid shipping", ...],
    "company_context": "Global semiconductor leader..."
  }
  ```

### VP-Style Email Generation
- Learns from your LinkedIn articles and writing samples
- Maintains your authentic voice and communication patterns
- Crafts compelling introductions that resonate with executive audiences
- JSON output with confidence scoring:
  ```json
  {
    "email_body": "Dear [VP Name], I'm excited about...",
    "subject": "Re: Vibe Coder-in-Residence Opportunity",
    "confidence_score": 0.92
  }
  ```

### Intelligent GitHub Organization
```
submissions/
├── analog_devices/
│   ├── README.md           # Auto-generated index
│   ├── role_summary.md     # JD analysis
│   ├── intro_email.md      # Your personalized email
│   └── resume.pdf          # Your resume
├── nvidia/
│   └── ...
```
- Creates organized folders by company
- Opens PRs for review: `submit/analog_devices-20240115`
- Maintains complete application history
- **Local**: Uses GitHub CLI (`gh`) for authentication
- **Vercel**: Uses GitHub token + Octokit API

### Dynamic Writing Sample Management
- Upload files (PDF/TXT/MD) or paste raw text
- Drag-and-drop multiple samples
- List view with preview & remove buttons
- Optional LinkedIn URL scraper
- Real-time style analysis
- Client-side word/character count and local persistence

### Preview & Edit Before Submission
- **Live preview panel** for all generated content
- **In-line editing** of summaries and emails
- **Retry individual agents** without restarting
- **Side-by-side comparison** of drafts
- **Approve/reject** mechanism before GitHub push

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Full-Stack Framework** | Next.js 14 + TypeScript | Unified frontend + API routes |
| **AI Framework** | LangChain.js + OpenAI | Agent orchestration as specified in JD |
| **UI Components** | Tailwind CSS + shadcn/ui | Beautiful, accessible UI |
| **State Management** | SWR + Vercel KV | Real-time updates and persistence |
| **Deployment** | Vercel | One-click deployment |
| **Version Control** | GitHub CLI (via Node.js) | Automated commits |

## 📋 Prerequisites

### For Local Development
- Node.js 18+
- npm or yarn
- OpenAI API key
- GitHub CLI authenticated (`gh auth login`)

### For Vercel Deployment (Optional)
- Vercel CLI (`npm i -g vercel`)
- GitHub Personal Access Token (for API access)

## 🔧 Installation

### Quick Start (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd adi-vp-agent-dem

# Run the launcher script
./quickstart.sh
```

The `quickstart.sh` script will:
- Check for Node.js and GitHub CLI
- Install dependencies if needed
- Create `.env.local` template if missing
- Start the development server

### Manual Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local
   cp .env.example .env.local
   # Edit .env.local and add your OpenAI API key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚦 Usage

1. **Start the application**
   ```bash
   ./quickstart.sh
   ```

2. **Follow the wizard steps**
   - **Step 1**: Paste job description → Click "Analyze"
   - **Step 2**: Upload your resume PDF
   - **Step 3**: Add 2+ writing samples 
   - **Step 4**: Review and edit generated content
   - **Step 5**: Submit to GitHub

3. **Access your application**
   - Open the PR link to see your submission
   - All materials organized in `submissions/{company}/`
   - Complete history maintained in GitHub

## 📁 Project Structure

```
adi-vp-agent-dem/
├── frontend/                    # Next.js application
│   ├── app/                     # App Router
│   │   ├── api/                 # API Routes
│   │   │   ├── draft/          # Email generation
│   │   │   ├── publish/        # GitHub publishing
│   │   │   └── summarize/      # JD analysis
│   │   ├── components/
│   │   │   ├── steps/          # Wizard step components
│   │   │   │   ├── step1-jd.tsx
│   │   │   │   ├── step2-resume.tsx
│   │   │   │   ├── step3-samples.tsx
│   │   │   │   ├── step4-review.tsx
│   │   │   │   └── step5-submit.tsx
│   │   │   └── wizard.tsx      # Main wizard controller
│   │   ├── layout.tsx
│   │   └── page.tsx             # Home page
│   ├── lib/
│   │   └── agents/              # LangChain agents
│   │       ├── jd-summarizer.ts
│   │       ├── email-drafter.ts
│   │       └── github-publisher.ts
│   ├── types/                   # TypeScript types
│   ├── public/                  # Static assets
│   └── package.json
├── quickstart.sh                # Launcher script
├── plan.md                      # Development plan
└── README.md                    # This file
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submit` | Submit new application |
| GET | `/api/status/[taskId]` | Check processing status and get results |
| POST | `/api/retry` | Retry a specific agent |
| PUT | `/api/update` | Update agent output after editing |
| POST | `/api/approve` | Approve and push to GitHub |
| DELETE | `/api/sample` | Remove writing sample |

### API Response Format
All agents return structured JSON for easy integration:

```json
{
  "task_id": "uuid",
  "status": "completed",
  "agents": {
    "jd_summarizer": {
      "summary": "Role focuses on building GenAI agents...",
      "key_requirements": ["Ship daily", "LangChain expertise"],
      "company_context": "ADI is a global semiconductor leader..."
    },
    "email_drafter": {
      "email_body": "Dear VP Edge AI Team...",
      "subject": "Re: Vibe Coder-in-Residence",
      "confidence_score": 0.92
    },
    "github_publisher": {
      "repo_url": "https://github.com/username/repo",
      "pr_url": "https://github.com/username/repo/pull/1",
      "commit_sha": "abc123",
      "files_created": ["submissions/analog_devices/role_summary.md", ...]
    }
  }
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# E2E tests with Playwright
npm run test:e2e

# Type checking
npm run type-check
```

## 🎨 Customization

### LangChain.js Agent Implementation
Each agent is implemented as a TypeScript module with structured outputs:

```typescript
// lib/agents/jd-summarizer.ts
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

const outputSchema = z.object({
  summary: z.string().max(300),
  key_requirements: z.array(z.string()),
  company_context: z.string(),
});

export async function summarizeJD(jdText: string) {
  const model = new ChatOpenAI({ 
    modelName: "gpt-4o",
    temperature: 0.7 
  });
  
  const parser = StructuredOutputParser.fromZodSchema(outputSchema);
  const chain = model.pipe(parser);
  
  return await chain.invoke({
    messages: [{
      role: "user",
      content: `Analyze this job description: ${jdText}`
    }]
  });
}
```

### Adjusting Agent Behavior
Edit agent instructions in `backend/app/agents/`:
- Modify summarization rubric
- Tune email tone and style
- Change GitHub organization patterns
- Adjust LLM temperature and parameters

### UI Theming
The frontend uses Tailwind CSS with shadcn/ui components:
- Edit `frontend/tailwind.config.js` for colors
- Modify components in `frontend/components/ui/`

## 🏠 Local Development vs Vercel Deployment

### GitHub Integration
The app handles GitHub differently based on environment:

**Local Development**
- Uses GitHub CLI (`gh`) via Node.js child_process
- Requires `gh auth login` before running
- Direct file system access for submissions

**Vercel Deployment**
- Uses GitHub API via Octokit
- Requires `GITHUB_TOKEN` environment variable
- Creates commits via API calls

### Storage
**Local**: In-memory state (resets on restart)  
**Vercel**: Vercel KV for persistence

## 🚢 Deployment to Vercel

### Prerequisites for Vercel
1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Save as `GITHUB_TOKEN`

2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

### Deploy Steps
```bash
# Initial deployment
vercel

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add GITHUB_TOKEN

# Deploy to production
vercel --prod
```

### Alternative: Deploy via GitHub
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Automatic deploys on every push

### Environment Variables for Vercel
- `OPENAI_API_KEY` - Your OpenAI API key
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `KV_URL` - Vercel KV database URL (auto-created)
- `NEXT_PUBLIC_APP_URL` - Your deployment URL

## 📊 Monitoring

- Agent performance metrics in `/metrics`
- Application logs in `logs/`
- GitHub webhook notifications (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for your job search!

## 🙋 FAQ

**Q: Can I use this with other AI providers?**  
A: Yes! The agent framework is provider-agnostic. Swap OpenAI for Anthropic, etc.

**Q: How do I add more agents?**  
A: Create a new agent in `backend/app/agents/` following the base class pattern.

**Q: Is my data secure?**  
A: Your API keys stay local. Resume/samples are only stored in your GitHub.