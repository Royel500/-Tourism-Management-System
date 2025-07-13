import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosecure from '../../hooks/useAxiosecure';
import Loading from '../../ShearCom/Loading';
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaMountain, FaStar, FaArrowLeft } from 'react-icons/fa';
import {  FaUtensils, FaBed, FaRoute, FaClock } from 'react-icons/fa';
import AllGuides from '../Be A Guide/AllGuide';

const PackageDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosecure();
  const [activeDay, setActiveDay] = useState(0);
  const { data: pkg = {}, isLoading, isError } = useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/packages/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
  const itinerary = [
    {
      day: 1,
      title: "Arrival in Kathmandu",
      description: "Welcome to Nepal! Airport pickup and transfer to hotel. Enjoy a welcome dinner with traditional Nepali cuisine.",
      activities: ["Airport pickup", "Hotel transfer", "Welcome dinner"],
      meals: "Dinner",
      accommodation: "4-star hotel",
      travel: "30 min drive",
      duration: "1-2 hours"
    },
    {
      day: 2,
      title: "Kathmandu City Tour",
      description: "Explore UNESCO World Heritage Sites including Swayambhunath, Pashupatinath, Boudhanath, and Patan Durbar Square.",
      activities: ["Swayambhunath Stupa", "Pashupatinath Temple", "Boudhanath Stupa", "Patan Durbar Square"],
      meals: "Breakfast, Lunch",
      accommodation: "4-star hotel",
      travel: "City transport",
      duration: "6-7 hours"
    },
    {
      day: 3,
      title: "Fly to Pokhara & Sightseeing",
      description: "Scenic flight to Pokhara. Visit Davis Falls, Gupteshwor Cave, and enjoy a boat ride on Phewa Lake.",
      activities: ["Scenic mountain flight", "Davis Falls & Cave", "Phewa Lake boating"],
      meals: "Breakfast, Lunch",
      accommodation: "3-star hotel",
      travel: "25 min flight + 1 hr drive",
      duration: "5-6 hours"
    },
    {
      day: 4,
      title: "Sarangkot Sunrise & Trek",
      description: "Sunrise views over Himalayas. Trek to Australian Camp through villages and forests.",
      activities: ["Sarangkot sunrise", "Trek to Australian Camp", "Village exploration"],
      meals: "Breakfast, Lunch, Dinner",
      accommodation: "Teahouse lodge",
      travel: "1 hr drive + 4 hr trek",
      duration: "6-7 hours"
    },
    {
      day: 5,
      title: "Trek to Dhampus & Return",
      description: "Morning mountain views. Trek downhill to Dhampus village. Drive back to Pokhara.",
      activities: ["Morning photography", "Trek to Dhampus", "Community interaction"],
      meals: "Breakfast, Lunch",
      accommodation: "3-star hotel",
      travel: "3 hr trek + 1.5 hr drive",
      duration: "5-6 hours"
    }
  ];

  if (isLoading) return <Loading></Loading>;
  if (isError || !pkg?._id) return <p className="text-center text-red-500 py-12">Failed to load package details.</p>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Navigation */}
      <NavLink to="/packages" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
        <FaArrowLeft /> Back to Packages
      </NavLink>
      
      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header with title */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{pkg.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <FaStar className="text-yellow-300" />
            <span>Popular Package</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {pkg.images?.map((imgUrl, index) => (
            <div key={index} className="relative overflow-hidden rounded-xl aspect-video">
              <img
                src={imgUrl}
                alt={`Package Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <span className="font-medium">Featured Image</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-t border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaMapMarkerAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Location</p>
              <p className="font-medium">{pkg.location}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-cyan-100 p-3 rounded-full">
              <FaCalendarAlt className="text-cyan-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Duration</p>
              <p className="font-medium">{pkg.days} days</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaDollarSign className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Price</p>
              <p className="font-medium">${pkg.price}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <FaMountain className="text-orange-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Difficulty</p>
              <p className="font-medium capitalize">{pkg.difficulty}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Package Overview</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{pkg.description}</p>
        </div>

        {/* Booking Section */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="text-xl font-semibold">Ready for Adventure?</h4>
              <p className="text-gray-600">Secure your spot on this amazing journey</p>
            </div>
            <NavLink
              to={`/dasboard/book/${pkg._id}`}
              state={{ pkg }}
              className="w-full md:w-auto"
            >
              <button className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg font-bold transform transition hover:scale-105">
                Book Now
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      <div>
        <AllGuides></AllGuides>
      </div>
<div>
    <section className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Tour Itinerary</h2>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-3">Detailed day-by-day plan of your adventure</p>
      </div>

      {/* Day Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
        {itinerary.map((day, index) => (
          <button
            key={index}
            onClick={() => setActiveDay(index)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${
              activeDay === index
                ? "bg-blue-500 text-white font-medium"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      {/* Active Day Details */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Day {itinerary[activeDay].day}: {itinerary[activeDay].title}
          </h3>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {itinerary[activeDay].duration}
          </span>
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          {itinerary[activeDay].description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activities */}
          <div>
            <h4 className="font-bold text-gray-700 mb-3 flex items-center">
              <FaMountain className="text-green-500 mr-2" />
              Activities
            </h4>
            <ul className="space-y-2">
              {itinerary[activeDay].activities.map((activity, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Trip Details */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaUtensils className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Meals Included</p>
                <p className="font-medium">{itinerary[activeDay].meals}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <FaBed className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Accommodation</p>
                <p className="font-medium">{itinerary[activeDay].accommodation}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <FaRoute className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Travel</p>
                <p className="font-medium">{itinerary[activeDay].travel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
</div>
      {/* Additional Information Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">What's Included</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Professional tour guides</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>All necessary equipment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Accommodation throughout the tour</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>All meals as specified in itinerary</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Transportation during the tour</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>24/7 customer support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;