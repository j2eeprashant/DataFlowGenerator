import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  FileCode, 
  RefreshCw,
  ExternalLink,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileSystemItem[];
  expanded?: boolean;
}

interface ProjectInfo {
  name: string;
  path: string;
  type: string;
  lastModified: string;
}

export function ProjectExplorer() {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", "/api/projects", {});
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectFiles = async (project: ProjectInfo) => {
    try {
      const response = await apiRequest("GET", `/api/projects/${encodeURIComponent(project.name)}/files`, {});
      const data = await response.json();
      
      if (data.success) {
        setFileTree(data.files || []);
        setSelectedProject(project);
      }
    } catch (error) {
      console.error("Failed to load project files:", error);
      toast({
        title: "Error",
        description: "Failed to load project files",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (project: ProjectInfo) => {
    if (!confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      return;
    }

    try {
      const response = await apiRequest("DELETE", `/api/projects/${encodeURIComponent(project.name)}`, {});
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Project Deleted",
          description: `Project "${project.name}" has been deleted`,
        });
        loadProjects();
        if (selectedProject?.name === project.name) {
          setSelectedProject(null);
          setFileTree([]);
        }
      } else {
        throw new Error(data.error || "Failed to delete project");
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const openProject = (project: ProjectInfo) => {
    window.open(`/project/${encodeURIComponent(project.name)}`, '_blank');
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'directory') {
      return <Folder className="w-4 h-4 text-blue-500" />;
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode className="w-4 h-4 text-yellow-500" />;
      case 'json':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'md':
        return <FileText className="w-4 h-4 text-blue-400" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderFileTree = (items: FileSystemItem[], depth = 0) => {
    return items.map((item, index) => (
      <div key={`${item.path}-${index}`} style={{ paddingLeft: `${depth * 16}px` }}>
        <div className="flex items-center py-1 px-2 hover:bg-gray-100 rounded text-sm">
          {getFileIcon(item.name, item.type)}
          <span className="ml-2 truncate">{item.name}</span>
        </div>
        {item.children && item.expanded && renderFileTree(item.children, depth + 1)}
      </div>
    ));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Project Explorer</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadProjects}
          disabled={isLoading}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Projects List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Generated Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No projects found. Click "Init React Project" to create one.
                </div>
              ) : (
                projects.map((project, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProject?.name === project.name
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1" 
                        onClick={() => loadProjectFiles(project)}
                      >
                        <div className="flex items-center">
                          <FolderOpen className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="font-medium text-sm">{project.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {project.type} • Modified: {new Date(project.lastModified).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProject(project);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project);
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* File Tree */}
          {selectedProject && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  Files - {selectedProject.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fileTree.length === 0 ? (
                  <div className="text-sm text-gray-500">No files found</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {renderFileTree(fileTree)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}