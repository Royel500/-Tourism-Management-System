import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosecure from '../hooks/useAxiosecure';
import useAuth from '../hooks/useAuth';

const PaymentHistory = () => {
  const axiosSecure = useAxiosecure();
  const { user } = useAuth(); // use user.email for filtering

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data;
    }
  });

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto my-16 p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-accent-blue">💳 Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-center text-gray-600">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
  <table className="table w-full">
    <thead>
      <tr className="bg-accent-blue ">
        <th>#</th>
        <th>Parcel ID</th>
        <th>Amount ($)</th>
        <th>Transaction ID</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td>{payment.parcelId}</td>
                  <td>${payment.amount}</td>
                  <td className="text-sm text-blue-600">{payment.transactionId}</td>
                  <td>
                    <span className={`badge ${payment.status === 'succeeded' ? 'badge-success' : 'badge-error'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
