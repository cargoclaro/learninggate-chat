# Create Working Tree

**Purpose**: Create git worktree, setup environment, open Cursor IDE, and start Claude CLI for feature development.

**Usage**: `/create-working-tree`

## Instructions

Follow this exact step-by-step process:

### Step 1: Get Working Tree Information
Ask the user: **"What should I name this working tree/feature?"**

If they don't provide a name, suggest: `feature-$(date +%Y-%m-%d)`

Set initial variables:
- `BASE_NAME` = `[user-provided-name]`
- `BRANCH_NAME` = `feature/[user-provided-name]`  
- `WORKTREE_PATH` = `../glosa-[user-provided-name]`

### Step 2: Validate Branch Name
Check if branch already exists:
```bash
git branch -a | grep "feature/[user-provided-name]"
```

If branch exists, modify the name:
- `BRANCH_NAME` = `feature/[user-provided-name]-$(date +%Y-%m-%d)`
- `WORKTREE_PATH` = `../glosa-[user-provided-name]-$(date +%Y-%m-%d)`
- Tell user: "Branch feature/[user-provided-name] exists, using feature/[user-provided-name]-$(date +%Y-%m-%d) instead"

### Step 3: Pull Latest Dev
Execute this single command:
```bash
git checkout dev && git pull origin dev
```

### Step 4: Create Working Tree
Execute this single command:
```bash
git worktree add [WORKTREE_PATH] -b [BRANCH_NAME] dev
```

### Step 5: Copy Environment Files
Execute these commands:
```bash
cp ".env.local" "[WORKTREE_PATH]/" 2>/dev/null || echo "No .env.local found"
```
```bash
cp ".env" "[WORKTREE_PATH]/" 2>/dev/null || echo "No .env found"
```

### Step 6: Launch Cursor
Execute this single command:
```bash
cursor [WORKTREE_PATH]
```

### Step 7: Report Success
Tell the user:
```
✅ Working tree created and Cursor opened!

📍 Location: [WORKTREE_PATH]
🌿 Branch: [BRANCH_NAME]
💻 Cursor IDE: Opening...

🤖 Next steps:
1. Open new terminal
2. cd [WORKTREE_PATH]
3. Run: claude chat
4. Run: /setup-worktree

Cleanup when done:
cd ../glosa
git worktree remove [WORKTREE_PATH]
git branch -d [BRANCH_NAME]
```

## Important Notes
- Execute each command individually 
- Wait for each command to complete before moving to the next
- Replace [BRANCH_NAME] and [WORKTREE_PATH] with actual values
- Ask for confirmation if any command fails 