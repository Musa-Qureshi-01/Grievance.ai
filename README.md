# Grievance.ai — Smart Public Governance & AI Dispatch Platform

[![Neon Auth](https://img.shields.io/badge/Identity-Neon%20Auth%20OIDC-blueviolet?style=for-the-badge)](https://neon.tech/docs/guides/auth)
[![Google Cloud Run](https://img.shields.io/badge/Deployment-Cloud%20Run-blue?style=for-the-badge)](https://cloud.google.com/run)
[![Firebase Hosting](https://img.shields.io/badge/Hosting-Firebase%20UI-orange?style=for-the-badge)](https://firebase.google.com)
[![FastAPI Models](https://img.shields.io/badge/AI%20Services-FastAPI%20Classification-emerald?style=for-the-badge)](https://fastapi.tiangolo.com)

Grievance.ai is a state-of-the-art, secure, and fully automated public administration platform designed to bridge the gap between citizens and municipal authorities. By leveraging advanced machine learning classification pipelines and real-time synchronization networks, Grievance.ai classifies, sanitizes, tracks, and routes civic issues to the appropriate municipal departments instantly.

---

## Live Deployments

Experience the live, production-grade deployment of the platform:

| Component | Service Platform | Live Endpoint URL |
| :--- | :--- | :--- |
| **Frontend Web Application** | Google Firebase Hosting | [https://grievance-ai-ui.web.app](https://grievance-ai-ui.web.app) |
| **Backend API Engine** | Google Cloud Run (Containerized) | [https://grievance-server-200448172587.us-central1.run.app](https://grievance-server-200448172587.us-central1.run.app) |

---

## System Architecture & Features

Grievance.ai transitions city management away from slow manual filing by offering three highly specialized web portals secured with **Neon Auth's OpenID Connect (OIDC)** identity system:

### 1. The Citizen Hub
* **AI-Guided Submission:** File civic issues with automatic department auto-tagging, severity assessment, and title optimization.
* **Global Leaderboards:** Engagement metrics celebrating citizens who contribute actively to community resolutions.
* **Community Portals:** Interactive maps and live boards detailing localized complaints and ongoing infrastructure operations.

### 2. The Officer Workspace
* **AI Intelligence Center:** Interactive natural language workspaces equipped with automated summarizers, routing recommendations, and dispatch triggers.
* **Operational Queue:** Dynamic Kanban boards with real-time status syncing via Socket.io channels.
* **Leaderboards & Auditing:** Metrics assessing departmental turnaround times, accuracy, and case closure efficiency.

### 3. The Admin Command Center
* **Operational Dashboards:** Premium charts and real-time telemetry analyzing total complaints, resolution rates, and departmental load metrics.
* **Citizen Management:** Advanced table operations for citizen roles, verification overrides, and identity auditing.
* **System Settings:** Centralized toggle boards managing regional routing rules, notification triggers, and API integrations.

---

## Behind the Scenes: Asymmetric AI Orchestration
* **Secure JWT Middleware:** Performs high-speed cryptographic signature verification natively against Neon's **Ed25519 (EdDSA)** OIDC elliptic curve key sets (JWKS).
* **Automatic Database Synchronizer:** Features a self-healing user onboarding engine that translates OIDC session claims directly into Postgres relational records on-the-fly.
* **FastAPI Model Spaces:** Connects municipal dispatchers to distributed classification layers hosted on Hugging Face Spaces for offloaded, high-throughput text analytics.

---

## Contributors

Honoring the engineering minds behind the architecture, implementation, and deployment of Grievance.ai:

| Contributor | Specialized Role | Primary Contributions |
| :--- | :--- | :--- |
| | | |
| | | |
| | | |
| | | |
| | | |

---

<p align="center">
  <i>Securing, Automating, and Modernizing Civic Governance</i>
</p>
