# Local Development Setup

## Quick Start

1. **Prerequisites**
   - Node.js 18 or higher
   - npm package manager

2. **Installation**
   ```bash
   # Clone the repository
   git clone <your-repo-url>
   cd dataflow-designer
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

3. **Access the application**
   Open your browser to `http://localhost:5000`

## What You Get

- Visual diagram editor with drag-and-drop nodes
- Real-time code generation from diagrams
- Image upload feature that converts UI mockups to React code
- Live code compilation and execution
- Persistent diagram storage

## File Structure

```
dataflow-designer/
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared types
├── package.json     # Dependencies and scripts
└── README.md        # Full documentation
```

## Development Commands

- `npm run dev` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run start` - Run production build

## Key Features

### Diagram Editor
- Drag nodes from left palette to canvas
- Connect nodes by dragging between connection points
- Configure node properties in right panel
- Save/load diagrams using toolbar

### Code Generation
- Click "Generate Code" to create React components from diagrams
- View generated TypeScript code in "Code" tab
- Use "Compile & Run" to test the generated component

### Image Upload
- Click "Upload" tab in right panel
- Select UI mockup image (JPEG/PNG, up to 10MB)
- Add optional description
- Generate React code automatically from the image
- Compile and run the generated component

## Troubleshooting

**Port already in use?**
- Change port in `server/index.ts` if needed
- Or kill process using port 5000: `lsof -ti:5000 | xargs kill`

**Large image uploads failing?**
- Images are processed locally, no external APIs needed
- Server supports up to 50MB uploads
- Try reducing image size if issues persist

**React Flow warnings?**
- These are development warnings and don't affect functionality
- The diagram canvas will still work normally

## Production Deployment

```bash
npm run build
NODE_ENV=production npm start
```

The application will serve both frontend and backend from a single Express server.