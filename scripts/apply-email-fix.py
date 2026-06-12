#!/usr/bin/env python3
"""
Applies email lowercase normalization fix to CertiPrepAI.
Run from ~/Desktop/Projects/AWSPrepAI:
    python3 apply-email-fix.py
"""
import re, pathlib, sys

ROOT = pathlib.Path(__file__).parent

# ── 1. cognito.ts ────────────────────────────────────────────────────────────
cognito = ROOT / "react-app/src/lib/cognito.ts"
src = cognito.read_text()

# signIn
src = src.replace(
    "export async function signIn(email: string, password: string): Promise<AuthUser> {\n  return new Promise",
    "export async function signIn(email: string, password: string): Promise<AuthUser> {\n  const normalizedEmail = email.trim().toLowerCase()\n  return new Promise"
)
src = src.replace(
    "    const user = new CognitoUser({ Username: email, Pool: userPool })\n    const authDetails = new AuthenticationDetails({ Username: email, Password: password })",
    "    const user = new CognitoUser({ Username: normalizedEmail, Pool: userPool })\n    const authDetails = new AuthenticationDetails({ Username: normalizedEmail, Password: password })"
)
# also fix onSuccess to use normalizedEmail
src = src.replace(
    "      onSuccess: (session) => resolve(sessionToUser(email, session)),",
    "      onSuccess: (session) => resolve(sessionToUser(normalizedEmail, session)),"
)

# forgotPassword
src = src.replace(
    "export async function forgotPassword(email: string): Promise<void> {\n  return new Promise",
    "export async function forgotPassword(email: string): Promise<void> {\n  const normalizedEmail = email.trim().toLowerCase()\n  return new Promise"
)
src = src.replace(
    "    const user = new CognitoUser({ Username: email, Pool: userPool })\n    user.forgotPassword",
    "    const user = new CognitoUser({ Username: normalizedEmail, Pool: userPool })\n    user.forgotPassword"
)

# confirmNewPassword
src = src.replace(
    "export async function confirmNewPassword(email: string, code: string, newPassword: string): Promise<void> {\n  return new Promise",
    "export async function confirmNewPassword(email: string, code: string, newPassword: string): Promise<void> {\n  const normalizedEmail = email.trim().toLowerCase()\n  return new Promise"
)
src = src.replace(
    "    const user = new CognitoUser({ Username: email, Pool: userPool })\n    user.confirmPassword",
    "    const user = new CognitoUser({ Username: normalizedEmail, Pool: userPool })\n    user.confirmPassword"
)

cognito.write_text(src)
print("✅ cognito.ts patched")

# ── 2. Login.tsx ──────────────────────────────────────────────────────────────
login = ROOT / "react-app/src/pages/Login.tsx"
src = login.read_text()
src = src.replace(
    "onChange={e => setEmail(e.target.value)}",
    "onChange={e => setEmail(e.target.value.trim().toLowerCase())}"
)
login.write_text(src)
print("✅ Login.tsx patched")

# ── 3. Signup.tsx ─────────────────────────────────────────────────────────────
signup = ROOT / "react-app/src/pages/Signup.tsx"
src = signup.read_text()
src = src.replace(
    "onChange={e => setEmail(e.target.value)}",
    "onChange={e => setEmail(e.target.value.trim().toLowerCase())}"
)
signup.write_text(src)
print("✅ Signup.tsx patched")

print("\nDone. Now run:")
print("  git add react-app/src/lib/cognito.ts react-app/src/pages/Login.tsx react-app/src/pages/Signup.tsx")
print('  git commit -m "fix: normalize email to lowercase on sign-in/sign-up"')
print("  git push origin main")
