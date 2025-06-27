import { transform } from "@babel/core";
import * as fs from "fs/promises";
import * as path from "path";

export interface CompilationResult {
  success: boolean;
  output?: string;
  error?: string;
  logs: string[];
}

export async function compileCode(code: string, componentName: string): Promise<CompilationResult> {
  const logs: string[] = [];
  
  try {
    logs.push(`[${new Date().toLocaleTimeString()}] Starting compilation for ${componentName}...`);

    // Transform TypeScript/JSX to JavaScript
    const result = transform(code, {
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ],
      filename: `${componentName}.tsx`,
    });

    if (!result || !result.code) {
      throw new Error("Babel compilation failed - no output generated");
    }

    logs.push(`[${new Date().toLocaleTimeString()}] TypeScript compilation successful`);
    logs.push(`[${new Date().toLocaleTimeString()}] Component ${componentName} generated successfully`);

    // Create a temporary file for the compiled code
    const tempDir = path.join(process.cwd(), "temp");
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    const tempFilePath = path.join(tempDir, `${componentName}.js`);
    await fs.writeFile(tempFilePath, result.code);

    logs.push(`[${new Date().toLocaleTimeString()}] Code written to temporary file: ${tempFilePath}`);
    
    // In a real scenario, you might want to start a development server
    // For now, we'll just indicate successful compilation
    logs.push(`[${new Date().toLocaleTimeString()}] ✓ Component ready for testing`);

    return {
      success: true,
      output: result.code,
      logs
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown compilation error";
    logs.push(`[${new Date().toLocaleTimeString()}] ❌ Compilation failed: ${errorMessage}`);
    
    return {
      success: false,
      error: errorMessage,
      logs
    };
  }
}
