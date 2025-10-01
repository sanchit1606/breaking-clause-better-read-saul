import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, FileText, AlertCircle, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { uploadDocument } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentUploadProps {
  onDocumentUploaded: (documentId: string) => void;
  onProcessDocument?: () => void;
  isProcessingDocument?: boolean;
  selectedGenre?: string;
}

export function DocumentUpload({ onDocumentUploaded, onProcessDocument, isProcessingDocument, selectedGenre }: DocumentUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReadyToProcess, setIsReadyToProcess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
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
      setDocumentId(response.documentId);
      
      toast({
        title: "Upload successful",
        description: "Your document has been uploaded. Click 'Start Processing' to begin analysis.",
      });

      // Stop here and show start processing button
      setIsUploading(false);
      setIsReadyToProcess(true);

    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  }, [onDocumentUploaded, toast]);

  const startProcessing = () => {
    if (!documentId) return;
    
    setIsReadyToProcess(false);
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate processing with progress updates
    const processingInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(processingInterval);
          setIsProcessing(false);
          onDocumentUploaded(documentId);
          return prev;
        }
        return Math.min(prev + 2, 100);
      });
    }, 500);
  };

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
    <Card data-testid="document-upload-card" className="overflow-hidden aspect-square">
      <CardContent className="pt-6 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Upload Your Document
          </h2>
        </motion.div>
        
        {/* Upload Zone */}
        <motion.div 
          {...getRootProps()}
          className={`
            border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/30 hover:bg-muted/50 
            transition-all duration-300 cursor-pointer group relative overflow-hidden flex-1 flex flex-col justify-center
            ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : ''}
            ${isUploading || isProcessing ? 'pointer-events-none opacity-50' : ''}
          `}
          data-testid="upload-dropzone"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input {...getInputProps()} data-testid="file-input" />
          
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col items-center space-y-3 relative z-10">
            <motion.div 
              className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </motion.div>
                ) : isProcessing ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <CloudUpload className="h-6 w-6 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <div>
              <motion.p 
                className="text-base font-medium text-foreground"
                animate={{ 
                  color: isDragActive ? "hsl(var(--primary))" : "hsl(var(--foreground))" 
                }}
              >
                {isUploading ? "Uploading..." : isProcessing ? "Processing..." : "Drop your document here"}
              </motion.p>
              <p className="text-sm text-muted-foreground">
                {isUploading || isProcessing ? "Please wait..." : "or click to browse files"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX • Max 10MB</p>
            </div>
            
            {isReadyToProcess ? (
              <Button 
                onClick={startProcessing}
                className="relative overflow-hidden bg-green-600 hover:bg-green-700"
              >
                <span className="relative z-10">Start Processing</span>
              </Button>
            ) : (
              <Button 
                type="button" 
                disabled={isUploading || isProcessing}
                data-testid="button-choose-file"
                className="relative overflow-hidden"
              >
                <AnimatePresence>
                  {isUploading && (
                    <motion.div
                      className="absolute inset-0 bg-primary/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">
                  {isUploading ? "Uploading..." : isProcessing ? "Processing..." : "Choose File"}
                </span>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <AnimatePresence>
          {(isUploading || isProcessing) && uploadedFile && (
            <motion.div 
              className="mt-4" 
              data-testid="upload-progress"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span data-testid="text-filename">
                    {isUploading ? "Uploading" : "Processing"} {uploadedFile.name}...
                  </span>
                </div>
                <span data-testid="text-progress" className="font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={uploadProgress} 
                  className="w-full h-2"
                  data-testid="progress-bar"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {/* Processing steps */}
              {isProcessing && (
                <motion.div 
                  className="mt-3 text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>AI is analyzing your document...</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Complete */}
        <AnimatePresence>
          {uploadedFile && !isUploading && !isProcessing && uploadProgress === 100 && (
            <motion.div 
              className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg" 
              data-testid="upload-complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className="flex items-center space-x-3 text-green-700 mb-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="h-5 w-5" />
                </motion.div>
                <div>
                  <span className="text-sm font-medium" data-testid="text-uploaded-filename">
                    {uploadedFile.name} uploaded successfully!
                  </span>
                  <p className="text-xs text-green-600 mt-1">
                    Your document is ready for processing
                  </p>
                </div>
              </div>
              
              {/* Process Document Button */}
              {onProcessDocument && (
                <Button
                  onClick={onProcessDocument}
                  disabled={!selectedGenre || isProcessingDocument}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingDocument ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing Document...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Process Document
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
