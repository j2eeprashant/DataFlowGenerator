import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, FolderOpen, Save, Code, Play, Rocket } from "lucide-react";

interface ToolbarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onGenerateCode: () => void;
  onCompileAndRun: () => void;
  onInitProject: () => void;
}

export function Toolbar({
  onNew,
  onOpen,
  onSave,
  onGenerateCode,
  onCompileAndRun,
  onInitProject,
}: ToolbarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">DataFlow Designer</h1>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" onClick={onNew}>
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpen}>
            <FolderOpen className="w-4 h-4 mr-1" />
            Open
          </Button>
          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={onInitProject}>
            <Rocket className="w-4 h-4 mr-1" />
            Init React Project
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button onClick={onGenerateCode} className="bg-blue-600 hover:bg-blue-700">
          <Code className="w-4 h-4 mr-2" />
          Generate React Code
        </Button>
        <Button onClick={onCompileAndRun} className="bg-green-600 hover:bg-green-700">
          <Play className="w-4 h-4 mr-2" />
          Compile & Run
        </Button>
      </div>
    </header>
  );
}
