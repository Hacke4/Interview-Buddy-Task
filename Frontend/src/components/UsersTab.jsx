// src/components/UsersTab.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function UsersTab({ organizationId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    role: "Coordinator",
    phone_number: "",
  });
  const [editUser, setEditUser] = useState(null);

  // Fetch users for this organization
  useEffect(() => {
    fetchUsers();
  }, [organizationId]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(
        `/users/organization/${organizationId}`
      );
      console.log("Fetched users:", res.data);

      // ✅ Always convert to array
      const data = Array.isArray(res.data) ? res.data : res.data?.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await axiosInstance.post("/users", {
        ...newUser,
        organization_id: organizationId,
      });

      Swal.fire({
        icon: "success",
        title: "User Added!",
        text: "The user has been successfully added.",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchUsers(); // Refresh user list
      setShowModal(false);
      setNewUser({
        full_name: "",
        email: "",
        role: "Coordinator",
        phone_number: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to add user",
      });
    }
  };

  const handleEditUser = async () => {
    try {
      await axiosInstance.put(`/users/${editUser.id}`, {
        ...newUser,
        organization_id: organizationId,
      });

      Swal.fire({
        icon: "success",
        title: "User Updated!",
        text: "The user has been successfully updated.",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchUsers(); // Refresh user list
      setShowModal(false);
      setEditUser(null);
      setNewUser({
        full_name: "",
        email: "",
        role: "Coordinator",
        phone_number: "",
      });
    } catch (err) {
      console.error("Error updating user:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update user",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/users/${userId}`);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchUsers(); // Refresh user list
      } catch (err) {
        console.error("Error deleting user:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete user",
        });
      }
    }
  };

  const openAddModal = () => {
    setEditUser(null);
    setNewUser({
      full_name: "",
      email: "",
      role: "Coordinator",
      phone_number: "",
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setNewUser({
      full_name: user.full_name || "",
      email: user.email || "",
      role: user.role || "Coordinator",
      phone_number: user.phone_number || "",
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editUser) {
      handleEditUser();
    } else {
      handleAddUser();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No users found. Add your first user!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Sr No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-y-gray-200">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {user.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {user.phone_number || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role || "Coordinator"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition"
                        title="Edit User"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editUser ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, full_name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone_number}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone_number: e.target.value })
                    }
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Coordinator">Coordinator</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditUser(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {editUser ? "Update User" : "Add User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
