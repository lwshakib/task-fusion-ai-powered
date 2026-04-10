# <img src="./public/logo.svg" width="40" height="40" align="center" /> Task Fusion AI

[![Made with Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io)

**Task Fusion AI** is an intelligent, agent-driven productivity platform designed to bridge the gap between complex planning and seamless execution. Powered by advanced **GLM-4.7-Flash** models, it decomposes goals, synthesizes context, and prioritizes your workflow so you can focus on what truly matters.

---

## 📸 Demo

<p align="center">
  <img src="./public/dark-demo.png" alt="Task Fusion AI - Dark Mode" width="100%">
  <br>
  <em>Dark Mode</em>
</p>

<p align="center">
  <img src="./public/light-demo.png" alt="Task Fusion AI - Light Mode" width="100%">
  <br>
  <em>Light Mode</em>
</p>

---

## ✨ Features

- 🧠 **AI Task Decomposition**: Transform high-level objectives into granular, actionable steps automatically using GLM-4.7-Flash.
- ⚙️ **Autonomous Agent Tools**: The assistant can interact directly with your database to create, update, and manage tasks.
- 💭 **Reasoning & Thinking**: See the AI's step-by-step thinking process as it breaks down complex requests.
- 💬 **Real-time Agent Chat**: Interact with your workspace using natural language via our integrated streaming AI assistant.
- ⚡ **Intelligent Prioritization**: AI-driven suggestions based on deadlines, effort, and project context.
- 🎨 **Premium UI/UX**: Built with **Tailwind CSS 4** and **Framer Motion** for a smooth, high-fidelity experience.
- 🔒 **Secure Authentication**: Robust user security and session management via **Better Auth**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org)
- **Runtime**: [Bun](https://bun.sh)
- **Frontend**: [React 19](https://react.dev)
- **AI Engine**: **GLM-4.7-Flash** via Cloudflare Workers
- **Database**: [PostgreSQL](https://www.postgresql.org) with [Prisma ORM](https://www.prisma.io)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Auth**: [Better Auth](https://better-auth.com)

---

## 🏗️ Architecture

```mermaid
graph TD
    User([User])
    Frontend[Next.js Frontend]
    Worker[Cloudflare Worker Proxy]
    AIService[GLM-4.7-Flash]
    Database[(Postgres Database)]
    Auth[Better Auth]

    User <-->|React 19 Interface| Frontend
    Frontend <-->|Streaming SSE| Worker
    Worker <-->|Chat Completion API| AIService
    Frontend <-->|Prisma Client| Database
    Frontend <-->|Session Management| Auth
    Auth <--> Database
```

---

## ⚙️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed.
- A PostgreSQL database instance.
- A Cloudflare AI Gateway API key and endpoint URL.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/lwshakib/task-fusion-ai-powered.git
   cd task-fusion-ai-powered
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/taskfusion"

   # Authentication
   BETTER_AUTH_SECRET="your_secret_here"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"

   # Google Auth
   GOOGLE_CLIENT_ID="your_google_client_id_here"
   GOOGLE_CLIENT_SECRET="your_google_client_secret_here"

   # Email Service
   RESEND_API_KEY="your_resend_api_key_here"

   # AI Service (Cloudflare AI Gateway)
   CLOUDFLARE_AI_GATEWAY_API_KEY="your_cloudflare_ai_gateway_api_key_here"
   CLOUDFLARE_AI_GATEWAY_ENDPOINT="your_cloudflare_ai_gateway_endpoint_here"
   ```

4. **Run Database Migrations**:

   ```bash
   bun run db:migrate
   ```

5. **Start the development server**:
   ```bash
   bun run dev
   ```

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with ❤️ by [lwshakib](https://github.com/lwshakib)
