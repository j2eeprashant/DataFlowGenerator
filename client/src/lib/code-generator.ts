import { Node, Edge } from "reactflow";
import { DiagramSettings } from "@shared/schema";

export function generateReactCode(
  nodes: Node[],
  edges: Edge[],
  settings: DiagramSettings
): string {
  const { componentName, useTypeScript, useHooks } = settings;
  
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
    const stateName = node.data.functionName || node.data.label?.toLowerCase().replace(/\s+/g, "") || "input";
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
      
      // Add validation based on data type
      if (node.data.dataType === "email") {
        code += `    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n`;
        code += `    if (!emailRegex.test(input)) {\n`;
        code += `      throw new Error('Invalid email format');\n`;
        code += `    }\n`;
        code += `    return input.toLowerCase().trim();\n`;
      } else {
        code += `    return input.trim();\n`;
      }
      
      code += `  }, []);\n`;
    }
  });

  // Generate JSX
  code += `\n  return (\n`;
  code += `    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">\n`;
  
  inputNodes.forEach(node => {
    const stateName = node.data.functionName || node.data.label?.toLowerCase().replace(/\s+/g, "") || "input";
    code += `      <div className="mb-4">\n`;
    code += `        <label className="block text-sm font-medium text-gray-700 mb-2">\n`;
    code += `          ${node.data.label || "Input"}\n`;
    code += `        </label>\n`;
    code += `        <input\n`;
    code += `          type="${node.data.dataType === "email" ? "email" : node.data.dataType === "number" ? "number" : "text"}"\n`;
    if (useHooks) {
      code += `          value={${stateName}}\n`;
      code += `          onChange={(e) => set${stateName.charAt(0).toUpperCase() + stateName.slice(1)}(e.target.value)}\n`;
    }
    code += `          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"\n`;
    code += `          placeholder="Enter ${node.data.label?.toLowerCase() || "input"}"\n`;
    code += `        />\n`;
    code += `      </div>\n`;
  });

  if (processNodes.length > 0) {
    code += `      <button\n`;
    code += `        onClick={() => {\n`;
    code += `          try {\n`;
    processNodes.forEach(node => {
      const functionName = node.data.functionName || "processData";
      const inputStateName = inputNodes[0]?.data.functionName || inputNodes[0]?.data.label?.toLowerCase().replace(/\s+/g, "") || "input";
      code += `            const result = ${functionName}(${inputStateName});\n`;
      code += `            console.log('Processed result:', result);\n`;
    });
    if (useTypeScript) {
      code += `            onSubmit?.(result);\n`;
    }
    code += `          } catch (error) {\n`;
    code += `            console.error('Processing failed:', error);\n`;
    code += `          }\n`;
    code += `        }}\n`;
    code += `        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"\n`;
    code += `      >\n`;
    code += `        Process Data\n`;
    code += `      </button>\n`;
  }

  // Add output display if there are output nodes
  const outputNodes = nodes.filter(node => node.type === "output");
  if (outputNodes.length > 0) {
    code += `      \n`;
    code += `      {/* Output section would go here */}\n`;
    outputNodes.forEach(node => {
      code += `      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">\n`;
      code += `        <h3 className="text-sm font-medium text-gray-800">${node.data.label || "Output"}:</h3>\n`;
      code += `        <p className="text-sm text-gray-600">Results will be displayed here</p>\n`;
      code += `      </div>\n`;
    });
  }

  code += `    </div>\n`;
  code += `  );\n`;
  code += `};\n\n`;
  code += `export default ${componentName};`;

  return code;
}
