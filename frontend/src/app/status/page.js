"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import api from "../../lib/api";

function SystemStatusContent() {
  const { user } = useAuth();
  const [systemData, setSystemData] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    criticalIssues: 0,
    uptime: "99.9%",
    lastUpdate: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      setError(null);
      const response = await api.issues.getAll();
      const issues = Array.isArray(response) ? response : (response.issues || []);
      
      const stats = {
        totalIssues: issues.length,
        resolvedIssues: issues.filter(issue => issue.status === "resolved" || issue.status === "closed").length,
        pendingIssues: issues.filter(issue => issue.status === "pending" || issue.status === "open").length,
        criticalIssues: issues.filter(issue => issue.status === "critical" || issue.status === "urgent").length,
        uptime: "99.9%", // This would come from actual monitoring
        lastUpdate: new Date().toISOString()
      };
      
      setSystemData(stats);
    } catch (error) {
      console.error("Error fetching system data:", error);
      setError("Failed to load system status.");
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = () => {
    const criticalPercentage = systemData.totalIssues > 0 ? (systemData.criticalIssues / systemData.totalIssues) * 100 : 0;
    
    if (criticalPercentage > 20) return { status: "Critical", color: "bg-red-500", textColor: "text-red-400" };
    if (criticalPercentage > 10) return { status: "Warning", color: "bg-yellow-500", textColor: "text-yellow-400" };
    return { status: "Healthy", color: "bg-green-500", textColor: "text-green-400" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <span className="text-2xl font-bold text-cyan-400">ApniSec</span>
              </Link>
              <div className="ml-8">
                <span className="text-gray-300 text-sm">System Status</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
            <p className="text-gray-300">Real-time monitoring of ApniSec security platform</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${healthStatus.color}`}></div>
              <span className={`font-semibold ${healthStatus.textColor}`}>{healthStatus.status}</span>
            </div>
            <p className="text-gray-400 text-sm">Last updated: {new Date(systemData.lastUpdate).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Overall Health */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Platform Health</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-green-400">{systemData.uptime}</p>
              <p className="text-gray-400 text-sm">Uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-cyan-400">{systemData.resolvedIssues}</p>
              <p className="text-gray-400 text-sm">Resolved</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{systemData.pendingIssues}</p>
              <p className="text-gray-400 text-sm">Pending</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-red-400">{systemData.criticalIssues}</p>
              <p className="text-gray-400 text-sm">Critical</p>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Core Services</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Authentication API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Issues API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Dashboard</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Issue Resolution Rate</span>
                  <span className="text-white font-medium">
                    {systemData.totalIssues > 0 ? Math.round((systemData.resolvedIssues / systemData.totalIssues) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${systemData.totalIssues > 0 ? (systemData.resolvedIssues / systemData.totalIssues) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Critical Issues</span>
                  <span className="text-white font-medium">
                    {systemData.totalIssues > 0 ? Math.round((systemData.criticalIssues / systemData.totalIssues) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${systemData.totalIssues > 0 ? (systemData.criticalIssues / systemData.totalIssues) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/issues/create"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all text-center"
            >
              Report Issue
            </Link>
            <Link
              href="/issues"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
            >
              View All Issues
            </Link>
            <button
              onClick={fetchSystemData}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? "Refreshing..." : "Refresh Status"}
            </button>
            <Link
              href="/dashboard"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SystemStatusPage() {
  return (
    <ProtectedRoute>
      <SystemStatusContent />
    </ProtectedRoute>
  );
}