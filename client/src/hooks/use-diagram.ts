import { useState, useCallback, useEffect } from "react";
import { Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange } from "reactflow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { socketManager } from "@/lib/socket";
import { generateReactCode } from "@/lib/code-generator";
import { DiagramSettings, Diagram } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const initialSettings: DiagramSettings = {
  componentName: "GeneratedComponent",
  useTypeScript: true,
  useHooks: true,
};

export function useDiagram() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [diagramSettings, setDiagramSettings] = useState<DiagramSettings>(initialSettings);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [currentDiagramId, setCurrentDiagramId] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Socket connection
  useEffect(() => {
    const socket = socketManager.connect();

    socket.on("code-generated", (data) => {
      if (data.success) {
        setGeneratedCode(data.code);
        toast({
          title: "Code Generated",
          description: "React code has been generated successfully.",
        });
      } else {
        toast({
          title: "Code Generation Failed",
          description: data.error,
          variant: "destructive",
        });
      }
    });

    socket.on("compilation-result", (result) => {
      setConsoleOutput(result.logs);
      if (result.success) {
        toast({
          title: "Compilation Successful",
          description: "Your code has been compiled and is ready to run.",
        });
      } else {
        toast({
          title: "Compilation Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    });

    return () => {
      socketManager.disconnect();
    };
  }, [toast]);

  // Save diagram mutation
  const saveMutation = useMutation({
    mutationFn: async (diagram: { name: string; nodes: Node[]; edges: Edge[]; settings: DiagramSettings }) => {
      if (currentDiagramId) {
        return apiRequest("PUT", `/api/diagrams/${currentDiagramId}`, {
          nodes: diagram.nodes,
          connections: diagram.edges,
          settings: diagram.settings,
        });
      } else {
        return apiRequest("POST", "/api/diagrams", {
          name: diagram.name,
          nodes: diagram.nodes,
          connections: diagram.edges,
          settings: diagram.settings,
        });
      }
    },
    onSuccess: (response) => {
      response.json().then((data) => {
        if (!currentDiagramId) {
          setCurrentDiagramId(data.id);
        }
        queryClient.invalidateQueries({ queryKey: ["/api/diagrams"] });
        toast({
          title: "Diagram Saved",
          description: "Your diagram has been saved successfully.",
        });
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save the diagram. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Node and edge change handlers
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Node selection handler
  const onNodeSelect = useCallback((node: Node | null) => {
    setSelectedNode(node);
  }, []);

  // Node update handler
  const onNodeUpdate = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      )
    );
    
    // Update selected node if it's the one being updated
    setSelectedNode((current) =>
      current?.id === nodeId ? { ...current, data } : current
    );
  }, []);

  // Settings update handler
  const onSettingsUpdate = useCallback((settings: Partial<DiagramSettings>) => {
    setDiagramSettings((current) => ({ ...current, ...settings }));
  }, []);

  // Code generation
  const generateCode = useCallback(async () => {
    if (nodes.length === 0) {
      toast({
        title: "No Nodes",
        description: "Please add some nodes to your diagram before generating code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const code = generateReactCode(nodes, edges, diagramSettings);
      setGeneratedCode(code);
      
      // Also send to socket for potential server-side processing
      const socket = socketManager.getSocket();
      socket.emit("generate-code", {
        nodes,
        connections: edges,
        settings: diagramSettings,
      });
    } catch (error) {
      toast({
        title: "Code Generation Failed",
        description: "Failed to generate React code from the diagram.",
        variant: "destructive",
      });
    }
  }, [nodes, edges, diagramSettings, toast]);

  // Code compilation
  const compileAndRun = useCallback(async () => {
    if (!generatedCode) {
      toast({
        title: "No Code",
        description: "Please generate code first before compiling.",
        variant: "destructive",
      });
      return;
    }

    const socket = socketManager.getSocket();
    socket.emit("compile-code", {
      code: generatedCode,
      componentName: diagramSettings.componentName,
    });
  }, [generatedCode, diagramSettings.componentName, toast]);

  // Save diagram
  const saveDiagram = useCallback(() => {
    saveMutation.mutate({
      name: diagramSettings.componentName,
      nodes,
      edges,
      settings: diagramSettings,
    });
  }, [saveMutation, nodes, edges, diagramSettings]);

  // Load diagram (placeholder)
  const loadDiagram = useCallback(() => {
    // TODO: Implement load diagram functionality
    toast({
      title: "Load Diagram",
      description: "Load diagram functionality will be implemented.",
    });
  }, [toast]);

  // New diagram
  const newDiagram = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setDiagramSettings(initialSettings);
    setGeneratedCode("");
    setConsoleOutput([]);
    setCurrentDiagramId(null);
    toast({
      title: "New Diagram",
      description: "Started a new diagram.",
    });
  }, [toast]);

  return {
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
  };
}
