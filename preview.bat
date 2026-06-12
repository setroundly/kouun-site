@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo 工運サイト プレビューを起動します...
echo ブラウザが開いたら http://localhost:5500 を表示します。
echo 終了するにはこの窓で Ctrl+C を押してください。
echo.

start "" "http://localhost:5500/index.html"

where python >nul 2>&1
if %errorlevel%==0 (
  python -m http.server 5500
  goto :eof
)

where py >nul 2>&1
if %errorlevel%==0 (
  py -m http.server 5500
  goto :eof
)

echo Python が見つかりません。
echo 代わりに index.html を直接開きます...
start "" "%~dp0index.html"
pause
