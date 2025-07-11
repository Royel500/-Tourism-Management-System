import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosecure from '../../hooks/useAxiosecure';
import Swal from 'sweetalert2';
import useRole from '../../hooks/useRole';
import { updateProfile } from 'firebase/auth';

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

  if (loading) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Manage Profile</h2>
      <p className="mb-2">Welcome, <span className="font-semibold">{profile?.name}</span></p>
      <img src={profile?.photoURL} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
      <p><strong>Email:</strong> {profile?.email}</p>
      <p><strong>Role:</strong> {profile?.role}</p>

      {/* Edit Button */}
      <button className="btn btn-info mt-4" onClick={() => document.getElementById('edit_modal')?.showModal()}>
        Edit Profile
      </button>

      {/* Apply for Tour Guide */}
      {
        !roleLoading && role === 'tourist' && (
          <div className="mt-6">
            <button
              className="btn btn-success"
              onClick={() => window.location.href = '/dasboard/tourguide'}
            >
              Apply for Tour Guide
            </button>
          </div>
        )
      }

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Your Profile</h3>
          <div className="mt-4 space-y-2">
            <label className="label">Name</label>
            <input
              className="input input-bordered w-full"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <label className="label">Photo URL</label>
            <input
              className="input input-bordered w-full"
              value={editData.photoURL}
              onChange={(e) => setEditData({ ...editData, photoURL: e.target.value })}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default TouristProfile;
