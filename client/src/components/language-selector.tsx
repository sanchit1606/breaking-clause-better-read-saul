import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-2"
          data-testid="language-selector-trigger"
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span data-testid="selected-language-name">{currentLanguage.name}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48" data-testid="language-dropdown">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              onLanguageChange(language.code);
              setIsOpen(false);
            }}
            className={`flex items-center space-x-2 cursor-pointer ${
              selectedLanguage === language.code ? 'bg-accent' : ''
            }`}
            data-testid={`language-option-${language.code}`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {selectedLanguage === language.code && (
              <span className="ml-auto text-accent-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
