import { useState } from "react";
import { DocumentUpload } from "@/components/document-upload";
import { SimplifiedDocument } from "@/components/simplified-document";
import { QAInterface } from "@/components/qa-interface";
import { TranslationPanel } from "@/components/translation-panel";
import { AgentStatus } from "@/components/agent-status";
import { LanguageSelector } from "@/components/language-selector";
import { Scale, Globe, MessageCircle, Sparkles, Search, Shield } from "lucide-react";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Scale className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Breaking Clause</h1>
                <p className="text-sm text-muted-foreground -mt-1">Better Read Saul</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </nav>

            {/* Language Toggle */}
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                Breaking <span className="text-primary">Clause</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <em>"Now you actually know what you're signing."</em>
              </p>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Upload your legal documents and get instant, AI-powered simplifications in plain language. 
                Ask questions, get answers, and understand your contracts like never before.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Upload and Document Display */}
            <div className="space-y-6">
              <DocumentUpload onDocumentUploaded={setCurrentDocument} />
              {currentDocument && (
                <SimplifiedDocument 
                  documentId={currentDocument} 
                  selectedLanguage={selectedLanguage}
                />
              )}
            </div>

            {/* Right Column: Q&A Interface */}
            <div className="space-y-6">
              {currentDocument && (
                <>
                  <QAInterface 
                    documentId={currentDocument}
                    selectedLanguage={selectedLanguage}
                  />
                  <TranslationPanel 
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                  <AgentStatus />
                </>
              )}
            </div>
          </div>

          {/* Features Section */}
          <section className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Powerful Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Advanced AI technology to make legal documents accessible to everyone
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Simplification</h3>
                <p className="text-muted-foreground text-sm">Transform complex legal jargon into plain, understandable language using advanced AI models.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="text-accent h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Q&A</h3>
                <p className="text-muted-foreground text-sm">Ask specific questions about your document and get instant, contextual answers.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="text-secondary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Multi-Language</h3>
                <p className="text-muted-foreground text-sm">Get explanations in Hindi, English, Tamil, Bengali, and more languages.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Smart Search</h3>
                <p className="text-muted-foreground text-sm">Advanced vector search to find relevant clauses and information instantly.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-indigo-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Private</h3>
                <p className="text-muted-foreground text-sm">Your documents are processed securely with enterprise-grade privacy protection.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Scale className="text-primary-foreground h-4 w-4" />
                </div>
                <span className="font-semibold text-foreground">Breaking Clause</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making legal documents accessible and understandable for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Breaking Clause - Better Read Saul. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
