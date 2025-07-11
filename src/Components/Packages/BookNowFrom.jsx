import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import useAxiosecure from '../../hooks/useAxiosecure';
import useAuth from '../../hooks/useAuth';

const BookNowForm = () => {
  const location = useLocation();
  const pkg = location.state?.pkg;

  const { user } = useAuth();
  const axiosSecure = useAxiosecure();
  const navigate = useNavigate();

  const [guides, setGuides] = useState([]);
  const [tourDate, setTourDate] = useState(null);
  const [guide, setGuide] = useState('');
  const selectedGuide = guides.find(gg => gg.name === guide);

  useEffect(() => {
    axiosSecure.get('/api/tour-guides/accepted').then(res => {
      setGuides(res.data);
    });
  }, [axiosSecure]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!tourDate || !guide) {
      Swal.fire("Warning", "Please select tour date and guide", "warning");
      return;
    }

    // ✅ Get existing bookings for this user
    let userBookings = [];
    try {
      const res = await axiosSecure.get(`/api/bookings/by-email/${user.email}`);
      userBookings = res.data || [];
    } catch (err) {
      console.error("Error fetching existing bookings", err);
    }

    const bookingData = {
      packageName: pkg?.title || "N/A",
      touristName: user?.displayName || "N/A",
      touristEmail: user?.email,
      touristImage: user?.photoURL,
      price: pkg?.price,
      date: tourDate,
      guideName: guide,
      guideEmail: selectedGuide?.email || '',
      payment_status: 'unpaid',
      status: 'pending',
      createdAt: new Date()
    };

    try {
      const res = await axiosSecure.post('/api/bookings', bookingData);
      if (res.data.insertedId) {
        const newTotal = userBookings.length + 1;

        if (newTotal === 3) {
          Swal.fire({
            title: "🎉 Congratulations!",
            text: "You've booked 3 packages! Thanks for being an awesome traveler!",
            icon: "success",
            confirmButtonText: "Go to My Bookings"
          }).then(() => {
            navigate('/dasboard/myBookings');
          });
        } else {
          Swal.fire({
            title: "✅ Confirm your Booking",
            text: "Your booking has been submitted successfully!",
            icon: "success",
            confirmButtonText: "Go to My Bookings"
          }).then(() => {
            navigate('/dasboard/myBookings');
          });
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Booking failed", "error");
    }
  };

  return (
    <form onSubmit={handleBooking} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-center">Book Now</h2>

      <div>
        <label className="label">Package Name</label>
        <input type="text" value={pkg?.title || ''} disabled className="input input-bordered w-full" />
      </div>

      <div className='flex gap-2'>
        <div className='w-1/2'>
          <label className="label">Tourist Name</label>
          <input type="text" value={user?.displayName || ''} disabled className="input input-bordered w-full" />
        </div>
        <div className='w-1/2'>
          <label className="label">Price</label>
          <input type="text" value={pkg?.price || ''} disabled className="input input-bordered w-full" />
        </div>
      </div>

      <div>
        <label className="label">Tourist Email</label>
        <input type="email" value={user?.email || ''} disabled className="input input-bordered w-full" />
      </div>

      <div>
        <label className="label">Tourist Image URL</label>
        <input type="text" value={user?.photoURL || ''} disabled className="input input-bordered w-full" />
      </div>

      <div>
        <label className="label">Select Tour Date</label>
        <DatePicker
          selected={tourDate}
          onChange={(date) => setTourDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          className="input input-bordered w-full"
          placeholderText="Pick a date"
        />
      </div>

      <div>
        <label className="label">Tour Guide</label>
        <select
          className="select select-bordered w-full"
          value={guide}
          onChange={(e) => setGuide(e.target.value)}
        >
          <option value="">-- Select a Guide --</option>
          {guides.map((g) => (
            <option key={g._id} value={g.name}>
              {g.name || g.email}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full">Book Now</button>
    </form>
  );
};

export default BookNowForm;
