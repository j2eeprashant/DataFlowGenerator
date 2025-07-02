
import fs from "fs/promises";
import path from "path";

export async function createReactPage(componentName: string, componentCode: string, route: string) {
  try {
    // Create the page component file
    const pageContent = `import React from 'react';

${componentCode}

export default function ${componentName}Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Generated Page</h1>
          <p className="text-gray-600 mt-2">This page was generated from your uploaded mockup</p>
        </div>
        <${componentName} onSubmit={(data) => console.log('Form submitted:', data)} />
      </div>
    </div>
  );
}`;

    const pagePath = path.join(process.cwd(), "client", "src", "pages", `${componentName.toLowerCase()}.tsx`);
    await fs.writeFile(pagePath, pageContent);

    // Update the router to include the new route
    await updateRouter(componentName, route);

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
