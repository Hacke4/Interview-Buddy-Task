import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function AddOrganizationModal({ onClose, onOrgAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    org_email: "",
    phone_primary: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axiosInstance.post("/organizations", formData);
      onOrgAdded(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Organization
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Name of the organization */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Name of the organization
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Type here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="Type here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Organization mail */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Organization mail
              </label>
              <input
                type="email"
                name="org_email"
                value={formData.org_email}
                onChange={handleChange}
                required
                placeholder="Type here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Contact
              </label>
              <input
                type="tel"
                name="phone_primary"
                value={formData.phone_primary}
                onChange={handleChange}
                required
                placeholder="Type here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrganizationModal;
