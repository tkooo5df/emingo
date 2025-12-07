#!/bin/bash

# Quick deployment script for backend to Fly.io
# This script helps deploy the backend API server to Fly.io

echo "🚀 EMINGO AI Dashboard - Backend Deployment to Fly.io"
echo "======================================================"
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed"
    echo "📦 Install it with: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

echo "✅ flyctl is installed"
echo ""

# Check if user is logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Please login to Fly.io first"
    flyctl auth login
fi

echo "✅ Logged in to Fly.io"
echo ""

# Check if app exists
if ! flyctl status &> /dev/null; then
    echo "📝 App not found. Creating new app..."
    flyctl launch --no-deploy
    echo ""
fi

echo "🔧 Setting environment variables..."
echo ""
echo "Please provide the following environment variables:"
echo ""

read -p "DATABASE_URL (PostgreSQL connection string): " DATABASE_URL
read -p "GOOGLE_CLIENT_ID: " GOOGLE_CLIENT_ID
read -p "GOOGLE_CLIENT_SECRET: " GOOGLE_CLIENT_SECRET
read -p "JWT_SECRET (random string for token signing): " JWT_SECRET
read -p "GOOGLE_REDIRECT_URI (e.g., https://eloquent-parfait-8fa33b.netlify.app/auth/callback): " GOOGLE_REDIRECT_URI

echo ""
echo "🔐 Setting secrets..."

flyctl secrets set \
  DATABASE_URL="$DATABASE_URL" \
  GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
  GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
  JWT_SECRET="$JWT_SECRET" \
  GOOGLE_REDIRECT_URI="$GOOGLE_REDIRECT_URI"

echo ""
echo "🚀 Deploying to Fly.io..."
flyctl deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your app URL: flyctl status"
echo "2. Update netlify.toml with your Fly.io URL"
echo "3. Redeploy frontend to Netlify"
echo ""
echo "🔗 Your backend URL will be something like:"
echo "   https://emingo-ai-dashboard.fly.dev"
echo ""
