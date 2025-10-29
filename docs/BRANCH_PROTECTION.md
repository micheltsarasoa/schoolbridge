# Branch Protection Rules Setup

This document provides step-by-step instructions for configuring branch protection rules on GitHub to ensure code quality and prevent accidental changes to critical branches.

## Overview

Branch protection rules help maintain code quality by:
- Requiring pull requests before merging
- Enforcing status checks (CI/CD)
- Preventing force pushes and branch deletion
- Requiring code reviews
- Enforcing linear history

## Prerequisites

- Repository administrator or owner access
- CI/CD workflows configured (already done in this project)
- Team members added to repository

## Step-by-Step Setup

### 1. Navigate to Branch Protection Settings

1. Go to your GitHub repository: `https://github.com/micheltsarasoa/schoolbridge`
2. Click on **Settings** tab
3. In the left sidebar, click **Branches**
4. Click **Add branch protection rule** (or **Add rule**)

### 2. Configure Main Branch Protection

#### Branch Name Pattern
```
main
```

#### Protection Rules to Enable

##### ✅ Require a pull request before merging
- **Purpose**: Ensures all changes go through PR review process
- **Configuration**:
  - ✅ Require approvals: `1` (minimum)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (optional, configure later)
  - ⬜ Restrict who can dismiss pull request reviews (optional)
  - ⬜ Allow specified actors to bypass required pull requests (optional)
  - ✅ Require approval of the most recent reviewable push

##### ✅ Require status checks to pass before merging
- **Purpose**: Ensures CI/CD checks pass before merging
- **Configuration**:
  - ✅ Require branches to be up to date before merging
  - **Required status checks** (select these after first workflow run):
    - `Lint and Type Check`
    - `Build Application`
    - `Run Tests`
    - `Security Scan`

##### ✅ Require conversation resolution before merging
- **Purpose**: Ensures all PR comments are addressed

##### ✅ Require signed commits (Optional but Recommended)
- **Purpose**: Ensures commit authenticity
- **Note**: Requires GPG key setup for contributors

##### ✅ Require linear history
- **Purpose**: Prevents merge commits, keeps history clean
- **Note**: Forces rebase or squash merges only

##### ✅ Require deployments to succeed before merging (Optional)
- **Purpose**: Ensures deployment previews work
- **Select environment**: `preview` (if configured)

##### ⬜ Lock branch
- **Purpose**: Makes branch read-only
- **Note**: Not recommended for active development branches

##### ✅ Do not allow bypassing the above settings
- **Purpose**: Applies rules to administrators too
- **Recommended**: Enable for strict enforcement

##### ✅ Restrict who can push to matching branches (Optional)
- **Purpose**: Limits who can directly push to branch
- **Configuration**: Select users/teams who can push

##### ⬜ Allow force pushes
- **Purpose**: Permits force pushing
- **Note**: NOT recommended for main branch

##### ⬜ Allow deletions
- **Purpose**: Permits branch deletion
- **Note**: NOT recommended for main branch

### 3. Configure Develop Branch Protection (Optional)

If you're using a develop branch for staging:

#### Branch Name Pattern
```
develop
```

#### Protection Rules (Slightly More Relaxed)
- ✅ Require a pull request before merging
  - Require approvals: `1`
- ✅ Require status checks to pass before merging
  - Same checks as main branch
- ✅ Require conversation resolution before merging
- ⬜ Require signed commits (optional)
- ⬜ Require linear history (optional)
- ✅ Do not allow bypassing the above settings (optional)
- ⬜ Allow force pushes (only if needed)
- ⬜ Allow deletions

### 4. Configure Feature Branch Pattern (Optional)

Protect all feature branches:

#### Branch Name Pattern
```
feature/*
```

#### Protection Rules (Minimal)
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ⬜ Other rules optional

## Recommended Configuration Summary

### Main Branch (`main`)

| Rule | Enabled | Configuration |
|------|---------|---------------|
| Require pull requests | ✅ | 1 approval minimum |
| Require status checks | ✅ | All CI/CD checks |
| Require conversation resolution | ✅ | - |
| Require signed commits | ⚠️ Optional | Recommended |
| Require linear history | ✅ | - |
| Do not allow bypass | ✅ | - |
| Allow force pushes | ❌ | - |
| Allow deletions | ❌ | - |

### Develop Branch (`develop`)

