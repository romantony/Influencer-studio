# InfluencerStudio — Product Overview

Last updated: ${DATE}

## Overview

InfluencerStudio is an AI‑first Instagram influencer and avatar studio to ideate, schedule, and analyze content. It helps solo creators and small teams produce on‑brand captions, maintain a consistent voice via personas, plan publishing, and track performance.

Audience: creators, social managers, and small teams.

App structure: Public marketing site + authenticated app with dashboard and task‑focused sections.

## Core Features

- Marketing Site
  - Hero, feature highlights, testimonials, pricing, and primary CTAs.
- Authentication
  - Sign up, sign in, forgot password; session via `SessionProvider`.
- Dashboard
  - Summary metric cards and at‑a‑glance insights with skeleton loading states.
- Avatars
  - Entry point for defining AI personas/brand voice and tone.
- Influencers
  - Manage influencer entities (real or synthetic personas) in a unified list.
- Posts
  - Draft captions, status, hashtags; post cards for quick previews; caption editor with toasts.
- Scheduler
  - Calendar‑oriented workflow for planning posts.
- Library
  - Asset repository and media upload flows with toasts for feedback.
- Analytics
  - Metrics overview (engagement, growth, posting velocity baseline).
- Settings
  - Profile/workspace preferences and future integrations.
- UI System
  - Shadcn‑style components exported via `@/components/ui` (Button, Card*, Input, Skeleton, Toast), plus local `Avatar`, `Separator`, `Tooltip`.
  - Dark theme by default using Tailwind tokens.

## Functional Highlights

- Global theming with `.dark` class and tokenized colors.
- Feedback via toasts for async operations (upload, save, error states).
- Suspense + Skeletons for perceived‑performance loading.
- Task‑oriented navigation (sidebar with active route state, sticky topbar with search hint, notifications, theme toggle).
- Data layer ready with `@tanstack/react-query`; server data example for dashboard summary.

## Typical User Journey

1. Discover: Lands on marketing page, reviews value props and pricing, clicks CTA.
2. Onboarding: Signs up or signs in; session persists.
3. First‑run Dashboard: Sees overview metrics and search hint in the topbar.
4. Create Persona: In Avatars, defines brand voice, tone, pillars, and target audience.
5. Draft Content: In Posts, generates/edits captions, adds hashtags; attaches media from Library or uploads new.
6. Plan & Schedule: Uses Scheduler to place drafts into calendar slots; selects channels/targets.
7. Analyze: Reviews Analytics to understand performance and adjust strategy.
8. Maintain: Updates workspace and profile in Settings; iterates on personas and content.

## Key Screens

- Landing/Marketing: Value, benefits, pricing, CTAs.
- Auth: Signup, signin, forgot password.
- Dashboard: Summary metric cards, recent activity.
- Avatars: Create/edit personas with voice/tone.
- Posts: List drafts/scheduled posts, caption editor, post card view.
- Scheduler: Calendar of planned posts.
- Library: Media grid and upload.
- Analytics: KPIs, charts, trends.
- Settings: Workspace, user profile, upcoming integrations.

## Entities & Data Concepts

- User: Authenticated account context.
- Workspace: Tenant boundary for content, personas, analytics.
- Avatar/Persona: Name, tone, pillars, target audience, style rules.
- Influencer: Metadata for synthetic or real creators.
- Post: Caption, status (draft/scheduled/published), hashtags, attachments.
- Media Asset: Image/video metadata and storage refs.
- Schedule Slot: Time, channels, linked post/persona.
- Metric: Engagement, reach, growth, posting cadence.

## Tech & UI Notes

- Next.js App Router (14.x) with Server Components where applicable.
- Shadcn‑style UI re‑exported via `@/components/ui` from `packages/ui`.
- Tailwind with light/dark tokens; dark mode default.
- Toast system wired into app’s providers and patterns.

## Known Gaps / Limitations

- Personas: No explicit training/prompt editor UI yet.
- Scheduler: No multi‑platform publish controls or conflict detection.
- Analytics: Baseline metrics only; limited breakdowns/comparisons.
- Library: Lacks tagging/foldering/deduplication and quick edit tools.
- Collaboration: No roles/permissions or multi‑user workflows.
- Integrations: IG/Meta OAuth and publishing APIs not wired; storage providers pending.

## Proposed Roadmap

- Content Creation
  - AI captioning with persona prompts and style rules.
  - Draft variations and A/B testing.
- Scheduling & Publishing
  - Platform integrations (Instagram/Meta first), bulk scheduling, timezones, conflict detection.
- Personas
  - Persona editor with structured fields, preview generation, tone check.
  - Persona performance breakdowns in Analytics.
- Library
  - Tagging, search, folders, asset dedupe, quick crop/resize.
- Analytics
  - Per‑persona and per‑platform dashboards; post‑level breakdowns; cohort and period comparisons.
- Collaboration
  - Roles (Owner/Editor/Viewer), approvals, comments, activity feed.
- Automation
  - Smart posting windows, hashtag recommendations, auto‑queue.
- DX & UX
  - `next-themes` integration; replace local `Avatar/Separator/Tooltip` with shared Radix/shadcn variants; keyboard shortcuts.

---

To discuss or propose changes, open an issue or PR referencing this document. This file is intended as a living doc to guide scope and prioritization.

