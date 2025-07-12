import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosecure from '../hooks/useAxiosecure';
import Loading from '../ShearCom/Loading';

const AdminPaymentHistory = () => {
  const axiosSecure = useAxiosecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/paymentsall`);
      return res.data;
    }
  });

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  // Slice data for current page
  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto my-16 p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-accent-blue">💳 Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-center text-gray-600">No payments found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-accent-blue">
                  <th>#</th>
                  <th>Package ID</th>
                  <th>Amount ($)</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment, index) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="max-w-[160px] overflow-x-auto whitespace-nowrap">
                      <div className="w-[160px] overflow-x-auto">{payment.bookingId}</div>
                    </td>
                    <td>${payment.amount}</td>
                    <td className="max-w-[160px] overflow-x-auto whitespace-nowrap">
                      <div className="w-[160px] overflow-x-auto">{payment.transactionId}</div>
                    </td>
                    <td>
                      <span className="badge badge-success">{payment.payment_status}</span>
                    </td>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPaymentHistory;
