import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosecure from '../../hooks/useAxiosecure';
import Select from 'react-select';

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'tourist', label: 'Tourist' },
  { value: 'guide', label: 'Guide' },
];


const ManageUsers = () => {
  const axiosSecure = useAxiosecure();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ['users', search, selectedRole.value],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/users?search=${search}&role=${selectedRole.value}`
      );
      return res.data;
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          className="input input-bordered w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          options={roleOptions}
          defaultValue={roleOptions[0]}
          onChange={(option) => setSelectedRole(option)}
          className="w-full md:w-1/2"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Create at</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id}>
                  <td>{idx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.createdAt}</td>

                  <td className='text-green-700 font-bold italic'>{user.role || 'user'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
