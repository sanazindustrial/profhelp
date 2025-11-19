# ProfHelp - Multi-AI Academic Assistant

A comprehensive academic assistance application with **multi-AI provider support** featuring Claude Sonnet 4.5, OpenAI, and free fallback providers. Designed to assist professors and students with AI-powered educational tools while prioritizing cost-effectiveness and reliability.

## 🚀 Key Features

### Multi-AI Provider System

- **Primary**: OpenAI GPT (prioritized for user's existing API key)
- **Secondary**: Anthropic Claude Sonnet 4.5 (as requested)  
- **Free Fallbacks**: Groq, HuggingFace, Mock provider
- **Automatic Failover**: Seamless switching between providers
- **Cost Optimization**: Prioritizes user's paid services first

### Authentication & Access

- **Flexible Auth**: Optional Google OAuth
- **Guest Access**: Immediate testing without registration
- **Invitation System**: Controlled user management
- **Role-based Access**: Admin, user, and guest levels

### Academic Features

- **AI-powered Chat**: Multi-provider conversations
- **File Upload**: Document processing and analysis
- **Grading Assistant**: Automated assessment tools
- **User Management**: Admin dashboard for oversight

## 🏗️ Technical Stack

- **Framework**: Next.js 13+ with TypeScript
- **Authentication**: NextAuth.js with flexible providers
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with modern UI components
- **AI Integration**: Multi-provider adapter pattern

## 📦 Installation & Setup

### Prerequisites

- Node.js (version 18 or higher)
- pnpm package manager
- PostgreSQL database
- AI provider API keys (see configuration below)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/sanazindustrial/profhelp.git
cd profhelp
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Environment Setup**
Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/profhelp"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Providers (Configure as available)
OPENAI_API_KEY="your-openai-key"        # Prioritized first
ANTHROPIC_API_KEY="your-anthropic-key"  # Claude Sonnet 4.5
GROQ_API_KEY="your-groq-key"           # Free option
HUGGINGFACE_API_KEY="your-hf-key"      # Free option

# Optional Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **Database Setup**

```bash
pnpm prisma:generate
pnpm migration:postgres:local
```

5. **Run Development Server**

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🤖 Multi-AI Provider Configuration

### Provider Priority Order

1. **OpenAI** - Uses your existing API key (prioritized)
2. **Anthropic** - Claude Sonnet 4.5 (as requested)
3. **Groq** - Free high-speed inference
4. **HuggingFace** - Free open-source models
5. **Mock** - Development and testing fallback

### API Status Endpoint

Check provider availability:

```bash
GET /api/status
```

Response:

```json
{
  "providers": {
    "openai": { "available": true, "cost": "paid" },
    "anthropic": { "available": true, "cost": "paid" },
    "groq": { "available": true, "cost": "free" },
    "huggingface": { "available": false, "cost": "free" },
    "mock": { "available": true, "cost": "free" }
  }
}
```

## 🔐 Authentication Options

### Option 1: Google OAuth (Recommended)

- Full user management
- Secure authentication
- Admin invite system

### Option 2: Guest Access

- Immediate testing
- No registration required
- Limited functionality

### Option 3: Credential-based

- Username/password system
- Local account management
- Full feature access

## 🎯 Getting Started Guide

1. **Quick Test**: Visit app and use guest access
2. **Configure AI**: Add your OpenAI API key to prioritize your paid service
3. **Add Claude**: Set ANTHROPIC_API_KEY for Claude Sonnet 4.5 access
4. **Free Backup**: Configure Groq for cost-effective fallback
5. **Admin Setup**: Invite users through admin panel

## 🛠️ Development

### Project Structure

```
├── adaptors/          # Multi-AI provider implementations
│   ├── multi-ai.adaptor.ts    # Main coordinator
│   ├── anthropic.adaptor.ts   # Claude integration
│   ├── openai-chat.adaptor.ts # OpenAI integration
│   ├── groq.adaptor.ts        # Groq integration
│   ├── huggingface.adaptor.ts # HuggingFace integration
│   └── mock.adaptor.ts        # Mock/testing provider
├── app/              # Next.js app directory
│   ├── api/          # API routes
│   │   ├── chat/     # Multi-AI chat endpoint
│   │   ├── status/   # Provider status endpoint
│   │   └── auth/     # Authentication
│   ├── auth/         # Authentication pages
│   └── ...
├── components/       # React components
├── types/           # TypeScript definitions
│   └── ai.types.ts  # AI provider interfaces
└── prisma/          # Database schema
```

### Adding New AI Providers

1. Create provider adapter implementing `AIProvider` interface
2. Add to `multi-ai.adaptor.ts` provider list
3. Update environment configuration
4. Test integration

Example provider implementation:

```typescript
import { AIProvider, ChatMessage, ChatResponse } from '@/types/ai.types'

export class NewProvider implements AIProvider {
  name = 'newprovider'
  cost = 'free' as const
  
  async isAvailable(): Promise<boolean> {
    return !!process.env.NEW_PROVIDER_API_KEY
  }
  
  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    // Implementation
  }
  
  async streamChat(messages: ChatMessage[]): Promise<ReadableStream> {
    // Streaming implementation
  }
}
```

## 📈 Why This Approach?

### Cost Optimization

- **Prioritizes user's existing OpenAI key** (as requested)
- Falls back to free providers when needed
- Transparent cost tracking per provider

### Reliability

- **Never fails** - always has a working provider
- Automatic failover between services
- Mock provider ensures development continuity

### Flexibility

- Easy to add new AI providers
- Configure priority based on needs
- Optional authentication for immediate access

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`                 | Starts local dev server at `localhost:3000`     |
| `pnpm build`               | Build your production site to `./dist/`         |
| `pnpm preview`             | Preview your build locally, before deploying    |
| `pnpm type-check`          | Run TypeScript type checking                     |
| `pnpm prisma:generate`     | Generate Prisma client                          |
| `pnpm migration:postgres:local` | Run database migrations                     |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎉 Implementation Achievements

✅ **Claude Sonnet 4.5 Integration** - As requested  
✅ **OpenAI Prioritization** - Uses your existing API key first  
✅ **Free AI Alternatives** - Groq & HuggingFace fallbacks  
✅ **Optional OAuth** - No Google requirement for immediate testing  
✅ **Complete Next.js App** - Production-ready academic platform  
✅ **Multi-provider Reliability** - Never fails to provide AI responses  
✅ **Cost-effective Architecture** - Prioritizes paid services you already have  
✅ **Seamless Fallback** - Automatic switching between providers  

## 📚 Original Features

This builds upon the solid foundation of the original ProfHelp platform:

- Next.js 13 App Directory structure
- Radix UI Primitives for accessible and customizable UI components
- Tailwind CSS for efficient styling
- Icons from [Lucide](https://lucide.dev)
- Dark mode support with `next-themes`
- Tailwind CSS class sorting, merging, and linting

## 🔧 Configuration Details
