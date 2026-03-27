# Software Requirements Specification

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional, non-functional, security, and deployment requirements for `Konfide`, a peer-support web application where people browse published listeners, send conversation requests, and continue permanent chat histories after acceptance.

### 1.2 Intended Audience
This document is intended for product owners, maintainers, designers, developers, QA reviewers, and deployment operators working on this repository.

### 1.3 Scope
Konfide provides:

- account creation and sign-in for `talker` and `listener` roles
- listener profile publishing and availability management
- listener discovery through an explore catalog
- lightweight conversation request creation
- listener-side request acceptance
- persistent encrypted chat history for accepted conversations
- browser-notification preferences for faster request/chat updates

Konfide does not currently provide:

- payment collection or payout logic
- appointment scheduling or calendar-slot booking
- forced profile completion before listener dashboard access
- ephemeral chat timers or auto-expiring chat history

### 1.4 Definitions

- `Talker`: A signed-in user browsing listeners and sending conversation requests.
- `Listener`: A signed-in user with a public profile who can receive and accept requests.
- `Conversation request`: A pending request from a talker to a listener.
- `Open conversation`: A request accepted by a listener, with chat unlocked for both participants.
- `Active now`: A presence badge shown when a listener has recently checked in from the website.
- `Requests on`: A listener-controlled setting that allows new conversation requests.

## 2. Product Overview

### 2.1 Product Perspective
Konfide is a server-rendered Next.js application backed by PostgreSQL through Prisma. Authentication uses signed cookies and optional Google OAuth. The application is designed for Vercel deployment with a hosted Postgres database.

### 2.2 User Classes

- Anonymous visitor
- Authenticated talker
- Authenticated listener
- Administrator or operator with infrastructure access only

### 2.3 Operating Environment

- Web browsers on desktop and mobile
- Next.js 16 App Router runtime
- PostgreSQL database
- Vercel hosting and environment management

## 3. Functional Requirements

### FR-1 Authentication and Session Management

- Users shall be able to sign up with email, password, and role selection.
- Users shall be able to sign in with email/password or Google OAuth.
- The system shall maintain authenticated state using signed `httpOnly` cookies.
- The system shall allow signed-in users to sign out from desktop and mobile navigation.
- The system shall block unauthenticated access to protected routes and protected API mutations.

### FR-2 Role-Based Experience

- Talkers shall land on browse and conversation flows relevant to finding listeners.
- Listeners shall land on a workspace containing dashboard, profile, availability, and sessions.
- The application shall not expose listener-only write actions to talker accounts.
- The application shall not allow listener accounts to send requests to themselves.

### FR-3 Listener Profile Management

- Listeners shall be able to save a public profile with slug, headline, about text, specialties, languages, and publish state.
- Slugs shall be unique and URL-safe.
- Published listener profiles shall appear in explore.
- Unpublished listener profiles shall remain hidden from explore.
- Saving a listener profile shall not require 100% profile completion beyond the minimum needed to persist a valid public record.

### FR-4 Listener Availability and Presence

- Listeners shall have a single request toggle that turns new requests on or off.
- Published listeners shall stay visible in explore even when requests are off.
- The `Active now` badge shall only appear when the listener has recently checked in from the website.
- Leaving the site shall clear the `Active now` badge without automatically disabling the saved request toggle.
- Listeners shall be able to return and regain `Active now` status without manually re-enabling requests.

### FR-5 Explore and Discovery

- Talkers shall be able to browse published listeners.
- Talkers shall be able to search by query text and filter by specialty.
- Explore cards shall show listener identity, profile summary, request availability, and `Active now` state.
- Explore shall prevent ambiguous states by distinguishing between `Active now`, `Requests on`, and `Requests off`.

### FR-6 Conversation Requests

