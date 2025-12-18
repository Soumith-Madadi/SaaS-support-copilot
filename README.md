# AI Chat Support Multi-Company SaaS Platform

A full-stack multi-tenant SaaS platform for AI-powered customer support. Each company can manage their own data, and users can interact with an AI chatbot that uses company-specific context to answer questions.

## Live Demo

**Access the live application at:** [https://saas-support-copilot-gf1qy6sjk-soumithmadadi-6457s-projects.vercel.app](https://saas-support-copilot-gf1qy6sjk-soumithmadadi-6457s-projects.vercel.app)

## Project Purpose

This project demonstrates a production-ready SaaS platform that solves real-world business problems. It enables companies to provide AI-powered customer support through intelligent chatbots that understand company-specific context. The platform supports multiple companies (multi-tenancy), allowing each organization to maintain isolated data while sharing the same infrastructure.

**Key Business Value:**
- Reduces customer support costs through AI automation
- Provides 24/7 customer support availability
- Enables companies to scale support without proportional cost increases
- Offers personalized support experiences based on company-specific knowledge

## Why This Project Stands Out

1. **Enterprise-Grade Architecture**: Multi-tenant design with complete data isolation, ensuring security and scalability for multiple organizations
2. **AI Integration**: Seamlessly integrates Google Gemini AI to provide context-aware responses using company-specific knowledge bases
3. **Full-Stack Excellence**: Demonstrates proficiency across the entire stack - from database design to API development to modern React UI
4. **Production Ready**: Includes authentication, authorization, role-based access control, and secure password handling
5. **Modern Tech Stack**: Built with cutting-edge technologies (Next.js 14, TypeScript, Prisma, PostgreSQL) following industry best practices
6. **Real-World Features**: Chat history and company data management - features that businesses actually need

## Tech Stack

- **Frontend/Backend**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Styling**: Tailwind CSS

## Screenshots

### User Dashboard
![User Company_Search](https://github.com/user-attachments/assets/8d1a8c01-dc87-41ba-80bd-c067bb688ea2)

### User Chat Interface
![Chat Interface](https://github.com/user-attachments/assets/6d5b78d0-1698-4a0f-b037-7dcb5ef457f2)

### User Chat History
![Company Chat List](https://github.com/user-attachments/assets/256631ba-5475-44d1-8bee-04982766361a)

### Company Dashboard
![Chat Viewer](https://github.com/user-attachments/assets/7213db7b-0853-44e3-81f6-e6b22400f49a)

### User Sign Up Page
![Sign Up](https://github.com/user-attachments/assets/38af8709-423a-496a-b648-a945e0a10a71)

## Engineering Skills Demonstrated

### Full-Stack Development
- **Frontend**: Built responsive, modern UI using Next.js 14 App Router, React, TypeScript, and Tailwind CSS
- **Backend**: Designed and implemented RESTful APIs with Next.js API routes
- **Database**: Architected PostgreSQL schema with Prisma ORM, including proper relationships and constraints

### System Design & Architecture
- **Multi-Tenancy**: Implemented secure multi-tenant architecture with complete data isolation
- **Authentication & Authorization**: Integrated NextAuth.js with role-based access control (Customer, Company Admin, Company Member)
- **API Design**: Created well-structured API endpoints with proper error handling and validation

### AI/ML Integration
- **AI Chatbot**: Integrated Google Gemini API to create context-aware chatbots
- **Context Management**: Implemented system to dynamically inject company-specific knowledge into AI prompts
- **Intelligent Summarization**: Built automatic chat summarization feature using AI

### DevOps & Deployment
- **CI/CD**: Set up automated deployments with Vercel
- **Database Migrations**: Implemented version-controlled database migrations with Prisma
- **Environment Management**: Configured secure environment variable management for production

### Security Best Practices
- **Password Hashing**: Implemented bcrypt for secure password storage
- **Session Management**: Used NextAuth.js for secure session handling
- **Row-Level Security**: Ensured users can only access their own company's data
- **Input Validation**: Added proper validation and sanitization throughout the application

### Code Quality
- **TypeScript**: Full type safety across the application
- **Component Architecture**: Built reusable, maintainable React components
- **Error Handling**: Comprehensive error handling and user feedback
- **Code Organization**: Clean, modular code structure following best practices

## Contact Info

**LinkedIn:** [My LinkedIn Profile](https://linkedin.com/in/soumith-madadi-a8038b233/)  
**Email:** madadi.soumith@gmail.com  
**GitHub:** [My GitHub Profile](https://github.com/Soumith-Madadi)  

---

## Features

- **Multi-Company Support**: Each company has isolated data and users
- **AI Chatbot**: Google Gemini-powered chatbot with company-specific context
- **User Chat History**: Users can view their own chat history
- **Company Admin Dashboard**: Admins can view all company user chats
- **Chat Summaries**: AI-generated summaries for each conversation
- **Company Data Management**: Manage features, pricing, usage docs, and common issues

## Project Structure

```
/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── company/           # Company admin routes
│   │   ├── api/               # API routes
│   │   └── ...                # Other routes
│   ├── components/
│   │   ├── chat/              # Chat components
│   │   ├── company/           # Company management components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client
│   │   ├── gemini.ts          # Gemini client
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript types
```

## API Routes

- `POST /api/auth/register` - Register a new company and user
- `POST /api/chat/message` - Send a message in a chat
- `PUT /api/company/data` - Update company data (admin only)

## Database Schema

- **Company**: Company information
- **User**: Regular users (customers)
- **CompanyData**: Company-specific data (features, pricing, etc.)
- **Chat**: Chat conversations
- **Message**: Individual messages in chats

## Security

- All API routes are protected with NextAuth session checks
- Row-level security: Users can only access their own company's data
- Role-based access control for different user types
- Passwords are hashed using bcrypt

## License

ISC
