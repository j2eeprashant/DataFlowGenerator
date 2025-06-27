import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Monitor } from "lucide-react";

export const OutputNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`px-3 py-2 bg-white border-2 border-orange-500 rounded-lg shadow-lg min-w-[140px] ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <div className="flex items-center space-x-2 mb-1">
        <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
          <Monitor className="w-2 h-2 text-white" />
        </div>
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <div className="text-xs text-gray-500">{data.componentName || "ResultComponent"}</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white"
      />
    </div>
  );
});

OutputNode.displayName = "OutputNode";
