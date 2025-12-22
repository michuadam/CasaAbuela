# Casa Abuela - Colombian Coffee E-commerce

## Overview

Casa Abuela is a Polish-language e-commerce website for a family-owned Colombian coffee plantation from the Huila region. The application allows customers to browse coffee products (whole beans and ground coffee in various sizes), add items to a shopping cart, and complete purchases through Stripe payment integration with InPost parcel locker delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for scroll-triggered animations
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api/*`
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **Development**: Vite middleware for HMR in development, static file serving in production

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**:
  - `products`: Coffee products with title, slug (unique URL-friendly identifier), weight, type, roast level, price, description, shortDescription, origin, tastingNotes
  - `productImages`: Product gallery images with productId, imageUrl, altText, sortOrder
  - `cartItems`: Shopping cart items linked to session IDs
  - `newsletterSubscribers`: Email newsletter subscriptions
  - `orders`: Order records with customer details, InPost point info, and Stripe session IDs
  - `users`: User accounts with isAdmin boolean for admin access
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization

### Payment Integration
- **Provider**: Stripe via `stripe-replit-sync` package
- **Environment**: Automatic switching between development and production Stripe keys based on deployment
- **Webhook Handling**: Raw body parsing for signature verification in `webhookHandlers.ts`

### Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # React components including shadcn/ui
│   │   ├── hooks/       # Custom React hooks (use-cart, use-products)
│   │   ├── pages/       # Route pages (Home, Checkout, OrderSuccess, ProductDetail, Admin)
│   │   └── lib/         # Utilities and query client
├── server/          # Express backend
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API route definitions (public + admin endpoints)
│   ├── replitAuth.ts # Authentication with isAdmin middleware
│   ├── storage.ts   # Database access layer
│   └── stripeClient.ts  # Stripe integration
├── shared/          # Shared code between client/server
│   └── schema.ts    # Drizzle database schema
└── db/              # Database configuration
    └── index.ts     # PostgreSQL client setup
```

### Admin Panel
- **Route**: `/admin` - Product management interface
- **Authentication**: Replit Auth with isAdmin flag check
- **Features**: CRUD operations for products, image management
- **API Endpoints**: `/api/admin/*` protected by isAdmin middleware

## External Dependencies

### Payment Processing
- **Stripe**: Payment processing with automatic environment detection (development/production)
- **stripe-replit-sync**: Replit-specific Stripe integration package for credential management

### Delivery Integration
- **InPost Geowidget**: Parcel locker selection widget loaded from `geowidget.inpost.pl`

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **React Query**: Server state management and caching
- **Radix UI**: Accessible component primitives
- **Embla Carousel**: Product/process image carousels
- **Sonner**: Toast notifications

### Development Tools
- **Replit Vite Plugins**: Error overlay, dev banner, and cartographer for Replit environment
- **Custom Meta Images Plugin**: OpenGraph image URL management for deployments