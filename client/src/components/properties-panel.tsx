import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Node } from "reactflow";
import { DiagramSettings } from "@shared/schema";

interface PropertiesPanelProps {
  selectedNode: Node | null;
  diagramSettings: DiagramSettings;
  onNodeUpdate: (nodeId: string, data: any) => void;
  onSettingsUpdate: (settings: Partial<DiagramSettings>) => void;
}

export function PropertiesPanel({
  selectedNode,
  diagramSettings,
  onNodeUpdate,
  onSettingsUpdate,
}: PropertiesPanelProps) {
  const handleNodeDataChange = (field: string, value: string) => {
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, {
        ...selectedNode.data,
        [field]: value,
      });
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case "input": return "bg-green-500";
      case "process": return "bg-blue-500";
      case "output": return "bg-orange-500";
      case "datastore": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {selectedNode ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Selected Node
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-3 h-3 ${getNodeTypeColor(selectedNode.type)} rounded-full`} />
                <span className="text-sm font-medium capitalize">{selectedNode.type} Node</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="label" className="text-xs font-medium">Label</Label>
                  <Input
                    id="label"
                    value={selectedNode.data.label || ""}
                    onChange={(e) => handleNodeDataChange("label", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                {selectedNode.type === "process" && (
                  <div>
                    <Label htmlFor="functionName" className="text-xs font-medium">Function Name</Label>
                    <Input
                      id="functionName"
                      value={selectedNode.data.functionName || ""}
                      onChange={(e) => handleNodeDataChange("functionName", e.target.value)}
                      className="mt-1"
                      placeholder="processData"
                    />
                  </div>
                )}

                {selectedNode.type === "output" && (
                  <div>
                    <Label htmlFor="componentName" className="text-xs font-medium">Component Name</Label>
                    <Input
                      id="componentName"
                      value={selectedNode.data.componentName || ""}
                      onChange={(e) => handleNodeDataChange("componentName", e.target.value)}
                      className="mt-1"
                      placeholder="ResultComponent"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="dataType" className="text-xs font-medium">Data Type</Label>
                  <Select
                    value={selectedNode.data.dataType || "string"}
                    onValueChange={(value) => handleNodeDataChange("dataType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="number">number</SelectItem>
                      <SelectItem value="boolean">boolean</SelectItem>
                      <SelectItem value="object">object</SelectItem>
                      <SelectItem value="array">array</SelectItem>
                      <SelectItem value="email">email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-xs font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedNode.data.description || ""}
                    onChange={(e) => handleNodeDataChange("description", e.target.value)}
                    className="mt-1"
                    rows={3}
                    placeholder="Describe this node's functionality..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-gray-500 text-sm py-8">
            Select a node to edit its properties
          </div>
        )}

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-700">
              Diagram Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="componentName" className="text-xs font-medium">Component Name</Label>
              <Input
                id="componentName"
                value={diagramSettings.componentName}
                onChange={(e) => onSettingsUpdate({ componentName: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="typescript"
                checked={diagramSettings.useTypeScript}
                onCheckedChange={(checked) => onSettingsUpdate({ useTypeScript: !!checked })}
              />
              <Label htmlFor="typescript" className="text-sm">Generate TypeScript</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hooks"
                checked={diagramSettings.useHooks}
                onCheckedChange={(checked) => onSettingsUpdate({ useHooks: !!checked })}
              />
              <Label htmlFor="hooks" className="text-sm">Use React Hooks</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
