import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosecure from '../../hooks/useAxiosecure';
import Select from 'react-select';
import Loading from '../../ShearCom/Loading';

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'tourist', label: 'Tourist' },
  { value: 'guide', label: 'Guide' },
];

const usersPerPage = 10;

const ManageUsers = () => {
  const axiosSecure = useAxiosecure();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data = {}, refetch, isLoading } = useQuery({
    queryKey: ['users', search, selectedRole.value, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/users?search=${search}&role=${selectedRole.value}&page=${currentPage}&limit=${usersPerPage}`
      );
      return res.data; // { users: [...], totalUsers: 100 }
    },
  });

  const users = data.users || [];
  const totalUsers = data.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

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
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id}>
                    <td>{(currentPage - 1) * usersPerPage + idx + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="text-green-700 font-bold italic">
                      {user.role || 'tourist'}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
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

            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                className={`btn btn-sm ${currentPage === page + 1 ? 'btn-primary' : 'btn-outline'}`}
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
