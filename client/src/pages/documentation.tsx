import { Scale, Github, Linkedin, Mail, Phone, MapPin, Calendar, User, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function Documentation() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

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

            {/* Navigation - Centered */}
            <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-6">
              <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            </nav>

            {/* Right Side - Test System and Social Card */}
            <div className="flex items-center space-x-4">
              {/* Test System Button */}
              <a href="/upload" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
                Test System
              </a>
              
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

            {/* Mobile Navigation */}
            <nav className="md:hidden flex items-center space-x-4">
              <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Breaking <span className="text-primary">Clause</span> - Better Read Saul
            </h1>
            <p className="text-xl text-muted-foreground italic">
              "Now you actually know what you're signing."
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">Google Cloud AI Hackathon</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">Built with Gemini AI</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">TypeScript 100%</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">React 18</span>
            </div>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              A comprehensive <strong>Generative AI Legal Document Simplification System</strong> that transforms complex legal documents into clear, accessible guidance using advanced AI technology. Built for the Google Cloud AI Hackathon, this system empowers users to make informed decisions and protect themselves from legal and financial risks.
            </p>
          </section>


          {/* Problem Statement */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Problem Statement</h2>
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <p className="text-lg font-semibold text-red-800 mb-4">
                <strong>73% of people don't read legal documents</strong> because they're filled with impenetrable jargon.
              </p>
              <p className="text-muted-foreground mb-4">
                This creates a massive information asymmetry where individuals unknowingly agree to unfavorable terms, exposing them to financial and legal risks.
              </p>
              <p className="text-muted-foreground">
                Legal documents - rental agreements, loan contracts, terms of service - are filled with complex, impenetrable jargon that creates information asymmetry. This exposes individuals to financial and legal risks when they unknowingly agree to unfavorable terms.
              </p>
              <p className="text-lg font-semibold text-primary mt-4">
                <strong>Breaking Clause</strong> solves this critical problem by making legal documents accessible to everyone through AI-powered simplification.
              </p>
            </div>
          </section>

          {/* Solution & Innovation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Solution & Innovation</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Core Innovation</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <strong>Direct AI Document Understanding:</strong> Uses Gemini's native document analysis without OCR preprocessing
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <strong>Multi-Agent Architecture:</strong> Specialized AI agents for different tasks (simplification, Q&A, translation, TTS)
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <strong>Context-Aware Chat:</strong> Intelligent Q&A system that understands document context and provides relevant answers
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <strong>Real-time Processing:</strong> Sub-5-second document analysis and simplification
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Technical Excellence</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <strong>Google Cloud AI Integration:</strong> Gemini 1.5 Pro/Flash, Document AI, Translation API, Text-to-Speech
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <strong>Advanced Architecture:</strong> React frontend, Express.js backend, MCP server for agent orchestration
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <strong>Vector Search:</strong> Intelligent document retrieval using embeddings
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <strong>Multi-language Support:</strong> Real-time translation and voice output in 10+ languages
                </li>
              </ul>
            </div>
          </section>


          {/* Technical Architecture */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Technical Architecture</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">System Architecture Diagram</h3>
              <p className="text-muted-foreground mb-6">
                Interactive diagram showing the complete system architecture with data flow between components.
                Use the controls below to zoom in/out and drag to pan around the diagram.
              </p>
              
              {/* Interactive Diagram Container */}
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
                {/* Controls */}
                <div className="flex items-center justify-between p-4 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Diagram Controls:</span>
                    <button
                      onClick={handleZoomIn}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                    >
                      <ZoomIn className="h-4 w-4" />
                      Zoom In
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm"
                    >
                      <ZoomOut className="h-4 w-4" />
                      Zoom Out
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 px-3 py-1.5 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors text-sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Zoom: {Math.round(zoomLevel * 100)}%</span> | 
                    <span className="ml-1">Drag to pan</span> | 
                    <span className="ml-1">Scroll to zoom</span>
                  </div>
                </div>
                
                {/* Diagram Container */}
                <div 
                  className="relative overflow-hidden bg-white"
                  style={{ height: '600px' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                      transformOrigin: 'center center',
                      transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    }}
                  >
                    <img
                      src="/architecture-diagram.png"
                      alt="Breaking Clause System Architecture Diagram"
                      className="max-w-none select-none"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '1200px'
                      }}
                      draggable={false}
                    />
                  </div>
                </div>
                
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Google Cloud Services Used</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Gemini 1.5 Pro:</strong> Document analysis and complex reasoning</li>
                <li>• <strong>Gemini 1.5 Flash:</strong> Real-time Q&A and quick responses</li>
                <li>• <strong>Document AI:</strong> Enhanced document parsing and OCR</li>
                <li>• <strong>Translation API:</strong> Multi-language support</li>
                <li>• <strong>Text-to-Speech API:</strong> Voice output generation</li>
                <li>• <strong>Firestore:</strong> Document metadata and conversation storage</li>
                <li>• <strong>Cloud Storage:</strong> File storage and management</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Frontend Card */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h4 className="text-lg font-semibold text-foreground mb-4">Frontend</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 17.5c-3.033 0-5.5-2.467-5.5-5.5s2.467-5.5 5.5-5.5 5.5 2.467 5.5 5.5-2.467 5.5-5.5 5.5z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">React 18 with TypeScript</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-black group-hover:bg-gray-800 transition-colors">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Next.js for routing and optimization</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-100 group-hover:bg-cyan-200 transition-colors">
                      <svg className="w-5 h-5 text-cyan-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">TailwindCSS for styling</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-pink-100 group-hover:bg-pink-200 transition-colors">
                      <svg className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Framer Motion for animations</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Radix UI for accessible components</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                      <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">React Query for state management</span>
                  </div>
                </div>
              </div>

              {/* Backend Card */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h4 className="text-lg font-semibold text-foreground mb-4">Backend</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Express.js with TypeScript</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                      <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Multer for file uploads</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Google Cloud Firestore for NoSQL data persistence</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-100 group-hover:bg-yellow-200 transition-colors">
                      <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Google Cloud Storage for document storage</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                      <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Google Cloud AI integration</span>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* Social Impact */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Social Impact & Market Feasibility</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Target Market</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Primary:</strong> 2.3 billion people globally who interact with legal documents</li>
                <li>• <strong>Secondary:</strong> Small businesses, legal professionals, educational institutions</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Social Impact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Accessibility:</strong> Makes legal documents understandable to non-lawyers</li>
                <li>• <strong>Protection:</strong> Prevents individuals from unknowingly agreeing to unfavorable terms</li>
                <li>• <strong>Education:</strong> Helps people learn about legal concepts and their rights</li>
                <li>• <strong>Inclusion:</strong> Multilingual support ensures accessibility across language barriers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Competitive Advantages</h3>
              <ol className="space-y-2 text-muted-foreground">
                <li>1. <strong>Direct AI Integration:</strong> No OCR preprocessing needed</li>
                <li>2. <strong>Multi-Agent Architecture:</strong> Specialized AI agents for different tasks</li>
                <li>3. <strong>Real-time Processing:</strong> Sub-5-second response times</li>
                <li>4. <strong>Comprehensive Solution:</strong> Simplification + Q&A + Translation + TTS</li>
                <li>5. <strong>Professional UI/UX:</strong> Production-ready interface with smooth animations</li>
                <li>6. <strong>Scalable Architecture:</strong> Cloud-native, microservices design</li>
              </ol>
            </div>
          </section>


          {/* Developer Card */}
          <section id="contact" className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Developer</h2>
            
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-lg border border-border">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  SN
                </div>
                
                {/* Developer Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Sanchitsai Nipanikar</h3>
                  <p className="text-muted-foreground mb-4">Full Stack Developer & AI/ML Engineer</p>
                  
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:sanchitnipanikar@gmail.com" className="hover:text-primary transition-colors">
                        sanchitnipanikar@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <a href="tel:+918459597997" className="hover:text-primary transition-colors">
                        +91-8459597997
                      </a>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Pune - 411045</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Male, 16/06/2004</span>
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start gap-4">
                    <a 
                      href="https://github.com/sanchit1606" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/sanchit1606/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
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
                </div>
              </div>
            </div>
          </section>

          {/* Footer Quote */}
          <section className="text-center py-8 border-t border-border">
            <p className="text-lg font-semibold text-foreground mb-2">
              Breaking Clause - Now you actually know what you're signing.
            </p>
            <p className="text-muted-foreground italic">
              Making legal documents accessible to everyone through the power of AI.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
