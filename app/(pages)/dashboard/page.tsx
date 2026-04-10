"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/app/components/logout-button";
import { getMe } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          router.push("/auth/login");
          return;
        }

        // Fetch current user from API
        const response = await getMe();
        setUser(response.user);
      } catch (err: any) {
        console.error("Auth check error:", err);
        localStorage.removeItem("auth_token");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user.email;

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      user: "Customer",
      studio_owner: "Studio Owner",
      admin: "Administrator"
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back, {displayName}!</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="text-lg font-semibold text-slate-900">
                  {displayName}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="text-lg font-semibold text-slate-900">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Account Type</p>
                <p className="text-lg font-semibold text-blue-600">
                  {getRoleDisplay(user.role)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email Verified</p>
                <p
                  className={`text-lg font-semibold ${user.is_email_verified ? "text-green-600" : "text-red-600"}`}
                >
                  {user.is_email_verified ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-slate-600">Active Bookings</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Account Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Update Profile
              </button>
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors">
                Change Password
              </button>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors">
                Account Settings
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Message based on Role */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Getting Started
          </h2>
          {user.role === "user" && (
            <p className="text-slate-600">
              You can now browse available studios and make bookings. Use the
              navigation menu to find studios near you.
            </p>
          )}
          {user.role === "studio_owner" && (
            <p className="text-slate-600">
              Welcome to your studio dashboard! You can manage your studio
              profile, view bookings, and update your availability.
            </p>
          )}
          {user.role === "admin" && (
            <p className="text-slate-600">
              As an administrator, you have access to manage users, studios,
              bookings, and system settings.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
