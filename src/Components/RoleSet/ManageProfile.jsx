import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';
import useAuth from '../../hooks/useAuth';

const ManageProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosecure();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Load admin stats
  const { data: stats = {} } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [payments, guides, packages, clients, stories,data] = await Promise.all([
        axiosSecure.get('/api/payments/total'),
        axiosSecure.get('/api/users/count?role=guide'),
        axiosSecure.get('/api/packages/count'),
        axiosSecure.get('/api/users/count?role=user'),
        axiosSecure.get('/api/stories/count'),
      
      ]);
      return {
        totalPayment: payments.data.total || 0,
        totalGuides: guides.data.count,
        totalPackages: packages.data.count,
        totalClients: clients.data.count,
        totalStories: stories.data.count,

      };
    },
  });

  // Update profile mutation
  const { register, handleSubmit, reset } = useForm();

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      return await axiosSecure.patch(`/api/users/${user.email}`, formData);
    },
    onSuccess: () => {
      Swal.fire('Success!', 'Profile updated.', 'success');
      queryClient.invalidateQueries(['admin-stats']);
      setIsOpen(false);
    },
  });

  const onSubmit = (data) => {
    const updateData = {
      name: data.name,
      photo: data.photo,
    };
    updateMutation.mutate(updateData);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Welcome,<span className='text-pink-700 font-bold italic'> {user?.displayName || 'Admin'}!</span></h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded text-center">
          <h3 className="text-lg font-semibold">Payment</h3>
          <p>${stats.totalPayment || 0}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded text-center">
          <h3 className="text-lg font-semibold">Tour Guides</h3>
          <p>{stats.totalGuides}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded text-center">
          <h3 className="text-lg font-semibold">Packages</h3>
          <p>{stats.totalPackages}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded text-center">
          <h3 className="text-lg font-semibold">Clients</h3>
          <p>{stats.totalClients}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded text-center">
          <h3 className="text-lg font-semibold">Stories</h3>
          <p>{stats.totalStories}</p>
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-white rounded shadow p-6 text-center">
        <img src={user?.photoURL} alt="Admin" className="w-24 h-24 mx-auto rounded-full mb-4" />
        <h3 className="text-xl font-bold">{user?.displayName}</h3>
        <p className="text-gray-500">{user?.email}</p>
        <p className="text-sm my-2 font-bold bg-blue-400 inline-block px-3 py-1  rounded-full">{user?.role || 'Admin'}</p>
        <button onClick={() => {
          setIsOpen(true);
          reset({ name: user.displayName, photo: user.photoURL });
        }} className="btn btn-outline btn-sm mx-2">Edit</button>
      </div>

      {/* Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button className="absolute top-2 right-3 text-xl" onClick={() => setIsOpen(false)}>✕</button>
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label>Name</label>
                <input {...register('name', { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label>Photo URL</label>
                <input {...register('photo', { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label>Email</label>
                <input disabled value={user.email} className="input input-bordered w-full bg-gray-100" />
              </div>
              <div>
                <label>Role</label>
                <input disabled value={user.role || 'admin'} className="input input-bordered w-full bg-gray-100" />
              </div>
              <button type="submit" className="btn btn-primary w-full">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProfile;
