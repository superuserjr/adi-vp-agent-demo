#!/bin/bash
#
# VP Agent Demo - Smart Launcher Script
# 
# This script handles both initial setup and daily startup:
# - First run: Sets up dependencies and environment
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

# Navigate to frontend directory
cd frontend

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

# For GitHub integration (optional for local dev)
# GITHUB_TOKEN=ghp_your_token_here

# For Vercel deployment (auto-generated)
# KV_URL=your_vercel_kv_url
EOF
    echo -e "${RED}❌ Please update frontend/.env.local with your OpenAI API key${NC}"
    exit 1
fi

# Check if API key is still the placeholder
if grep -q "sk-your-key-here" .env.local; then
    echo -e "${RED}❌ Please update frontend/.env.local with your actual OpenAI API key${NC}"
    exit 1
fi

# Start the dev server
echo -e "${GREEN}🚀 Starting development server...${NC}"
echo -e "${BLUE}📱 Opening http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Features available:${NC}"
echo "  ✅ Multi-step wizard interface"
echo "  ✅ JD Analysis with key insights extraction"
echo "  ✅ VP-style email generation from writing samples"
echo "  ✅ Smart GitHub publishing with PR creation"
echo "  ✅ Real-time preview and editing"
echo ""
npm run dev 