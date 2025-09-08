#!/bin/sh

# Find manage.py location
MANAGE_PATH=$(find . -name manage.py -type f -print -quit 2>/dev/null)
if [ -z "$MANAGE_PATH" ]; then
    echo "Error: Could not locate manage.py" >&2
    exit 1
fi

# Find consumer.py location
CONSUMER_PATH=$(find . -name consumer.py -type f -print -quit 2>/dev/null)
if [ -z "$CONSUMER_PATH" ]; then
    echo "Error: Could not locate consumer.py" >&2
    exit 1
fi

# Get absolute paths
PROJECT_ROOT=$(dirname "$(realpath "$MANAGE_PATH")")
CONSUMER_ABS=$(realpath "$CONSUMER_PATH")

# Navigate to project root
cd "$PROJECT_ROOT" || exit 1

# Apply migrations
python manage.py migrate

# Start services
python "$CONSUMER_ABS" &
python manage.py runserver 0.0.0.0:8081
