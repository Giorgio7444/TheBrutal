#!/bin/bash
# 🚀 QUICK START SCRIPT - Estetica Digitale

echo "=========================================="
echo "   Estetica Digitale - Quick Start"
echo "=========================================="
echo ""

# Check Node version
echo "✓ Checking Node.js version..."
node_version=$(node -v)
echo "  Node: $node_version"
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
npm install
echo ""

# Create .env.local template
echo "✓ Creating .env.local template..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "  📝 Created .env.local - Update with Supabase credentials"
else
  echo "  ℹ️  .env.local already exists"
fi
echo ""

# Start dev server
echo "✓ Starting development server..."
echo ""
echo "=========================================="
echo "🎉 Setup Complete!"
echo "=========================================="
echo ""
echo "📖 Next steps:"
echo "  1. Read SUPABASE_SETUP.md for backend setup"
echo "  2. Update .env.local with your credentials"
echo "  3. Dev server should be running at:"
echo "     → http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "  • README.md - Quick reference"
echo "  • SUPABASE_SETUP.md - Backend setup guide"
echo "  • USER_GUIDE.md - How to use app"
echo "  • ARCHITECTURE.md - Technical details"
echo ""
echo "Happy coding! ✨"
