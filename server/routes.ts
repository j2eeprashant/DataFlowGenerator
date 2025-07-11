import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { insertDiagramSchema, insertGeneratedCodeSchema } from "@shared/schema";
import { setupSocketHandler } from "./services/socket-handler";
import { compileCode } from "./services/code-compiler";
import { analyzeMockupAndGenerateCode } from "./services/image-analyzer";
import { createReactPage } from "./page-generator";
import { initializeReactProject, getProjectsList, getProjectFiles, deleteProject, renameProject } from "./project-initializer";

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

  // Image upload and analysis route
  app.post("/api/upload-mockup", async (req, res) => {
    try {
      const { image, description, generatePage } = req.body; // Added generatePage flag

      if (!image) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Extract base64 data from data URL
      const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, "");

      // Analyze the mockup and generate code
      const analysisResult = await analyzeMockupAndGenerateCode(base64Data, "GeneratedComponent");

      if (analysisResult.success) {
        // Store the generated code
        const generatedCode = await storage.createGeneratedCode({
          diagramId: null, // No diagram associated with image uploads
          code: analysisResult.code,
          language: "typescript",
          componentName: analysisResult.componentName,
          sourceType: "image",
        });

        let pageRoute: string | undefined = undefined;

        if (generatePage) {
          // Create a React page with a route
          pageRoute = `/${analysisResult.componentName.toLowerCase()}`;
          await createReactPage(analysisResult.componentName, analysisResult.code, pageRoute);
        }

        res.json({
          success: true,
          code: analysisResult.code,
          componentName: analysisResult.componentName,
          id: generatedCode.id,
          route: generatePage ? pageRoute : undefined,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to analyze mockup",
          error: analysisResult.error
        });
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Image upload failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // React project initialization route
  app.post("/api/init-project", async (req, res) => {
    try {
      const result = await initializeReactProject();
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          projectPath: result.projectPath,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  });

  // Project management routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await getProjectsList();
      res.json({
        success: true,
        projects,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to list projects",
      });
    }
  });

  app.get("/api/projects/:name/files", async (req, res) => {
    try {
      const projectName = req.params.name;
      const files = await getProjectFiles(projectName);
      res.json({
        success: true,
        files,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to load project files",
      });
    }
  });

  app.delete("/api/projects/:name", async (req, res) => {
    try {
      const projectName = req.params.name;
      await deleteProject(projectName);
      res.json({
        success: true,
        message: `Project "${projectName}" deleted successfully`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete project",
      });
    }
  });

  app.patch("/api/projects/:name/rename", async (req, res) => {
    try {
      const oldName = req.params.name;
      const { newName } = req.body;

      if (!newName || typeof newName !== 'string' || !newName.trim()) {
        return res.status(400).json({
          success: false,
          error: "New name is required and must be a non-empty string",
        });
      }

      await renameProject(oldName, newName.trim());
      res.json({
        success: true,
        message: `Project renamed from "${oldName}" to "${newName.trim()}"`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to rename project",
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