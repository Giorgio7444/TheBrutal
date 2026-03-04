# 📋 Command Reference - Estetica Digitale

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🔧 Project Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your Supabase credentials
nano .env.local
# or
code .env.local
```

## 📦 Dependency Management

```bash
# Add new package
npm install package-name

# Remove package
npm uninstall package-name

# Update all packages (use with caution)
npm update

# Check for outdated packages
npm outdated

# Install specific version
npm install package-name@1.2.3
```

## 🐛 Debugging

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite/

# Check for build errors
npm run build 2>&1 | tee build.log

# Run with verbose output
npm run dev -- --debug
```

## 📱 Browser DevTools

```
F12 or Right-click → Inspect
Ctrl+Shift+K (Firefox Console)
Cmd+Option+I (macOS)
```

### Useful DevTools Commands

```javascript
// Vue DevTools (after installing extension)
// Check app state
vue

// View component tree
// Check reactive data
// Monitor performance

// Supabase auth state
console.log(useAuthStore())

// View articles in store
console.log(useArticlesStore().articles)

// Check browser localStorage
localStorage.getItem('theme')
localStorage.getItem('auth-token')
```

## 🗂️ File Structure Navigation

```bash
# Go to project root
cd estetica-digitale

# View directory structure
tree -I 'node_modules|dist' -L 2

# Or use ls with formatting
ls -la src/

# Find specific component
find . -name "*ArticleCard*"

# Search for string in files
grep -r "function name" src/
```

## 📝 Editing Files

```bash
# Edit with VS Code
code .

# Or any editor
nano src/App.vue
vim src/stores/auth.js
```

## 🔍 Git Commands (per versioning)

```bash
# Initialize git
git init

# Check status
git status

# Stage files
git add .

# Commit
git commit -m "Initial commit: Estetica Digitale prototype"

# View log
git log --oneline

# Create branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/new-feature
```

## 🚀 Deployment Commands

```bash
# Production build
npm run build

# Verify build
npm run preview

# Check build size
ls -lh dist/

# Build and preview together
npm run build && npm run preview
```

## 📚 Documentation Viewing

```bash
# Open README in terminal
cat README.md

# Or with less (paging)
less README.md

# Search in file
grep -n "setup" SUPABASE_SETUP.md

# Count lines of code
find src -type f -name "*.vue" -o -name "*.js" | xargs wc -l
```

## 🎯 Useful npm Scripts (pode aggiungere)

Se decidi di aggiungere questi al package.json:

```bash
# Format code (add Prettier)
npm run format

# Fix linting (add ESLint)
npm run lint
npm run lint:fix

# Type checking (if TypeScript added)
npm run type-check

# Run tests
npm run test
npm run test:e2e
```

## 💻 Terminal Shortcuts

```bash
# Clear screen
clear
# or Ctrl+L

# List files
ls -la

# Change directory
cd path/to/directory

# Go back
cd ..

# Go home
cd ~

# Print working directory
pwd

# Create directory
mkdir new-folder

# Create file
touch new-file.txt

# Remove file
rm file.txt

# Remove directory
rm -rf folder/

# Copy file
cp source.txt destination.txt

# Move/rename
mv old-name.txt new-name.txt

# View file content
cat filename.txt
```

## 🔄 Process Management

```bash
# List running processes
ps aux | grep node

# Kill process on port 5173
# macOS/Linux:
lsof -i :5173
kill -9 <PID>

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## 🌐 Network Debugging

```bash
# Check if Supabase is reachable
curl https://your-project.supabase.co

# Check DNS
nslookup supabase.co

# Trace network path
ping supabase.co

# Test API endpoint
curl -X GET https://your-project.supabase.co/rest/v1/articles
```

## 📊 Project Statistics

```bash
# Count components
ls -1 src/components/**/*.vue | wc -l

# Count lines in Vue files
find src -name "*.vue" -exec wc -l {} + | tail -1

# Count all lines
find src -type f \( -name "*.vue" -o -name "*.js" -o -name "*.css" \) \
  -exec wc -l {} + | tail -1

# List all files by size
ls -lhSr src/ | head -20
```

## 🔐 Environment Variables

```bash
# Check if .env.local is loaded
cat .env.local

# Verify variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Add to .env.local (don't commit!)
echo "VITE_KEY=value" >> .env.local
```

## 📈 Performance Check

```bash
# Webpack bundle analyzer (if added)
npm run build:analyze

# Check largest files in dist
du -sh dist/* | sort -h | tail -10

# Check bundle size
ls -lh dist/assets/*.js
```

## 🎓 Learning Resources

```bash
# Open documentation in browser
open https://vuejs.org
open https://supabase.com/docs
open https://tailwindcss.com/docs

# Or on Linux
xdg-open https://...
```

## ✅ Pre-deployment Checklist Commands

```bash
# 1. Check Node version
node -v

# 2. Clean install
rm -rf node_modules package-lock.json
npm install

# 3. Build
npm run build

# 4. Check for errors
npm run build 2>&1 | grep -i "error"

# 5. Test build
npm run preview

# 6. List files to deploy
ls -la dist/

# 7. Check env vars are set
test -n "$VITE_SUPABASE_URL" && echo "URL set" || echo "URL missing"
test -n "$VITE_SUPABASE_ANON_KEY" && echo "Key set" || echo "Key missing"
```

## 🆘 Quick Troubleshooting

```bash
# Port already in use
# Kill process and retry
lsof -i :5173
kill -9 <PID>
npm run dev

# Module not found
# Reinstall deps
rm -rf node_modules package-lock.json
npm install

# CSS not loading
# Check Tailwind config
npm run build
npm run preview

# Import errors
# Check path aliases in jsconfig.json
# Verify file exists in src/

# Memory issues during build
# Increase Node heap
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

**Pro Tip**: Salva questi comandi come alias nel tuo .bashrc o .zshrc!

```bash
# In ~/.bashrc or ~/.zshrc
alias dev='npm run dev'
alias build='npm run build'
alias preview='npm run preview'
alias lint='npm run lint'
```

Poi usa: `dev` al posto di `npm run dev`
