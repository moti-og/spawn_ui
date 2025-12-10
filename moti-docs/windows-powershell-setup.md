# Windows PowerShell Setup Guide

## The Problem
You're on Windows PowerShell, but the project's `aliases.sh` file is designed for bash/zsh (Linux/Mac). PowerShell can't directly source bash scripts.

## Solutions

### Option 1: Use Git Bash (Recommended for Windows)
Git Bash provides a bash-compatible environment on Windows.

1. **Install Git Bash** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Or install via: `winget install Git.Git` (note: it's `winget`, not `wingest`)

2. **Set up your profile in Git Bash**:
   - Open Git Bash
   - Edit `~/.bash_profile` (or create it if it doesn't exist)
   - Add the following (adjust paths for Windows):

   ```bash
   # Convert Windows path to Git Bash format
   # Example: C:\Users\msokrin\OneDrive - OpenGov, Inc\Useful files\pro-app
   # Becomes: /c/Users/msokrin/OneDrive\ -\ OpenGov,\ Inc/Useful\ files/pro-app
   
   export REPO_PATH="/c/Users/msokrin/OneDrive - OpenGov, Inc/Useful files/pro-app"
   export SYNC_REPO_PATH="/c/Users/msokrin/OneDrive - OpenGov, Inc/Useful files/pro-sync"
   export DOCKER_ENV="local"
   export AWS_PROFILE_FOR_LOCALSTACK=procurement-production-read
   
   source $REPO_PATH/docker/env/$DOCKER_ENV/aliases.sh
   ```

3. **Reload your profile**:
   ```bash
   source ~/.bash_profile
   ```

4. **Test it**:
   ```bash
   pro_npm --version
   ```

### Option 2: Use WSL (Windows Subsystem for Linux)
If you have WSL installed, you can use a full Linux environment.

1. **Install WSL** (if not installed):
   ```powershell
   wsl --install
   ```

2. **Clone your repos in WSL** and follow the Linux setup instructions from the README

### Option 3: Convert Aliases to PowerShell Functions
If you must use PowerShell, you can convert the aliases to PowerShell functions.

1. **Create a PowerShell profile script**:
   ```powershell
   # Edit your PowerShell profile
   notepad $PROFILE
   ```

2. **Add environment variables**:
   ```powershell
   $env:REPO_PATH = "C:\Users\msokrin\OneDrive - OpenGov, Inc\Useful files\pro-app"
   $env:SYNC_REPO_PATH = "C:\Users\msokrin\OneDrive - OpenGov, Inc\Useful files\pro-sync"
   $env:DOCKER_ENV = "local"
   $env:AWS_PROFILE_FOR_LOCALSTACK = "procurement-production-read"
   ```

3. **Create PowerShell functions** (example for `pro_npm`):
   ```powershell
   function pro_npm {
       docker compose -f "$env:REPO_PATH\docker\env\$env:DOCKER_ENV\commands-docker-compose.yml" run --rm npm_docker $args
   }
   ```

   **Note:** You'd need to convert all ~215 aliases from `aliases.sh` to PowerShell functions. This is a lot of work!

## Quick Fix for Right Now

Since `pro_npm` runs npm inside Docker, you can use this directly in PowerShell:

```powershell
# Set your paths first
$REPO_PATH = "C:\Users\msokrin\OneDrive - OpenGov, Inc\Useful files\pro-app"
$DOCKER_ENV = "local"

# Run the docker command directly
docker compose -f "$REPO_PATH\docker\env\$DOCKER_ENV\commands-docker-compose.yml" run --rm npm_docker ci
```

Or create a simple PowerShell function in your current session:

```powershell
function pro_npm {
    $REPO_PATH = "C:\Users\msokrin\OneDrive - OpenGov, Inc\Useful files\pro-app"
    $DOCKER_ENV = "local"
    docker compose -f "$REPO_PATH\docker\env\$DOCKER_ENV\commands-docker-compose.yml" run --rm npm_docker $args
}
```

Then you can use: `pro_npm ci`

## Recommendation

**Use Git Bash** - it's the easiest path forward and matches what the project expects. The aliases will work as-is once you set up your profile correctly.