| Rule | Enabled | Configuration |
|------|---------|---------------|
| Require pull requests | ✅ | 1 approval minimum |
| Require status checks | ✅ | All CI/CD checks |
| Require conversation resolution | ✅ | - |
| Require signed commits | ⬜ | Optional |
| Require linear history | ⬜ | Optional |
| Do not allow bypass | ⬜ | Optional |
| Allow force pushes | ⬜ | Only if needed |
| Allow deletions | ❌ | - |

## After First Workflow Run

Status checks won't appear in the dropdown until workflows have run at least once. To make them available:

1. Make a small change and push to trigger workflows
2. Wait for workflows to complete
3. Return to branch protection settings
4. Select required status checks from the dropdown

## Code Owners Setup (Optional)

Create a `CODEOWNERS` file to automatically request reviews from specific team members:

1. Create `.github/CODEOWNERS` file:
```
# Global owners
* @micheltsarasoa

# Database schema
/prisma/ @micheltsarasoa

# Documentation
/docs/ @micheltsarasoa

# CI/CD
/.github/ @micheltsarasoa

# Frontend components
/src/components/ @frontend-team

# Backend API
/src/app/api/ @backend-team
```

2. Enable "Require review from Code Owners" in branch protection

## GPG Commit Signing Setup (Optional)

### For Contributors

1. **Generate GPG key**:
```bash
gpg --full-generate-key
# Select: RSA and RSA, 4096 bits, no expiration
# Enter your name and email (must match GitHub email)
```

2. **List GPG keys**:
```bash
gpg --list-secret-keys --keyid-format=long
```

3. **Export public key**:
```bash
gpg --armor --export YOUR_KEY_ID
```

4. **Add to GitHub**:
   - Go to GitHub Settings → SSH and GPG keys
   - Click "New GPG key"
   - Paste public key

5. **Configure Git**:
```bash
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```

## Testing Branch Protection

### Test 1: Direct Push to Main
```bash
# This should fail
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test: direct push"
git push origin main
```
**Expected**: Push rejected by branch protection

### Test 2: PR Without Approval
1. Create feature branch
2. Make changes and push
3. Create PR to main
4. Try to merge without approval
**Expected**: Merge blocked until approved

### Test 3: PR With Failed Checks
1. Create PR with linting errors
2. Wait for CI to fail
3. Try to merge
**Expected**: Merge blocked until checks pass

## Workflow Integration

Branch protection works with the CI/CD workflows we've configured:

1. **Developer creates PR** → Triggers `pr-check.yml`
2. **PR checks run** → Lint, test, build
3. **If checks fail** → PR cannot be merged
4. **If checks pass** → PR can be reviewed
5. **After approval** → PR can be merged
6. **Merge to main** → Triggers `deploy.yml`

## Troubleshooting

### Can't See Status Checks in Dropdown

**Solution**: Trigger workflows at least once by pushing code

### Administrator Can't Merge PR

**Solution**: Check if "Do not allow bypassing" is enabled. If yes, follow same rules as other contributors.

### Status Check Names Don't Match

**Solution**: Ensure job names in workflows match exactly:
- Workflow file: `name: Lint and Type Check`
- Branch protection: Select `Lint and Type Check`

### PR Shows "Waiting for status checks"

**Solution**:
1. Check if workflows are running in Actions tab
2. Verify workflow has correct branch triggers
3. Check if status check names match

## Best Practices

1. **Enable protection early**: Set up before team grows
2. **Start strict**: Easier to relax rules than tighten later
3. **Document exceptions**: If bypassing protection, document why
4. **Review regularly**: Update rules as team and project evolve
5. **Educate team**: Ensure everyone understands the rules
6. **Monitor compliance**: Check branch protection reports regularly

## Emergency Procedures

### Hotfix Process

For urgent production fixes:

1. **Create hotfix branch from main**:
```bash
git checkout main
git pull
git checkout -b hotfix/critical-bug
```

2. **Make minimal fix**
3. **Push and create PR**
4. **Fast-track review** (assign senior developer)
5. **Merge after approval and checks pass**

### Bypassing Protection (Emergency Only)

If administrator access is needed to bypass protection:

1. Temporarily disable protection rule
2. Make necessary changes
3. Re-enable protection immediately
4. Document action and reason

⚠️ **Warning**: Only use in extreme emergencies!

## Monitoring and Reporting

### View Protection Status

1. Go to repository **Insights** → **Network**
2. View branch history and protection compliance

### Audit Bypass Events

1. Go to repository **Settings** → **Audit log**
2. Filter for branch protection bypass events

## Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Code Owners Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GPG Signing Documentation](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)

## Support

For issues with branch protection:
1. Check GitHub Status: https://www.githubstatus.com/
2. Review GitHub Community Forums
3. Contact GitHub Support (if available)
