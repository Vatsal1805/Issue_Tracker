"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import api from "../../lib/api";

function IssuesListContent() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ show: false, issue: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.issues.getAll();
      const issuesData = Array.isArray(response) ? response : (response.issues || []);
      setIssues(issuesData);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setError("Failed to load issues. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (issue) => {
    setDeleteModal({ show: true, issue });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.issue) return;

    try {
      setDeleting(true);
      await api.issues.delete(deleteModal.issue._id);
      setIssues(issues.filter(issue => issue._id !== deleteModal.issue._id));
      setDeleteModal({ show: false, issue: null });
    } catch (error) {
      console.error("Error deleting issue:", error);
      setError("Failed to delete issue. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, issue: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
      case "Closed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Open":
      default:
        return "bg-yellow-500";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Cloud Security":
        return "bg-cyan-500";
      case "Red Team Assessment":
        return "bg-red-500";
      case "VAPT":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredIssues = issues.filter(issue => {
    const typeMatch = typeFilter === "all" || issue.type === typeFilter;
    return typeMatch;
  });

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
                <span className="text-gray-300 text-sm">All Issues</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/issues/create"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                + New Issue
              </Link>
              <Link
                href="/profile"
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Profile
              </Link>
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
            <h1 className="text-3xl font-bold text-white mb-2">Security Issues</h1>
            <p className="text-gray-300">Manage and track all cybersecurity incidents</p>
          </div>
          <button
            onClick={fetchIssues}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="Cloud Security">Cloud Security</option>
              <option value="Red Team Assessment">Red Team Assessment</option>
              <option value="VAPT">VAPT</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-200 px-6 py-4 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchIssues}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Issues List */}
        {loading ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-600 rounded w-1/4 mx-auto mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Issues Found</h3>
            <p className="text-gray-400 mb-4">No issues match your current filters</p>
            <Link
              href="/issues/create"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all inline-block"
            >
              Create First Issue
            </Link>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="divide-y divide-slate-700">
              {filteredIssues.map((issue) => (
                <div key={issue._id} className="p-6 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(issue.status)}`}></div>
                        <h3 className="text-lg font-semibold text-white">{issue.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${getTypeColor(issue.type)}`}>
                          {issue.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${getPriorityColor(issue.priority)}`}>
                          {issue.priority} Priority
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3 line-clamp-2">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="capitalize">Status: {issue.status}</span>
                        <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                        {issue.updatedAt !== issue.createdAt && (
                          <span>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <button
                        onClick={() => handleDeleteClick(issue)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete the issue "<span className="font-medium text-white">{deleteModal.issue?.title}</span>"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IssuesPage() {
  return (
    <ProtectedRoute>
      <IssuesListContent />
    </ProtectedRoute>
  );
}