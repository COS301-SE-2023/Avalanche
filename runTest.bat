@echo off    
start cmd /k docker exec gateway yarn test:cov
start cmd /k docker exec usermanagement yarn test:cov
start cmd /k docker exec africa yarn test:cov
start cmd /k docker exec zacr yarn test:cov
start cmd /k docker exec ryce yarn test:cov
exit /b