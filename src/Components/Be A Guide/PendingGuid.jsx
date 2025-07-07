import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosecure from '../../hooks/useAxiosecure';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PendingTourGuides = () => {
  const axiosSecure = useAxiosecure();
  const queryClient = useQueryClient();

  // Fetch pending applications
  const { data: pendingGuides = [], isLoading } = useQuery({
    queryKey: ['pendingGuides'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/tour-guides/pending');
      return res.data;
    }
  });

  // Accept/Reject mutation
  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/api/tour-guides/status/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('Success!', 'Application status updated', 'success');
      queryClient.invalidateQueries(['pendingGuides']);
    },
    onError: () => {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  });

  const handleStatusChange = (id, status) => {
    Swal.fire({
      title: `Are you sure to ${status} this application?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, status });
      }
    });
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Pending Tour Guide Applications</h2>
      <table className="table w-full table-zebra">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Reason</th>
            <th>CV</th>
            <th>Submitted At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingGuides.map((guide, index) => (
            <tr key={guide._id}>
              <td>{index + 1}</td>
              <td>{guide.title}</td>
              <td className="max-w-xs truncate">{guide.reason}</td>
              <td>
                <a
                  href={guide.cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View CV
                </a>
              </td>
              <td>{new Date(guide.createdAt).toLocaleString()}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(guide._id, 'accepted')}
                  className="text-green-600 text-xl hover:scale-110"
                  title="Accept"
                >
                  <FaCheckCircle />
                </button>
                <button
                  onClick={() => handleStatusChange(guide._id, 'rejected')}
                  className="text-red-600 text-xl hover:scale-110"
                  title="Reject"
                >
                  <FaTimesCircle />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingTourGuides;
