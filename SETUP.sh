#!/bin/bash

# Notifications System - Automated Setup Script
# This script helps you set up the project quickly

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     Notifications System API - Setup Script               ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js >= 18.x${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm --version) detected"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 2: Setup environment file
echo "⚙️  Step 2: Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env file created from .env.example"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Please edit .env file with your configuration:${NC}"
    echo "   - Set your DATABASE_URL"
    echo "   - Set your SERVICE_TOKEN"
    echo ""
    read -p "Press Enter to continue after editing .env file..."
else
    echo -e "${YELLOW}⚠️${NC}  .env file already exists, skipping..."
fi
echo ""

# Step 3: Generate Prisma Client
echo "🔧 Step 3: Generating Prisma Client..."
npm run prisma:generate
echo -e "${GREEN}✓${NC} Prisma Client generated"
echo ""

# Step 4: Database setup
echo "🗄️  Step 4: Setting up database..."
echo "Choose database setup method:"
echo "  1) Run migrations (recommended for production)"
echo "  2) Push schema (quick for development)"
echo "  3) Skip database setup"
read -p "Enter choice (1-3): " db_choice

case $db_choice in
    1)
        echo "Running migrations..."
        npm run prisma:migrate
        echo -e "${GREEN}✓${NC} Migrations completed"
        ;;
    2)
        echo "Pushing schema to database..."
        npm run prisma:push
        echo -e "${GREEN}✓${NC} Schema pushed"
        ;;
    3)
        echo -e "${YELLOW}⚠️${NC}  Skipping database setup"
        ;;
    *)
        echo -e "${RED}Invalid choice, skipping database setup${NC}"
        ;;
esac
echo ""

# Step 5: Build TypeScript
echo "🔨 Step 5: Building TypeScript..."
npm run build
echo -e "${GREEN}✓${NC} Build completed"
echo ""

# Final message
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     ✅ Setup Complete!                                    ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Quick Start Commands:"
echo ""
echo "  Development mode:"
echo "    npm run dev"
echo ""
echo "  Production mode:"
echo "    npm start"
echo ""
echo "  Open Prisma Studio:"
echo "    npm run prisma:studio"
echo ""
echo "📚 Documentation:"
echo "  • README.md - Full documentation"
echo "  • QUICKSTART.md - Quick start guide"
echo "  • API_EXAMPLES.md - API testing examples"
echo ""
echo "🔗 Default URLs (once started):"
echo "  • Public API:  http://localhost:3000/api/public"
echo "  • Private API: http://localhost:3000/api/private"
echo "  • Health:      http://localhost:3000/api/public/health"
echo ""
echo "Happy coding! 🎉"
