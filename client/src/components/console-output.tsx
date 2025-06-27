import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConsoleOutputProps {
  logs: string[];
  onClear?: () => void;
}

export function ConsoleOutput({ logs, onClear }: ConsoleOutputProps) {
  const getLogColor = (log: string) => {
    if (log.includes("❌") || log.includes("error") || log.includes("failed")) {
      return "text-red-400";
    }
    if (log.includes("✓") || log.includes("successful") || log.includes("ready")) {
      return "text-green-400";
    }
    if (log.includes("Warning") || log.includes("warning")) {
      return "text-yellow-400";
    }
    if (log.includes("Starting") || log.includes("compilation")) {
      return "text-blue-400";
    }
    return "text-gray-300";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Compilation Output</span>
        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={logs.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="bg-gray-900 text-gray-100 font-mono text-xs h-full">
          <div className="p-4 space-y-1">
            {logs.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No compilation output yet. Click "Compile & Run" to see results.
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={getLogColor(log)}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
