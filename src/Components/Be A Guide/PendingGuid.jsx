import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosecure from '../../hooks/useAxiosecure';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Loading from '../../ShearCom/Loading';

const PendingTourGuides = () => {
  const axiosSecure = useAxiosecure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useQuery({
    queryKey: ['pendingGuides', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tour-guides/pending?page=${page}&limit=${limit}`);
      return res.data;
    }
  });

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

  if (isLoading) return <Loading />;

  const { guides, totalPages } = data;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Pending Tour Guide Applications</h2>

      <table className="table w-full table-zebra">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Title</th>
            <th>Reason</th>
            <th>CV</th>
            <th>Submitted At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((guide, index) => (
            <tr key={guide._id}>
              <td>{(page - 1) * limit + index + 1}</td>
              <td>{guide.name}</td>
              <td>{guide.title}</td>
              <td className="max-w-50 truncate">{guide.reason}</td>
              <td>
                <a
                  href={guide.cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  ViewCV
                </a>
              </td>
              <td>{new Date(guide.createdAt).toLocaleString()}</td>
              <td className='font-bold text-red-700 italic'>{guide.status}</td>
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="btn btn-sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingTourGuides;
