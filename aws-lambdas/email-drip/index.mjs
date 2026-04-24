/**
 * awsprepai-email-drip
 * Sends the 3-email drip sequence for CertiPrepAI leads.
 *
 * Triggered by:
 *   1. awsprepai-db (direct invoke) after capture_lead → sends Email 1 immediately
 *   2. EventBridge Scheduler → sends Email 2 (day 3) and Email 3 (day 7)
 *
 * Event shape: { email: string, type: 'welcome' | 'day3' | 'day7' }
 *
 * Env vars:
 *   FROM_EMAIL     — e.g. hello@certiprepai.com (must be SES-verified)
 *   AWS_REGION     — us-east-1
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import {
  SchedulerClient,
  CreateScheduleCommand,
} from '@aws-sdk/client-scheduler';
import {
  DynamoDBClient,
  UpdateItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';

const ses = new SESClient({ region: 'us-east-1' });
const scheduler = new SchedulerClient({ region: 'us-east-1' });
const dynamo = new DynamoDBClient({ region: 'us-east-1' });

const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@certiprepai.com';
const LAMBDA_ARN = process.env.LAMBDA_ARN; // this Lambda's own ARN (for scheduler target)
const SCHEDULER_ROLE_ARN = process.env.SCHEDULER_ROLE_ARN; // IAM role for EventBridge Scheduler

// ─── Email Templates ────────────────────────────────────────────────────────

function emailWelcome(email) {
  return {
    subject: "You're in — your free AWS practice questions 🎓",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:36px 40px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:8px;">🎓</div>
      <h1 style="color:#ffffff;margin:0;font-size:1.5rem;font-weight:800;letter-spacing:-0.5px;">Welcome to CertiPrepAI</h1>
      <p style="color:#93c5fd;margin:8px 0 0;font-size:0.9rem;">Your AWS certification prep starts now</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="color:#374151;font-size:1rem;line-height:1.6;margin:0 0 20px;">Hey there 👋</p>

      <p style="color:#374151;font-size:1rem;line-height:1.6;margin:0 0 20px;">
        Thanks for signing up. You've got <strong>20 free practice questions per certification</strong> — no credit card needed, no time limit.
      </p>

      <!-- CTA box -->
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
        <p style="color:#1e40af;font-weight:700;font-size:0.95rem;margin:0 0 12px;">Start with the most popular certs:</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:4px 0;"><a href="https://certiprepai.com/cert/saa-c03" style="color:#2563eb;text-decoration:none;font-size:0.9rem;">→ SAA-C03 Solutions Architect</a></td>
          </tr>
          <tr>
            <td style="padding:4px 0;"><a href="https://certiprepai.com/cert/clf-c02" style="color:#2563eb;text-decoration:none;font-size:0.9rem;">→ CLF-C02 Cloud Practitioner</a></td>
          </tr>
          <tr>
            <td style="padding:4px 0;"><a href="https://certiprepai.com/cert/dva-c02" style="color:#2563eb;text-decoration:none;font-size:0.9rem;">→ DVA-C02 Developer Associate</a></td>
          </tr>
        </table>
      </div>

      <!-- Quick tip -->
      <div style="border-left:4px solid #2563eb;padding:12px 16px;background:#f8fafc;border-radius:0 8px 8px 0;margin:0 0 24px;">
        <p style="color:#374151;margin:0;font-size:0.9rem;line-height:1.5;">
          <strong>💡 Pro tip:</strong> Don't just memorize answers. Read every explanation — that's where the real exam patterns are.
        </p>
      </div>

      <!-- Big CTA -->
      <div style="text-align:center;margin:0 0 24px;">
        <a href="https://certiprepai.com/certifications"
           style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:700;font-size:1rem;padding:14px 32px;border-radius:10px;text-decoration:none;">
          Start practicing →
        </a>
      </div>

      <p style="color:#6b7280;font-size:0.85rem;line-height:1.6;margin:0;">
        I'll send you a study tip in 3 days. No spam — just useful stuff.<br>
        — Ihab, builder of CertiPrepAI
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.75rem;margin:0;">
        CertiPrepAI · <a href="https://certiprepai.com" style="color:#9ca3af;">certiprepai.com</a><br>
        You're receiving this because you signed up at certiprepai.com.<br>
        <a href="https://certiprepai.com" style="color:#9ca3af;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>`,
    text: `Welcome to CertiPrepAI!

You've got 20 free practice questions per certification — no credit card needed.

Start with the most popular certs:
→ SAA-C03: https://certiprepai.com/cert/saa-c03
→ CLF-C02: https://certiprepai.com/cert/clf-c02
→ DVA-C02: https://certiprepai.com/cert/dva-c02

Pro tip: Don't just memorize answers. Read every explanation — that's where the real exam patterns are.

I'll send you a study tip in 3 days.
— Ihab, builder of CertiPrepAI

Unsubscribe: https://certiprepai.com
`,
  };
}

function emailDay3(email) {
  return {
    subject: "The #1 mistake AWS exam candidates make 🚫",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:36px 40px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:8px;">🧠</div>
      <h1 style="color:#ffffff;margin:0;font-size:1.5rem;font-weight:800;">Study Smarter, Not Harder</h1>
      <p style="color:#93c5fd;margin:8px 0 0;font-size:0.9rem;">Day 3 tip from CertiPrepAI</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="color:#374151;font-size:1rem;line-height:1.6;margin:0 0 20px;">
        The #1 mistake I see AWS candidates make:
      </p>

      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
        <p style="color:#dc2626;font-weight:700;font-size:1rem;margin:0 0 8px;">❌ Practicing questions without reading explanations</p>
        <p style="color:#374151;font-size:0.9rem;line-height:1.5;margin:0;">
          They get an answer right → skip the explanation → get a similar question wrong on the real exam because they memorized the answer, not the concept.
        </p>
      </div>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
        <p style="color:#16a34a;font-weight:700;font-size:1rem;margin:0 0 8px;">✅ What actually works</p>
        <p style="color:#374151;font-size:0.9rem;line-height:1.5;margin:0;">
          Read every explanation — even for questions you got right. AWS exams test <em>why</em> something is the best answer, not just <em>what</em> it is. The explanation tells you the trap they're setting.
        </p>
      </div>

      <!-- Exam trap callout -->
      <div style="border-left:4px solid #f59e0b;padding:12px 16px;background:#fffbeb;border-radius:0 8px 8px 0;margin:0 0 24px;">
        <p style="color:#374151;margin:0;font-size:0.9rem;line-height:1.6;">
          <strong>🪤 This week's trap:</strong> "RDS Multi-AZ vs Read Replicas" —
          Multi-AZ is for <strong>availability</strong> (the standby doesn't serve reads).
          Read Replicas are for <strong>performance</strong> (async replication, not failover).
          The exam loves this distinction.
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:0 0 24px;">
        <a href="https://certiprepai.com/cert/saa-c03"
           style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:700;font-size:1rem;padding:14px 32px;border-radius:10px;text-decoration:none;">
          Practice with explanations →
        </a>
      </div>

      <p style="color:#6b7280;font-size:0.85rem;line-height:1.6;margin:0;">
        One more tip coming in 4 days.<br>
        — Ihab
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.75rem;margin:0;">
        CertiPrepAI · <a href="https://certiprepai.com" style="color:#9ca3af;">certiprepai.com</a><br>
        <a href="https://certiprepai.com" style="color:#9ca3af;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>`,
    text: `The #1 mistake AWS exam candidates make:

Practicing questions without reading explanations.

They memorize answers, not concepts — then fail on similar questions worded differently.

What actually works: Read every explanation, even for questions you got right. The explanation tells you the trap they're setting.

This week's trap: "RDS Multi-AZ vs Read Replicas"
Multi-AZ = availability (standby doesn't serve reads)
Read Replicas = performance (async, not failover)
The exam loves this distinction.

Practice with explanations: https://certiprepai.com/cert/saa-c03

One more tip coming in 4 days.
— Ihab

Unsubscribe: https://certiprepai.com
`,
  };
}

function emailDay7(email) {
  return {
    subject: "Your 7-day free trial is up — here's what you're missing",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:36px 40px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:8px;">🚀</div>
      <h1 style="color:#ffffff;margin:0;font-size:1.5rem;font-weight:800;">Ready to go all in?</h1>
      <p style="color:#93c5fd;margin:8px 0 0;font-size:0.9rem;">Unlock everything — 3,958 questions across 12 certs</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="color:#374151;font-size:1rem;line-height:1.6;margin:0 0 20px;">
        You've had a week to explore CertiPrepAI. Here's what's waiting on the other side of the free tier:
      </p>

      <!-- Feature list -->
      <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 0;color:#374151;font-size:0.9rem;">✅ <strong>3,958 questions</strong> across all 12 AWS certifications</td></tr>
          <tr><td style="padding:6px 0;color:#374151;font-size:0.9rem;">✅ <strong>Timed mock exams</strong> — real exam pressure</td></tr>
          <tr><td style="padding:6px 0;color:#374151;font-size:0.9rem;">✅ <strong>Skill radar chart</strong> — see exactly where you're weak</td></tr>
          <tr><td style="padding:6px 0;color:#374151;font-size:0.9rem;">✅ <strong>Cheat sheets</strong> for all 12 certs</td></tr>
          <tr><td style="padding:6px 0;color:#374151;font-size:0.9rem;">✅ <strong>Retry wrong answers</strong> until you nail them</td></tr>
          <tr><td style="padding:6px 0;color:#374151;font-size:0.9rem;">🔥 <strong>AI Coach</strong> (lifetime plan) — ask anything about AWS</td></tr>
        </table>
      </div>

      <!-- Pricing -->
      <div style="display:flex;gap:12px;margin:0 0 24px;">
        <!-- Monthly -->
        <div style="flex:1;border:1px solid #e5e7eb;border-radius:12px;padding:16px;text-align:center;">
          <p style="color:#6b7280;font-size:0.75rem;font-weight:600;margin:0 0 4px;text-transform:uppercase;">Monthly</p>
          <p style="color:#0f172a;font-size:1.5rem;font-weight:800;margin:0 0 4px;">$9</p>
          <p style="color:#6b7280;font-size:0.75rem;margin:0;">Cancel anytime</p>
        </div>
        <!-- Yearly -->
        <div style="flex:1;border:2px solid #2563eb;border-radius:12px;padding:16px;text-align:center;position:relative;">
          <div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#2563eb;color:#fff;font-size:0.65rem;font-weight:700;padding:2px 10px;border-radius:999px;white-space:nowrap;">BEST VALUE</div>
          <p style="color:#6b7280;font-size:0.75rem;font-weight:600;margin:0 0 4px;text-transform:uppercase;">Yearly</p>
          <p style="color:#0f172a;font-size:1.5rem;font-weight:800;margin:0 0 4px;">$59</p>
          <p style="color:#6b7280;font-size:0.75rem;margin:0;">$4.92/month</p>
        </div>
        <!-- Lifetime -->
        <div style="flex:1;border:1px solid #e5e7eb;border-radius:12px;padding:16px;text-align:center;">
          <p style="color:#6b7280;font-size:0.75rem;font-weight:600;margin:0 0 4px;text-transform:uppercase;">Lifetime</p>
          <p style="color:#0f172a;font-size:1.5rem;font-weight:800;margin:0 0 4px;">$149</p>
          <p style="color:#6b7280;font-size:0.75rem;margin:0;">Pay once, forever</p>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:0 0 24px;">
        <a href="https://certiprepai.com/pricing"
           style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:700;font-size:1rem;padding:14px 40px;border-radius:10px;text-decoration:none;">
          Unlock all 3,958 questions →
        </a>
      </div>

      <p style="color:#6b7280;font-size:0.85rem;line-height:1.6;margin:0;text-align:center;">
        Questions? Just reply to this email.<br>
        — Ihab
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.75rem;margin:0;">
        CertiPrepAI · <a href="https://certiprepai.com" style="color:#9ca3af;">certiprepai.com</a><br>
        <a href="https://certiprepai.com" style="color:#9ca3af;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>`,
    text: `Ready to go all in?

Here's what's waiting beyond the free tier:

✅ 3,958 questions across 12 AWS certifications
✅ Timed mock exams — real exam pressure
✅ Skill radar chart — see exactly where you're weak
✅ Cheat sheets for all 12 certs
✅ Retry wrong answers until you nail them
🔥 AI Coach (lifetime) — ask anything about AWS

Pricing:
• Monthly: $9/month
• Yearly: $59/year ($4.92/month) ← best value
• Lifetime: $149 one-time

Unlock everything: https://certiprepai.com/pricing

Questions? Just reply to this email.
— Ihab

Unsubscribe: https://certiprepai.com
`,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function sendEmail(to, template) {
  await ses.send(new SendEmailCommand({
    Source: `CertiPrepAI <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: template.subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: template.html, Charset: 'UTF-8' },
        Text: { Data: template.text, Charset: 'UTF-8' },
      },
    },
  }));
}

async function markEmailSent(email, type) {
  await dynamo.send(new UpdateItemCommand({
    TableName: 'awsprepai-leads',
    Key: { email: { S: email } },
    UpdateExpression: 'SET emails_sent = list_append(if_not_exists(emails_sent, :empty), :type)',
    ExpressionAttributeValues: {
      ':type': { L: [{ S: type }] },
      ':empty': { L: [] },
    },
  }));
}

async function alreadySent(email, type) {
  const res = await dynamo.send(new GetItemCommand({
    TableName: 'awsprepai-leads',
    Key: { email: { S: email } },
    ProjectionExpression: 'emails_sent',
  }));
  const sent = res.Item?.emails_sent?.L?.map(i => i.S) || [];
  return sent.includes(type);
}

async function scheduleFollowup(email, type, daysFromNow) {
  if (!LAMBDA_ARN || !SCHEDULER_ROLE_ARN) {
    console.log(`[drip] Skipping schedule for ${type} — LAMBDA_ARN or SCHEDULER_ROLE_ARN not set`);
    return;
  }
  const scheduleTime = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  const scheduleName = `certiprepai-${type}-${email.replace(/[@.]/g, '-')}-${Date.now()}`;

  await scheduler.send(new CreateScheduleCommand({
    Name: scheduleName,
    ScheduleExpression: `at(${scheduleTime.toISOString().slice(0, 19)})`,
    ScheduleExpressionTimezone: 'UTC',
    Target: {
      Arn: LAMBDA_ARN,
      RoleArn: SCHEDULER_ROLE_ARN,
      Input: JSON.stringify({ email, type }),
    },
    FlexibleTimeWindow: { Mode: 'OFF' },
    ActionAfterCompletion: 'DELETE', // auto-clean one-time schedules
  }));
  console.log(`[drip] Scheduled ${type} for ${email} at ${scheduleTime.toISOString()}`);
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const { email, type } = event;

  if (!email || !type) {
    console.error('[drip] Missing email or type', event);
    return { statusCode: 400, body: 'Missing email or type' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  console.log(`[drip] Processing ${type} for ${normalizedEmail}`);

  // Idempotency check
  if (await alreadySent(normalizedEmail, type)) {
    console.log(`[drip] ${type} already sent to ${normalizedEmail} — skipping`);
    return { statusCode: 200, body: 'already_sent' };
  }

  try {
    let template;
    if (type === 'welcome') {
      template = emailWelcome(normalizedEmail);
      // Schedule day3 and day7 follow-ups
      await scheduleFollowup(normalizedEmail, 'day3', 3);
      await scheduleFollowup(normalizedEmail, 'day7', 7);
    } else if (type === 'day3') {
      template = emailDay3(normalizedEmail);
    } else if (type === 'day7') {
      template = emailDay7(normalizedEmail);
    } else {
      console.error('[drip] Unknown email type:', type);
      return { statusCode: 400, body: 'Unknown email type' };
    }

    await sendEmail(normalizedEmail, template);
    await markEmailSent(normalizedEmail, type);
    console.log(`[drip] ✅ Sent ${type} to ${normalizedEmail}`);
    return { statusCode: 200, body: 'sent' };

  } catch (err) {
    console.error(`[drip] ❌ Failed ${type} for ${normalizedEmail}:`, err.message);
    // Don't throw — swallow errors so awsprepai-db isn't affected
    return { statusCode: 500, body: err.message };
  }
};
