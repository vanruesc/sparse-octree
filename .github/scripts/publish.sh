#!/usr/bin/env bash
set -euo pipefail

cd "${1:?Usage: publish.sh <package-directory>}"

package=$(node -p "require('./package.json').name")
version=$(node -p "require('./package.json').version")

if pnpm view "$package@$version" version >/dev/null 2>&1; then
	echo "::notice::$package@$version is already published, skipping."
	exit 0
fi

pnpm publish --ignore-scripts
