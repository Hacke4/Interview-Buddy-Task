import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import UsersTab from "../components/UsersTab";
import { Pencil } from "lucide-react";

export default function OrganizationDetails() {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const res = await axiosInstance.get(`/organizations/${id}`);
      setOrganization(res.data);
      setFormData(res.data);
      if (res.data.logo_url) {
        setLogoPreview(`http://localhost:5000${res.data.logo_url}`);
      }
    } catch (err) {
      console.error("Error fetching organization:", err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.patch(`/organizations/${id}/status`, {
        status: newStatus,
      });
      setOrganization({ ...organization, status: newStatus });
      setShowStatusDropdown(false);
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      case "Blocked":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately from local file
    setLogoPreview(URL.createObjectURL(file));

    // Auto-upload the logo
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("logo", file);

    try {
      const res = await axiosInstance.post(
        `/organizations/${id}/logo`,
        formDataUpload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ UPDATE: Use the ImgBB URL directly from response
      if (res.data.logo_url) {
        setOrganization((prev) => ({
          ...prev,
          logo_url: res.data.logo_url, // This is now ImgBB URL
        }));
        setLogoPreview(res.data.logo_url); // Set preview to ImgBB URL
      }

      alert("Logo uploaded successfully!");
    } catch (err) {
      console.error("Logo upload error:", err);
      alert("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put(`/organizations/${id}`, formData);
      setOrganization(res.data);
      setEditMode(false);
      alert("Organization updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update organization");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(organization);
    setEditMode(false);
    if (organization.logo_url) {
      setLogoPreview(`http://localhost:5000${organization.logo_url}`);
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">›</span>
          <Link to="/organizations" className="hover:text-blue-600">
            Manage B2B organizations
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Organization details</span>
        </div>
      </div>

      {/* Organization Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Logo with hover edit overlay */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0 group cursor-pointer">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt={organization.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-amber-600 text-2xl font-bold">
                {organization.name?.charAt(0) || "O"}
              </div>
            )}

            {/* Hover overlay with edit icon */}
            <label
              htmlFor="logo-upload-header"
              className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-white text-xs font-medium">Edit</span>
            </label>

            {/* Hidden file input */}
            <input
              id="logo-upload-header"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />

            {/* Upload indicator */}
            {uploading && (
              <div className="absolute inset-0 bg-blue-600 bg-opacity-75 flex items-center justify-center">
                <div className="text-white text-xs font-medium">
                  Uploading...
                </div>
              </div>
            )}
          </div>

          {/* Organization Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {organization.name}
            </h1>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>{organization.org_email || "No email"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>{organization.phone_primary || "No phone"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌍</span>
                <span>{organization.region || "No region"}</span>
              </div>
            </div>
          </div>

          {/* Status Badge and Dropdown */}
          <div className="flex items-center gap-2 relative">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                organization.status
              )}`}
            >
              {organization.status}
            </span>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Change status
            </button>

            {/* Status Dropdown */}
            {showStatusDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                <button
                  onClick={() => handleStatusChange("Active")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </button>
                <button
                  onClick={() => handleStatusChange("Inactive")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Inactive
                </button>
                <button
                  onClick={() => handleStatusChange("Blocked")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  Blocked
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-3 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Basic details
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-3 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "details" ? (
            <div>
              {/* Profile Header with Edit Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {/* Organization details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Organization details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Organization name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter organization name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Organization SLUG
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter slug"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Contact details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Primary Admin: Name
                      </label>
                      <input
                        type="text"
                        name="primary_admin_name"
                        value={formData.primary_admin_name || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter admin name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Primary Admin: Mail-Id
                      </label>
                      <input
                        type="email"
                        name="primary_admin_email"
                        value={formData.primary_admin_email || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="admin@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Support Email ID
                      </label>
                      <input
                        type="email"
                        name="support_email"
                        value={formData.support_email || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="support@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      />
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Phone no
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value="+91"
                          disabled
                          className="w-16 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                        <input
                          type="tel"
                          name="phone_primary"
                          value={formData.phone_primary || ""}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="789541596"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Alternative phone no
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value="+91"
                          disabled
                          className="w-16 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                        <input
                          type="tel"
                          name="phone_alt1"
                          value={formData.phone_alt1 || ""}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="9347329413"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maximum Allowed Coordinators */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Maximum Allowed Coordinators
                  </h3>
                  <div className="max-w-md">
                    <label className="block text-xs text-gray-600 mb-1">
                      Max active Coordinators allowed
                    </label>
                    <select
                      name="max_coordinators"
                      value={formData.max_coordinators || 0}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    >
                      <option value="0">Upto 0 Coordinators</option>
                      <option value="5">Upto 5 Coordinators</option>
                      <option value="10">Upto 10 Coordinators</option>
                      <option value="20">Upto 20 Coordinators</option>
                      <option value="50">Upto 50 Coordinators</option>
                    </select>
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Timezone
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Common timezones
                      </label>
                      <select
                        name="timezone"
                        value={formData.timezone || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      >
                        <option value="">Select timezone</option>
                        <option value="India Standard Time">
                          India Standard Time
                        </option>
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Standard Time</option>
                        <option value="PST">Pacific Standard Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Region
                      </label>
                      <select
                        name="region"
                        value={formData.region || ""}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      >
                        <option value="">Select region</option>
                        <option value="Asia/Colombo">Asia/Colombo</option>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="America/New_York">
                          America/New_York
                        </option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Language
                  </h3>
                  <div className="max-w-md">
                    <label className="block text-xs text-gray-600 mb-1">
                      Choose the language for organization
                    </label>
                    <select
                      name="language"
                      value={formData.language || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    >
                      <option value="">Select language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                </div>

                {/* Official website URL */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Official website URL
                  </h3>
                  <div className="max-w-2xl">
                    <label className="block text-xs text-gray-600 mb-1">
                      website URL
                    </label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url || ""}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <UsersTab organizationId={id} />
          )}
        </div>
      </div>
    </div>
  );
}
