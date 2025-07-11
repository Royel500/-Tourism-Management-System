import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosecure from '../../hooks/useAxiosecure';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const AddStoryWithUpload = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosecure();
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const {user} =useAuth();
  

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_PHOTO_KEY}`,
        formData
      );
      const url = res.data.data.url;
      setPhotoURL(url);
      Swal.fire("✅ Success!", "Photo uploaded.", "success");
      return url;
    } catch (err) {
      console.error("Image upload error:", err);
      Swal.fire("❌ Error", "Failed to upload image", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    const file = data.image[0];

    if (!file) {
      Swal.fire("Please upload an image", "", "warning");
      return;
    }

    const uploadedUrl = await handleImageUpload(file);

    if (!uploadedUrl) return;

    const storyData = {
      title: data.title,
      text: data.text,
      author: user?.displayName,
      email: user?.email,
      imageUrl: uploadedUrl,
    };

    try {
      const res = await axiosSecure.post('/api/story-url', storyData);
      if (res.data.storyId) {
        Swal.fire('✅ Story Saved!', 'Your story has been posted.', 'success');
        reset();
        setPhotoURL('');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('❌ Error', 'Failed to post story', 'error');
    }
  };

  return (
    <>
     <h1 className='font-bold text-center mt-10'> Add Your Story </h1>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4 bg-white rounded shadow">
      <input {...register('title')} placeholder="Title" className="input input-bordered w-full" />
      <textarea {...register('text')} placeholder="Story Text" className="textarea textarea-bordered w-full" />
      
      <input type="file" {...register('image')} accept="image/*" className="file-input file-input-bordered w-full" />
      
      <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
        {uploading ? 'Uploading Image...' : 'Submit Story'}
      </button>
    </form>
     </>
  );
};

export default AddStoryWithUpload;