
import fs from "fs/promises";
import path from "path";

export async function createReactPage(componentName: string, componentCode: string, route: string) {
  try {
    // Clean component name for file naming
    const cleanComponentName = componentName.replace(/[^a-zA-Z0-9]/g, '');
    
    // Create the page component file
    const pageContent = `import React from 'react';

${componentCode}

export default function ${cleanComponentName}Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generated Page</h1>
            <p className="text-gray-600 mt-2">This page was generated from your uploaded mockup</p>
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Editor
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <${cleanComponentName} />
        </div>
      </div>
    </div>
  );
}`;

    const pagePath = path.join(process.cwd(), "client", "src", "pages", `${cleanComponentName.toLowerCase()}.tsx`);
    await fs.writeFile(pagePath, pageContent);

    // Update the router to include the new route
    await updateRouter(cleanComponentName, route);

    console.log(`Created page: ${pagePath} with route: ${route}`);
    return { success: true, route, pagePath };
  } catch (error) {
    console.error("Error creating page:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function updateRouter(componentName: string, route: string) {
  const appPath = path.join(process.cwd(), "client", "src", "App.tsx");
  
  try {
    const appContent = await fs.readFile(appPath, "utf-8");
    
    // Add import for the new component
    const importLine = `import ${componentName}Page from "@/pages/${componentName.toLowerCase()}";`;
    
    // Add route to the router
    const routeLine = `      <Route path="${route}" component={${componentName}Page} />`;
    
    // Insert import after existing imports
    const updatedContent = appContent
      .replace(
        'import NotFound from "@/pages/not-found";',
        `import NotFound from "@/pages/not-found";\n${importLine}`
      )
      .replace(
        '      <Route component={NotFound} />',
        `${routeLine}\n      <Route component={NotFound} />`
      );
    
    await fs.writeFile(appPath, updatedContent);
  } catch (error) {
    console.error("Error updating router:", error);
  }
}
