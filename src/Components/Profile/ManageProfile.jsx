// src/components/ManageProfile.js
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FaDollarSign, FaUserFriends, FaBox, FaUsers, FaBook, FaEdit, FaChartLine, FaTimes } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosecure from '../../hooks/useAxiosecure';
import { updateProfile } from 'firebase/auth';  // <-- import this at top


const ManageProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosecure();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    totalPayment: 0,
    totalGuides: 0,
    totalPackages: 0,
    totalClients: 0,
    totalStories: 0,
  });

  // Load admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        
        // Fetch all stats in parallel
        const [paymentsRes, guidesRes, packagesRes, clientsRes, storiesRes] = await Promise.all([
          axiosSecure.get('/api/payments/total'),
          axiosSecure.get('/api/tour-guides/accepted-count'),
          axiosSecure.get('/api/packages/count'),
          axiosSecure.get('/api/userss'),
          axiosSecure.get('/api/stories/count'),
        ]);
        
        setStats({
          totalPayment: paymentsRes.data.total || 0,
          totalGuides: guidesRes.data.count || 0,
          totalPackages: packagesRes.data.count || 0,
          totalClients: clientsRes.data.count || 0,
          totalStories: storiesRes.data.count || 0,
        });
        
        setIsLoadingStats(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        Swal.fire('Error', 'Failed to load dashboard statistics', 'error');
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  // Update profile mutation
 const { register, handleSubmit, reset } = useForm();
const updateMutation = useMutation({
  mutationFn: async (formData) => {
    return await axiosSecure.patch(`/api/users/${user.email.toLowerCase()}`, formData);
  },
  onSuccess: async (_, variables) => {
    // variables = formData passed to mutate
    if (user) {
      try {
        await updateProfile(user, {
          displayName: variables.name,
          photoURL: variables.photoURL,
        });
      } catch (err) {
        console.error('Firebase profile update failed:', err);
      }
    }
    Swal.fire('Success!', 'Profile updated successfully', 'success');
    queryClient.invalidateQueries(['admin-stats']);
    setIsOpen(false);
  },
  onError: (error) => {
    console.error('Update error:', error);
    Swal.fire('Error', 'Failed to update profile', 'error');
  }
});

const onSubmit = (data) => {
  const updateData = {
    name: data.name,
    photoURL: data.photoURL,
  };
  updateMutation.mutate(updateData);  // <-- call mutate here
};


  const StatCard = ({ title, value, icon, color, loading }) => (
    <div className={`p-5 rounded-xl shadow-md ${color} text-white transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-medium">{title}</p>
          {loading ? (
            <div className="animate-pulse mt-2">
              <div className="h-8 w-16 bg-white bg-opacity-30 rounded"></div>
            </div>
          ) : (
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          )}
        </div>
        <div className="text-3xl opacity-80">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="h-1 bg-white bg-opacity-30 rounded-full">
          {!loading && (
            <div 
              className="h-full bg-white rounded-full" 
              style={{ width: `${Math.min(100, value / (value > 100 ? 200 : 100) * 100)}%` }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );

  // Calculate growth percentages
  const monthlyRevenueGrowth = 12.5;
  const newClientsGrowth = 24;
  const activePackages = stats.totalPackages;
  const satisfactionRate = 94;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome <span className='text-2xl font-bold italic text-fuchsia-600 mx-3'> {user?.displayName}</span> to your management Admin Profile </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium">{user?.displayName || 'Admin'}</p>
            <p className="text-sm text-gray-600">{user?.role || 'Admin'}</p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Admin" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                <span className="text-gray-500 font-bold text-lg">
                  {user?.displayName?.charAt(0) || 'A'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-200 p-5 rounded-xl animate-pulse h-32"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard 
            title="Total Revenue" 
            value={`$${stats.totalPayment.toLocaleString()}`} 
            icon={<FaDollarSign />} 
            color="bg-gradient-to-r from-green-500 to-emerald-600" 
            loading={isLoadingStats}
          />
          <StatCard 
            title="Tour Guides" 
            value={stats.totalGuides} 
            icon={<FaUserFriends />} 
            color="bg-gradient-to-r from-blue-500 to-cyan-600" 
            loading={isLoadingStats}
          />
          <StatCard 
            title="Packages" 
            value={stats.totalPackages} 
            icon={<FaBox />} 
            color="bg-gradient-to-r from-amber-500 to-orange-600" 
            loading={isLoadingStats}
          />
          <StatCard 
            title="Clients" 
            value={stats.totalClients} 
            icon={<FaUsers />} 
            color="bg-gradient-to-r from-purple-500 to-violet-600" 
            loading={isLoadingStats}
          />
          <StatCard 
            title="Stories" 
            value={stats.totalStories} 
            icon={<FaBook />} 
            color="bg-gradient-to-r from-pink-500 to-rose-600" 
            loading={isLoadingStats}
          />
        </div>
      )}

      {/* Admin Profile Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-b from-indigo-600 to-purple-700 p-8 text-white">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Admin" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg">
                    <span className="text-gray-500 text-4xl font-bold">
                      {user?.displayName?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
                <button 
                  onClick={() => {
                    setIsOpen(true);
                    reset({ name: user?.displayName || '', photoURL: user?.photoURL || '' });
                  }}
                  className="absolute bottom-0 right-0 bg-white text-purple-600 rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
                >
                  <FaEdit />
                </button>
              </div>
              <h2 className="text-2xl font-bold mt-4">{user?.displayName || 'Admin'}</h2>
              <p className="bg-indigo-500 px-4 py-1 rounded-full text-sm mt-2">
                {user?.role || 'Admin'}
              </p>
              
              <div className="mt-8 w-full">
                <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Profile Completeness</span>
                    <span className="font-bold">95%</span>
                  </div>
                  <div className="h-2 bg-indigo-500 rounded-full">
                    <div className="h-full bg-white rounded-full w-11/12"></div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <span>Last Login</span>
                    <span className="font-bold">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <FaBox className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Added new travel package</p>
                    <p className="text-gray-600 text-sm">Just now</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <FaUsers className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Approved new tour guide</p>
                    <p className="text-gray-600 text-sm">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <FaDollarSign className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Processed payments ($1,250)</p>
                    <p className="text-gray-600 text-sm">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Statistics Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Monthly Revenue</p>
                  <p className="text-xl font-bold text-green-600">+{monthlyRevenueGrowth}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">New Clients</p>
                  <p className="text-xl font-bold text-blue-600">+{newClientsGrowth}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Active Packages</p>
                  <p className="text-xl font-bold text-amber-600">{activePackages}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Satisfaction Rate</p>
                  <p className="text-xl font-bold text-purple-600">{satisfactionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Visualization Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg">Revenue Growth</h4>
              <FaChartLine className="text-blue-500 text-xl" />
            </div>
            <div className="h-48 flex items-end space-x-2">
              {[40, 60, 75, 90, 65, 85, 70].map((height, index) => (
                <div 
                  key={index} 
                  className="w-8 bg-gradient-to-t from-blue-400 to-indigo-600 rounded-t flex-grow"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg">User Engagement</h4>
              <FaUsers className="text-green-500 text-xl" />
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.totalClients}</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="8" 
                    strokeDasharray={`${(stats.totalClients / 200) * 283}, 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Edit Profile</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Admin" 
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg">
                      <span className="text-gray-500 text-3xl font-bold">
                        {user?.displayName?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-white text-purple-600 rounded-full p-2 shadow-md">
                    <FaEdit />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input 
                  {...register('name', { required: true })} 
                  defaultValue={user?.displayName || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Photo URL</label>
                <input 
                  {...register('photoURL', { required: true })} 
                  defaultValue={user?.photoURL || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input 
                  disabled 
                  value={user?.email || ''} 
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Role</label>
                <input 
                  disabled 
                  value={user?.role || 'admin'} 
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={updateMutation.isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-70"
              >
                {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProfile;