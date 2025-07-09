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

  useEffect(() => {
    // ✅ Fetch accepted tour guides
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

    const bookingData = {
      packageName: pkg?.title || "N/A",
      touristName: user?.displayName || "N/A",
      touristEmail: user?.email,
      touristImage: user?.photoURL,
      price: pkg?.price,
      date: tourDate,
      guideName: guide,
      status: "pending",
      payment_status:'unpaid',
      createdAt: new Date()
    };

    try {
      const res = await axiosSecure.post('/api/bookings', bookingData);
      if (res.data.insertedId) {
        Swal.fire({
          title: "✅ Confirm your Booking",
          text: "Your booking has been submitted successfully!",
          icon: "success",
          confirmButtonText: "Go to My Bookings"
        }).then(() => {
          navigate('/dasboard/myBookings');
        });
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

     <div className='flex'>
      <div>
        <label className="label">Tourist Name</label>
        <input type="text" value={user?.displayName || ''} disabled className="input input-bordered w-full" />
      </div>
  <div>
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
            <option key={g._id} value={g.name}>{g.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full">Book Now</button>
    </form>
  );
};

export default BookNowForm;
