@echo off
if defined INFINITY_LOOP_HOME (
  node "%INFINITY_LOOP_HOME%\bin\loop.js" %*
) else (
  node "%~dp0..\bin\loop.js" %*
)
