# Cleanup Development Garbage

**Purpose**: Clean up temporary files, test artifacts, and unintended changes that accumulate during development sessions.

**Usage**: `/cleanup-dev-garbage`

## Instructions

You are a meticulous code janitor. Your job is to identify and clean up development garbage while preserving essential changes.

### Step 1: Assess Current State
1. Run `git status` to see all staged and unstaged changes
2. Run `git diff --staged` to review staged changes
3. Run `git diff` to review unstaged changes

### Step 2: Identify Garbage Categories

**Common Garbage Patterns:**
- `.claude/commands/*.md` files created during development (except permanent commands)
- `*.sh` scripts created for temporary tasks
- `*test*.ts` or `*.spec.ts` files created for experimentation
- Backup files like `*.bak`, `*.tmp`, `*.orig`
- Log files and debug outputs
- Unintended changes to files that weren't part of the task
- Development documentation that shouldn't be committed
- Test data files in wrong locations

**Files to PRESERVE:**
- Core business logic changes
- Configuration updates
- Schema updates
- Component improvements
- Bug fixes
- New features

### Step 3: Clean Up Process

For each identified garbage file/change:

1. **Temporary scripts and commands**: 
   ```bash
   rm -f filename.sh
   git reset HEAD -- .claude/commands/temp-command.md
   ```

2. **Unintended file changes**:
   ```bash
   git checkout -- path/to/unintended-file.tsx
   ```

3. **Test files in wrong locations**:
   ```bash
   rm -f app/some-test-file.spec.ts
   git reset HEAD -- path/to/test-file.ts
   ```

4. **Staged garbage**:
   ```bash
   git reset HEAD -- garbage-file.xyz
   ```

### Step 4: Verify Clean State

1. Run `git status` again
2. Confirm only essential business changes remain staged
3. Run `pnpm run typecheck` to ensure no broken imports
4. Run `pnpm run build` to ensure everything still works

### Step 5: Report

Provide a summary:
- ❌ Files removed (with reasons)
- ✅ Essential changes preserved
- 📊 Final git status overview

## Example Decision Matrix

| File Type | Action | Reason |
|-----------|--------|---------|
| `cleanup-script.sh` | ❌ Remove | Temporary development script |
| `new-feature.tsx` | ✅ Keep | Core business logic |
| `test-data.json` in wrong folder | ❌ Remove | Misplaced test artifact |
| `schema-update.ts` | ✅ Keep | Essential schema change |
| `.claude/commands/temp.md` | ❌ Remove | Temporary development command |
| `component-fix.tsx` | ✅ Keep | Bug fix or improvement |

## Safety Rules

1. **Never remove without understanding** - Always explain why something is garbage
2. **Preserve user's work** - When in doubt, ask the user before removing
3. **Test after cleanup** - Always run typecheck and build
4. **Be surgical** - Remove only what's clearly garbage, not legitimate changes

## Follow-up Actions

After cleanup:
1. Suggest committing the clean changes
2. Recommend any missing documentation
3. Point out any potential improvements to the development workflow 