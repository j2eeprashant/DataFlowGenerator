import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, X, Code, Play, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { socketManager } from "@/lib/socket";

interface ImageUploadProps {
  onCodeGenerated: (code: string, componentName: string) => void;
  onCompileCode: (code: string, componentName: string) => void;
}

export function ImageUpload({ onCodeGenerated, onCompileCode }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [componentName, setComponentName] = useState("");
  const [analysisDescription, setAnalysisDescription] = useState("");

  const { toast } = useToast();

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview("");
    setGeneratedCode("");
    setComponentName("");
    setAnalysisDescription("");
  }, []);

  const handleUploadAndAnalyze = useCallback(async () => {
    if (!selectedImage || !imagePreview) {
      toast({
        title: "No Image Selected",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await apiRequest("POST", "/api/upload-mockup", {
        image: imagePreview,
        description: description || undefined,
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCode(data.code);
        setComponentName(data.componentName);
        setAnalysisDescription(data.description);
        onCodeGenerated(data.code, data.componentName);
        
        toast({
          title: "Code Generated Successfully",
          description: `Created component: ${data.componentName}`,
        });
      } else {
        throw new Error(data.message || "Failed to analyze mockup");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze the mockup",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedImage, imagePreview, description, onCodeGenerated, toast]);

  const handleCompileAndRun = useCallback(() => {
    if (!generatedCode || !componentName) {
      toast({
        title: "No Code to Compile",
        description: "Please generate code first",
        variant: "destructive",
      });
      return;
    }

    onCompileCode(generatedCode, componentName);
  }, [generatedCode, componentName, onCompileCode, toast]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Upload Mockup</h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload a UI mockup image to generate React code automatically
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Select Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drop your mockup image here or click to browse</p>
                  <p className="text-xs text-gray-500 mb-4">Supports JPEG, PNG (max 10MB)</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Select Image</span>
                    </Button>
                  </Label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Mockup preview"
                    className="w-full h-48 object-contain bg-gray-50 rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="mt-2 text-sm text-gray-600">
                    {selectedImage.name} ({Math.round(selectedImage.size / 1024)}KB)
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Description (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the UI elements, functionality, or any specific requirements..."
                rows={3}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleUploadAndAnalyze}
              disabled={!selectedImage || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Code className="w-4 h-4 mr-2" />
              )}
              {isUploading ? "Analyzing..." : "Generate Code"}
            </Button>
            
            {generatedCode && (
              <Button
                onClick={handleCompileAndRun}
                variant="outline"
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Compile & Run
              </Button>
            )}
          </div>

          {/* Analysis Results */}
          {generatedCode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-700">
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Component Name</Label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{componentName}</p>
                </div>
                {analysisDescription && (
                  <div>
                    <Label className="text-xs font-medium text-gray-600">Description</Label>
                    <p className="text-sm text-gray-700 mt-1">{analysisDescription}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs font-medium text-gray-600">Generated Code</Label>
                  <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {generatedCode.split('\n').length} lines of TypeScript React code generated
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}