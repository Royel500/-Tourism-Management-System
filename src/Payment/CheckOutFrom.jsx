import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import useAxiosecure from '../hooks/useAxiosecure';
import Loading from '../ShearCom/Loading';

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { bookingId } = useParams(); // Get bookingId from URL
  const axiosSecure = useAxiosecure();
  const { user } = useAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isPending, data: booking = {} } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/bookings/${bookingId}`);
      return res.data;
    },
  });

  const price = booking.price || 0;
  const amountInCents = Math.round(price * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setLoading(false);
      return;
    }

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
        billing_details: {
          name: user?.displayName || 'Anonymous',
          email: user?.email,
        },
      });
      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setLoading(false);
        return;
      }

      // Create payment intent
      const res = await axiosSecure.post('/create-payment-intent', {
        amountInCents,
        bookingId,
      });
      const clientSecret = res.data.clientSecret;

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || 'Anonymous',
            email: user?.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Save payment info to DB
        await axiosSecure.post('/payments', {
          bookingId,
          userEmail: user.email,
          amount: price,
          transactionId: result.paymentIntent.id,
          payment_status: 'paid',
          date: new Date(),
        });

        // Show success alert first
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: `Transaction ID: ${result.paymentIntent.id}`,
        });

        // Then update booking status, but don't block alert if fails
        try {
          await axiosSecure.patch(`/api/bookings/${bookingId}`, {
            payment_status: 'paid',
          });
          // console.log('Booking status updated successfully.');
        } catch (patchError) {
          console.warn('Failed to update booking status:', patchError);
          // Optionally, you can show a warning here or ignore
        }
      }
    } catch (err) {
      console.error('Unhandled error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <Loading></Loading>;
  }

  if (!booking || !booking._id) {
    return <div className="text-center text-red-500">Booking not found.</div>;
  }

  return (
    <div className="my-20 max-w-xl mx-auto">
      {booking.payment_status === 'paid' ? (
        <div className="text-green-600 text-center text-lg font-semibold">
          ✅ This booking is already paid.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Pay ${price} for: <br />
            <span className="text-blue-600">{booking.packageName}</span>
          </h2>
          <CardElement className="mb-4 border p-2 rounded" />
          <button
            disabled={!stripe || price === 0 || loading}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full px-4 py-2 rounded"
          >
            {loading ? 'Processing...' : `Pay $${price}`}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CheckOutForm;
