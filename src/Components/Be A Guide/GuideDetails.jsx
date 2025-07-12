import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosecure from '../../hooks/useAxiosecure';
import Loading from '../../ShearCom/Loading';

const GuideDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosecure();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axiosSecure.get(`/api/tour-guides/${id}`);
        setGuide(res.data);
      } catch (err) {
        console.error('Failed to fetch guide details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id, axiosSecure]);

  if (loading) return <Loading></Loading>;
  if (!guide) return <p className="text-center text-red-500">Guide not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={guide.photo}
            alt={guide.name}
            className="w-40 h-40 rounded-full object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold">{guide.name}</h2>
            <p className="text-gray-600 mt-2"><strong>Email:</strong> {guide.email}</p>
           
              <p className="text-gray-600"><strong>Experience:</strong> {guide.title} </p>
        
           
              <p className="text-gray-600"><strong>About Guide :</strong> {guide.reason}</p>
      
          </div>
        </div>

        {guide.bio && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">About</h3>
            <p className="text-gray-700">{guide.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideDetails;
