# Webhook CRM Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the n8n test webhook and the old production webhook with the new CRM endpoint in all landing pages, and add the missing `origem` field in the `/terceirizacaocafe` form.

**Architecture:** Three files hold webhook logic independently. Each will be updated to call only `https://crm.canastrainteligencia.com/webhook/landing-page`. The dual-webhook `Promise.all` pattern is simplified to a single fetch call. The `whatsapp-chat.tsx` component also gets an `origem` fix for `/terceirizacaocafe`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, browser `fetch` API

---

## File Map

| File | Change |
|---|---|
| `app/graocafeteria/page.tsx:107-126` | Replace 2 webhooks with 1 CRM URL |
| `app/terceirizacaocafe/page.tsx:95-119` | Replace 2 webhooks with 1 CRM URL + add `origem: "terceirizacao"` |
| `components/whatsapp-chat.tsx:219-256` | Replace 2 webhooks with 1 CRM URL + fix `origem` detection |

---

## Task 1: Migrate webhook in `/graocafeteria`

**Files:**
- Modify: `app/graocafeteria/page.tsx:107-126`

- [ ] **Step 1: Apply the change**

Replace the entire `webhookPromises` block (lines 108–126 in `handleSubmit`) with a single CRM fetch:

```typescript
// Before
const webhookPromises = [
  fetch("https://n8n.canastrainteligencia.com/webhook-test/landing-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }),
  fetch("https://webhook.canastrainteligencia.com/webhook/landing-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }),
]
await Promise.all(webhookPromises)

// After
await fetch("https://crm.canastrainteligencia.com/webhook/landing-page", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
})
```

The `formData` object (lines 99–105) already contains `origem: "graocafeteria"` — no change needed there.

- [ ] **Step 2: Verify TypeScript compiles without errors**

```bash
npx tsc --noEmit
```

Expected: no errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add app/graocafeteria/page.tsx
git commit -m "feat: migrate graocafeteria webhook to CRM endpoint"
```

---

## Task 2: Migrate webhook in `/terceirizacaocafe` and add `origem`

**Files:**
- Modify: `app/terceirizacaocafe/page.tsx:95-119`

- [ ] **Step 1: Apply the change**

In `handleSubmit`, update `formData` to add `origem` and replace the webhook block:

```typescript
// Before (lines 95–119)
const formData = {
  nome: name,
  email: email,
  whatsapp: whatsapp,
  timestamp: new Date().toISOString(),
}

try {
  const webhookPromises = [
    fetch("https://n8n.canastrainteligencia.com/webhook-test/landing-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }),
    fetch("https://webhook.canastrainteligencia.com/webhook/landing-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }),
  ]
  await Promise.all(webhookPromises)

// After
const formData = {
  nome: name,
  email: email,
  whatsapp: whatsapp,
  timestamp: new Date().toISOString(),
  origem: "terceirizacao",
}

try {
  await fetch("https://crm.canastrainteligencia.com/webhook/landing-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
```

- [ ] **Step 2: Verify TypeScript compiles without errors**

```bash
npx tsc --noEmit
```

Expected: no errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add app/terceirizacaocafe/page.tsx
git commit -m "feat: migrate terceirizacao webhook to CRM and add origem field"
```

---

## Task 3: Migrate webhook in `whatsapp-chat.tsx` and fix `origem` detection

**Files:**
- Modify: `components/whatsapp-chat.tsx:219-256`

- [ ] **Step 1: Apply the change**

In `submitToWebhook`, update the `origem` detection and replace the webhook block:

```typescript
// Before (lines 221–254)
const currentPath = window.location.pathname
const origem = currentPath.includes('/cafeatacado') ? "atacado" : "Chat WhatsApp"

const formData = {
  nome: data.name,
  whatsapp: data.phone,
  email: data.email,
  origem: origem,
  timestamp: new Date().toISOString()
}

const webhookPromises = [
  fetch("https://n8n.canastrainteligencia.com/webhook-test/landing-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).catch(err => {
    console.warn("Webhook 1 falhou:", err)
    return { ok: false }
  }),
  fetch("https://webhook.canastrainteligencia.com/webhook/landing-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).catch(err => {
    console.warn("Webhook 2 falhou:", err)
    return { ok: false }
  })
]
await Promise.all(webhookPromises)

// After
const currentPath = window.location.pathname
const origem = currentPath.includes('/cafeatacado')
  ? "atacado"
  : currentPath.includes('/terceirizacaocafe')
    ? "terceirizacao"
    : "Chat WhatsApp"

const formData = {
  nome: data.name,
  whatsapp: data.phone,
  email: data.email,
  origem: origem,
  timestamp: new Date().toISOString()
}

await fetch("https://crm.canastrainteligencia.com/webhook/landing-page", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
}).catch(err => {
  console.warn("Webhook CRM falhou:", err)
})
```

- [ ] **Step 2: Verify TypeScript compiles without errors**

```bash
npx tsc --noEmit
```

Expected: no errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add components/whatsapp-chat.tsx
git commit -m "feat: migrate whatsapp-chat webhook to CRM and fix origem for terceirizacao"
```

---

## Self-Review Checklist

- [x] n8n endpoint (`webhook-test`) removed from all 3 files
- [x] Old production endpoint (`webhook.canastrainteligencia.com`) removed from all 3 files
- [x] CRM endpoint (`crm.canastrainteligencia.com/webhook/landing-page`) added to all 3 files
- [x] `origem: "terceirizacao"` added to `terceirizacaocafe/page.tsx` formData
- [x] `origem` detection in `whatsapp-chat.tsx` updated to cover `/terceirizacaocafe`
- [x] `graocafeteria` already had `origem: "graocafeteria"` — no change needed
- [x] Redirect logic untouched in all files (only webhook calls change)
