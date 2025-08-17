import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosecure from '../../hooks/useAxiosecure';
import Select from 'react-select';
import Loading from '../../ShearCom/Loading';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

// Roles for filter
const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'tourist', label: 'Tourist' },
  { value: 'guide', label: 'Guide' },
];

const usersPerPage = 10;

// Hook to track current logged-in user's activity
const useUserActivity = (email) => {

  const axioss = useAxios();
  useEffect(() => {
    if (!email) return;

    // Send heartbeat every 30 seconds
    const interval = setInterval(() => {
      axioss.post('/api/users/activity', { email, isActive: true });
    }, 30000);

    // On tab close or logout, mark offline
    const handleUnload = () => {
      navigator.sendBeacon(
        '/api/users/activity',
        JSON.stringify({ email, isActive: false })
      );
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [email]);
};

const ManageUsers = () => {
  const axiosSecure = useAxiosecure();
  const { user } = useAuth();

  // Track current user's activity globally
  useUserActivity(user?.email);

  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users with live updates every 10s
  const { data = {}, isLoading } = useQuery({
    queryKey: ['users', search, selectedRole.value, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/users?search=${search}&role=${selectedRole.value}&page=${currentPage}&limit=${usersPerPage}`
      );
      return res.data; // { users: [...], totalUsers: 100 }
    },
    refetchInterval: 10000, // refresh every 10s
  });

  const users = data.users || [];
  const totalUsers = data.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* Search & Role Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          className="input input-bordered w-full md:w-1/2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select
          options={roleOptions}
          defaultValue={roleOptions[0]}
          onChange={(option) => {
            setSelectedRole(option);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/2"
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last LogOut</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{(currentPage - 1) * usersPerPage + idx + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td className="text-green-700 font-bold italic">
                      {u.role || 'tourist'}
                    </td>
                    <td>
                      {u.lastLogout
                        ? new Date(u.lastLogout).toLocaleString()
                        : 'Never'}
                    </td>
                   <td>
                  <span className={`badge ${u.isActive ? 'badge-success' : 'badge-error'}`}>
                    {u.isActive ? 'Active' : 'Offline'}
                  </span>
                </td>
                          </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                className={`btn btn-sm ${
                  currentPage === page + 1 ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
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

export default ManageUsers;
