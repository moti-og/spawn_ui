# Pro-App Setup Progress Summary

## Overview
This document tracks progress through the README setup steps for getting pro-app running locally on Windows.

## README Steps Breakdown

### Prerequisites (from README)
- ✅ Docker Desktop installed and running
- ✅ Git Bash installed (for running bash aliases)
- ⚠️ LocalStack - not yet installed/configured
- ⚠️ AWS CLI v2 - not yet verified
- ⚠️ awslocal - not yet installed
- ⚠️ npm/node - not yet verified
- ⚠️ SSH keys for GitHub - not yet verified
- ⚠️ pro-sync repository - not yet cloned

### Main Setup Steps (from README)

#### ✅ Step 1: Clone Repository
- **Status:** COMPLETE
- **Location:** `C:\dev\pro-app` (moved from OneDrive to avoid sync issues)
- **Action Taken:** Cloned fresh from GitHub to pure local directory

#### ✅ Step 2: Create .env File
- **Status:** COMPLETE
- **Action Taken:** Copied `docker/env/local/.env_file` to `docker/env/local/.env`

#### ✅ Step 3: Fill .env with Secrets
- **Status:** PARTIALLY COMPLETE
- **Completed:**
  - Added dummy values for `AUTH0_CLIENT_ID`, `AUTH0_UI_CLIENT_ID`, `AUTH0_CLIENT_SECRET` (dummy values work per README)
  - `ENCRYPTION_KEY` already had dummy value in template
- **Still Needed:**
  - Real AWS credentials (needed for Step 5 - localstack S3 sync)
  - Other optional secrets can be added later

#### ✅ Step 4: Configure Shell Profile
- **Status:** COMPLETE
- **Issue:** README assumes Mac/Linux (bash/zsh), but we're on Windows
- **Solution:** Created `~/.bash_profile` directly in Git Bash (not via PowerShell) with correct path format:
  ```
  export REPO_PATH=/c/dev/pro-app
  export SYNC_REPO_PATH=/c/dev/pro-sync
  export DOCKER_ENV=local
  export AWS_PROFILE_FOR_LOCALSTACK=procurement-production-read
  source $REPO_PATH/docker/env/$DOCKER_ENV/aliases.sh
  ```
