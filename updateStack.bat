@echo off

REM Loop through each directory and run yarn start in a new terminal
for %%i in (gatekeeper hades gateway user-management) do (
    start cmd /k "cd %%i && echo Running 'yarn' in %%i... && yarn"
)

start cmd /k "cd frontend && echo Running 'yarn' in frontend... && yarn"

pause