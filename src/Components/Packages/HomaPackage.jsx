import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosecure from '../../hooks/useAxiosecure';
import Loading from '../../ShearCom/Loading';
import { Link } from 'react-router-dom';

const HomePackage = () => {
  const axiosSecure = useAxiosecure();

const { data: packages = [], isLoading } = useQuery({
  queryKey: ['randomPackages'],
  queryFn: async () => {
    const res = await axiosSecure.get('/api/packages/random');
     const allStories = res.data;
     return allStories.sort(() => 0.5 - Math.random()).slice(0, 4);
  },
  refetchOnWindowFocus: true,
  cacheTime: 0,
  staleTime: 0
});


  if (isLoading) return <Loading />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Tour Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            {pkg.images?.length > 0 && (
              <img
                src={pkg.images[0]}
                alt={pkg.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h3 className="text-xl font-semibold mb-1">{pkg.title}</h3>
            <p className="text-gray-500 text-sm mb-2">{pkg.location}</p>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Duration:</span> {pkg.days} days
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Price:</span> ${pkg.price}
            </p>

            {/* <p className="text-sm text-gray-600 mb-2">
              {pkg.description?.slice(0, 80)}...
            </p> */}

            <span className="inline-block  py-1 rounded-full text-xs mb-3">
              Difficulty: <span className=' bg-blue-100 text-blue-800  px-3 py-1 rounded-full'> {pkg.difficulty} </span>
            </span>

            {/* Buttons */}
            <div className="mt-auto flex justify-between gap-2">
              <Link
                to={`/dasboard/packageDetails/${pkg._id}`}
                className="btn btn-sm btn-outline btn-info w-1/2"
              >
                Details
              </Link>


            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePackage;
