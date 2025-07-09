import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosecure from '../../hooks/useAxiosecure';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/bookings?email=${user?.email}`);
      return res.data;
    },
  });

  // Delete booking mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/bookings/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('Deleted!', 'Your booking has been removed.', 'success');
      queryClient.invalidateQueries(['my-bookings']);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete your booking.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handlePayment = (booking) => {
    if (booking.payment_status === 'paid') {
      Swal.fire({
        icon: 'info',
        title: 'Already Paid',
        text: 'You have already completed the payment for this booking.',
      });
    } else {
      navigate(`/dasboard/payment/${booking._id}`);
    }
  };

  if (isLoading) return <div className="text-center my-10">Loading...</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">My Bookings</h2>
      <table className="table w-full border rounded">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th>#</th>
            <th>Package</th>
            <th>Date</th>
            <th>Price</th>
            <th>Guide</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking._id} className="text-center">
              <td>{index + 1}</td>
              <td>{booking.packageName}</td>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>${booking.price}</td>
              <td>{booking.guideName || 'N/A'}</td>
              <td>
                <span className={`badge ${booking.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                  {booking.status}
                </span>
              </td>
              <td>
                <span className={`badge ${booking.payment_status === 'unpaid' ? 'badge-error' : 'badge-success'}`}>
                  {booking.payment_status}
                </span>
              </td>
              <td className="space-x-2">
                <button
                  onClick={() => handlePayment(booking)}
                  className="btn btn-sm btn-success"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;
