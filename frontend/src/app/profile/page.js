"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import api from "../../lib/api";

function ProfileContent() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    username: "",
    email: ""
  });
  const [userStats, setUserStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    joinedDate: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || ""
      });
    }
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await api.issues.getAll();
      const issues = Array.isArray(response) ? response : (response.issues || []);
      const resolved = issues.filter(issue => issue.status === "resolved" || issue.status === "closed").length;
      
      setUserStats({
        totalIssues: issues.length,
        resolvedIssues: resolved,
        joinedDate: user?.createdAt || new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.auth.updateProfile(profileData);
      setSuccess("Profile updated successfully!");
      // Optionally refresh user data in auth context
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
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
                <span className="text-gray-300 text-sm">Profile</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-300">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{user?.username || "User"}</h3>
                <p className="text-gray-400 text-sm break-all">{user?.email}</p>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                    activeTab === "profile" 
                      ? "bg-cyan-600 text-white shadow-lg" 
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Information</span>
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                    activeTab === "stats" 
                      ? "bg-cyan-600 text-white shadow-lg" 
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Account Stats</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl">
              {/* Success/Error Messages */}
              {error && (
                <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-900/50 border border-green-600 text-green-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </div>
              )}

              {/* Profile Information Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="border-b border-slate-700 pb-4 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                    <p className="text-gray-400">Update your personal information and account details</p>
                  </div>
                  <form onSubmit={handleProfileSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-3">
                          Username
                        </label>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          className="w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                          placeholder="Enter your username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                          placeholder="Enter your email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-700">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none flex items-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Update Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Account Stats Tab */}
              {activeTab === "stats" && (
                <div>
                  <div className="border-b border-slate-700 pb-4 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Account Statistics</h2>
                    <p className="text-gray-400">View your security issue reporting activity and account details</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 text-center border border-slate-600">
                      <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-3xl font-bold text-cyan-400 mb-2">{userStats.totalIssues}</div>
                      <div className="text-gray-300 text-sm">Total Issues Reported</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 text-center border border-slate-600">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-3xl font-bold text-green-400 mb-2">{userStats.resolvedIssues}</div>
                      <div className="text-gray-300 text-sm">Issues Resolved</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 text-center border border-slate-600">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="text-3xl font-bold text-yellow-400 mb-2">
                        {userStats.totalIssues > 0 ? Math.round((userStats.resolvedIssues / userStats.totalIssues) * 100) : 0}%
                      </div>
                      <div className="text-gray-300 text-sm">Resolution Rate</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Account Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400">Member Since:</span>
                          <span className="text-white font-medium">{new Date(userStats.joinedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400">Last Login:</span>
                          <span className="text-white font-medium">Today</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400">Account Status:</span>
                          <span className="text-green-400 font-medium flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}