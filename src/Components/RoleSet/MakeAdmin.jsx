import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';

const MakeAdmin = () => {
  const axiosSecure = useAxiosecure();
  const [searchEmail, setSearchEmail] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
        Swal.fire('Not Found', res.data.message, 'info');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch user.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      const res = await axiosSecure.patch('/users/role', {
        email: user.email,
        role: newRole,
      });

      if (res.data.success) {
        Swal.fire('Success', res.data.message, 'success');
        setUser(prev => ({ ...prev, role: newRole }));
      } else {
        Swal.fire('Error', res.data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update role.', 'error');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Make / Remove Admin</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="Enter user email"
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

      {user && (
        <div className="border p-4 rounded-lg bg-base-200">
          <p><strong>Name:</strong> {user.name || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

          <div className="mt-4 space-x-2">
            {user.role !== 'admin' ? (
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleRoleChange('admin')}
              >
                Make Admin
              </button>
            ) : (
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleRoleChange('user')}
              >
                Remove Admin
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
