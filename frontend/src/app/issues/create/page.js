"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import api from "../../../lib/api";

function CreateIssueContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "Medium"
  });

  const issueTypes = [
    "Cloud Security",
    "Red Team Assessment", 
    "VAPT"
  ];

  const priorityLevels = [
    { value: "Low", label: "Low Priority", color: "text-green-400" },
    { value: "Medium", label: "Medium Priority", color: "text-yellow-400" },
    { value: "High", label: "High Priority", color: "text-red-400" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.issues.create(formData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating issue:", error);
      setError(error.response?.data?.message || "Failed to create issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
                <span className="text-gray-300 text-sm">Report New Issue</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Report Security Issue</h1>
          <p className="text-gray-300">Document and track cybersecurity incidents</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Issue Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                placeholder="Brief description of the security issue"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                Issue Type *
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Select issue type</option>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                Priority Level *
              </label>
              <select
                id="priority"
                name="priority"
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                value={formData.priority}
                onChange={handleChange}
              >
                {priorityLevels.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                placeholder="Provide detailed information about the security issue, including steps to reproduce, potential impact, and any relevant technical details..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none"
              >
                {loading ? "Creating Issue..." : "Create Issue"}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Reporting Guidelines</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-cyan-400 mb-2">Cloud Security</h4>
              <p>AWS, Azure, GCP misconfigurations, access control issues, data exposure</p>
            </div>
            <div>
              <h4 className="font-medium text-red-400 mb-2">Red Team Assessment</h4>
              <p>Social engineering, physical security, network penetration testing</p>
            </div>
            <div>
              <h4 className="font-medium text-green-400 mb-2">VAPT</h4>
              <p>Web application vulnerabilities, API security, code review findings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateIssuePage() {
  return (
    <ProtectedRoute>
      <CreateIssueContent />
    </ProtectedRoute>
  );
}