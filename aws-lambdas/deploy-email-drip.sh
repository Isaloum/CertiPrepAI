#!/bin/bash
# deploy-email-drip.sh
# Deploys the awsprepai-email-drip Lambda and wires everything up.
# Run from: ~/Desktop/Projects/CertiPrepAI/aws-lambdas/

set -e

REGION="us-east-1"
ACCOUNT_ID="441393059130"
FUNCTION_NAME="awsprepai-email-drip"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/awsprepai-checkout-role"
FROM_EMAIL="hello@certiprepai.com"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  CertiPrepAI Email Drip — Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Step 1: Package Lambda ────────────────────────────────────────────────────
echo ""
echo "📦 Step 1: Packaging Lambda..."
cd email-drip
npm install --omit=dev --silent
zip -r ../email-drip.zip index.mjs node_modules/ package.json -q
cd ..
echo "   ✅ email-drip.zip created"

# ── Step 2: Deploy or update Lambda ──────────────────────────────────────────
echo ""
echo "🚀 Step 2: Deploying Lambda..."

LAMBDA_EXISTS=$(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>&1 || true)

if echo "$LAMBDA_EXISTS" | grep -q "ResourceNotFoundException"; then
  echo "   Creating new Lambda function..."
  aws lambda create-function \
    --function-name $FUNCTION_NAME \
    --runtime nodejs20.x \
    --role $ROLE_ARN \
    --handler index.handler \
    --zip-file fileb://email-drip.zip \
    --timeout 30 \
    --memory-size 256 \
    --region $REGION \
    --environment "Variables={FROM_EMAIL=${FROM_EMAIL}}" \
    --output text --query 'FunctionArn'
  echo "   ✅ Lambda created"
else
  echo "   Updating existing Lambda..."
  aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://email-drip.zip \
    --region $REGION \
    --output text --query 'FunctionArn'
  echo "   Waiting for update to complete..."
  aws lambda wait function-updated --function-name $FUNCTION_NAME --region $REGION
  aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --environment "Variables={FROM_EMAIL=${FROM_EMAIL}}" \
    --region $REGION --output text --query 'FunctionArn'
  echo "   ✅ Lambda updated"
fi

# ── Step 3: Get Lambda ARN ────────────────────────────────────────────────────
LAMBDA_ARN=$(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --query 'Configuration.FunctionArn' --output text)
echo ""
echo "   Lambda ARN: $LAMBDA_ARN"

# ── Step 4: Create EventBridge Scheduler IAM role ────────────────────────────
echo ""
echo "🔐 Step 3: Setting up EventBridge Scheduler IAM role..."

SCHEDULER_ROLE_NAME="awsprepai-email-scheduler-role"
SCHEDULER_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${SCHEDULER_ROLE_NAME}"

ROLE_EXISTS=$(aws iam get-role --role-name $SCHEDULER_ROLE_NAME 2>&1 || true)
if echo "$ROLE_EXISTS" | grep -q "NoSuchEntity"; then
  aws iam create-role \
    --role-name $SCHEDULER_ROLE_NAME \
    --assume-role-policy-document '{
      "Version":"2012-10-17",
      "Statement":[{
        "Effect":"Allow",
        "Principal":{"Service":"scheduler.amazonaws.com"},
        "Action":"sts:AssumeRole"
      }]
    }' --output text --query 'Role.Arn'

  aws iam put-role-policy \
    --role-name $SCHEDULER_ROLE_NAME \
    --policy-name allow-invoke-email-drip \
    --policy-document "{
      \"Version\":\"2012-10-17\",
      \"Statement\":[{
        \"Effect\":\"Allow\",
        \"Action\":\"lambda:InvokeFunction\",
        \"Resource\":\"${LAMBDA_ARN}\"
      }]
    }"
  echo "   ✅ IAM role created"
else
  echo "   ✅ IAM role already exists"
fi

