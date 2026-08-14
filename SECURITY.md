# Security Policy

## Repository visibility

This repository is **private** internal operational software. It documents
berth dimensions, crane positions, bollard allocations and operating rules
for MIDPL Kattupalli. Do not fork it to a personal public account, paste
its contents into public forums or AI tools outside approved channels, or
enable GitHub Pages unless a publicly reachable demo URL has been cleared.

## Reporting a vulnerability

Report suspected security problems privately to the product owner
(Tushar — GM & Terminal Head, MIDPL Kattupalli) or the APSEZ IT security
team. Do not open a public issue. Include what you observed, how to
reproduce it, and the impact you expect.

## What must never be committed

| Never commit | Why |
|---|---|
| `.env` files, connection strings, API keys, JWT secrets | Direct compromise of the production system |
| Real staff mobile numbers in test data | Personal data |
| Vessel schedules, manifests, line or agent correspondence | Commercially confidential |
| Database dumps or report exports containing live operational data | Commercially confidential |

The repository `.gitignore` blocks the common cases, but the rule is the
author's responsibility, not the tool's.

If a secret is committed, treat it as compromised: rotate the credential
first, then remove it from the repository and its history.

## Production security requirements

The prototype in this repository has no server and uses a demo OTP
(`123456`). Before any production deployment the following are mandatory —
they are tracked as NFR-06 and FR-106/FR-107 in `docs/SRS.md`:

- HTTPS everywhere; no plain HTTP endpoint
- Real OTP delivery (SMS or email) with expiry and retry limiting
- JWT access and refresh tokens with rotation
- Role permissions enforced server-side on every endpoint, not only in the UI
- Audit logging of every create, update and delete with user identity
- Daily automated database backups with tested restore
- Dependency vulnerability scanning enabled on the repository

## Safety note

PORTVISION 3D is a planning aid. Berthing, mooring and cargo decisions
remain subject to the judgement of the terminal's marine and operations
personnel, the Master's authority, pilotage advice and applicable port
regulations. A validation message in this software is never a substitute
for a safety assessment on the quay.
