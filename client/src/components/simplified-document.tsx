import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Volume2, FileText, Sparkles, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { simplifyDocument, generateTTS } from "@/lib/api";
import { SimplifiedClause } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface SimplifiedDocumentProps {
  documentId: string;
  selectedLanguage: string;
}

const clauseColors = {
  payment: "bg-blue-50 border-l-blue-400 hover:bg-blue-100/50",
  financial: "bg-amber-50 border-l-amber-400 hover:bg-amber-100/50", 
  critical: "bg-red-50 border-l-red-400 hover:bg-red-100/50",
  security: "bg-green-50 border-l-green-400 hover:bg-green-100/50",
  general: "bg-gray-50 border-l-gray-400 hover:bg-gray-100/50"
};

const categoryBadges = {
  payment: "bg-blue-100 text-blue-800 border-blue-200",
  financial: "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  security: "bg-green-100 text-green-800 border-green-200",
  general: "bg-gray-100 text-gray-800 border-gray-200"
};

const importanceIcons = {
  low: Clock,
  medium: FileText,
  high: AlertTriangle,
  critical: AlertTriangle
};

const importanceColors = {
  low: "text-gray-500",
  medium: "text-blue-500", 
  high: "text-amber-500",
  critical: "text-red-500"
};

export function SimplifiedDocument({ documentId, selectedLanguage }: SimplifiedDocumentProps) {
  const { toast } = useToast();

  const { data: documentData, isLoading, error } = useQuery({
    queryKey: ["/api/documents", documentId, "simplified"],
    enabled: !!documentId,
  });

  const handlePlayAudio = async (text: string) => {
    try {
      const response = await generateTTS(text, selectedLanguage);
      const audio = new Audio(response.audioUrl);
      await audio.play();
    } catch (error) {
      toast({
        title: "Audio playback failed",
        description: "Unable to generate or play audio for this text.",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    if (!documentData?.clauses) return;
    
    const content = documentData.clauses
      .map((clause: SimplifiedClause) => `${clause.title}\n\n${clause.simplified}\n\n`)
      .join('---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simplified-document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card data-testid="simplified-document-loading" className="h-fit overflow-hidden">
        <CardContent className="p-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="p-4 bg-muted/30 rounded-lg border"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="text-center text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 animate-pulse" />
                <span>AI is analyzing your document...</span>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="simplified-document-error" className="h-fit overflow-hidden">
        <CardContent className="p-6">
          <motion.div 
            className="text-center text-destructive"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive/60" />
            <p className="text-lg font-medium">Failed to load simplified document</p>
            <p className="text-sm text-muted-foreground mt-2">Please try uploading the document again</p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (!documentData?.clauses) {
    return (
      <Card data-testid="simplified-document-empty" className="h-fit overflow-hidden">
        <CardContent className="p-6">
          <motion.div 
            className="text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Clock className="h-8 w-8 mx-auto text-primary" />
            </motion.div>
            <p className="text-lg font-medium">Document is being processed...</p>
            <p className="text-sm mt-2">AI is analyzing and simplifying your document</p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-fit overflow-hidden" data-testid="simplified-document">
      <motion.div 
        className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2" data-testid="text-document-title">
                <Sparkles className="h-5 w-5 text-primary" />
                Simplified Document
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-document-subtitle">
                {documentData.fileName || "Legal Document"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                data-testid="button-export"
                className="hover:bg-primary/5"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const fullText = documentData.clauses
                    .map((clause: SimplifiedClause) => `${clause.title}. ${clause.simplified}`)
                    .join(' ');
                  handlePlayAudio(fullText);
                }}
                data-testid="button-listen"
                className="hover:bg-primary/5"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                Listen
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto" data-testid="clauses-container">
        <AnimatePresence>
          {documentData.clauses.map((clause: SimplifiedClause, index: number) => {
            const ImportanceIcon = importanceIcons[clause.importance as keyof typeof importanceIcons];
            const importanceColor = importanceColors[clause.importance as keyof typeof importanceColors];
            
            return (
              <motion.div 
                key={clause.id}
                className={`
                  p-5 border-l-4 rounded-r-lg transition-all duration-300 hover:shadow-md
                  ${clauseColors[clause.category as keyof typeof clauseColors] || clauseColors.general}
                `}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.02, x: 5 }}
                data-testid={`clause-card-${clause.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <motion.span 
                      className={`
                        w-8 h-8 text-white text-sm font-bold rounded-full flex items-center justify-center
                        ${clause.category === 'payment' ? 'bg-blue-500' :
                          clause.category === 'financial' ? 'bg-amber-500' :
                          clause.category === 'critical' ? 'bg-red-500' :
                          clause.category === 'security' ? 'bg-green-500' : 'bg-gray-500'}
                      `}
                      data-testid={`clause-number-${clause.id}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {clause.id}
                    </motion.span>
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2" data-testid={`clause-title-${clause.id}`}>
                        {clause.title}
                        <ImportanceIcon className={`h-4 w-4 ${importanceColor}`} />
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className={`text-xs ${categoryBadges[clause.category as keyof typeof categoryBadges] || categoryBadges.general}`}
                          data-testid={`badge-${clause.id}`}
                        >
                          {clause.category}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${importanceColor} border-current`}
                        >
                          {clause.importance}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlayAudio(clause.simplified)}
                      data-testid={`button-play-${clause.id}`}
                      className="hover:bg-primary/10"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
                
                <motion.p 
                  className="text-sm text-muted-foreground leading-relaxed" 
                  data-testid={`clause-content-${clause.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {clause.simplified}
                </motion.p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
