# Overview

MediFind is a full-stack medicine locator platform that helps users quickly find medicines in nearby pharmacies. The application offers two primary search modes: medicine-first search (find pharmacies that stock a specific medicine) and shop-first search (browse a specific pharmacy's inventory). The platform provides real-time availability, pricing, and distance calculations to help users make informed decisions about where to purchase medicines.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using a component-based architecture. The application uses Wouter for client-side routing, providing three main routes: home page, medicine search, and shop search. The UI is built with Tailwind CSS and Shadcn/ui components for consistent styling and responsive design. TanStack Query handles data fetching and caching, providing efficient API communication and loading states. The architecture separates concerns with dedicated components for search results, layout elements (header/footer), and reusable UI components.

## Backend Architecture
The backend follows a RESTful API design using Node.js and Express. The server implements a layered architecture with separate modules for routing, database operations, and storage management. The main API endpoints include medicine search, shop listing, and shop inventory queries. The system uses a storage abstraction layer (IStorage interface) implemented by DatabaseStorage, making the data layer easily testable and replaceable. Distance calculations are performed server-side using the Haversine formula with mock user coordinates.

## Database Design
The system uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema consists of three main tables:
- **shops**: Stores pharmacy information including name, address, and geographic coordinates (latitude/longitude)
- **medicines**: Contains medicine catalog with names and descriptions
- **inventory**: Junction table linking shops and medicines with pricing, stock quantities, and availability status

The database uses foreign key relationships to maintain referential integrity, with inventory items referencing both shops and medicines. This normalized design allows for efficient queries while maintaining data consistency.

## Data Flow and Business Logic
Medicine search queries filter inventory by medicine name (case-insensitive), join with shop and medicine data, calculate distances from a mock user location, and sort results by proximity. The nearest shop is automatically flagged for user convenience. Shop inventory queries retrieve all medicines available at a specific pharmacy with stock status indicators (in stock, low stock, out of stock). The system implements real-time stock tracking and price comparison across multiple pharmacies.

## Development and Build System
The application uses Vite as the build tool with TypeScript support throughout the stack. The development setup includes hot module replacement for the frontend and automatic server restart for backend changes. The build process compiles TypeScript to JavaScript and bundles the frontend assets. Path aliases are configured for cleaner imports (@/ for client code, @shared for shared schemas).

# External Dependencies

## Database and Hosting
- **Neon Serverless Postgres**: Cloud PostgreSQL database with serverless architecture
- **Drizzle ORM**: Type-safe database ORM with automatic migrations
- **WebSocket integration**: For real-time database connections via Neon

## Frontend Libraries
- **React**: Core UI framework with hooks and functional components
- **Wouter**: Lightweight client-side routing library
- **TanStack Query**: Data fetching and caching with optimistic updates
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/ui**: Pre-built accessible UI components based on Radix UI
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **TypeScript**: Type safety across frontend and backend
- **ESLint and Prettier**: Code formatting and linting
- **Zod**: Runtime type validation for API schemas
- **Drizzle-Zod**: Integration between Drizzle schema and Zod validation

## Utility Libraries
- **class-variance-authority**: Utility for managing component variants
- **clsx**: Conditional CSS class composition
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation for sessions and components