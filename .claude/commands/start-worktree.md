# Setup Worktree

**Purpose**: Complete the worktree setup with dependencies and verification (run from inside the worktree).

**Usage**: `/start-worktree`

## Instructions

This command should be run from inside the worktree directory after using `/create-working-tree`.

### Step 1: Verify Location
Check that we're in the correct worktree:
```bash
pwd && git branch --show-current
```

### Step 2: Install Dependencies
Execute this single command:
```bash
pnpm install
```

### Step 3: Verify Setup
Execute this single command:
```bash
pnpm run typecheck
```

### Step 4: Publish Branch
Push the new branch to origin:
```bash
git push -u origin $(git branch --show-current)
```

### Step 5: Report Ready Status
Tell the user:
```
✅ Worktree setup complete!

🚀 Ready for development:
- Dependencies installed ✅
- TypeScript validated ✅
- Environment files copied ✅
- Branch published to origin ✅

💡 Start developing:
pnpm dev

🔄 Remember to run typecheck before commits!

