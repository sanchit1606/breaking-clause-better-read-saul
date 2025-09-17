import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, FileText, AlertCircle } from "lucide-react";
import { uploadDocument } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onDocumentUploaded: (documentId: string) => void;
}

export function DocumentUpload({ onDocumentUploaded }: DocumentUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await uploadDocument(file);
      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "Your document has been uploaded and is being processed.",
      });

      onDocumentUploaded(response.documentId);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  }, [onDocumentUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <Card data-testid="document-upload-card">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Upload Your Document</h2>
        
        {/* Upload Zone */}
        <div 
          {...getRootProps()}
          className={`
            border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 
            transition-all duration-300 cursor-pointer group
            ${isDragActive ? 'drag-active' : ''}
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
          data-testid="upload-dropzone"
        >
          <input {...getInputProps()} data-testid="file-input" />
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <CloudUpload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">Drop your document here</p>
              <p className="text-sm text-muted-foreground">or click to browse files</p>
              <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX • Max 10MB</p>
            </div>
            <Button 
              type="button" 
              disabled={isUploading}
              data-testid="button-choose-file"
            >
              Choose File
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {isUploading && uploadedFile && (
          <div className="mt-4" data-testid="upload-progress">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span data-testid="text-filename">Uploading {uploadedFile.name}...</span>
              </div>
              <span data-testid="text-progress">{uploadProgress}%</span>
            </div>
            <Progress 
              value={uploadProgress} 
              className="w-full progress-glow"
              data-testid="progress-bar"
            />
          </div>
        )}

        {/* Upload Complete */}
        {uploadedFile && !isUploading && uploadProgress === 100 && (
          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg" data-testid="upload-complete">
            <div className="flex items-center space-x-2 text-accent">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium" data-testid="text-uploaded-filename">
                {uploadedFile.name} uploaded successfully
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
