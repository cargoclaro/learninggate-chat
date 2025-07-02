# Merge Working Tree to Dev

**Purpose**: Merge a feature branch from a working tree into the dev branch and clean up.

**Usage**: `/merge-worktree-to-dev`

## Instructions

This command helps you merge a completed feature from a working tree into the main dev branch.

### Step 1: List Available Working Trees
First, let's see what working trees you have:
```bash
git worktree list
```

### Step 2: User Selection
Ask the user: "Which working tree/feature branch would you like to merge into dev? Please specify the branch name."

### Step 3: Switch to Main Dev Worktree
Navigate to your main development worktree:
```bash
cd /Users/santipandal/glosa
```

### Step 4: Pull Latest Dev Changes
Ensure dev is up to date:
```bash
git pull origin dev
```

### Step 5: Merge Feature Branch
Merge the selected feature branch:
```bash
git merge [selected-branch-name]
```

### Step 6: Push Merged Changes
Push the updated dev branch:
```bash
git push origin dev
```

### Step 7: Clean Up - Delete Feature Branch
Remove the feature branch locally and remotely:
```bash
# Delete locally
git branch -d [selected-branch-name]

# Delete remotely (if it exists on remote)
git push origin --delete [selected-branch-name]
```

### Step 8: Remove the Working Tree
Clean up the working tree directory:
```bash
git worktree remove [worktree-path]
```

### Step 9: Verification
Confirm the merge worked correctly:
```bash
git log --oneline -5
```

## Why This Works

Think of worktrees like having two copies of your project in different folders. Each worktree can be on a different branch. When you merge, you're telling git: "take all the changes from this branch and combine them with dev."

The cleanup is important - it removes the extra folder and tells git you don't need that separate workspace anymore.

## Quick Check
After merging, the `git log --oneline -5` command shows you the recent commits and you should see your feature branch changes now in dev. 