#!/bin/bash

# Launch Claude Code with system prompt from claude.md file

# Check if claude.md exists
if [ ! -f "claude.md" ]; then
    echo "Error: claude.md file not found"
    exit 1
fi

# Read the contents of claude.md
SYSTEM_PROMPT=$(<claude.md)

# Launch Claude with the custom system prompt
claude --append-system-prompt "$SYSTEM_PROMPT" "$@"