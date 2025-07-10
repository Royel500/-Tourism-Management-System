import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';

const MakeAdmin = () => {
  const axiosSecure = useAxiosecure();
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredUser, setFilteredUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get('/api/users');
        setUsers(res.data || []);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to fetch users.', 'error');
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  // Handle user search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      if (res.data.success) {
        setFilteredUser(res.data.user);
      } else {
        setFilteredUser(null);
        Swal.fire('Not Found', res.data.message, 'info');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to search user.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle role change with confirmation
  const handleRoleChange = async (email, newRole) => {
    const confirmText = newRole === 'admin' ? 'Make this user an admin?' : 'Remove admin role?';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm!',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch('/users/role', { email, role: newRole });

        if (res.data.success) {
          Swal.fire('Success', res.data.message, 'success');
          setUsers(prev => prev.map(user => user.email === email ? { ...user, role: newRole } : user));
          if (filteredUser?.email === email) {
            setFilteredUser({ ...filteredUser, role: newRole });
          }
        } else {
          Swal.fire('Error', res.data.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to update role.', 'error');
      }
    }
  };

  // Display user table rows
  const renderUserRow = (user, index) => (
    <tr key={user._id || index}>
      <td className="p-2">{index + 1}</td>
      <td className="p-2">{user.name}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2 capitalize">{user.role}</td>
      <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
      <td className="p-2 space-x-2">
        {user.role !== 'admin' ? (
          <button
            onClick={() => handleRoleChange(user.email, 'admin')}
            className="btn btn-success btn-xs"
          >
            Make Admin
          </button>
        ) : (
          <button
            onClick={() => handleRoleChange(user.email, 'user')}
            className="btn btn-warning btn-xs"
          >
            Remove Admin
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage User Roles</h2>

      {/* Search input */}
      <div className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading || !searchEmail}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Show filtered user if searched */}
      {filteredUser ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="table w-full text-sm">
            <thead className="bg-base-200">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {renderUserRow(filteredUser, 0)}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Show all users */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="table w-full text-sm">
              <thead className="bg-base-200">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Created At</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => renderUserRow(user, idx))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MakeAdmin;
