#!/usr/bin/env bash
set -euo pipefail

if ! command -v flutter >/dev/null 2>&1; then
  echo "[ERROR] Flutter SDK табылмады (command not found: flutter)."
  echo "Шешімі:"
  echo "  1) Flutter SDK орнатыңыз: https://docs.flutter.dev/get-started/install"
  echo "  2) flutter/bin жолын PATH-қа қосыңыз"
  echo "  3) Тексеру: flutter --version && flutter doctor"
  exit 127
fi

echo "[OK] $(flutter --version | head -n 1)"
if command -v dart >/dev/null 2>&1; then
  echo "[OK] $(dart --version 2>&1 | head -n 1)"
fi

echo "[OK] Flutter environment ready"
