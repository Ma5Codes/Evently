import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import Loader from '../components/Loader';
import Input from '../components/Input';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiUser, FiMail, FiSettings } from "react-icons/fi";

export default function UserAccountPage() {
  const { user, setUser, loading: userLoading } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (userLoading || loading) return <Loader count={1} />;
  if (!user) {
    return <Navigate to={"/login"} />;
  }

  const handleEdit = () => {
    setEditMode(true);
    setForm({ name: user.name, email: user.email });
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.put('/profile', form);
      setUser(data);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-blue-600" /> Profile Information
          </h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {editMode ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="submit" className="primary px-4 py-2 rounded" disabled={loading}>
                  {loading ? <Loader small /> : 'Save'}
                </button>
                <button type="button" className="secondary px-4 py-2 rounded" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email Address</p>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button className="primary px-4 py-2 rounded" onClick={handleEdit}>
                  Edit
                </button>
              </div>
            </div>
          )}
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
