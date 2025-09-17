import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Volume2 } from "lucide-react";
import { simplifyDocument, generateTTS } from "@/lib/api";
import { SimplifiedClause } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface SimplifiedDocumentProps {
  documentId: string;
  selectedLanguage: string;
}

const clauseColors = {
  payment: "bg-blue-50 border-l-blue-400",
  financial: "bg-amber-50 border-l-amber-400", 
  critical: "bg-red-50 border-l-red-400",
  security: "bg-green-50 border-l-green-400",
  general: "bg-gray-50 border-l-gray-400"
};

const categoryBadges = {
  payment: "bg-blue-100 text-blue-800",
  financial: "bg-amber-100 text-amber-800",
  critical: "bg-red-100 text-red-800",
  security: "bg-green-100 text-green-800",
  general: "bg-gray-100 text-gray-800"
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
      <Card data-testid="simplified-document-loading">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="simplified-document-error">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Failed to load simplified document</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!documentData?.clauses) {
    return (
      <Card data-testid="simplified-document-empty">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Document is being processed...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm overflow-hidden" data-testid="simplified-document">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground" data-testid="text-document-title">
              Simplified Document
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-document-subtitle">
              {documentData.fileName || "Legal Document"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
              data-testid="button-export"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
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
            >
              <Volume2 className="h-4 w-4 mr-1" />
              Listen
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto" data-testid="clauses-container">
        {documentData.clauses.map((clause: SimplifiedClause, index: number) => (
          <div 
            key={clause.id}
            className={`
              p-4 border-l-4 rounded-r-lg animate-fade-in
              ${clauseColors[clause.category as keyof typeof clauseColors] || clauseColors.general}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
            data-testid={`clause-card-${clause.id}`}
          >
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              <span 
                className={`
                  w-6 h-6 text-white text-xs rounded-full flex items-center justify-center mr-2
                  ${clause.category === 'payment' ? 'bg-blue-400' :
                    clause.category === 'financial' ? 'bg-amber-400' :
                    clause.category === 'critical' ? 'bg-red-400' :
                    clause.category === 'security' ? 'bg-green-400' : 'bg-gray-400'}
                `}
                data-testid={`clause-number-${clause.id}`}
              >
                {clause.id}
              </span>
              <span data-testid={`clause-title-${clause.id}`}>{clause.title}</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3" data-testid={`clause-content-${clause.id}`}>
              {clause.simplified}
            </p>
            <div className="flex items-center justify-between">
              <Badge 
                className={categoryBadges[clause.category as keyof typeof categoryBadges] || categoryBadges.general}
                data-testid={`badge-${clause.id}`}
              >
                {clause.category}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePlayAudio(clause.simplified)}
                data-testid={`button-play-${clause.id}`}
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
