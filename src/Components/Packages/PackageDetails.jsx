import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosecure from '../../hooks/useAxiosecure';

const PackageDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosecure();

  const { data: pkg = {}, isLoading, isError } = useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/packages/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <p className="text-center">Loading package details...</p>;
  if (isError || !pkg?._id) return <p className="text-center text-red-500">Failed to load package details.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-4">{pkg.title}</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {pkg.images?.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`Package Image ${index + 1}`}
            className="w-full h-48 object-cover rounded shadow"
          />
        ))}
      </div>
      <p className="text-gray-600 mb-2"><strong>Location:</strong> {pkg.location}</p>
   <div className='flex gap-5'>

  
      <p className="text-gray-600 mb-2"><strong>Duration:</strong> {pkg.days} days</p>
      <p className="text-gray-600 mb-2"><strong>Price:</strong> ${pkg.price}</p>
 </div>
      <p className="text-gray-600 mb-2"><strong>Difficulty:</strong> {pkg.difficulty}</p>

      <div className="mt-4">
        <h4 className="text-xl font-semibold mb-2">Description</h4>
        <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
      </div>

             <NavLink
  to={`/dasboard/book/${pkg._id}`}
  state={{ pkg }}
  className="w-1/2"
>
  <button className="btn btn-sm btn-primary w-full">Book Now</button>
</NavLink>
    </div>
  );
};

export default PackageDetails;
