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
  <div className="max-w-lg mx-auto p-6">
    <h1 className='text-2xl font-bold text-center mb-8 text-indigo-700'>
      Share Your Story
    </h1>
    
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-indigo-50"
    >
      <div>
        <input 
          {...register('title')}
          placeholder="Story Title"
          className="w-full px-4 py-3 border-b-2 border-indigo-100 focus:border-indigo-500 focus:outline-none text-lg"
        />
      </div>
      
      <div>
        <textarea 
          {...register('text')}
          placeholder="Tell your story..."
          className="w-full px-4 py-3 border-b-2 border-indigo-100 focus:border-indigo-500 focus:outline-none min-h-[150px]"
        />
      </div>
      
      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Add Image
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
              </p>
            </div>
            <input 
              type="file" 
              {...register('image')} 
              accept="image/*" 
              className="hidden" 
            />
          </label>
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={uploading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all
          ${uploading 
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'}`}
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        ) : 'Publish Your Story'}
      </button>
    </form>
  </div>
);
};

export default AddStoryWithUpload;