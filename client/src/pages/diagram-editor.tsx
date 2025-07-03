import { useState, useCallback } from "react";
import { Toolbar } from "@/components/toolbar";
import { NodePalette } from "@/components/node-palette";
import { DiagramCanvas } from "@/components/diagram-canvas";
import { PropertiesPanel } from "@/components/properties-panel";
import { CodeViewer } from "@/components/code-viewer";
import { ConsoleOutput } from "@/components/console-output";
import { useDiagram } from "@/hooks/use-diagram";
import { socketManager } from "@/lib/socket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/image-upload";
import { PageNavigation } from "@/components/page-navigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function DiagramEditor() {
  const {
    nodes,
    edges,
    selectedNode,
    diagramSettings,
    generatedCode,
    consoleOutput,
    onNodesChange,
    onEdgesChange,
    onNodeSelect,
    onNodeUpdate,
    onSettingsUpdate,
    generateCode,
    compileAndRun,
    saveDiagram,
    loadDiagram,
    newDiagram,
    setGeneratedCode,
  } = useDiagram();

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"properties" | "code" | "console" | "image">("properties");

  const handleGenerateCode = useCallback(async () => {
    await generateCode();
    setActiveTab("code");
  }, [generateCode]);

  const handleCompileAndRun = useCallback(async () => {
    await compileAndRun();
    setActiveTab("console");
  }, [compileAndRun]);

  const handleImageCodeGenerated = useCallback((code: string, componentName: string) => {
    // Update the diagram with the generated code
    setGeneratedCode(code);
    setActiveTab("code");
  }, []);

  const handleImageCompileCode = useCallback((code: string, componentName: string) => {
    // Use the socket to compile the image-generated code
    const socket = socketManager.getSocket();
    socket.emit("compile-code", {
      code,
      componentName,
    });
    setActiveTab("console");
  }, []);

  const handleInitProject = useCallback(async () => {
    try {
      const response = await apiRequest("POST", "/api/init-project", {});
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Project Initialized",
          description: data.message || "React project has been successfully created",
        });
        setActiveTab("console");
      } else {
        throw new Error(data.error || "Failed to initialize project");
      }
    } catch (error) {
      toast({
        title: "Initialization Failed",
        description: error instanceof Error ? error.message : "Failed to initialize React project",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Toolbar */}
      <Toolbar
        onNew={newDiagram}
        onOpen={loadDiagram}
        onSave={saveDiagram}
        onGenerateCode={handleGenerateCode}
        onCompileAndRun={handleCompileAndRun}
        onInitProject={handleInitProject}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Node Palette */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <PageNavigation />
          <NodePalette />
        </div>

        {/* Center: Canvas Area */}
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeSelect={onNodeSelect}
        />

        {/* Right Panel: Properties & Code */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="image">Upload</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="flex-1 m-0 h-0">
              <PropertiesPanel
                selectedNode={selectedNode}
                diagramSettings={diagramSettings}
                onNodeUpdate={onNodeUpdate}
                onSettingsUpdate={onSettingsUpdate}
              />
            </TabsContent>

            <TabsContent value="image" className="flex-1 m-0 h-0">
              <ImageUpload
                onCodeGenerated={handleImageCodeGenerated}
                onCompileCode={handleImageCompileCode}
              />
            </TabsContent>

            <TabsContent value="code" className="flex-1 m-0 h-0">
              <CodeViewer code={generatedCode} />
            </TabsContent>

            <TabsContent value="console" className="flex-1 m-0 h-0">
              <ConsoleOutput logs={consoleOutput} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}