import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { insertDiagramSchema, insertGeneratedCodeSchema } from "@shared/schema";
import { setupSocketHandler } from "./services/socket-handler";
import { compileCode } from "./services/code-compiler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Diagram CRUD routes
  app.get("/api/diagrams", async (req, res) => {
    try {
      const diagrams = await storage.getAllDiagrams();
      res.json(diagrams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch diagrams" });
    }
  });

  app.get("/api/diagrams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const diagram = await storage.getDiagram(id);
      if (!diagram) {
        return res.status(404).json({ message: "Diagram not found" });
      }
      res.json(diagram);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch diagram" });
    }
  });

  app.post("/api/diagrams", async (req, res) => {
    try {
      const validatedData = insertDiagramSchema.parse(req.body);
      const diagram = await storage.createDiagram(validatedData);
      res.status(201).json(diagram);
    } catch (error) {
      res.status(400).json({ message: "Invalid diagram data" });
    }
  });

  app.put("/api/diagrams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDiagramSchema.partial().parse(req.body);
      const diagram = await storage.updateDiagram(id, validatedData);
      if (!diagram) {
        return res.status(404).json({ message: "Diagram not found" });
      }
      res.json(diagram);
    } catch (error) {
      res.status(400).json({ message: "Invalid diagram data" });
    }
  });

  app.delete("/api/diagrams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDiagram(id);
      if (!deleted) {
        return res.status(404).json({ message: "Diagram not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete diagram" });
    }
  });

  // Code generation route
  app.post("/api/generate-code", async (req, res) => {
    try {
      const { diagramId, code, componentName } = req.body;
      const generatedCode = await storage.createGeneratedCode({
        diagramId,
        code,
        language: "typescript",
        componentName,
      });
      res.json(generatedCode);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate code" });
    }
  });

  // Code compilation route
  app.post("/api/compile-code", async (req, res) => {
    try {
      const { code, componentName } = req.body;
      const result = await compileCode(code, componentName);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        message: "Compilation failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  
  // Setup Socket.IO for real-time communication
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  setupSocketHandler(io);

  return httpServer;
}
