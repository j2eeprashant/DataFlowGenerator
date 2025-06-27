import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const diagrams = pgTable("diagrams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nodes: json("nodes").notNull(),
  connections: json("connections").notNull(),
  settings: json("settings").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const generatedCode = pgTable("generated_code", {
  id: serial("id").primaryKey(),
  diagramId: serial("diagram_id").references(() => diagrams.id),
  code: text("code").notNull(),
  language: text("language").notNull().default("typescript"),
  componentName: text("component_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDiagramSchema = createInsertSchema(diagrams).omit({
  id: true,
  createdAt: true,
});

export const insertGeneratedCodeSchema = createInsertSchema(generatedCode).omit({
  id: true,
  createdAt: true,
});

export type InsertDiagram = z.infer<typeof insertDiagramSchema>;
export type Diagram = typeof diagrams.$inferSelect;

export type InsertGeneratedCode = z.infer<typeof insertGeneratedCodeSchema>;
export type GeneratedCode = typeof generatedCode.$inferSelect;

// Diagram node types
export const NodeType = z.enum(["input", "process", "output", "datastore"]);
export type NodeType = z.infer<typeof NodeType>;

export const DiagramNode = z.object({
  id: z.string(),
  type: NodeType,
  label: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    dataType: z.string().optional(),
    functionName: z.string().optional(),
    description: z.string().optional(),
    componentName: z.string().optional(),
  }),
});

export const DiagramConnection = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

export const DiagramSettings = z.object({
  componentName: z.string(),
  useTypeScript: z.boolean().default(true),
  useHooks: z.boolean().default(true),
});

export type DiagramNode = z.infer<typeof DiagramNode>;
export type DiagramConnection = z.infer<typeof DiagramConnection>;
export type DiagramSettings = z.infer<typeof DiagramSettings>;
