#!/usr/bin/env bash

set -euo pipefail

corepack enable
yarn set version canary
yarn install
yarn build
