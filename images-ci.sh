#!/bin/bash

set -e

IMAGE_JSON_PATH="image-tags/images.json" # path to images.json in the cloned repo in unibook-platform repo
COMPONENT_NAME="frontend-crm"  # component like backend, frontend
BRANCH_NAME="$3"     # branch name passed from workflow
COMMIT_HASH="$4"     # commit SHA passed from workflow

if [[ -z "$IMAGE_JSON_PATH" || -z "$COMPONENT_NAME" || -z "$BRANCH_NAME" || -z "$COMMIT_HASH" ]]; then
    echo "Usage: $0 <image_json_path> <component_name> <branch_name> <commit_hash>"
    exit 1
fi

# Determine section
if [[ "$BRANCH_NAME" == "main" ]]; then
    SECTION="prod"
elif [[ "$BRANCH_NAME" == "dev" ]]; then
    SECTION="dev"
else
    echo "Unsupported branch: $BRANCH_NAME"
    exit 0
fi

# Validate component exists
if ! jq -e ".${SECTION} | has(\"$COMPONENT_NAME\")" "$IMAGE_JSON_PATH" >/dev/null; then
    echo "Component '$COMPONENT_NAME' not found in section '$SECTION' of $IMAGE_JSON_PATH"
    exit 1
fi

# Update tag
TMP_FILE=$(mktemp)
jq --arg comp "$COMPONENT_NAME" \
   --arg hash "$COMMIT_HASH" \
   --arg section "$SECTION" \
   '.[$section][$comp] = $hash' "$IMAGE_JSON_PATH" > "$TMP_FILE" && mv "$TMP_FILE" "$IMAGE_JSON_PATH"

echo "Updated '$SECTION' for '$COMPONENT_NAME' with commit: $COMMIT_HASH"