import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Volume2, Languages, Bot, User, Loader2, Sparkles } from "lucide-react";
import { askQuestion, generateTTS, translateText } from "@/lib/api";
import { QAMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface QAInterfaceProps {
  documentId: string;
  selectedLanguage: string;
}

export function QAInterface({ documentId, selectedLanguage }: QAInterfaceProps) {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
    <Card className="shadow-sm h-fit overflow-hidden min-h-[500px]" data-testid="qa-interface">
      <motion.div 
        className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Ask Questions
            </h3>
            <p className="text-sm text-muted-foreground">Get instant answers about your document</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <ScrollArea className="h-96" ref={scrollAreaRef}>
        <div className="p-6 space-y-4" data-testid="messages-container">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div 
                className="text-center text-muted-foreground py-8" 
                data-testid="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-4"
                >
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                    <Bot className="h-8 w-8 text-muted-foreground" />
                  </div>
                </motion.div>
                <p className="text-lg font-medium">Ask a question about your document</p>
                <p className="text-sm mt-2">I'm here to help you understand the terms and conditions</p>
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div 
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${message.type}-${message.id}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  {message.type === 'user' ? (
                    <motion.div 
                      className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-xs shadow-md"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4" />
                        <span className="text-xs font-medium">You</span>
                      </div>
                      <p className="text-sm" data-testid={`text-user-${message.id}`}>
                        {message.content}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="bg-muted rounded-2xl px-4 py-3 max-w-xs shadow-sm border"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">AI Assistant</span>
                      </div>
                      <p className="text-sm text-foreground mb-3" data-testid={`text-ai-${message.id}`}>
                        {message.content}
                      </p>
                      <div className="flex items-center space-x-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayAudio(message.content)}
                            data-testid={`button-listen-${message.id}`}
                            className="h-8 px-2 text-xs hover:bg-primary/10"
                          >
                            <Volume2 className="h-3 w-3 mr-1" />
                            Listen
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTranslate(message.content)}
                            data-testid={`button-translate-${message.id}`}
                            className="h-8 px-2 text-xs hover:bg-primary/10"
                          >
                            <Languages className="h-3 w-3 mr-1" />
                            Translate
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>

          <AnimatePresence>
            {askQuestionMutation.isPending && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-muted rounded-2xl px-4 py-3 max-w-xs shadow-sm border">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">AI Assistant</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <motion.div 
        className="p-6 border-t border-border bg-muted/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <motion.div 
            className="flex-1 relative"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Input 
              type="text" 
              placeholder="Ask about penalties, terms, obligations..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={askQuestionMutation.isPending}
              className="pr-12 h-12 text-base rounded-xl border-2 focus:border-primary/50 transition-colors"
              data-testid="input-question"
            />
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              animate={{ 
                opacity: inputValue.trim() ? 1 : 0.5,
                scale: inputValue.trim() ? 1 : 0.9
              }}
              transition={{ duration: 0.2 }}
            >
              <Send className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || askQuestionMutation.isPending}
              data-testid="button-send-question"
              className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 transition-colors"
            >
              <AnimatePresence mode="wait">
                {askQuestionMutation.isPending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </form>
        
        {/* Quick suggestions */}
        <motion.div 
          className="mt-3 flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {["What are the penalties?", "What are my obligations?", "Can I cancel?"].map((suggestion, index) => (
            <motion.button
              key={suggestion}
              type="button"
              onClick={() => setInputValue(suggestion)}
              className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </Card>
  );
}
