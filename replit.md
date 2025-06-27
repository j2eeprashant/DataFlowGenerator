# DataFlow Designer - replit.md

## Overview

DataFlow Designer is a web-based visual diagramming tool that allows users to create data flow diagrams and automatically generate React components from those diagrams. The application features a drag-and-drop interface for building flowcharts with different node types (input, process, output, datastore) and provides real-time code generation with compilation capabilities.

## System Architecture

The application follows a full-stack architecture with a clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and production builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Diagramming**: ReactFlow for the visual diagram editor

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Communication**: Socket.IO for live code generation and compilation feedback
- **Code Processing**: Babel for TypeScript/JSX compilation

## Key Components

### Client Components
1. **DiagramEditor**: Main application interface with tabbed panels
2. **DiagramCanvas**: ReactFlow-based canvas for node manipulation
3. **NodePalette**: Draggable node types (input, process, output, datastore)
4. **PropertiesPanel**: Node configuration and diagram settings
5. **CodeViewer**: Generated React code display with copy functionality
6. **ConsoleOutput**: Real-time compilation logs and error messages
7. **Toolbar**: File operations and code generation controls

### Server Components
1. **Storage Layer**: Abstracted storage interface with in-memory implementation
2. **API Routes**: RESTful endpoints for diagram CRUD operations
3. **Socket Handler**: Real-time communication for code generation
4. **Code Compiler**: Babel-based TypeScript/JSX compilation service

### Node Types
- **Input Nodes**: Data entry points with validation options
- **Process Nodes**: Data transformation with custom logic
- **Output Nodes**: Result display components
- **DataStore Nodes**: Storage layer representations

## Data Flow

1. **Diagram Creation**: Users drag nodes from palette to canvas
2. **Node Configuration**: Properties panel allows customization of node behavior
3. **Connection Building**: Users connect nodes to define data flow
4. **Code Generation**: Socket.IO triggers server-side React code generation
5. **Compilation**: Babel transforms TypeScript/JSX to executable JavaScript
6. **Real-time Feedback**: Console displays compilation status and errors

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, ReactDOM, React Query)
- Vite build tooling with TypeScript support
- Express.js with Socket.IO for real-time features

### UI/UX Dependencies
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- ReactFlow for diagram visualization
- Lucide React for consistent iconography

### Database & ORM
- Drizzle ORM with PostgreSQL dialect
- Neon Database serverless driver
- Zod for schema validation

### Development Tools
- TypeScript for type safety
- Babel for code transformation
- ESBuild for production bundling

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` starts development server on port 5000
- **Hot Reload**: Vite HMR for instant client updates
- **Database**: PostgreSQL 16 module in Replit environment

### Production Build
- **Build Process**: Vite builds client assets, ESBuild bundles server
- **Static Assets**: Client build output served from `/dist/public`
- **Server Bundle**: Single ESM file for production deployment

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Environment**: Autoscale deployment target with build/run commands

### Database Schema
The application uses two main tables:
- **diagrams**: Stores diagram metadata, nodes, connections, and settings as JSON
- **generated_code**: Stores generated React components linked to diagrams

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **June 27, 2025**: Initial project setup with full-stack architecture
- **June 27, 2025**: Built custom image analyzer to replace external API dependency
- **June 27, 2025**: Fixed payload size limits for image uploads (increased to 50MB)
- **June 27, 2025**: Added comprehensive local development documentation
- **June 27, 2025**: Integrated image upload feature with custom React code generation

## User Preferences

- Prefers simple, everyday language for communication
- Wants to avoid external API dependencies when possible
- Values self-contained solutions that work locally

## Changelog

- June 27, 2025: Initial setup with custom image analyzer implementation