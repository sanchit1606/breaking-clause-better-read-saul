import { useState } from "react";
import { Scale, User, BarChart3, TrendingUp, FileText, Clock, AlertTriangle, CheckCircle, Search, Filter, Download, Calendar, Eye, Shield, Zap, DollarSign } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [dateRange, setDateRange] = useState("30");

  // Mock data for document processing history
  const documentHistory = [
    {
      id: 1,
      fileName: "Insurance Policy - All Risk.pdf",
      user: "Sanchit N",
      uploadDate: "2024-01-15",
      processDate: "2024-01-15 09:15:23",
      model: "gemini-1.5-flash",
      tokensUsed: 12500,
      riskLevel: "Medium",
      severity: "Moderate",
      processingTime: "12.5s",
      status: "Completed",
      cost: 0.94,
      documentType: "Insurance Policy"
    },
    {
      id: 2,
      fileName: "Employment Contract - Tech Corp.docx",
      user: "Sarah Johnson",
      uploadDate: "2024-01-14",
      processDate: "2024-01-14 14:32:11",
      model: "gpt-4o",
      tokensUsed: 8900,
      riskLevel: "Low",
      severity: "Low",
      processingTime: "8.2s",
      status: "Completed",
      cost: 44.50,
      documentType: "Employment Contract"
    },
    {
      id: 3,
      fileName: "NDA Agreement - Startup Inc.pdf",
      user: "Mike Chen",
      uploadDate: "2024-01-14",
      processDate: "2024-01-14 11:45:33",
      model: "claude-3-5-sonnet",
      tokensUsed: 6700,
      riskLevel: "High",
      severity: "High",
      processingTime: "15.8s",
      status: "Completed",
      cost: 20.10,
      documentType: "NDA"
    },
    {
      id: 4,
      fileName: "Terms of Service - E-commerce.pdf",
      user: "Emily Davis",
      uploadDate: "2024-01-13",
      processDate: "2024-01-13 16:20:45",
      model: "gemini-1.5-pro",
      tokensUsed: 15200,
      riskLevel: "Medium",
      severity: "Moderate",
      processingTime: "18.3s",
      status: "Completed",
      cost: 19.00,
      documentType: "Terms of Service"
    },
    {
      id: 5,
      fileName: "Rental Agreement - Office Space.docx",
      user: "David Wilson",
      uploadDate: "2024-01-13",
      processDate: "2024-01-13 10:15:22",
      model: "gpt-4o-mini",
      tokensUsed: 4500,
      riskLevel: "Low",
      severity: "Low",
      processingTime: "6.1s",
      status: "Completed",
      cost: 0.68,
      documentType: "Rental Agreement"
    },
    {
      id: 6,
      fileName: "Loan Agreement - Business.pdf",
      user: "Lisa Brown",
      uploadDate: "2024-01-12",
      processDate: "2024-01-12 13:45:18",
      model: "gemini-1.5-flash",
      tokensUsed: 9800,
      riskLevel: "High",
      severity: "High",
      processingTime: "11.2s",
      status: "Completed",
      cost: 0.74,
      documentType: "Loan Agreement"
    },
    {
      id: 7,
      fileName: "Privacy Policy - Mobile App.pdf",
      user: "Sanchit N",
      uploadDate: "2024-01-12",
      processDate: "2024-01-12 09:30:55",
      model: "claude-3-5-sonnet",
      tokensUsed: 11200,
      riskLevel: "Medium",
      severity: "Moderate",
      processingTime: "14.7s",
      status: "Completed",
      cost: 33.60,
      documentType: "Privacy Policy"
    },
    {
      id: 8,
      fileName: "Service Agreement - Cloud.pdf",
      user: "Mike Chen",
      uploadDate: "2024-01-11",
      processDate: "2024-01-11 15:22:41",
      model: "gpt-4o",
      tokensUsed: 13400,
      riskLevel: "Low",
      severity: "Low",
      processingTime: "16.9s",
      status: "Completed",
      cost: 67.00,
      documentType: "Service Agreement"
    }
  ];

  // Filter documents based on search and filters
  const filteredDocuments = documentHistory.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRisk === "all" || doc.riskLevel.toLowerCase() === selectedRisk.toLowerCase();
    const matchesModel = selectedModel === "all" || doc.model === selectedModel;
    
    return matchesSearch && matchesRisk && matchesModel;
  });

  // Calculate statistics
  const totalDocuments = documentHistory.length;
  const totalTokens = documentHistory.reduce((sum, doc) => sum + doc.tokensUsed, 0);
  const totalCost = documentHistory.reduce((sum, doc) => sum + doc.cost, 0);
  const avgProcessingTime = documentHistory.reduce((sum, doc) => sum + parseFloat(doc.processingTime), 0) / totalDocuments;
  const highRiskDocs = documentHistory.filter(doc => doc.riskLevel === "High").length;
  const mediumRiskDocs = documentHistory.filter(doc => doc.riskLevel === "Medium").length;
  const lowRiskDocs = documentHistory.filter(doc => doc.riskLevel === "Low").length;

  // Model usage statistics
  const modelUsage = documentHistory.reduce((acc, doc) => {
    acc[doc.model] = (acc[doc.model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Risk level colors
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <a href="/upload" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Document Upload</a>
              <a href="/reports" className="block px-3 py-2 text-sm bg-blue-600 text-white rounded">Reports</a>
              <a href="/settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Settings</a>
            </nav>
          </div>
          
          {/* User Profile Card */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-blue-800 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sanchit N</p>
                  <p className="text-xs text-gray-300">Risk Analyst</p>
                  <p className="text-xs text-gray-400">Last login: Today, 09:15</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Processing Reports</h1>
            <p className="text-gray-600">Comprehensive analytics and history of all processed documents</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTokens.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                  <p className="text-2xl font-bold text-gray-900">{avgProcessingTime.toFixed(1)}s</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">High Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{highRiskDocs}</span>
                    <span className="text-xs text-gray-500">({((highRiskDocs / totalDocuments) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Medium Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{mediumRiskDocs}</span>
                    <span className="text-xs text-gray-500">({((mediumRiskDocs / totalDocuments) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Low Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{lowRiskDocs}</span>
                    <span className="text-xs text-gray-500">({((lowRiskDocs / totalDocuments) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Usage</h3>
              <div className="space-y-4">
                {Object.entries(modelUsage).map(([model, count]) => (
                  <div key={model} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{model}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / totalDocuments) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search documents, users, or types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
                
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Models</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                </select>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Document History Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Document Processing History</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Document</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Processed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Model</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Risk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Tokens</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2 flex-shrink-0">
                            <FileText className="w-3 h-3 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</div>
                            <div className="text-xs text-gray-500 truncate">{doc.documentType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1 flex-shrink-0">
                            <User className="w-2.5 h-2.5 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-900 truncate">{doc.user.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(doc.processDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        {doc.model.split('-')[0]}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(doc.riskLevel)}`}>
                          {doc.riskLevel.charAt(0)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        {(doc.tokensUsed / 1000).toFixed(1)}k
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        ${doc.cost.toFixed(1)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        {doc.processingTime}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-3 h-3" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
