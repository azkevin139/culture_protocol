# Culture Markets Sovereignty Record

This document is the step-1 ownership and architecture record for the Culture Markets protocol stack.

## Purpose

This file defines:
- which repositories are canonical
- which on-chain programs exist
- which environments are recognized
- which program IDs belong to the Culture Markets stack
- which authority roles must be controlled by Culture Markets
- which dependencies remain
- how event integration is scoped for first bring-up

---

## Canonical repositories

These repositories are the canonical source of truth for the sovereign Culture Markets protocol stack:

1. `azkevin139/culture_protocol`
   - Main protocol program
   - Admin tooling
   - JS client packages
   - Root sovereignty record

2. `azkevin139/culture-product`
   - Product metadata program
   - Commission configuration / escrow-linked product metadata

3. `azkevin139/culture-event`
   - Event data model and lifecycle program
   - Categories, subcategories, event groups, participants, events

---

## Programs in scope

### 1. Main protocol
- Repo: `azkevin139/culture_protocol`
- Program crate/module path: `programs/monaco_protocol`
- Current program ID (localnet/devnet): `7i2N9qqqcfne1BouHhMw1vvNAo2aeVwwWhecWy5XrKqY`

### 2. Product program
- Repo: `azkevin139/culture-product`
- Program crate/module path: `programs/protocol_product`
- Current program ID (localnet/devnet): `2cTEcEM1B5pkVFrqSFnUDowgbRvqc5uoagRBAQ1Uehh7`

### 3. Event program
- Repo: `azkevin139/culture-event`
- Program crate/module path: `programs/protocol_event`
- Current program ID (localnet/devnet): `Q4JNMDYYGb1kktLz1yr6p5PktLvCyVCDcThzmjzji5i`

---

## Environment model

Recognized environments:
- `localnet`
- `devnet`
- `mainnet`

Current active shared config source:
- `config/programIds.ts`

Current IDs:

### localnet
- protocol: `7i2N9qqqcfne1BouHhMw1vvNAo2aeVwwWhecWy5XrKqY`
- product: `2cTEcEM1B5pkVFrqSFnUDowgbRvqc5uoagRBAQ1Uehh7`
- event: `Q4JNMDYYGb1kktLz1yr6p5PktLvCyVCDcThzmjzji5i`

### devnet
- protocol: `7i2N9qqqcfne1BouHhMw1vvNAo2aeVwwWhecWy5XrKqY`
- product: `2cTEcEM1B5pkVFrqSFnUDowgbRvqc5uoagRBAQ1Uehh7`
- event: `Q4JNMDYYGb1kktLz1yr6p5PktLvCyVCDcThzmjzji5i`

### mainnet
- protocol: `TBD`
- product: `TBD`
- event: `TBD`

---

## Authority model

### Upgrade authority
- Mainnet target: must be a fresh Culture Markets-controlled authority wallet or multisig
- Status: `TBD before mainnet deployment`
- Requirement: do not use any wallet/seed phrase that has been exposed in chat or insecure channels

### Admin operator
- Devnet/testing: may be a temporary Culture-controlled dev wallet
- Mainnet target: fresh Culture Markets-controlled operations wallet or multisig-backed operator workflow
- Status: `TBD / operationally assigned during deployment`

### Crank / market operators
- Must be explicitly authorized by the Culture Markets-controlled admin/operator path
- Status: assigned during initialization and operations setup

---

## Step-1 scope decision for event integration

### Decision
The event program is included in the step-1 sovereignty inventory, but it does **not** block the first localnet/devnet bring-up of the main protocol.

### Why
- The main protocol explicitly depends on the product program today.
- The event program is a separate program for event data modeling and lifecycle.
- The full Culture Markets stack will use the event program, but first deployment of the core market protocol should not be delayed by event integration complexity.

### Operational interpretation
- Required for ownership inventory: **yes**
- Required for first protocol bring-up: **no**
- Required for full Culture Markets stack: **yes**

### Implementation rule
Proceed with:
1. protocol + product bring-up first
2. event integration immediately after the first successful local/dev deployment path is verified

---

## Dependency posture

### Core sovereign dependency position
- `culture_protocol` now points product dependency to the Culture-owned fork of `culture-product`
- No Monaco-owned Git dependency should remain in the core protocol path

### Remaining external dependencies
These remain standard open-source library/tooling dependencies, not protocol-ownership dependencies:
- Anchor
- Solana crates
- SPL Token libraries
- JS/TS ecosystem packages used for tooling and clients

---

## Branch strategy

Target convention across sovereign repos:
- `main` = stable
- `develop` = active integration

Companion branches have been created to normalize structure across:
- `culture_protocol`
- `culture-product`
- `culture-event`

Repository default-branch settings in GitHub UI should be aligned separately if needed.

---

## Deployment policy notes

Before mainnet:
- generate fresh mainnet program keypairs
- assign final upgrade authority deliberately
- assign final admin/operator wallet deliberately
- confirm no exposed seed phrase or compromised dev wallet is reused
- re-check `config/programIds.ts`
- verify admin tooling resolves IDs only through `CULTURE_ENV` / config or explicit override

---

## Current step-1 completion meaning

Step 1 is considered complete when:
- all canonical repos are forked and owned
- IDs are Culture-controlled for localnet/devnet
- licensing and attribution are preserved
- branding is no longer Monaco-facing in live repo metadata
- admin runtime resolves program IDs through Culture-controlled config
- dependency chain is pointed to Culture-owned forks
- event scope is explicitly documented and not allowed to delay first bring-up

---

## Next execution path

Recommended next path:
1. build verification
2. localnet bring-up
3. devnet deployment
4. operator/admin initialization
5. first market lifecycle test
6. then event-program integration into the broader Culture Markets stack