- A talker shall be able to submit a request with a short topic and optional context.
- The system shall block duplicate pending requests between the same talker and listener.
- The system shall cap pending requests per listener to prevent overload.
- A listener with requests off shall reject new request creation.
- Request creation shall redirect the talker into the corresponding conversation workspace.

### FR-7 Conversation Acceptance and Chat

- A listener shall be able to accept a pending request.
- Accepting a request shall immediately unlock the chat for both participants.
- Pending requests shall keep the chat read-only until acceptance.
- Declined or closed conversations shall remain read-only.
- Accepted chat history shall remain permanently attached to the same conversation record.
- Messages shall be encrypted at rest before storage.

### FR-8 Notifications

- Signed-in users shall be able to open a notification panel in the app shell.
- Listener notifications shall surface profile setup gaps, request-toggle state, and new pending requests.
- Talker notifications shall surface pending and accepted request state changes.
- Notification data shall refresh without requiring a full page reload.
- Users shall be able to store browser notification preference metadata for supported devices.

### FR-9 Account Management

- Talkers and listeners shall be able to edit their display name.
- Users shall be able to store browser notification permission state and enabled preference.
- Account routes shall be protected and role-aware.

## 4. Non-Functional Requirements

### NFR-1 Security

- Mutating routes shall reject untrusted origins.
- Authentication and sensitive writes shall be rate-limited.
- Session cookies shall be signed, `httpOnly`, and `sameSite=lax`.
- Chat messages shall be encrypted at rest.
- The application shall send defensive security headers, including CSP, HSTS, `X-Frame-Options`, and `nosniff`.
- Secret values shall remain outside version control and be provided through environment configuration.

### NFR-2 Reliability

- Protected API responses shall return explicit HTTP error codes for authorization, validation, and rate-limit failures.
- Chat polling and notification refresh shall fail softly without breaking the current UI state.
- The system shall continue to function when a listener is temporarily away by preserving request-toggle state.

### NFR-3 Performance

- The application shall serve compact route payloads and avoid unnecessary client-side state duplication.
- Explore, notifications, and chat refresh paths shall use focused queries and `no-store` responses for live data.
- The repository shall avoid dead code and obsolete product logic that no longer supports the live request/chat model.

### NFR-4 Usability

- Primary flows shall remain usable on mobile and desktop.
- The app shall favor compact layouts, sharp edges, and low visual clutter consistent with the current product direction.
- Navigation to active conversations shall be direct, with conversation history accessible from dedicated session routes.

## 5. Data Requirements

- User records shall store identity, role, avatar, optional Google subject, and notification preferences.
- Listener profiles shall store public discoverability metadata.
- Listener settings shall store request-toggle and presence timestamp data.
- Conversation records shall store participants, request content, lifecycle state, and acceptance timestamp.
- Chat messages shall store sender, conversation reference, encrypted body, and timestamps.

## 6. External Interface Requirements

- Google OAuth shall support localhost and deployed callback URLs.
- Production deployment shall use a hosted PostgreSQL database.
- Vercel environment configuration shall provide:
  - `DATABASE_URL` or `POSTGRES_URL`
  - `AUTH_SECRET`
  - `CHAT_ENCRYPTION_KEY`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `APP_URL`

## 7. Constraints and Assumptions

- The current persistence layer still contains some legacy booking-era storage fields for compatibility, but the application contract is the live request-and-chat model described in this SRS.
- Browser notifications depend on device and browser support and may not be available everywhere.
- Google OAuth functionality depends on correct origin and callback allowlists in Google Cloud Console.

## 8. Acceptance Summary

The application is SRS-compatible when:

- talkers can sign in, browse listeners, send a request, and see its state in sessions
- listeners can publish a profile, keep requests on or off, appear in explore when published, and show `Active now` only while recently present
- listeners can accept pending requests and both sides can continue chatting in the same permanent conversation
- requests, sessions, notifications, and chat data stay protected by origin checks, rate limits, signed cookies, encrypted chat storage, and production security headers
