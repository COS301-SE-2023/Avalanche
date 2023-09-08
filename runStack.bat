@echo off

REM Loop through each directory and run yarn start in a new terminal
for %%i in (gatekeeper hades gateway user-management) do (
    start cmd /k "cd %%i && echo Running 'yarn start' in %%i... && yarn start"
)

start cmd /k "cd frontend && echo Running 'yarn dev' in frontend... && yarn dev"

pause