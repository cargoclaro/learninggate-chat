# End Working Tree

**Purpose**: Complete feature development by merging to dev and cleaning up the worktree.

**Usage**: `/end-worktree`

## Instructions

This command should be run from inside the worktree when your feature is complete and ready to merge.

### Step 1: Final Validation
Ensure everything is ready for merge:
```bash
pnpm run typecheck && pnpm run build
```

### Step 2: Commit Any Remaining Changes
Check for uncommitted work:
```bash
git status
```

If there are uncommitted changes, ask user to commit them:
```bash
git add . && git commit -m "feat: [ask user for commit message]"
```

### Step 3: Push Final Changes
Push any final commits to the feature branch:
```bash
git push origin $(git branch --show-current)
```
