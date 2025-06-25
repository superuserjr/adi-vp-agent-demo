#!/bin/bash
#
# VP Agent Demo - Smart Launcher Script
# 
# This script handles both initial setup and daily startup:
# - First run: Creates the Next.js project and sets up everything
# - Subsequent runs: Starts the development server
#
# Usage: ./quickstart.sh

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 VP Agent Demo - Launcher${NC}"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is required. Please install Node.js 18+${NC}"
    exit 1
fi

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI not found. Install with: brew install gh${NC}"
    echo -e "${YELLOW}   Then run: gh auth login${NC}"
else
    # Check GitHub auth status
    if ! gh auth status &>/dev/null; then
        echo -e "${YELLOW}⚠️  GitHub CLI not authenticated${NC}"
        echo -e "${YELLOW}   Run: gh auth login${NC}"
    else
        echo -e "${GREEN}✅ GitHub CLI authenticated${NC}"
    fi
fi

# Check if project already exists
if [ -d "adi-vp-agent-demo" ]; then
    echo -e "${GREEN}✅ Project already exists${NC}"
    cd adi-vp-agent-demo
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies...${NC}"
        npm install
    fi
    
    # Check .env.local
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️  .env.local not found! Creating template...${NC}"
        cat > .env.local << EOF
OPENAI_API_KEY=sk-your-key-here
# Add your OpenAI API key above
EOF
        echo -e "${RED}❌ Please update .env.local with your OpenAI API key${NC}"
        exit 1
    fi
    
    # Check if API key is still the placeholder
    if grep -q "sk-your-key-here" .env.local; then
        echo -e "${RED}❌ Please update .env.local with your actual OpenAI API key${NC}"
        exit 1
    fi
    
    # Start the dev server
    echo -e "${GREEN}🚀 Starting development server...${NC}"
    echo -e "${BLUE}📱 Opening http://localhost:3000${NC}"
    echo ""
    npm run dev
    exit 0
fi

# If we get here, it's first time setup
echo -e "${YELLOW}📦 First time setup detected...${NC}"

# Create Next.js app
echo -e "${GREEN}Creating Next.js app...${NC}"
npx create-next-app@latest adi-vp-agent-demo \
    --typescript \
    --tailwind \
    --app \
    --src-dir=false \
    --import-alias="@/*" \
    --no-eslint

cd adi-vp-agent-demo

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install langchain @langchain/openai zod
npm install @radix-ui/themes lucide-react swr react-dropzone
npm install class-variance-authority clsx tailwind-merge
npm install @vercel/kv

# Create project structure
echo -e "${GREEN}Creating project structure...${NC}"
mkdir -p app/api/{submit,status,retry,update,approve}
mkdir -p app/components
mkdir -p lib/agents
mkdir -p types
mkdir -p submissions

# Create .env.local
echo -e "${GREEN}Creating .env.local...${NC}"
cat > .env.local << EOF
OPENAI_API_KEY=sk-your-key-here
# Add your OpenAI API key above
EOF

# Create a basic type file
cat > types/index.ts << 'EOF'
export interface JDSummary {
  summary: string;
  key_requirements: string[];
  company_context: string;
}

export interface EmailDraft {
  email_body: string;
  subject: string;
  confidence_score: number;
}

export interface GitHubResult {
  repo_url: string;
  pr_url: string;
  commit_sha: string;
  files_created: string[];
}

export interface TaskResult {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  agents: {
    jd_summarizer?: JDSummary;
    email_drafter?: EmailDraft;
    github_publisher?: GitHubResult;
  };
}
EOF

# Create a sample agent
cat > lib/agents/jd-summarizer.ts << 'EOF'
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import type { JDSummary } from "@/types";

const outputSchema = z.object({
  summary: z.string().max(300).describe("Concise summary of the role"),
  key_requirements: z.array(z.string()).describe("List of key requirements"),
  company_context: z.string().describe("Company background and culture"),
});

export async function summarizeJD(jdText: string): Promise<JDSummary> {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7,
  });

  const parser = StructuredOutputParser.fromZodSchema(outputSchema);
  
  const prompt = `
    Analyze this job description and provide:
    1. A concise summary (max 300 words)
    2. Key requirements as a list
    3. Company context and culture
    
    Job Description:
    ${jdText}
    
    {format_instructions}
  `;

  const chain = model.pipe(parser);
  
  return await chain.invoke({
    messages: [{
      role: "user",
      content: prompt.replace("{format_instructions}", parser.getFormatInstructions())
    }]
  });
}
EOF

# Create GitHub publisher stub
cat > lib/agents/github-publisher.ts << 'EOF'
import { exec } from 'child_process';
import { promisify } from 'util';
import type { GitHubResult } from '@/types';

const execAsync = promisify(exec);

export async function publishToGitHub(
  company: string,
  summary: string,
  email: string,
  resumePath: string
): Promise<GitHubResult> {
  // Detect environment
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    // TODO: Implement Octokit-based publishing for Vercel
    throw new Error('GitHub publishing on Vercel requires GITHUB_TOKEN and Octokit implementation');
  } else {
    // Local development: use GitHub CLI
    try {
      await execAsync('gh auth status');
    } catch (error) {
      throw new Error('GitHub CLI not authenticated. Run: gh auth login');
    }
    
    // TODO: Implement gh CLI-based publishing
    return {
      repo_url: 'https://github.com/user/repo',
      pr_url: 'https://github.com/user/repo/pull/1',
      commit_sha: 'abc123',
      files_created: [`submissions/${company}/role_summary.md`]
    };
  }
}
EOF

echo -e "${GREEN}✅ Initial setup complete!${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANT: You must update .env.local with your OpenAI API key${NC}"
echo -e "${YELLOW}📝 Edit: adi-vp-agent-demo/.env.local${NC}"
echo ""
echo -e "${BLUE}After adding your API key, run this script again to start the app:${NC}"
echo -e "${GREEN}./quickstart.sh${NC}"
echo ""
echo -e "${YELLOW}For Vercel deployment later:${NC}"
echo "- Add GITHUB_TOKEN to .env.local"
echo "- Run: vercel" 