@echo off
cd /d "%~dp0"
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo ===================================
echo   WARNING: Resetting Git Repository
echo   Deleting .git folder and nested repos...
echo ===================================
if exist .git (
    rmdir /s /q .git
)
if exist yvo____ (
    rmdir /s /q yvo____
)

echo ===================================
echo   Initializing Fresh Repository...
echo ===================================
%GIT_PATH% init
%GIT_PATH% branch -M main

echo ===================================
echo   Adding ALL files...
echo ===================================
%GIT_PATH% add .

echo ===================================
echo   Committing changes...
echo ===================================
%GIT_PATH% commit -m "Fresh Upload: Complete project reset"

echo ===================================
echo   Configuring Remote Repository...
echo ===================================
%GIT_PATH% remote add origin https://github.com/YVO-Company/final.git

echo ===================================
echo   Pushing to GitHub (Force Overwrite)...
echo ===================================
%GIT_PATH% push -u origin main --force

echo ===================================
echo   Done!
echo ===================================
pause
