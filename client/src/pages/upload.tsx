import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Scale, Upload as UploadIcon, FileText, Globe, MessageCircle, Sparkles, ArrowLeft, CheckCircle, AlertCircle, Github, Linkedin, BarChart3, Clock, TrendingUp, User } from "lucide-react";
import { DocumentUpload } from "@/components/document-upload";
import { SimplifiedDocument } from "@/components/simplified-document";
import { QAInterface } from "@/components/qa-interface";
import { TranslationPanel } from "@/components/translation-panel";
import { LanguageSelector } from "@/components/language-selector";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";

export default function Upload() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const genres = [
    "Legal Contract",
    "Insurance Policy", 
    "Terms of Service",
    "Privacy Policy",
    "Rental Agreement",
    "Loan Agreement",
    "Employment Contract",
    "NDA (Non-Disclosure)",
    "Term Sheet",
    "Other"
  ];

  const handleFileUpload = (documentId: string) => {
    setUploadedFile({ name: 'uploaded-document.pdf' } as File); // Mock file for display
  };

  const handleProcessDocument = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setCurrentDocument("sample-document-id");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        /* From Uiverse.io by alexruix - Modified for sidebar */
        .card {
          width: 180px;
          height: 220px;
          background: #f5f5f5;
          padding: 1.75rem 1.25rem;
          transition: box-shadow .3s ease, transform .2s ease;
          border-radius: 12px;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: transform .2s ease, opacity .2s ease;
        }

        /*Image*/
        .card-avatar {
          --size: 55px;
          background: linear-gradient(to top, #f1e1c1 0%, #fcbc97 100%);
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          transition: transform .2s ease;
          margin-bottom: 0.875rem;
        }

        /*Card footer*/
        .card-social {
          transform: translateY(200%);
          display: flex;
          justify-content: space-around;
          width: 100%;
          opacity: 0;
          transition: transform .2s ease, opacity .2s ease;
        }

        .card-social__item {
          list-style: none;
        }

        .card-social__item svg {
          display: block;
          height: 16px;
          width: 16px;
          fill: #515F65;
          cursor: pointer;
          transition: fill 0.2s ease ,transform 0.2s ease;
        }

        /*Text*/
        .card-title {
          color: #333;
          font-size: 1.2em;
          font-weight: 600;
          line-height: 1.6rem;
          margin-bottom: 0.375rem;
        }

        .card-subtitle {
          color: #859ba8;
          font-size: 0.8em;
        }

        /*Hover*/
        .card:hover {
          box-shadow: 0 8px 50px #23232333;
        }

        .card:hover .card-info {
          transform: translateY(-5%);
        }

        .card:hover .card-social {
          transform: translateY(100%);
          opacity: 1;
        }

        .card-social__item svg:hover {
          fill: #232323;
          transform: scale(1.1);
        }

        .card-avatar:hover {
          transform: scale(1.1);
        }
      `}</style>
      {/* Header */}
      <header className="bg-blue-100 text-blue-900 border-b border-blue-200">
        <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Breaking Clause AI-Powered Document Analysis System</h1>
          </div>
          
          {/* Center - Home Button */}
          <div className="flex-1 flex justify-center">
            <a href="/" className="text-blue-800 text-sm">
              Home
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-700" />
              </div>
              <span className="text-sm font-medium">Sanchit N</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AnimatedThemeToggler className="w-8 h-8 text-blue-700 hover:text-blue-500 transition-colors" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">System Online</span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 text-gray-800 min-h-screen relative" style={{ backgroundColor: '#A6E3E9' }}>
          <div className="p-6">
            <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">NAVIGATION</h2>
            <nav className="space-y-2">
              <a href="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Dashboard</a>
              <a href="/upload" className="block px-3 py-2 text-sm bg-blue-600 text-white rounded">Document Upload</a>
              <a href="/reports" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Reports</a>
              <a href="/settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Settings</a>
            </nav>
          </div>
          
          {/* User Profile Card */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="card">
              <div className="card-info">
                <div className="card-avatar flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="card-title">Sanchit N</h3>
                <p className="card-subtitle">Risk Analyst</p>
              </div>
              <ul className="card-social">
                <li className="card-social__item">
                  <a href="https://github.com/sanchit1606" target="_blank" rel="noopener noreferrer">
                    <Github />
                  </a>
                </li>
                <li className="card-social__item">
                  <a href="https://www.linkedin.com/in/sanchit1606/" target="_blank" rel="noopener noreferrer">
                    <Linkedin />
                  </a>
                </li>
                <li className="card-social__item">
                  <a href="https://portfolio-three-silk-62.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
        </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload & Analysis</h1>
            <p className="text-gray-600">Upload your legal documents for AI-powered analysis and simplification</p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documents Processed</p>
                  <p className="text-2xl font-bold text-gray-900">847</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    12% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Analysis Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    3% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                </div>
              </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing Time</p>
                  <p className="text-2xl font-bold text-gray-900">1.8h</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                    15% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">42</p>
                  <p className="text-xs text-red-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    5% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Upload Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Side - Upload Cards */}
            <div className="xl:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Document Upload Card */}
                <div className="bg-white p-8 rounded-lg shadow-sm border min-h-[400px]">
                  <DocumentUpload 
                    onDocumentUploaded={handleFileUpload} 
                    onProcessDocument={handleProcessDocument}
                    isProcessingDocument={isProcessing}
                    selectedGenre={selectedGenre}
                  />
                </div>

                {/* Document Type Card */}
                <div className="bg-white p-8 rounded-lg shadow-sm border min-h-[400px]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Document Type
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Select the genre/domain of the document you have uploaded
                  </p>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full p-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select document type...</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
            </div>

                {/* Processing Status Card */}
                <div className="bg-white p-8 rounded-lg shadow-sm border min-h-[400px]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  Processing Status
                </h3>
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-sm font-medium text-gray-900">Processing your document...</span>
                  </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        AI is analyzing your document and extracting key information
                      </p>
                    </div>
                  ) : currentDocument ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-green-600">
                        <CheckCircle className="h-6 w-6" />
                        <span className="text-sm font-medium">Document processed successfully!</span>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          Your document has been analyzed and simplified. You can now view the results and ask questions.
                        </p>
                      </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-gray-500">
                        <AlertCircle className="h-6 w-6" />
                        <span className="text-sm font-medium">Ready to process</span>
                      </div>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Upload a document and select its type to begin processing
                        </p>
                    </div>
                  </div>
                )}
              </div>

                {/* Output Language Card */}
                <div className="bg-white p-8 rounded-lg shadow-sm border min-h-[400px]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Output Language
                  </h3>
                  <TranslationPanel 
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - AI Chatbot */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <QAInterface 
                  documentId={currentDocument || "demo"} 
                  selectedLanguage={selectedLanguage}
                />
              </div>
            </div>
            </div>
            
          {/* Document Display - Only show after processing */}
          {currentDocument && (
            <div className="mt-12">
              <SimplifiedDocument 
                documentId={currentDocument} 
                selectedLanguage={selectedLanguage}
              />
            </div>
          )}
        </main>
        </div>
    </div>
  );
}