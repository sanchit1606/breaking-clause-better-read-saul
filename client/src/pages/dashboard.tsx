import { useState } from "react";
import { Scale, FileText, BarChart3, TrendingUp, Users, Clock, CheckCircle, AlertCircle, Download, Eye, Share2, Filter, Search } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";

export default function Dashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  // Mock data for charts
  const documentStats = {
    totalProcessed: 1247,
    thisWeek: 89,
    thisMonth: 342,
    accuracy: 94.2,
    avgProcessingTime: 1.8,
    activeUsers: 23
  };

  const weeklyData = [
    { day: "Mon", documents: 12, accuracy: 95 },
    { day: "Tue", documents: 18, accuracy: 94 },
    { day: "Wed", documents: 15, accuracy: 96 },
    { day: "Thu", documents: 22, accuracy: 93 },
    { day: "Fri", documents: 19, accuracy: 95 },
    { day: "Sat", documents: 8, accuracy: 97 },
    { day: "Sun", documents: 5, accuracy: 98 }
  ];

  const documentTypes = [
    { type: "Legal Contracts", count: 456, percentage: 36.6 },
    { type: "Insurance Policies", count: 234, percentage: 18.8 },
    { type: "Terms of Service", count: 189, percentage: 15.2 },
    { type: "Privacy Policies", count: 156, percentage: 12.5 },
    { type: "Rental Agreements", count: 98, percentage: 7.9 },
    { type: "Other", count: 114, percentage: 9.1 }
  ];

  const recentDocuments = [
    { id: "DOC-001", name: "Employment Contract - Tech Corp", status: "Completed", time: "2 min ago", type: "Legal Contract" },
    { id: "DOC-002", name: "Privacy Policy - DataCorp", status: "Processing", time: "5 min ago", type: "Privacy Policy" },
    { id: "DOC-003", name: "Insurance Policy - HealthPlus", status: "Completed", time: "12 min ago", type: "Insurance Policy" },
    { id: "DOC-004", name: "Terms of Service - AppStore", status: "Failed", time: "18 min ago", type: "Terms of Service" },
    { id: "DOC-005", name: "Rental Agreement - PropertyCo", status: "Completed", time: "25 min ago", type: "Rental Agreement" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .chart-bar {
          transition: all 0.3s ease;
        }
        .chart-bar:hover {
          transform: scaleY(1.05);
        }
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-700" />
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
              <a href="/dashboard" className="block px-3 py-2 text-sm bg-blue-600 text-white rounded">Dashboard</a>
              <a href="/upload" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Document Upload</a>
              <a href="/reports" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Reports</a>
              <a href="/settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Settings</a>
            </nav>
          </div>
          
          {/* User Profile Card */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-blue-800 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
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
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Monitor document processing statistics and system performance</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{documentStats.totalProcessed.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">{documentStats.accuracy}%</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.1% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Processing Time</p>
                  <p className="text-2xl font-bold text-gray-900">{documentStats.avgProcessingTime}h</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                    -15% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{documentStats.activeUsers}</p>
                  <p className="text-xs text-blue-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3 new this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Side - Document Viewer */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sample Document</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* PDF Viewer Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">All-Risk Insurance Policy</h4>
                  <p className="text-sm text-gray-600 mb-4">PDF Document - 2.4 MB</p>
                  <div className="flex justify-center space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>View Document</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Documents */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type} • {doc.time}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        doc.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Charts and Analytics */}
            <div className="space-y-6">
              {/* Weekly Processing Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Weekly Processing</h3>
                  <select 
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
                
                <div className="h-64 flex items-end justify-between space-x-2">
                  {weeklyData.map((day, index) => (
                    <div key={day.day} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-blue-100 rounded-t-lg relative group">
                        <div 
                          className="chart-bar bg-blue-500 rounded-t-lg w-full transition-all duration-300"
                          style={{ height: `${(day.documents / 25) * 200}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {day.documents} docs
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">{day.day}</div>
                      <div className="text-xs text-gray-500">{day.accuracy}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Types Distribution */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Types</h3>
                <div className="space-y-3">
                  {documentTypes.map((type, index) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{
                          backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                        }}></div>
                        <span className="text-sm text-gray-700">{type.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${type.percentage}%`,
                              backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">{type.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Performance */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-green-700">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.1s</div>
                    <div className="text-sm text-blue-700">Avg Response</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">156</div>
                    <div className="text-sm text-yellow-700">API Calls/min</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">23</div>
                    <div className="text-sm text-purple-700">Active Sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
