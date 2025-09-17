import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Volume2, Languages } from "lucide-react";
import { askQuestion, generateTTS, translateText } from "@/lib/api";
import { QAMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface QAInterfaceProps {
  documentId: string;
  selectedLanguage: string;
}

export function QAInterface({ documentId, selectedLanguage }: QAInterfaceProps) {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const askQuestionMutation = useMutation({
    mutationFn: ({ question }: { question: string }) => askQuestion(documentId, question),
    onSuccess: (response, variables) => {
      const userMessage: QAMessage = {
        id: Date.now().toString(),
        type: "user",
        content: variables.question,
        timestamp: new Date(),
      };

      const aiMessage: QAMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setInputValue("");
    },
    onError: (error) => {
      toast({
        title: "Question failed",
        description: error instanceof Error ? error.message : "Unable to process your question.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || askQuestionMutation.isPending) return;
    
    askQuestionMutation.mutate({ question: inputValue.trim() });
  };

  const handlePlayAudio = async (text: string) => {
    try {
      const response = await generateTTS(text, selectedLanguage);
      const audio = new Audio(response.audioUrl);
      await audio.play();
    } catch (error) {
      toast({
        title: "Audio playback failed",
        description: "Unable to generate or play audio for this message.",
        variant: "destructive"
      });
    }
  };

  const handleTranslate = async (text: string) => {
    try {
      const response = await translateText(text, selectedLanguage);
      toast({
        title: "Translation",
        description: response.translatedText,
      });
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Unable to translate this message.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-sm h-fit" data-testid="qa-interface">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground">Ask Questions</h3>
        <p className="text-sm text-muted-foreground">Get instant answers about your document</p>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="h-64">
        <div className="p-6 space-y-4" data-testid="messages-container">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground" data-testid="empty-state">
              <p>Ask a question about your document to get started</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${message.type}-${message.id}`}
              >
                {message.type === 'user' ? (
                  <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm" data-testid={`text-user-${message.id}`}>
                      {message.content}
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg px-4 py-3 max-w-xs">
                    <p className="text-sm text-foreground mb-2" data-testid={`text-ai-${message.id}`}>
                      {message.content}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlayAudio(message.content)}
                        data-testid={`button-listen-${message.id}`}
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        <span className="text-xs">Listen</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTranslate(message.content)}
                        data-testid={`button-translate-${message.id}`}
                      >
                        <Languages className="h-3 w-3 mr-1" />
                        <span className="text-xs">Translate</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {askQuestionMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 border-t border-border">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input 
            type="text" 
            placeholder="Ask about penalties, terms, obligations..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={askQuestionMutation.isPending}
            className="flex-1"
            data-testid="input-question"
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || askQuestionMutation.isPending}
            data-testid="button-send-question"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
