import { 
  diagrams, 
  generatedCode,
  type Diagram, 
  type InsertDiagram,
  type GeneratedCode,
  type InsertGeneratedCode 
} from "@shared/schema";

export interface IStorage {
  // Diagram operations
  createDiagram(diagram: InsertDiagram): Promise<Diagram>;
  getDiagram(id: number): Promise<Diagram | undefined>;
  getAllDiagrams(): Promise<Diagram[]>;
  updateDiagram(id: number, diagram: Partial<InsertDiagram>): Promise<Diagram | undefined>;
  deleteDiagram(id: number): Promise<boolean>;
  
  // Generated code operations
  createGeneratedCode(code: InsertGeneratedCode): Promise<GeneratedCode>;
  getGeneratedCodeByDiagramId(diagramId: number): Promise<GeneratedCode | undefined>;
}

export class MemStorage implements IStorage {
  private diagrams: Map<number, Diagram>;
  private generatedCodes: Map<number, GeneratedCode>;
  private currentDiagramId: number;
  private currentCodeId: number;

  constructor() {
    this.diagrams = new Map();
    this.generatedCodes = new Map();
    this.currentDiagramId = 1;
    this.currentCodeId = 1;
  }

  async createDiagram(insertDiagram: InsertDiagram): Promise<Diagram> {
    const id = this.currentDiagramId++;
    const diagram: Diagram = { 
      ...insertDiagram, 
      id,
      createdAt: new Date()
    };
    this.diagrams.set(id, diagram);
    return diagram;
  }

  async getDiagram(id: number): Promise<Diagram | undefined> {
    return this.diagrams.get(id);
  }

  async getAllDiagrams(): Promise<Diagram[]> {
    return Array.from(this.diagrams.values());
  }

  async updateDiagram(id: number, updateData: Partial<InsertDiagram>): Promise<Diagram | undefined> {
    const existing = this.diagrams.get(id);
    if (!existing) return undefined;
    
    const updated: Diagram = { ...existing, ...updateData };
    this.diagrams.set(id, updated);
    return updated;
  }

  async deleteDiagram(id: number): Promise<boolean> {
    return this.diagrams.delete(id);
  }

  async createGeneratedCode(insertCode: InsertGeneratedCode): Promise<GeneratedCode> {
    const id = this.currentCodeId++;
    const code: GeneratedCode = {
      id,
      diagramId: insertCode.diagramId ?? null,
      code: insertCode.code,
      language: insertCode.language || "typescript",
      componentName: insertCode.componentName,
      sourceType: insertCode.sourceType || "diagram",
      createdAt: new Date()
    };
    this.generatedCodes.set(id, code);
    return code;
  }

  async getGeneratedCodeByDiagramId(diagramId: number): Promise<GeneratedCode | undefined> {
    return Array.from(this.generatedCodes.values()).find(
      (code) => code.diagramId === diagramId
    );
  }
}

export const storage = new MemStorage();
