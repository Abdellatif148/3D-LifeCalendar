import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';

interface APIViewProps {
    onNavigate: (view: string) => void;
}

const APIView: React.FC<APIViewProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const endpoints = [
        {
            method: 'GET',
            path: '/api/v1/life-data',
            description: 'Retrieve user life data and visualization parameters',
            response: `{
  "currentAge": 25,
  "targetAge": 80,
  "activities": [
    {
      "name": "Sleep",
      "minutesPerDay": 480
    }
  ]
}`
        },
        {
            method: 'POST',
            path: '/api/v1/life-data',
            description: 'Update user life data and recalculate visualization',
            response: `{
  "success": true,
  "lifeExpectancyChange": 2.5,
  "message": "Life data updated successfully"
}`
        },
        {
            method: 'GET',
            path: '/api/v1/analytics',
            description: 'Get detailed analytics and insights',
            response: `{
  "totalWeeks": 4160,
  "weeksLived": 1300,
  "optimizationScore": 85,
  "recommendations": []
}`
        }
    ];

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="api" />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-extrabold text-white mb-6"
                        >
                            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">API</span> for Developers
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-white/80 mb-8"
                        >
                            Integrate life optimization into your applications with our comprehensive REST API.
                        </motion.p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => onNavigate('app')}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                Get API Key
                            </button>
                            <button className="px-6 py-3 border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/10 transition-all">
                                View Docs
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* API Documentation */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Tabs */}
                        <div className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-xl">
                            {['overview', 'authentication', 'endpoints', 'examples'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                                        activeTab === tab
                                            ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-md border border-white/10">
                            {activeTab === 'overview' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">API Overview</h2>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-lg font-bold text-cyan-400 mb-3">Base URL</h3>
                                            <code className="block bg-gray-900/50 p-3 rounded-lg text-sm">
                                                https://api.3dtimeoptimizer.com/v1
                                            </code>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-purple-400 mb-3">Rate Limits</h3>
                                            <ul className="space-y-2 text-white/70">
                                                <li>• Free: 100 requests/hour</li>
                                                <li>• Pro: 1,000 requests/hour</li>
                                                <li>• Enterprise: Unlimited</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'authentication' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Authentication</h2>
                                    <p className="text-white/70 mb-4">All API requests require authentication using Bearer tokens.</p>
                                    <div className="bg-gray-900/50 p-4 rounded-lg">
                                        <code className="text-sm text-green-400">
                                            curl -H "Authorization: Bearer YOUR_API_KEY" \<br/>
                                            &nbsp;&nbsp;&nbsp;&nbsp;https://api.3dtimeoptimizer.com/v1/life-data
                                        </code>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'endpoints' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>
                                    <div className="space-y-6">
                                        {endpoints.map((endpoint, index) => (
                                            <div key={index} className="border border-white/10 rounded-lg p-4">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        endpoint.method === 'GET' ? 'bg-green-600' : 'bg-blue-600'
                                                    }`}>
                                                        {endpoint.method}
                                                    </span>
                                                    <code className="text-cyan-400">{endpoint.path}</code>
                                                </div>
                                                <p className="text-white/70 mb-3">{endpoint.description}</p>
                                                <details className="text-sm">
                                                    <summary className="cursor-pointer text-purple-400 hover:text-purple-300">
                                                        View Response
                                                    </summary>
                                                    <pre className="mt-2 bg-gray-900/50 p-3 rounded text-green-400 overflow-x-auto">
                                                        {endpoint.response}
                                                    </pre>
                                                </details>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'examples' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Code Examples</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-cyan-400 mb-3">JavaScript</h3>
                                            <pre className="bg-gray-900/50 p-4 rounded-lg text-sm overflow-x-auto">
                                                <code className="text-green-400">{`const response = await fetch('https://api.3dtimeoptimizer.com/v1/life-data', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}</code>
                                            </pre>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-purple-400 mb-3">Python</h3>
                                            <pre className="bg-gray-900/50 p-4 rounded-lg text-sm overflow-x-auto">
                                                <code className="text-green-400">{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.3dtimeoptimizer.com/v1/life-data',
    headers=headers
)

data = response.json()
print(data)`}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default APIView;