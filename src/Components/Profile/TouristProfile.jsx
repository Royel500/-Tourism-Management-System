import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosecure from '../../hooks/useAxiosecure';
import Swal from 'sweetalert2';
import useRole from '../../hooks/useRole';
import { updateProfile } from 'firebase/auth';
import Loading from '../../ShearCom/Loading';
import { FaUser, FaEdit, FaEnvelope, FaShieldAlt, FaCamera, FaCheck } from 'react-icons/fa';

const TouristProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosecure();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ name: '', photoURL: '' });
  const { role, roleLoading } = useRole();

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(`/api/users/${user.email}`);
        setProfile(res.data);
        setEditData({ name: res.data.name, photoURL: res.data.photoURL });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchProfile();
  }, [user?.email, axiosSecure]);

  // Update profile and sync across systems
  const handleUpdate = async () => {
    try {
      // ✅ 1. Update Firebase auth profile
      await updateProfile(user, {
        displayName: editData.name,
        photoURL: editData.photoURL,
      });

      // ✅ 2. Update MongoDB user
      const userRes = await axiosSecure.patch(`/api/users/update/${user.email}`, {
        name: editData.name,
        photoURL: editData.photoURL,
      });

      // ✅ 3. Update tour guide profile if exists
      await axiosSecure.patch(`/api/tour-guides/update-photo/${user.email}`, {
        photoURL: editData.photoURL,
      });

      if (userRes.data.modifiedCount > 0) {
        Swal.fire('Success', 'Profile updated!', 'success');
        setProfile(prev => ({ ...prev, ...editData }));
        document.getElementById('edit_modal')?.close();
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  if (loading) return <Loading></Loading>
 return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 mx-auto overflow-hidden">
              {profile?.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUser className="text-5xl text-gray-400" />
                </div>
              )}
            </div>
            <button 
              onClick={() => document.getElementById('edit_modal')?.showModal()}
              className="absolute bottom-2 right-2 bg-cyan-700 p-2 rounded-full hover:bg-cyan-800 transition-all"
            >
              <FaCamera className="text-white" />
            </button>
          </div>
          <h1 className="text-3xl font-bold mt-4">{profile?.name || 'User'}</h1>
          <div className="inline-flex items-center gap-2 mt-2 bg-cyan-800 px-4 py-1 rounded-full">
            <FaShieldAlt />
            <span className="capitalize">{profile?.role || 'tourist'}</span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUser className="text-cyan-600" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Full Name</p>
                  <p className="font-medium">{profile?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email Address</p>
                  <p className="font-medium flex items-center gap-2">
                    <FaEnvelope className="text-cyan-600" />
                    {profile?.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Account Type</p>
                  <p className="font-medium capitalize">{profile?.role || 'tourist'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => document.getElementById('edit_modal')?.showModal()}
                  className="w-full flex items-center justify-center gap-2 btn btn-outline btn-info"
                >
                  <FaEdit />
                  Edit Profile
                </button>

                {!roleLoading && role === 'tourist' && (
                  <button
                    className="w-full btn btn-success"
                    onClick={() => window.location.href = '/dasboard/tourguide'}
                  >
                    Apply for Tour Guide
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box max-w-md">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaEdit className="text-cyan-600" />
            Edit Your Profile
          </h3>
          
          <div className="mt-6 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Profile Photo URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={editData.photoURL}
                onChange={(e) => setEditData({ ...editData, photoURL: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            
            {editData.photoURL && (
              <div className="flex justify-center">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={editData.photoURL} alt="Preview" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-action">
            <button 
              className="btn btn-primary flex items-center gap-2"
              onClick={handleUpdate}
            >
              <FaCheck />
              Save Changes
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default TouristProfile;
