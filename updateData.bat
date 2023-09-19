@echo off

REM Loop through each directory and run yarn start in a new terminal
for %%i in (africa ryce zacr) do (
    start cmd /k "cd %%i && echo Running 'yarn' in %%i... && yarn"
)


pause