- **Key Learnings:**
  - Git Bash uses `/c/` path format, NOT `/mnt/c/` (that's WSL format)
  - Writing the file via PowerShell caused BOM encoding issues
  - Solution: Write directly in Git Bash using heredoc: `cat > ~/.bash_profile << 'EOF'`
  - Verification: Use `type pro_build_images` (not `which` - which doesn't find aliases)

#### ✅ Step 5: Source Profile
- **Status:** COMPLETE
- **Action:** Ran `source ~/.bash_profile` in Git Bash terminal
- **Verification:** Confirmed aliases load correctly with `type pro_build_images`
- **Result:** All aliases from `aliases.sh` are now available

#### ⏸️ Step 6: Sync LocalStack S3
- **Status:** PENDING (requires AWS credentials)
- **Action:** Run `pro_localstack_s3_sync`
- **Blockers:** 
  - Needs AWS credentials in .env
  - Profile is now working (Step 4-5 complete)
  - May need LocalStack installed

#### ⏸️ Step 7: Build Docker Images
- **Status:** READY (can proceed)
- **Action:** Run `pro_build_images`
- **Blockers:** None - profile is working (Step 4-5 complete)
- **Note:** This is where we rebuild containers fresh from new location

#### ⏸️ Step 8: Start Services
- **Status:** PENDING
- **Action:** Run `pro_services_start`
- **Blockers:** Needs Step 7 complete
- **Note:** Will start postgres, redis, and other infrastructure containers

#### ⏸️ Step 9: Setup npm Token
- **Status:** PENDING
- **Action:** Copy `.npmrc-template` to `.npmrc` and add npm token
- **Blockers:** None - can be done independently

#### ⏸️ Step 10: Install Dependencies
- **Status:** PENDING
- **Action:** Run `pro_npm ci`
- **Blockers:** Needs Step 9 (npm token) and profile working

#### ⏸️ Step 11: Build Sync Dependencies
- **Status:** PENDING
- **Action:** Run `pro_build_sync_deps`
- **Blockers:** Needs pro-sync repo cloned, profile working

#### ⏸️ Step 12: Seed Dev Database
- **Status:** PENDING
- **Action:** Run `pro_seed_dev_data`
- **Blockers:** Needs AWS credentials, services running (Step 8)

#### ⏸️ Step 13: Seed Test Database
- **Status:** PENDING
- **Action:** Run `pro_seed_test_data`
- **Blockers:** Needs Step 12 complete

#### ⏸️ Step 14: Start Application
- **Status:** PENDING
- **Action:** Run `pro_start_http` or `pro_start_https`
- **Blockers:** Needs all previous steps complete

## Current Status

### ✅ Profile Configuration - RESOLVED
The README assumes Mac/Linux environment with bash/zsh. We're on Windows and need to use Git Bash.

**What Worked:**
- Created `~/.bash_profile` directly in Git Bash (not via PowerShell)
- Used correct path format: `/c/dev/pro-app` (Git Bash format, not `/mnt/c/` which is WSL)
- Verified aliases load correctly with `type pro_build_images`
- All Docker aliases from `aliases.sh` are now available

**Key Lessons Learned:**
- PowerShell encoding (BOM) causes issues when writing bash files
- Git Bash path format is `/c/` not `/mnt/c/`
- Use `type` command to verify aliases, not `which` (which only finds executables)
- Writing directly in Git Bash avoids all encoding issues

**Troubleshooting Journey:**
1. Initially tried writing profile via PowerShell - encountered BOM encoding errors
2. Tried multiple PowerShell approaches (Out-File with different encodings, .NET methods) - all failed
3. Discovered path format confusion: tried `/mnt/c/` (WSL format) instead of `/c/` (Git Bash format)
4. User wrote file directly in Git Bash using heredoc - this worked immediately
5. Learned that `which` doesn't find aliases (they're shell functions, not executables)
6. Used `type pro_build_images` to verify aliases were loading correctly

**Next Steps:**
- Step 6: Can skip for now (needs AWS credentials)
- Step 7: Ready to proceed with `pro_build_images` (build Docker images)

## Additional Notes

### Old Containers
- There are existing Docker containers from previous OneDrive setup attempts
- These should be cleaned up before starting fresh build
- Can be done with: `docker ps` to see them, then stop/remove as needed

### Windows-Specific Considerations
- README is Mac/Linux focused
- Using Git Bash instead of native shell
- **Path format:** `/c/dev/pro-app` (Git Bash format) - NOT `/mnt/c/` (that's WSL format)
- Windows path `C:\dev\pro-app` maps to Git Bash path `/c/dev/pro-app`
- Docker Desktop is running and working
- **Important:** Write bash profile files directly in Git Bash, not via PowerShell (avoids BOM encoding issues)

### Dependencies Still Needed
- AWS credentials (for S3 sync and database seeding)
- npm token (for installing dependencies)
- pro-sync repository (for sync-related commands)
- LocalStack (may need installation/configuration)
- AWS CLI and awslocal (may need installation/verification)

## Questions for DevOps Engineer
1. ~~How to properly configure bash profile on Windows for these aliases?~~ ✅ RESOLVED
2. Do we need to install LocalStack separately or is it containerized?
3. AWS credentials setup process (needed for Step 6: `pro_localstack_s3_sync` and Step 12: database seeding)
4. npm token setup process (needed for Step 9)
5. Should we clean up old containers first? (from previous OneDrive setup attempts)
6. Do we need to clone pro-sync repository? (needed for Step 11: `pro_build_sync_deps`)

