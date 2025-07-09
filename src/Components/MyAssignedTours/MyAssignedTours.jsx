import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosecure from '../../hooks/useAxiosecure';

const MyAssignedTours = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosecure();
  const queryClient = useQueryClient();

  const { data: tours = [], isLoading, error } = useQuery({
    queryKey: ['assignedTours', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/api/bookings/assigned/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/api/bookings/status/${id}`, { status: newStatus });
      Swal.fire('Success', `Tour ${newStatus}`, 'success');
      queryClient.invalidateQueries(['assignedTours', user.email]);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const handleReject = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reject this tour?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(id, 'rejected');
      }
    });
  };

  if (isLoading) return <div>Loading assigned tours...</div>;
  if (error) return <div>Error loading tours: {error.message}</div>;
  if (tours.length === 0) return <div>No assigned tours found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">My Assigned Tours</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Package Name</th>
            <th className="border border-gray-300 p-2">Tourist Name</th>
            <th className="border border-gray-300 p-2">Tour Date</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour._id} className="text-center">
              <td className="border border-gray-300 p-2">{tour.packageName}</td>
              <td className="border border-gray-300 p-2">{tour.touristName}</td>
              <td className="border border-gray-300 p-2">
                {new Date(tour.date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2">${tour.price}</td>
              <td className="border border-gray-300 p-2 capitalize">{tour.status || 'pending'}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                <button
                  onClick={() => updateStatus(tour._id, 'accepted')}
                  disabled={
                    tour.status === 'pending' ||
                    tour.status === 'accepted' ||
                    tour.status === 'rejected'
                  }
                  className={`px-3 py-1 rounded text-white ${
                    tour.status === 'in-review'
                      ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  title={
                    tour.status === 'pending'
                      ? 'Accept disabled while pending'
                      : tour.status === 'accepted'
                      ? 'Already accepted'
                      : tour.status === 'rejected'
                      ? 'Tour rejected'
                      : ''
                  }
                >
                  Accept
                </button>

                {(tour.status === 'pending' || tour.status === 'in-review') && (
                 <button
  onClick={() => handleReject(tour._id)}
  disabled={tour.status === 'accepted' || tour.status === 'rejected'}
  className={`px-3 py-1 rounded text-white ${
    tour.status === 'pending' || tour.status === 'in-review'
      ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
      : 'bg-gray-400 cursor-not-allowed'
  }`}
  title={
    tour.status === 'accepted'
      ? 'Already accepted'
      : tour.status === 'rejected'
      ? 'Already rejected'
      : ''
  }
>
  Reject
</button>

                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAssignedTours;
