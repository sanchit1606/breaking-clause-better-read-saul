import { useState } from "react";
import { DocumentUpload } from "@/components/document-upload";
import { SimplifiedDocument } from "@/components/simplified-document";
import { QAInterface } from "@/components/qa-interface";
import { TranslationPanel } from "@/components/translation-panel";
import { LanguageSelector } from "@/components/language-selector";
import { Scale, Globe, MessageCircle, Sparkles, Search, Shield, CheckCircle, BarChart3, FileText, AlertTriangle, Filter, TrendingUp, Users, ClipboardCheck, Play, Pause, Volume2, VolumeX, Github, Linkedin } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleAudio = () => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <style jsx>{`
        :where(.wp-site-blocks *:focus) {
          outline-width: 2px;
          outline-style: solid;
        }
        .card svg {
          height: 25px;
        }

        .card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e7e7e7;
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          height: 50px;
          width: 200px;
        }

        .card-small {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e7e7e7;
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          height: 40px;
          width: 140px;
        }

        .card::before,
        .card::after {
          position: absolute;
          display: flex;
          align-items: center;
          width: 50%;
          height: 100%;
          transition: 0.25s linear;
          z-index: 1;
        }
        .card::before {
          content: "";
          left: 0;
          justify-content: flex-end;
          background-color: #70a170;
        }

        .card::after {
          content: "";
          right: 0;
          justify-content: flex-start;
          background-color: #7db37d;
        }

        .card-small::before,
        .card-small::after {
          position: absolute;
          display: flex;
          align-items: center;
          width: 50%;
          height: 100%;
          transition: 0.25s linear;
          z-index: 1;
        }
        .card-small::before {
          content: "";
          left: 0;
          justify-content: flex-end;
          background-color: #70a170;
        }

        .card-small::after {
          content: "";
          right: 0;
          justify-content: flex-start;
          background-color: #7db37d;
        }

        .card:hover {
          box-shadow:
            0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
        }

        .card:hover span {
          opacity: 0;
          z-index: -3;
        }

        .card:hover::before {
          opacity: 0.5;
          transform: translateY(-100%);
        }

        .card:hover::after {
          opacity: 0.5;
          transform: translateY(100%);
        }

        .card-small:hover {
          box-shadow:
            0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
        }

        .card-small:hover span {
          opacity: 0;
          z-index: -3;
        }

        .card-small:hover::before {
          opacity: 0.5;
          transform: translateY(-100%);
        }

        .card-small:hover::after {
          opacity: 0.5;
          transform: translateY(100%);
        }

        .card span {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: whitesmoke;
          font-family: "Fira Mono", monospace;
          font-size: 24px;
          font-weight: 700;
          opacity: 1;
          transition: opacity 0.25s;
          z-index: 2;
        }

        .card-small span {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: whitesmoke;
          font-family: "Fira Mono", monospace;
          font-size: 16px;
          font-weight: 700;
          opacity: 1;
          transition: opacity 0.25s;
          z-index: 2;
        }

        .card .social-link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25%;
          height: 100%;
          color: whitesmoke;
          font-size: 24px;
          text-decoration: none;
          transition: 0.25s;
        }

        .card .social-link svg {
          text-shadow: 1px 1px rgba(31, 74, 121, 0.7);
          transform: scale(1);
        }

        .card .social-link:hover {
          background-color: rgba(249, 244, 255, 0.774);
          animation: bounce_613 0.4s linear;
        }

        .card-small .social-link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25%;
          height: 100%;
          color: whitesmoke;
          font-size: 16px;
          text-decoration: none;
          transition: 0.25s;
        }

        .card-small .social-link svg {
          text-shadow: 1px 1px rgba(31, 74, 121, 0.7);
          transform: scale(1);
        }

        .card-small .social-link:hover {
          background-color: rgba(249, 244, 255, 0.774);
          animation: bounce_613 0.4s linear;
        }

        @keyframes bounce_613 {
          40% {
            transform: scale(1.4);
          }

          60% {
            transform: scale(0.8);
          }

          80% {
            transform: scale(1.2);
          }

          100% {
            transform: scale(1);
          }
        }
      `}</style>
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

            {/* Navigation - Centered */}
            <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="/documentation" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
            </nav>

            {/* Right Side - Test System, Language Toggle and Social Card */}
            <div className="flex items-center space-x-4">
              {/* Test System Button */}
              <a href="/upload" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
                Test System
              </a>
              
              {/* Language Toggle */}
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
              
              {/* Animated Social Media Card */}
              <div className="hidden md:flex items-center">
                <div className="card-small">
                  <span>Connect</span>
                  <a href="https://github.com/sanchit1606" target="_blank" rel="noopener noreferrer" className="social-link">
                    <Github className="h-4 w-4" />
                  </a>
                  <a href="https://www.linkedin.com/in/sanchit1606/" target="_blank" rel="noopener noreferrer" className="social-link">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://portfolio-three-silk-62.vercel.app/" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Background Video Section */}
        <section className="relative py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              {/* Translucent Video Card */}
              <div className="relative w-1/2 max-w-3xl">
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl hover:bg-black/40">
                  <video
                    className="w-full h-auto object-contain rounded-xl"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src="/background homepage.mp4" type="video/mp4" />
                  </video>
                </div>
                
                {/* Audio Controls */}
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                  <button
                    onClick={toggleAudio}
                    className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                    title={isPlaying ? "Pause audio" : "Play audio"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                    title={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Background Audio */}
          <audio
            id="background-audio"
            loop
            preload="auto"
            className="hidden"
          >
            <source src="/breaking_bad.mp3" type="audio/mpeg" />
          </audio>
        </section>

        {/* Hero Text Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30">
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
          {/* Centered Upload Button */}
          <div className="flex justify-center mb-12">
            <a href="/upload" className="inline-block">
              <button className="test-system-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
                <span>test system</span>
              </button>
            </a>
          </div>

          {/* Document Display and Q&A - Only show after upload */}
          {currentDocument && (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column: Document Display */}
              <div className="space-y-6">
                <SimplifiedDocument 
                  documentId={currentDocument} 
                  selectedLanguage={selectedLanguage}
                />
              </div>

              {/* Right Column: Q&A Interface */}
              <div className="space-y-6">
                <QAInterface 
                  documentId={currentDocument}
                  selectedLanguage={selectedLanguage}
                />
                <TranslationPanel 
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              </div>
            </div>
          )}

          {/* Features Section */}
          <section id="features" className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Powerful Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Advanced AI technology to make legal documents accessible to everyone
              </p>
            </div>

            <Marquee pauseOnHover className="[--duration:20s]">
              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Simplification</h3>
                <p className="text-muted-foreground text-sm">Transform complex legal jargon into plain, understandable language using advanced AI models.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="text-accent h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Q&A</h3>
                <p className="text-muted-foreground text-sm">Ask specific questions about your document and get instant, contextual answers.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="text-secondary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Multi-Language</h3>
                <p className="text-muted-foreground text-sm">Get explanations in Hindi, English, Tamil, Bengali, and more languages.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Smart Search</h3>
                <p className="text-muted-foreground text-sm">Advanced vector search to find relevant clauses and information instantly.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-indigo-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Private</h3>
                <p className="text-muted-foreground text-sm">Your documents are processed securely with enterprise-grade privacy protection.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Validation</h3>
                <p className="text-muted-foreground text-sm">Compare extracted data with internal records, highlight mismatches, and enable Reject/Review/Approve actions with severity levels.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Dashboard Overview</h3>
                <p className="text-muted-foreground text-sm">Real-time analytics of processed documents, discrepancies found, high-risk trades, and AI vs Manual accuracy rates.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-orange-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Reports Module</h3>
                <p className="text-muted-foreground text-sm">Compliance breakdown by regulatory categories (MiFID II, FCA, SEC), validation efficiency by user, and risk level distribution.</p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow w-80 mx-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="text-red-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Compliance Review System</h3>
                <p className="text-muted-foreground text-sm">Monitor pending reviews and alerts, highlight high-risk trades, and provide compliance queue filtering for efficient workflow management.</p>
              </div>
            </Marquee>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logo and Description */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Scale className="text-primary-foreground h-4 w-4" />
              </div>
              <span className="font-semibold text-foreground">Breaking Clause</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Making legal documents accessible and understandable for everyone.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/sanchit1606" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/sanchit1606/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a 
                href="https://portfolio-three-silk-62.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm font-medium">Portfolio</span>
              </a>
            </div>
            
            {/* Copyright */}
            <div className="border-t border-border pt-6 w-full">
              <p className="text-sm text-muted-foreground">
                © 2024 Breaking Clause - Better Read Saul. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
