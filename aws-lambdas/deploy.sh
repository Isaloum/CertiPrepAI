#!/bin/bash
# Deploy all AWS Lambda functions for AWSPrepAI
# Run from: /Users/ihabsaloum/AWSPrepAI/aws-lambdas/
# Requires: AWS CLI configured, Node.js 20+

set -e

REGION="us-east-1"
# Security: all sensitive values must be set as env vars before running this script.
ROLE_ARN="${ROLE_ARN:?Set ROLE_ARN env var (arn:aws:iam::<account-id>:role/<role-name>)}"
COGNITO_USER_POOL_ID="${COGNITO_USER_POOL_ID:?Set COGNITO_USER_POOL_ID env var}"
COGNITO_CLIENT_ID="${COGNITO_CLIENT_ID:?Set COGNITO_CLIENT_ID env var}"
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:?Set STRIPE_SECRET_KEY env var before running}"
STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET:?Set STRIPE_WEBHOOK_SECRET env var}"

echo "=== Deploying awsprepai-verify-session ==="
cd verify-session
npm install --omit=dev
zip -r ../verify-session.zip . -x "*.git*"
cd ..

aws lambda create-function \
  --function-name awsprepai-verify-session \
  --runtime nodejs20.x \
  --role "$ROLE_ARN" \
  --handler index.handler \
  --zip-file fileb://verify-session.zip \
  --timeout 30 \
  --region "$REGION" \
  --environment "Variables={STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID}" \
  2>/dev/null || \
aws lambda update-function-code \
  --function-name awsprepai-verify-session \
  --zip-file fileb://verify-session.zip \
  --region "$REGION"

aws lambda add-permission \
  --function-name awsprepai-verify-session \
  --statement-id AllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region "$REGION" 2>/dev/null || true

aws lambda create-function-url-config \
  --function-name awsprepai-verify-session \
  --auth-type NONE \
  --cors "AllowOrigins=https://awsprepai.isaloumapps.com,AllowMethods=POST,AllowHeaders=Content-Type" \
  --region "$REGION" 2>/dev/null || true

echo "=== Deploying awsprepai-stripe-webhook ==="
cd stripe-webhook
npm install --omit=dev
zip -r ../stripe-webhook.zip . -x "*.git*"
cd ..

aws lambda create-function \
  --function-name awsprepai-stripe-webhook \
  --runtime nodejs20.x \
  --role "$ROLE_ARN" \
  --handler index.handler \
  --zip-file fileb://stripe-webhook.zip \
  --timeout 30 \
  --region "$REGION" \
  --environment "Variables={STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET,COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID}" \
  2>/dev/null || \
aws lambda update-function-code \
  --function-name awsprepai-stripe-webhook \
  --zip-file fileb://stripe-webhook.zip \
  --region "$REGION"

aws lambda add-permission \
  --function-name awsprepai-stripe-webhook \
  --statement-id AllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region "$REGION" 2>/dev/null || true

aws lambda create-function-url-config \
  --function-name awsprepai-stripe-webhook \
  --auth-type NONE \
  --cors "AllowOrigins=https://stripe.com,AllowMethods=POST,AllowHeaders=Content-Type stripe-signature" \
  --region "$REGION" 2>/dev/null || true

echo "=== Deploying awsprepai-db ==="
cd awsprepai-db
npm install --omit=dev
zip -r ../awsprepai-db.zip . -x "*.git*"
cd ..

aws lambda create-function \
  --function-name awsprepai-db \
  --runtime nodejs20.x \
  --role "$ROLE_ARN" \
  --handler index.handler \
  --zip-file fileb://awsprepai-db.zip \
  --timeout 30 \
  --region "$REGION" \
  --environment "Variables={COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID,COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID}" \
  2>/dev/null || \
aws lambda update-function-code \
  --function-name awsprepai-db \
  --zip-file fileb://awsprepai-db.zip \
  --region "$REGION"

aws lambda add-permission \
  --function-name awsprepai-db \
  --statement-id AllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region "$REGION" 2>/dev/null || true

aws lambda create-function-url-config \
  --function-name awsprepai-db \
  --auth-type NONE \
  --cors "AllowOrigins=https://awsprepai.isaloumapps.com,AllowMethods=POST,AllowHeaders=Content-Type Authorization" \
  --region "$REGION" 2>/dev/null || true

echo ""
echo "=== Done! Getting Function URLs ==="
aws lambda get-function-url-config --function-name awsprepai-verify-session --region "$REGION" --query FunctionUrl --output text
aws lambda get-function-url-config --function-name awsprepai-stripe-webhook --region "$REGION" --query FunctionUrl --output text
aws lambda get-function-url-config --function-name awsprepai-db --region "$REGION" --query FunctionUrl --output text

echo ""
echo "Next: Update the IAM role to allow Cognito + DynamoDB access."
echo "Run: aws iam attach-role-policy --role-name awsprepai-checkout-role --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
echo "Run: aws iam attach-role-policy --role-name awsprepai-checkout-role --policy-arn arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
