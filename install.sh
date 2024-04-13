#!/bin/bash
set -e

echo "portfolio re-install"
echo ""

echo "remove node_modules, package-lock.json, .angular .firebase"
rm -rf node_modules package-lock.json .angular .firebase

echo ""
echo "npm cache verify"
npm cache verify

echo ""
echo "pnpm i --force"
pnpm i --force
