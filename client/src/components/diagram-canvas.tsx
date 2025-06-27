import { useCallback, useRef } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";

import { InputNode } from "./nodes/input-node";
import { ProcessNode } from "./nodes/process-node";
import { OutputNode } from "./nodes/output-node";
import { DataStoreNode } from "./nodes/datastore-node";

const nodeTypes: NodeTypes = {
  input: InputNode,
  process: ProcessNode,
  output: OutputNode,
  datastore: DataStoreNode,
};

interface DiagramCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeSelect: (node: Node | null) => void;
}

export function DiagramCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
}: DiagramCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (params.source && params.target) {
        const newEdge = {
          id: `e${Date.now()}`,
          source: params.source as string,
          target: params.target as string,
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
        };
        onEdgesChange([{ type: "add", item: newEdge }]);
      }
    },
    [onEdgesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          dataType: "string",
          functionName: "",
          description: "",
          componentName: "",
        },
      };

      onNodesChange([{ type: "add", item: newNode }]);
    },
    [onNodesChange]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div className="flex-1 relative bg-gray-100" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
      >
        <Background color="#d1d5db" gap={20} size={1} />
        <Controls />
        <MiniMap
          className="!bg-white !border-gray-300"
          nodeColor={(node) => {
            switch (node.type) {
              case "input":
                return "#10b981";
              case "process":
                return "#3b82f6";
              case "output":
                return "#f59e0b";
              case "datastore":
                return "#8b5cf6";
              default:
                return "#6b7280";
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
