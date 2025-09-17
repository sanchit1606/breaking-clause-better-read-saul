import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Volume2 } from "lucide-react";
import { generateTTS } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface TranslationPanelProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "ta", name: "தமிழ்" },
  { code: "bn", name: "বাংলা" },
];

export function TranslationPanel({ selectedLanguage, onLanguageChange }: TranslationPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(30);
  const { toast } = useToast();

  const handlePlaySummary = async () => {
    try {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        // This would normally use the actual document summary
        const summaryText = "This is a sample document summary that would be played back using text-to-speech.";
        const response = await generateTTS(summaryText, selectedLanguage);
        const audio = new Audio(response.audioUrl);
        
        audio.onended = () => setIsPlaying(false);
        audio.onpause = () => setIsPlaying(false);
        
        await audio.play();
      }
    } catch (error) {
      setIsPlaying(false);
      toast({
        title: "Audio playback failed",
        description: "Unable to play the document summary.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-sm" data-testid="translation-panel">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground">Language & Audio</h3>
        <p className="text-sm text-muted-foreground">Get explanations in your preferred language</p>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Choose Language</label>
          <div className="grid grid-cols-2 gap-2" data-testid="language-buttons">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => onLanguageChange(lang.code)}
                data-testid={`button-language-${lang.code}`}
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Audio Controls */}
        <div className="pt-4 border-t border-border">
          <label className="block text-sm font-medium text-foreground mb-2">Audio Playback</label>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handlePlaySummary}
              className="flex items-center space-x-2"
              data-testid="button-play-summary"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isPlaying ? "Pause" : "Play"} Summary</span>
            </Button>
            
            <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
              <Progress 
                value={audioProgress} 
                className={`h-full ${isPlaying ? 'animate-pulse-soft' : ''}`}
                data-testid="audio-progress"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              data-testid="button-volume"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
