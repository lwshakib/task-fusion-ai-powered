# TaskFusion 🚀

**AI-Powered Task Management Reimagined**

TaskFusion is a modern, intelligent task management application that combines the power of AI with intuitive user experience. Built with Next.js 15, it offers seamless switching between chat and visual modes, AI-generated task suggestions, and intelligent organization based on priority and context.

![TaskFusion](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)


![TaskFusion Demo](./public/demo.gif)

_Watch TaskFusion in action - AI-powered task management with seamless chat and visual modes_

## ✨ Features

### 🤖 AI-Powered Task Management

- **Intelligent Task Generation**: AI creates tasks based on natural language input
- **Smart Prioritization**: Automatic priority assignment (HIGH, MEDIUM, LOW)
- **Context-Aware Responses**: AI understands conversation history for better task creation
- **Natural Language Processing**: Create, update, and delete tasks using plain English

### 🎯 Dual Interface Modes

- **Chat Mode**: Conversational AI interface for task management
- **Visual Mode**: Traditional task list view with drag-and-drop organization
- **Seamless Switching**: Toggle between modes without losing context

### 🔐 Authentication & Security

- **Clerk Integration**: Secure user authentication and management
- **User-Specific Data**: Each user has isolated tasks and messages
- **Protected Routes**: Middleware ensures secure access to private content

### 📱 Modern UI/UX

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Smooth Animations**: Framer Motion powered interactions
- **Accessibility**: Built with Radix UI components for better accessibility

### 🗄️ Data Management

- **PostgreSQL Database**: Robust data storage with Prisma ORM
- **Real-time Updates**: Instant task and message synchronization
- **Sorting & Filtering**: Multiple sorting options (priority, creation date)
- **Task Completion Tracking**: Mark tasks as complete/incomplete

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI Integration**: Google GenAI
- **State Management**: React Context API
- **Animations**: Framer Motion

### Project Structure

```
task-fusion/
├── actions/           # Server actions for database operations
├── app/              # Next.js app router pages and layouts
│   ├── (auth)/      # Authentication routes
│   ├── (main)/      # Main application routes
│   └── api/         # API endpoints
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Feature-specific components
├── lib/             # Utility functions and configurations
├── prisma/          # Database schema and migrations
└── public/          # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication
- Google AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lwshakib/task-fusion-ai-powered.git
   cd task-fusion
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/taskfusion"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Google AI
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npm run generate

   # Run database migrations
   npm run migrate:dev
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating Tasks

1. **Chat Mode**: Simply type "Create a task to buy groceries" and the AI will create it
2. **Visual Mode**: Use the task creation form with priority selection

### Managing Tasks

- **Update**: "Change the task 'Buy groceries' to 'Buy groceries and medicine'"
- **Delete**: "Remove the task 'Call mom'"
- **Complete**: "Mark 'Buy groceries' as done"
- **Priority**: Tasks are automatically prioritized, but you can manually adjust

### AI Commands

The AI understands natural language and can:

- Create multiple tasks at once
- Update existing tasks with new information
- Delete tasks by description
- Provide contextual responses based on conversation history

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run generate     # Generate Prisma client
npm run migrate:dev  # Run database migrations
npm run migrate:deploy # Deploy migrations to production
npm run migrate:studio # Open Prisma Studio
```

### Database Schema

The application uses three main models:

- **User**: Authentication and profile information
- **Task**: Task details with priority, completion status, and descriptions
- **Message**: Chat history for AI context

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run migrations
2. **New Components**: Add to `components/` directory
3. **API Endpoints**: Create in `app/api/` directory
4. **Server Actions**: Add to `actions/` directory

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

- **Railway**: Great for PostgreSQL hosting
- **Supabase**: Alternative to PostgreSQL with built-in auth
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Clerk** for authentication solutions
- **Prisma** for database management
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/lwshakib/task-fusion/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lwshakib/task-fusion/discussions)
- **Email**: support@taskfusion.com

---

**Made with ❤️ by the TaskFusion Team**

_Transform your productivity with AI-powered task management_
