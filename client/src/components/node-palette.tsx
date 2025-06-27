import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  Link, 
  ZoomIn, 
  ZoomOut,
  TextCursorInput,
  Settings,
  Monitor,
  Database
} from "lucide-react";

const nodeTypes = [
  {
    type: "input",
    label: "TextCursorInput Node",
    description: "Data entry point",
    color: "bg-green-500",
    icon: TextCursorInput,
  },
  {
    type: "process",
    label: "Process Node", 
    description: "Transform data",
    color: "bg-blue-500",
    icon: Settings,
  },
  {
    type: "output",
    label: "Output Node",
    description: "Display result", 
    color: "bg-orange-500",
    icon: Monitor,
  },
  {
    type: "datastore",
    label: "Data Store",
    description: "Storage layer",
    color: "bg-purple-500", 
    icon: Database,
  },
];

export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Node Types
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-2 px-4">
        {nodeTypes.map((nodeType) => {
          const IconComponent = nodeType.icon;
          
          return (
            <div
              key={nodeType.type}
              className="p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-grab hover:border-blue-500 hover:bg-blue-50 transition-all"
              draggable
              onDragStart={(event) => onDragStart(event, nodeType.type)}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${nodeType.color} rounded-full flex items-center justify-center`}>
                  <IconComponent className="w-2 h-2 text-white" />
                </div>
                <span className="text-sm font-medium">{nodeType.label}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{nodeType.description}</p>
            </div>
          );
        })}

        <Separator className="my-4" />

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Canvas Tools
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" title="Select Tool">
              <MousePointer className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" title="Connect Nodes">
              <Link className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
