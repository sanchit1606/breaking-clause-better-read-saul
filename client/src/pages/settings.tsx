import { useState } from "react";
import { Scale, User, LogOut, Settings as SettingsIcon, Shield, DollarSign, BarChart3, Users, Key, Zap, AlertCircle, CheckCircle, Edit, Trash2, Plus, Save } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [maxTokens, setMaxTokens] = useState(2048);
  const [autoProcess, setAutoProcess] = useState(true);
  const [simplificationLevel, setSimplificationLevel] = useState("medium");
  const [enableTranslation, setEnableTranslation] = useState(true);
  const [enableQASuggestions, setEnableQASuggestions] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // Current user is admin

  // Mock data
  const currentUser = {
    name: "Sanchit N",
    email: "sanchit@breakingclause.com",
    role: "Admin - Risk Analyst",
    joinDate: "2024-01-15",
    lastLogin: "Today, 09:15",
    avatar: "SN"
  };

  const models = [
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google", cost: 0.000075, speed: "Fast" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", cost: 0.00125, speed: "Medium" },
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", cost: 0.005, speed: "Medium" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", cost: 0.00015, speed: "Fast" },
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", cost: 0.003, speed: "Medium" }
  ];

  const users = [
    { id: 1, name: "Sarah Johnson", email: "sarah@company.com", role: "Risk Analyst", tokensUsed: 125000, model: "gemini-1.5-flash", billing: 9.38, status: "Active" },
    { id: 2, name: "Mike Chen", email: "mike@company.com", role: "Legal Counsel", tokensUsed: 89000, model: "gpt-4o", billing: 445.00, status: "Active" },
    { id: 3, name: "Emily Davis", email: "emily@company.com", role: "Compliance Officer", tokensUsed: 67000, model: "claude-3-5-sonnet", billing: 201.00, status: "Inactive" },
    { id: 4, name: "David Wilson", email: "david@company.com", role: "Risk Analyst", tokensUsed: 45000, model: "gemini-1.5-pro", billing: 56.25, status: "Active" },
    { id: 5, name: "Lisa Brown", email: "lisa@company.com", role: "Legal Counsel", tokensUsed: 23000, model: "gpt-4o-mini", billing: 3.45, status: "Active" }
  ];

  const totalBilling = users.reduce((sum, user) => sum + user.billing, 0);
  const totalTokens = users.reduce((sum, user) => sum + user.tokensUsed, 0);

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
              <a href="/reports" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Reports</a>
              <a href="/settings" className="block px-3 py-2 text-sm bg-blue-600 text-white rounded">Settings</a>
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
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Manage your account, AI models, and system configuration</p>
          </div>

          {/* Settings Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: "profile", name: "Profile", icon: User },
                  { id: "models", name: "AI Models", icon: Zap },
                  { id: "users", name: "User Management", icon: Users },
                  { id: "billing", name: "Billing & Usage", icon: DollarSign }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Current User Profile */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Your Profile</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="space-y-4 md:col-span-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={currentUser.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={currentUser.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-900">{currentUser.role}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:col-span-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                      <p className="text-sm text-gray-900">{currentUser.joinDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                      <p className="text-sm text-gray-900">{currentUser.lastLogin}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:col-span-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {currentUser.avatar}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "models" && (
            <div className="space-y-6">
              {/* Model Selection */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Model</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} ({model.provider}) - ${model.cost}/1K tokens
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Simplification Level</label>
                    <select
                      value={simplificationLevel}
                      onChange={(e) => setSimplificationLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="basic">Basic - Simple language conversion</option>
                      <option value="medium">Medium - Balanced simplification</option>
                      <option value="advanced">Advanced - Maximum simplification</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                    <input
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Save className="w-4 h-4" />
                      <span>Save Configuration</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Document Processing Settings */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Processing Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Auto-Process Documents</label>
                        <p className="text-xs text-gray-500">Automatically process documents after upload</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoProcess}
                          onChange={(e) => setAutoProcess(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable Translation</label>
                        <p className="text-xs text-gray-500">Allow document translation features</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableTranslation}
                          onChange={(e) => setEnableTranslation(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">QA Suggestions</label>
                        <p className="text-xs text-gray-500">Show suggested questions for documents</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableQASuggestions}
                          onChange={(e) => setEnableQASuggestions(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Comparison */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/1K tokens</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {models.map((model) => (
                        <tr key={model.id} className={selectedModel === model.id ? "bg-blue-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {model.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {model.provider}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${model.cost}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {model.speed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {selectedModel === model.id ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Inactive
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && isAdmin && (
            <div className="space-y-6">
              {/* User Management */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Used</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-blue-600">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.tokensUsed.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.model}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${user.billing.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              {/* Billing Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Billing</p>
                      <p className="text-2xl font-bold text-gray-900">${totalBilling.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Key className="w-6 h-6 text-blue-600" />
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
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Cost/Token</p>
                      <p className="text-2xl font-bold text-gray-900">${(totalBilling / totalTokens).toFixed(6)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage by Model */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage by Model</h3>
                <div className="space-y-4">
                  {models.map((model) => {
                    const modelUsers = users.filter(user => user.model === model.id);
                    const modelTokens = modelUsers.reduce((sum, user) => sum + user.tokensUsed, 0);
                    const modelBilling = modelUsers.reduce((sum, user) => sum + user.billing, 0);
                    
                    return (
                      <div key={model.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{model.name}</p>
                            <p className="text-xs text-gray-500">{model.provider}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{modelTokens.toLocaleString()} tokens</p>
                          <p className="text-xs text-gray-500">${modelBilling.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
