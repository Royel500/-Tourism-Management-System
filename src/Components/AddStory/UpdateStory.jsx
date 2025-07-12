import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';
import axios from 'axios';
import Loading from '../../ShearCom/Loading';

const UpdateStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosecure();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  // ✅ Load existing story
  useEffect(() => {
    axiosSecure.get(`/api/stories/${id}`)
      .then(res => {
        reset({
          title: res.data.title,
          text: res.data.text,
        });
        setImages(res.data.photos || []);
        setLoading(false);
      })
      .catch(err => {
        Swal.fire('Error', 'Failed to load story', 'error');
        setLoading(false);
      });
  }, [id, axiosSecure, reset]);

  // ✅ Remove photo
  const handleRemovePhoto = async (url) => {
    try {
      await axiosSecure.patch(`/api/stories/${id}/remove-photo`, { imageUrl: url });
      setImages(prev => prev.filter(img => img !== url));
      Swal.fire('Removed', 'Image removed successfully', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to remove image', 'error');
    }
  };

  // ✅ Upload and Add new photo
  const handleAddPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_PHOTO_KEY}`,
        formData
      );
      const newUrl = res.data.data.url;

      // Add to DB
      await axiosSecure.patch(`/api/stories/${id}/add-photo`, { newImageUrl: newUrl });
      setImages(prev => [...prev, newUrl]);

      Swal.fire('Added', 'New image uploaded', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Image upload failed', 'error');
    }
  };

  // ✅ Submit title & text
  const onSubmit = (data) => {
    axiosSecure.put(`/api/stories/${id}`, data).then(() => {
      Swal.fire('Success', 'Story updated!', 'success');
      navigate('/dasboard/allStory');
    });
  };

  if (loading) return <Loading></Loading>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Your Story</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-semibold">Title</label>
          <input
            type="text"
            {...register('title', { required: true })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="font-semibold">Story Text</label>
          <textarea
            {...register('text', { required: true })}
            className="w-full border rounded p-2"
            rows="6"
          ></textarea>
        </div>

        
      {/* ✅ Image Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Story Images</h3>

        {images.length === 0 ? (
          <p>No images yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative border rounded">
                <img src={img} alt="Story" className="w-full h-32 object-cover rounded" />
                <button
                  onClick={() => handleRemovePhoto(img)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new photo */}
        <div className="mt-4">
          <label className="font-semibold">Add New Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAddPhoto}
            className="file-input file-input-bordered w-full"
          />
        </div>
      </div>

        <button type="submit" className="btn btn-primary w-full">Update Story</button>
      </form>

    </div>
  );
};

export default UpdateStory;
