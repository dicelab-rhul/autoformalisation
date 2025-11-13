#!/usr/bin/env bash

BUNDLE_INTEGRITY=$(openssl dgst -sha384 -binary static/js/bundle.js | openssl base64 -A)
CSS_INTEGRITY=$(openssl dgst -sha384 -binary static/css/index.css | openssl base64 -A)

echo "Bundle integrity: sha384-${BUNDLE_INTEGRITY}"
echo "CSS integrity: sha384-${CSS_INTEGRITY}"
