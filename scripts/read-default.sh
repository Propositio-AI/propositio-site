#!/bin/sh
set -eu

key=${1:?"usage: read-default.sh KEY [FILE]"}
file=${2:-config/defaults.json}

case "$key" in
  *[!A-Z0-9_]*)
    echo "invalid config key: $key" >&2
    exit 2
    ;;
esac

awk -v key="$key" '
  {
    line = $0
    sub(/^[[:space:]]*/, "", line)
    if (index(line, "\"" key "\"") == 1) {
      sub(/^[^:]*:[[:space:]]*/, "", line)
      sub(/,[[:space:]]*$/, "", line)
      if (line ~ /^\".*\"$/) {
        sub(/^\"/, "", line)
        sub(/\"$/, "", line)
      }
      print line
      found = 1
      exit
    }
  }
  END {
    if (!found) exit 1
  }
' "$file"
