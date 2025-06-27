# DataFlow Designer

A web-based visual diagramming tool that allows users to create data flow diagrams and automatically generate React components from those diagrams. Features a drag-and-drop interface for building flowcharts and provides real-time code generation with compilation capabilities.

## Features

- 🎨 **Visual Diagram Editor**: Drag-and-drop interface with ReactFlow
- 🔄 **Real-time Code Generation**: Convert diagrams to TypeScript React components
- 🖼️ **Image-to-Code**: Upload UI mockups and generate React components automatically
- ⚡ **Live Compilation**: Real-time code compilation and execution
- 💾 **Persistent Storage**: Save and load diagrams
- 🎯 **Node Types**: Input, Process, Output, and DataStore nodes
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS + shadcn/ui components
- ReactFlow for diagram visualization
- TanStack Query for state management
- Socket.IO for real-time communication

### Backend
- Node.js with Express.js
- TypeScript with ESM modules
- Socket.IO for real-time features
- Babel for code compilation
- In-memory storage (easily extensible to database)

## Local Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dataflow-designer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

The development server will start both the frontend (Vite) and backend (Express) on the same port.

### Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── pages/        # Page components
│   └── index.html
├── server/               # Backend Express application
│   ├── services/         # Business logic services
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage layer
├── shared/               # Shared types and schemas
│   └── schema.ts
└── package.json
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Key Features Usage

#### 1. Creating Diagrams
- Drag nodes from the left palette to the canvas
- Connect nodes by dragging from one node's handle to another
- Configure node properties in the right panel
- Use the toolbar to save, load, or create new diagrams

#### 2. Code Generation
- Click "Generate Code" in the toolbar
- View generated TypeScript React code in the "Code" tab
- Copy code or compile it directly in the browser

#### 3. Image Upload Feature
- Click the "Upload" tab in the right panel
- Select a UI mockup image (JPEG/PNG, max 10MB)
- Add optional description for better analysis
- Click "Generate Code" to create React component from the image
- Use "Compile & Run" to test the generated component

#### 4. Real-time Compilation
- Generated code is compiled using Babel
- View compilation results and console logs in the "Console" tab
- Errors and warnings are displayed in real-time

### API Endpoints

- `GET /api/diagrams` - Get all diagrams
- `POST /api/diagrams` - Create new diagram
- `PUT /api/diagrams/:id` - Update diagram
- `DELETE /api/diagrams/:id` - Delete diagram
- `POST /api/upload-mockup` - Upload and analyze mockup image
- `POST /api/compile-code` - Compile TypeScript code

### WebSocket Events

- `generate-code` - Generate code from diagram
- `compile-code` - Compile and execute code
- `compilation-result` - Receive compilation results
- `compilation-log` - Receive real-time logs

## Customization

### Adding New Node Types

1. Create a new node component in `client/src/components/nodes/`
2. Add the node type to `nodeTypes` in `diagram-canvas.tsx`
3. Update the node palette in `node-palette.tsx`
4. Add corresponding logic in the code generator

### Extending Storage

The storage layer is abstracted through `IStorage` interface. To add database support:

1. Implement the `IStorage` interface for your database
2. Update the storage instance in `server/storage.ts`
3. Add database connection configuration

### Custom Image Analysis

The image analyzer in `server/services/image-analyzer.ts` uses heuristic-based analysis. To improve it:

1. Add computer vision libraries (OpenCV, TensorFlow)
2. Implement more sophisticated image processing
3. Add machine learning models for better UI element detection

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

- `NODE_ENV` - Set to 'production' for production builds
- `PORT` - Server port (defaults to 5000)

### Docker Deployment

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details