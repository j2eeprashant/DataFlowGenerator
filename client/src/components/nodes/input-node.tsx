import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { TextCursorInput } from "lucide-react";

export const InputNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className={`px-3 py-2 bg-white border-2 border-green-500 rounded-lg shadow-lg min-w-[140px] ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <div className="flex items-center space-x-2 mb-1">
        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
          <TextCursorInput className="w-2 h-2 text-white" />
        </div>
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <div className="text-xs text-gray-500">{data.dataType || "string"}</div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white"
      />
    </div>
  );
});

InputNode.displayName = "InputNode";
