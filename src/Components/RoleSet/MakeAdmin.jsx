import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';

const ITEMS_PER_PAGE = 10;

const MakeAdmin = () => {
  const axiosSecure = useAxiosecure();
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredUser, setFilteredUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page = 1) => {
    try {
      const res = await axiosSecure.get(`/api/users?page=${page}&limit=${ITEMS_PER_PAGE}`);
      setUsers(res.data.users || []);
      setTotalUsers(res.data.totalUsers || 0);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch users.', 'error');
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [axiosSecure, currentPage]);

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
          fetchUsers(currentPage); // Refresh list
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

  const renderUserRow = (user, index) => (
    <tr key={user._id || index}>
      <td className="p-2">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
      <td className="p-2">{user.name}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2 capitalize">{user.role}</td>

<td className="p-2">
  {user.lastLogout
    ? new Date(user.lastLogout).toLocaleDateString()
    : new Date(user.createdAt).toLocaleDateString()}
</td>

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

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage User Roles</h2>

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

      {/* Filtered User */}
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
            <tbody>{renderUserRow(filteredUser, 0)}</tbody>
          </table>
        </div>
      ) : (
        <>
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
              <tbody>{users.map((user, idx) => renderUserRow(user, idx))}</tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages).keys()].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MakeAdmin;