# BasePoint DB

BasePoint is a modern multi-database web client built with Next.js, Prisma, and NextAuth.js. It allows users to connect to multiple database types, manage connections, perform CRUD operations, and audit database activity — all through a sleek and secure web interface.

## Features

- **Multi-Database Support**: Connect to PostgreSQL, MySQL, SQLite, and MongoDB
- **Secure Authentication**: Email/password, Google, and GitHub OAuth integration
- **Role-Based Access Control**: Admin, Developer, and Viewer roles with granular permissions
- **Connection Management**: Search, add, edit, and delete database connections
- **Audit & Activity Tracking**: Comprehensive logging of user actions and database operations
- **Modern UI**: Responsive design with dark theme and Lucide icons
- **Real-time Operations**: Live database querying and result display

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm installed
- PostgreSQL (or other supported database) running and accessible
- GitHub and Google OAuth apps for social login (optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SamMcClear/BasePoint-v1.git
   cd BasePoint-v1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration (see Environment Variables section below).

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database Configuration
# Primary database for BasePoint's internal data (user accounts, connections, audit logs)

DATABASE_URL="postgresql://username:password@localhost:5432/basepoint_db?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (Optional)
# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application Settings
NODE_ENV="development"
```

### Environment Variables Explained

- **DATABASE_URL**: Connection string for BasePoint's internal database where user accounts, saved connections, and audit logs are stored
- **NEXTAUTH_URL**: The canonical URL of your application (use your domain in production)
- **NEXTAUTH_SECRET**: A random string used to hash tokens, sign cookies, and encrypt JWTs
- **GITHUB_ID/GITHUB_SECRET**: OAuth credentials for GitHub authentication (get these from GitHub Developer Settings)
- **GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET**: OAuth credentials for Google authentication (get these from Google Cloud Console)

## Project Structure

```
BasePoint-v1/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth.js authentication
│   │   ├── connections/  # Database connection management
│   │   ├── query/        # Database query execution
│   │   └── audit/        # Audit logging
│   ├── dashboard/        # Main dashboard pages
│   ├── connections/      # Database connection management UI
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── database/         # Database-related components
│   └── layout/           # Layout components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection utilities
│   ├── prisma.ts         # Prisma client setup
│   └── utils.ts          # General utilities
├── prisma/               # Prisma ORM files
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── .env.example          # Environment variables template
├── .env.local           # Your local environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

3. **Deploy to your preferred platform:**
   - 
   - 
   - 
   -

## Database Schema

BasePoint uses Prisma ORM with the following main models:

- **User**: User accounts with role-based permissions
- **Connection**: Saved database connections with encrypted credentials
- **AuditLog**: Activity tracking and audit trails
- **Session**: User session management

## Security Features

- **Encrypted Credentials**: Database passwords are encrypted before storage
- **Role-Based Access**: Three-tier permission system (Admin/Developer/Viewer)
- **Audit Logging**: All database operations are logged with user attribution
- **Secure Authentication**: OAuth and secure password hashing
- **Connection Validation**: All database connections are validated before use

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/DESCRIBES-FEATURE`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/...`)
5. Open a Pull Request

## License

TBD

## Support

For support, please open an issue on GitHub or contact the maintainers.

---

**BasePoint DB** - Making multi-database management simple and secure.