# ── Step 5: Update Lambda env vars with ARNs ─────────────────────────────────
echo ""
echo "⚙️  Step 4: Adding ARNs to Lambda environment..."
aws lambda wait function-updated --function-name $FUNCTION_NAME --region $REGION
aws lambda update-function-configuration \
  --function-name $FUNCTION_NAME \
  --environment "Variables={FROM_EMAIL=${FROM_EMAIL},LAMBDA_ARN=${LAMBDA_ARN},SCHEDULER_ROLE_ARN=${SCHEDULER_ROLE_ARN}}" \
  --region $REGION --output text --query 'FunctionArn'
echo "   ✅ Environment updated"

# ── Step 6: Add IAM permissions for awsprepai-db to invoke email-drip ─────────
echo ""
echo "🔐 Step 5: Allowing awsprepai-db to invoke email-drip..."
aws lambda add-permission \
  --function-name $FUNCTION_NAME \
  --statement-id allow-db-lambda \
  --action lambda:InvokeFunction \
  --principal lambda.amazonaws.com \
  --source-arn "arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:awsprepai-db" \
  --region $REGION 2>/dev/null || echo "   (permission already exists)"
echo "   ✅ Permission set"

# ── Step 7: Grant awsprepai-checkout-role permission to call SES ──────────────
echo ""
echo "📧 Step 6: Adding SES send permission to Lambda role..."
aws iam put-role-policy \
  --role-name awsprepai-checkout-role \
  --policy-name allow-ses-send \
  --policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Action":["ses:SendEmail","ses:SendRawEmail"],
      "Resource":"*"
    }]
  }' 2>/dev/null || echo "   (policy may already exist)"

# Also allow invoking other Lambdas and EventBridge Scheduler
aws iam put-role-policy \
  --role-name awsprepai-checkout-role \
  --policy-name allow-invoke-email-drip \
  --policy-document "{
    \"Version\":\"2012-10-17\",
    \"Statement\":[
      {\"Effect\":\"Allow\",\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"${LAMBDA_ARN}\"},
      {\"Effect\":\"Allow\",\"Action\":[\"scheduler:CreateSchedule\",\"iam:PassRole\"],\"Resource\":\"*\"}
    ]
  }" 2>/dev/null || echo "   (policy may already exist)"
echo "   ✅ IAM policies updated"

# ── Step 8: Redeploy awsprepai-db with Lambda client ─────────────────────────
echo ""
echo "🔄 Step 7: Redeploying awsprepai-db Lambda..."
cd awsprepai-db
npm install --omit=dev --silent 2>/dev/null || true
zip -r ../awsprepai-db-new.zip index.js node_modules/ -q
cd ..
aws lambda update-function-code \
  --function-name awsprepai-db \
  --zip-file fileb://awsprepai-db-new.zip \
  --region $REGION --output text --query 'FunctionArn'
rm awsprepai-db-new.zip
echo "   ✅ awsprepai-db redeployed"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ DEPLOYMENT COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT — Manual steps still needed:"
echo ""
echo "1. VERIFY SES DOMAIN (if not done already):"
echo "   → Go to: https://console.aws.amazon.com/ses/home?region=us-east-1"
echo "   → Click 'Verified identities' → 'Create identity'"
echo "   → Choose 'Domain' → enter: certiprepai.com"
echo "   → Add the DKIM CNAME records to Route 53"
echo "   → Wait ~5 min for verification"
echo ""
echo "2. VERIFY SENDING EMAIL:"
echo "   → In SES console, also verify: hello@certiprepai.com"
echo "   → (Or just verify the domain — all @certiprepai.com addresses work)"
echo ""
echo "3. REQUEST PRODUCTION ACCESS (if in SES sandbox):"
echo "   → SES console → 'Account dashboard' → 'Request production access'"
echo "   → Without this, you can only email verified addresses"
echo ""
echo "4. TEST IT:"
echo "   aws lambda invoke --function-name awsprepai-email-drip \\"
echo "     --payload '{\"email\":\"ihabsaloum85@gmail.com\",\"type\":\"welcome\"}' \\"
echo "     --cli-binary-format raw-in-base64-out /tmp/test-response.json"
echo "   cat /tmp/test-response.json"
echo ""
