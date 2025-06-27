import { Server as SocketIOServer, Socket } from "socket.io";
import { compileCode } from "./code-compiler";

export function setupSocketHandler(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    // Handle real-time code generation requests
    socket.on("generate-code", async (data) => {
      try {
        const { nodes, connections, settings } = data;
        // Code generation logic would go here
        // For now, emit a simple response
        socket.emit("code-generated", {
          success: true,
          code: generateReactCode(nodes, connections, settings)
        });
      } catch (error) {
        socket.emit("code-generated", {
          success: false,
          error: error instanceof Error ? error.message : "Code generation failed"
        });
      }
    });

    // Handle compilation requests
    socket.on("compile-code", async (data) => {
      try {
        const { code, componentName } = data;
        const result = await compileCode(code, componentName);
        socket.emit("compilation-result", result);
      } catch (error) {
        socket.emit("compilation-result", {
          success: false,
          error: error instanceof Error ? error.message : "Compilation failed",
          logs: [`[${new Date().toLocaleTimeString()}] ❌ ${error instanceof Error ? error.message : "Unknown error"}`]
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

function generateReactCode(nodes: any[], connections: any[], settings: any): string {
  const { componentName, useTypeScript, useHooks } = settings;
  const fileExtension = useTypeScript ? "tsx" : "jsx";
  
  let code = `import React${useHooks ? ", { useState, useCallback }" : ""} from 'react';\n\n`;
  
  if (useTypeScript) {
    code += `interface ${componentName}Props {\n`;
    code += `  onSubmit?: (data: any) => void;\n`;
    code += `}\n\n`;
  }

  code += `const ${componentName}${useTypeScript ? `: React.FC<${componentName}Props>` : ""} = (${useTypeScript ? "{ onSubmit }" : "props"}) => {\n`;

  // Generate state for each input node
  const inputNodes = nodes.filter(node => node.type === "input");
  inputNodes.forEach(node => {
    const stateName = node.data.functionName || node.label.toLowerCase().replace(/\s+/g, "");
    if (useHooks) {
      code += `  const [${stateName}, set${stateName.charAt(0).toUpperCase() + stateName.slice(1)}] = useState${useTypeScript ? "<string>" : ""}("");\n`;
    }
  });

  // Generate functions for process nodes
  const processNodes = nodes.filter(node => node.type === "process");
  processNodes.forEach(node => {
    const functionName = node.data.functionName || "processData";
    if (useHooks) {
      code += `\n  const ${functionName} = useCallback((input${useTypeScript ? ": string" : ""}) => {\n`;
      code += `    // ${node.data.description || "Process the input data"}\n`;
      code += `    return input.trim().toLowerCase();\n`;
      code += `  }, []);\n`;
    }
  });

  // Generate JSX
  code += `\n  return (\n`;
  code += `    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">\n`;
  
  inputNodes.forEach(node => {
    const stateName = node.data.functionName || node.label.toLowerCase().replace(/\s+/g, "");
    code += `      <div className="mb-4">\n`;
    code += `        <label className="block text-sm font-medium text-gray-700 mb-2">\n`;
    code += `          ${node.label}\n`;
    code += `        </label>\n`;
    code += `        <input\n`;
    code += `          type="${node.data.dataType === "email" ? "email" : "text"}"\n`;
    if (useHooks) {
      code += `          value={${stateName}}\n`;
      code += `          onChange={(e) => set${stateName.charAt(0).toUpperCase() + stateName.slice(1)}(e.target.value)}\n`;
    }
    code += `          className="w-full px-3 py-2 border border-gray-300 rounded-md"\n`;
    code += `          placeholder="Enter ${node.label.toLowerCase()}"\n`;
    code += `        />\n`;
    code += `      </div>\n`;
  });

  if (processNodes.length > 0) {
    code += `      <button\n`;
    code += `        onClick={() => {\n`;
    processNodes.forEach(node => {
      const functionName = node.data.functionName || "processData";
      code += `          ${functionName}(${inputNodes[0]?.data.functionName || "input"});\n`;
    });
    code += `        }}\n`;
    code += `        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"\n`;
    code += `      >\n`;
    code += `        Process Data\n`;
    code += `      </button>\n`;
  }

  code += `    </div>\n`;
  code += `  );\n`;
  code += `};\n\n`;
  code += `export default ${componentName};`;

  return code;
}
