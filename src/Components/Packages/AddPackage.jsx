import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';

const AddPackage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const axiosSecure = useAxiosecure();

  const [uploading, setUploading] = useState(false);

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_PHOTO_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('Image upload failed');
    }
  };

  const onSubmit = async (data) => {
    if (!data.images || data.images.length === 0) {
      Swal.fire('Error!', 'Please select at least one image', 'error');
      return;
    }

    try {
      setUploading(true);

      // Upload all images and get URLs
      const imageFiles = Array.from(data.images); // FileList to Array
      const uploadPromises = imageFiles.map(file => uploadImageToImgbb(file));
      const imageUrls = await Promise.all(uploadPromises);

      // Prepare package data with image URLs array
      const packageData = {
        title: data.title,
        location: data.location,
        price: parseFloat(data.price),
        days: parseInt(data.days),
        images: imageUrls,   // array of urls here
        description: data.description,
        difficulty: data.difficulty,
        createdAt: new Date(),
      };

      // Send to backend
      const res = await axiosSecure.post('/api/packages', packageData);
      if (res.data.insertedId) {
        Swal.fire('Success!', 'Package added successfully!', 'success');
        reset();
      }

    } catch (error) {
      console.error(error);
      Swal.fire('Error!', error.message || 'Failed to add package.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Tour Package</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Other fields ... */}

        <div>
          <label>Package Title</label>
          <input {...register('title', { required: true })} className="input input-bordered w-full" />
          {errors.title && <p className="text-red-500">Title is required</p>}
        </div>

        <div>
          <label>Location</label>
          <input {...register('location', { required: true })} className="input input-bordered w-full" />
          {errors.location && <p className="text-red-500">Location is required</p>}
        </div>

        <div>
          <label>Price ($)</label>
          <input type="number" {...register('price', { required: true })} className="input input-bordered w-full" />
          {errors.price && <p className="text-red-500">Price is required</p>}
        </div>

        <div>
          <label>Duration (days)</label>
          <input type="number" {...register('days', { required: true })} className="input input-bordered w-full" />
          {errors.days && <p className="text-red-500">Duration is required</p>}
        </div>

        {/* Multiple Images input */}
        <div>
          <label>Upload Images</label>
          <input
            type="file"
            {...register('images', { required: true })}
            accept="image/*"
            multiple
            className="file-input file-input-bordered w-full"
          />
          {errors.images && <p className="text-red-500">Please upload at least one image</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea {...register('description', { required: true })} className="textarea textarea-bordered w-full" />
          {errors.description && <p className="text-red-500">Description is required</p>}
        </div>

        <div>
          <label>Difficulty</label>
          <select {...register('difficulty', { required: true })} className="select select-bordered w-full">
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
          {errors.difficulty && <p className="text-red-500">Difficulty is required</p>}
        </div>

        <button type="submit" disabled={uploading} className="btn btn-primary w-full">
          {uploading ? 'Uploading...' : 'Add Package'}
        </button>
      </form>
    </div>
  );
};

export default AddPackage;
