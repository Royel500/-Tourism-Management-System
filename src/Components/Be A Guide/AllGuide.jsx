import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosecure from '../../hooks/useAxiosecure';

const AllGuides = () => {
  const [guides, setGuides] = useState([]);
  const axiosSecure = useAxiosecure();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await axiosSecure.get('/api/tour-guides/accepted');
        const all = res.data;

        // Shuffle and select 6 random guides
        const shuffled = all.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        setGuides(selected);
      } catch (err) {
        console.error('Error fetching guides:', err);
      }
    };

    fetchGuides();
  }, [axiosSecure]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Tour Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <div
            key={guide._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center"
          >
            <img
              src={guide.photo}
              alt={guide.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">{guide.name}</h3>
            <p className="text-gray-500">{guide.email}</p>
            <Link
              to={`/details/${guide._id}`}
              className="btn btn-outline btn-sm btn-primary mt-3"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllGuides;
