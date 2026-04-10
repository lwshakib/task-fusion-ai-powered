# <img src="./public/logo.svg" width="40" height="40" align="center" /> Task Fusion AI

[![Made with Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io)

Task Fusion AI is an AI-powered task management platform that helps users plan, prioritize, and execute work through real-time chat and tool-assisted automation.

![Task Fusion AI Dark Mode](./public/dark-demo.png)
![Task Fusion AI Light Mode](./public/light-demo.png)

## Features

- AI task creation, updating, deletion, and search via tool calls
- Real-time streaming assistant responses
- Cloudflare AI Gateway integration for model requests
- Better Auth-based authentication flow
- Prisma + PostgreSQL persistence for users, tasks, and messages
- Modern Next.js App Router architecture with Bun runtime

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Bun
- Prisma ORM + PostgreSQL
- Tailwind CSS 4
- Better Auth
- Cloudflare AI Gateway

## Architecture

```mermaid
graph TD
    User[User]
    UI[Next.js App Router UI]
    ChatAPI[POST /api/chat]
    AIService[AIService class]
    Gateway[Cloudflare AI Gateway]
    Tools[Task tools in AIService]
    DB[(PostgreSQL via Prisma)]
    Auth[Better Auth]

    User --> UI
    UI --> ChatAPI
    ChatAPI --> Auth
    ChatAPI --> DB
    ChatAPI --> AIService
    AIService --> Gateway
    AIService --> Tools
    Tools --> DB
    Auth --> DB
```

## Setup

1. Clone the repository:

```bash
git clone https://github.com/lwshakib/task-fusion-ai-powered.git
cd task-fusion-ai-powered
```

2. Install packages:

```bash
bun install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Add environment variables in `.env`:

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

5. Run database migration and generate client:

```bash
bun run db:migrate
```

6. Start development server:

```bash
bun run dev
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
