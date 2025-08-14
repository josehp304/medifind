# MediFind - Medicine Locator Platform

MediFind is a full-stack web application that helps users quickly locate medicines in nearby pharmacies. The platform offers two search modes: finding pharmacies that stock a specific medicine, and browsing a pharmacy's complete inventory.

## Features

### 🔍 Two Search Modes
- **Medicine-first Search**: Enter a medicine name to find nearby pharmacies with availability, pricing, and distance
- **Shop-first Search**: Select a pharmacy to browse their complete medicine inventory

### 📱 User Experience
- Responsive design for mobile and desktop
- Real-time search with loading animations
- Distance calculation using Haversine formula
- "Nearest Shop" badges and stock availability indicators
- Case-insensitive search functionality

### 🏪 Pharmacy Features
- Real-time inventory management
- Price comparison across pharmacies
- Stock quantity tracking with "Out of Stock" indicators
- Geographic location-based distance calculation

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Shadcn/ui** components

### Backend
- **Node.js** with Express
- **Drizzle ORM** with PostgreSQL
- **Neon Serverless Postgres** database
- RESTful API design

### Database Schema
- **shops**: Pharmacy information with geographic coordinates
- **medicines**: Medicine catalog with descriptions
- **inventory**: Stock levels and pricing per pharmacy

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Neon Postgres database account

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd medifind
   npm install
   ```

2. **Database Setup**
   
   Create a Neon Postgres database:
   - Go to [Neon Console](https://console.neon.tech)
   - Create a new project
   - Copy the connection string

3. **Environment Configuration**
   
   Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   ```

4. **Database Migration & Seeding**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npx tsx server/seed.ts
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

## API Endpoints

### Medicine Search
