"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";
import api from "../../lib/api";

function DashboardContent() {
  const { user, logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    resolved: 0,
    pending: 0,
    critical: 0,
    total: 0
  });

  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching issues...');
      const response = await api.issues.getAll();
      console.log('API Response:', response);
      // Backend returns issues array directly, not wrapped in {issues: [...]}
      const issuesData = Array.isArray(response) ? response : (response.issues || []);
      console.log('Issues Data:', issuesData);
      setIssues(issuesData);
      
      // Calculate statistics
      const statistics = calculateStats(issuesData);
      console.log('Calculated Stats:', statistics);
      setStats(statistics);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError('Failed to load issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (issuesData) => {
    const stats = {
      resolved: 0,
      inProgress: 0,
      highPriority: 0,
      total: issuesData.length
    };

    issuesData.forEach(issue => {
      // Count by status
      const status = issue.status;
      if (status === 'Resolved' || status === 'Closed') {
        stats.resolved++;
      } else if (status === 'Open' || status === 'In Progress') {
        stats.inProgress++;
      }
      
      // Count by priority
      const priority = issue.priority;
      if (priority === 'High') {
        stats.highPriority++;
      }
    });

    return stats;
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will happen automatically via AuthContext
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-cyan-400">ApniSec</span>
              </Link>
              <div className="ml-8">
                <span className="text-gray-300 text-sm">Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                Welcome, {user?.username || user?.email}
              </span>
              <Link
                href="/profile"
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
          <p className="text-gray-300">Monitor and manage your cybersecurity issues</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Resolved Issues */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {loading ? (
                    <span className="animate-pulse bg-gray-600 h-6 w-8 rounded"></span>
                  ) : (
                    stats.resolved
                  )}
                </p>
                <p className="text-gray-400 text-sm">Resolved Issues</p>
              </div>
            </div>
          </div>

          {/* In Progress Issues */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {loading ? (
                    <span className="animate-pulse bg-gray-600 h-6 w-8 rounded"></span>
                  ) : (
                    stats.inProgress
                  )}
                </p>
                <p className="text-gray-400 text-sm">In Progress</p>
              </div>
            </div>
          </div>

          {/* High Priority Issues */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {loading ? (
                    <span className="animate-pulse bg-gray-600 h-6 w-8 rounded"></span>
                  ) : (
                    stats.highPriority
                  )}
                </p>
                <p className="text-gray-400 text-sm">High Priority</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-200 px-6 py-4 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
            <button
              onClick={fetchIssues}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Recent Issues */}
        {!loading && issues.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Issues</h2>
              <button
                onClick={fetchIssues}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Refresh
              </button>
            </div>
            <div className="space-y-3">
              {issues.slice(0, 5).map((issue) => (
                <div key={issue._id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      issue.status === 'Resolved' || issue.status === 'Closed' ? 'bg-green-500' :
                      issue.status === 'In Progress' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="text-white font-medium">{issue.title}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-400 text-sm">{issue.type}</p>
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${
                          issue.priority === 'High' ? 'bg-red-500' :
                          issue.priority === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}>
                          {issue.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm capitalize">{issue.status}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Issues State */}
        {!loading && issues.length === 0 && !error && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-6 text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Issues Yet</h3>
            <p className="text-gray-400 mb-4">Create your first security issue to get started</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/issues/create"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all text-center"
            >
              Report New Issue
            </Link>
            <Link
              href="/issues"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
            >
              View All Issues
            </Link>
            <button 
              onClick={fetchIssues}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <Link
              href="/status"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
            >
              System Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}