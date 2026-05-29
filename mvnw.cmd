@echo off
setlocal

set MAVEN_VERSION=3.9.11
set PROJECT_DIR=%~dp0
set MAVEN_CACHE=%USERPROFILE%\.m2\pao-fresquim-maven
set MAVEN_DIR=%MAVEN_CACHE%\apache-maven-%MAVEN_VERSION%
set MAVEN_CMD=%MAVEN_DIR%\bin\mvn.cmd
set MAVEN_ZIP=%MAVEN_CACHE%\apache-maven-%MAVEN_VERSION%-bin.zip
set MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip

if not exist "%MAVEN_CMD%" (
  echo Maven %MAVEN_VERSION% nao encontrado no cache do usuario. Baixando...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "New-Item -ItemType Directory -Force -Path '%MAVEN_CACHE%' | Out-Null; " ^
    "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'; " ^
    "Expand-Archive -LiteralPath '%MAVEN_ZIP%' -DestinationPath '%MAVEN_CACHE%' -Force"
)

call "%MAVEN_CMD%" %*
exit /b %ERRORLEVEL%
