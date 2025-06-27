import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeViewerProps {
  code: string;
}

export function CodeViewer({ code }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code copied to clipboard",
        description: "The generated code has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy code",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Generated React Code</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!code}
        >
          {copied ? (
            <Check className="w-4 h-4 mr-1" />
          ) : (
            <Copy className="w-4 h-4 mr-1" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="bg-gray-900 text-gray-100 font-mono text-sm h-full">
          {code ? (
            <pre className="p-4 overflow-auto">
              <code>{code}</code>
            </pre>
          ) : (
            <div className="p-4 text-gray-400 text-center">
              No code generated yet. Create a diagram and click "Generate React Code" to see the output.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
