import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { FiUser, FiMail, FiSettings } from "react-icons/fi";

export default function UserAccountPage() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-blue-600" /> Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Full Name</p>
              <p className="text-lg font-medium text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email Address</p>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiSettings className="text-blue-600" /> Account Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placeholder setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Name (Coming Soon)
              </label>
              <input
                disabled
                type="text"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200 disabled:opacity-50"
                placeholder={user.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Email (Coming Soon)
              </label>
              <input
                disabled
                type="email"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200 disabled:opacity-50"
                placeholder={user.email}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
