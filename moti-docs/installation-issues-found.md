# Installation Issues Found - Step-by-Step Analysis

## Overview
Executed the README steps one by one to identify where the installation is getting blocked. Here are the findings:

## ✅ Steps That Are Complete

1. **Step 1: .env file exists** ✓
   - `.env` file is present in `docker/env/local/`
   - Copied from `.env_file`

2. **Step 2: .env file has ENCRYPTION_KEY** ✓
   - ENCRYPTION_KEY is set (though it's a test/dummy value)
   - ENCRYPTION_KEY_VERSION is set

3. **Step 7: Services are running** ✓
   - All infrastructure services are up and running:
     - postgres, redis, kafka, opensearch, localstack, dynamodb, flink
   - Application containers are also running:
     - pro_api, nginx, sendgrid_webhook_service, public_gateway

4. **Step 8: .npmrc file exists** ✓
   - `.npmrc` file is present in the root directory
   - Contains npm token

## ❌ Issues Found

### Issue 1: Missing AWS Credentials (CRITICAL)
**Location:** Step 2, Step 5, Step 9, and throughout

**Problem:**
- The `.env` file has:
  ```
  AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
  ```
- These environment variables are NOT set in the PowerShell session
- Docker Compose is showing warnings:
  ```
  The "AWS_ACCESS_KEY_ID" variable is not set. Defaulting to a blank string.
  The "AWS_SECRET_ACCESS_KEY" variable is not set. Defaulting to a blank string.
  ```

**Impact:**
- Step 5 (`pro_localstack_s3_sync`) will fail - needs AWS credentials to sync S3 buckets
- Any operations that need AWS access will fail
- Database seeding may fail if it requires AWS credentials

**Solution:**
1. Get AWS credentials from 1Password or your team
2. Set them in PowerShell:
   ```powershell
   $env:AWS_ACCESS_KEY_ID = "your-access-key"
   $env:AWS_SECRET_ACCESS_KEY = "your-secret-key"
   ```
3. OR add them directly to the `.env` file (but be careful not to commit them!)

### Issue 2: Missing Docker Images
**Location:** Step 6

**Problem:**
- Missing images:
  - `pro_sync` (needed for sync service)
  - `flink_sql_client` (needed for Flink SQL operations)
- Present images:
  - `pro_app` ✓
  - `pro_postgres` ✓
  - `kafka_connect` ✓

**Impact:**
- Step 6 (`pro_build_images`) needs to build these missing images
- Step 10 (`pro_build_sync_deps`) will fail without `pro_sync` image
- Flink SQL operations will fail

**Solution:**
Run `pro_build_images` to build all required images. This requires:
- `pro-sync` repository to be cloned (✓ confirmed it exists)
- Proper environment variables set

### Issue 3: Docker Mount Path Issue with OneDrive
**Location:** Step 9 (`pro_npm ci`)

**Problem:**
- Error when trying to run Docker commands:
  ```
  Error response from daemon: error while creating mount source path 
  '/run/desktop/mnt/host/c/Users/msokrin/OneDrive - OpenGov, Inc/Useful files/pro-app': 
  mkdir /run/desktop/mnt/host/c: file exists
  ```
- This is a known Docker Desktop issue with:
  - Spaces in paths
  - OneDrive paths
  - Long paths

**Impact:**
- Any Docker command that mounts volumes will fail
- `pro_npm ci` fails
- Most development commands will fail

**Solutions (try in order):**
1. **Move the repository out of OneDrive** (Recommended)
   - Clone to a simpler path like `C:\dev\pro-app`
   - OneDrive can cause sync conflicts and path issues

2. **Use WSL2 with Docker**
   - Install WSL2
   - Clone repos in WSL2 filesystem (e.g., `~/pro-app`)
   - Run all commands from WSL2

3. **Use Docker Desktop WSL2 backend**
   - Enable WSL2 integration in Docker Desktop settings
   - This may help with path handling

4. **Use Git Bash instead of PowerShell**
   - Git Bash may handle paths better
   - But the underlying Docker issue will likely persist

### Issue 4: Step 5 - LocalStack S3 Sync Requires Bash
**Location:** Step 5

**Problem:**
- `localstack_sync_s3.sh` is a bash script
- PowerShell cannot directly execute bash scripts
- Need to use Git Bash, WSL, or convert to PowerShell

**Solution:**
- Use Git Bash to run: `pro_localstack_s3_sync`
- OR manually run the AWS S3 sync commands in PowerShell:
  ```powershell
  aws s3 sync s3://development-government-project docker\env\local\s3-buckets\development-government-project --profile procurement-production-read
  aws s3 sync s3://procure-now/docx-templates/defaults docker\env\local\s3-buckets\procure-now/docx-templates/defaults --profile procurement-production-read
  ```

### Issue 5: Shell Profile Not Set Up for PowerShell
**Location:** Step 3-4

**Problem:**
- The README assumes bash/zsh shell
- PowerShell cannot source `.sh` files
- Aliases from `aliases.sh` are not available

**Current Status:**
- Environment variables are being set manually in PowerShell session
- Aliases are not available (need to use full docker compose commands)

**Solution:**
- Use Git Bash (recommended in `windows-powershell-setup.md`)
- OR create PowerShell functions for the aliases (lot of work)
- OR continue using full docker compose commands

## 🔧 Recommended Fix Order

1. **Fix Issue 3 FIRST** (Docker mount path)
   - Move repo out of OneDrive OR use WSL2
   - This blocks most other steps

2. **Fix Issue 1** (AWS credentials)
   - Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
   - Either in environment or in .env file

3. **Fix Issue 4** (Use Git Bash)
   - Switch to Git Bash for running bash scripts
   - Or manually run the commands

4. **Fix Issue 2** (Build missing images)
   - Run `pro_build_images` after fixing above issues

5. **Continue with remaining steps**

## 📝 Next Steps

1. **Decide on path solution:**
   - Option A: Move repo to `C:\dev\pro-app` (simplest)
   - Option B: Set up WSL2 and work from there (more robust)

2. **Set AWS credentials:**
   - Get from 1Password
   - Set in PowerShell session or add to .env

3. **Use Git Bash for bash scripts:**
   - Open Git Bash
   - Source your profile
   - Run the remaining steps

4. **Build missing images:**
   - After fixing path and credentials
   - Run the build commands

## Testing Commands

To test if issues are resolved:

```powershell
# Test Docker mount (should not error)
docker compose -f "docker\env\local\commands-docker-compose.yml" run --rm npm_docker --version

# Test AWS credentials (should not show warnings)
docker compose -f "docker\env\local\services-docker-compose.yml" config

# Check images
docker images | Select-String "pro_|kafka_|flink_"
```

