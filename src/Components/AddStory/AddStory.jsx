import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth'; // adjust based on your path
import useAxiosecure from './../../hooks/useAxiosecure';

const AddStory = () => {
  const { user } = useAuth();
//   const navigate = useNavigate();
  const axiosSecure = useAxiosecure();
  const { register, handleSubmit, reset } = useForm();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosSecure.post('/api/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('Success', 'Story added successfully!', 'success');
      reset();
    //   navigate('/manage-story');
    },
    onError: (err) => {
      console.error(err);
      Swal.fire('Error', 'Failed to add story', 'error');
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('text', data.text);
    formData.append('author', user.displayName);
    formData.append('email', user.email);
    for (let i = 0; i < data.images.length; i++) {
      formData.append('images', data.images[i]);
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Share Your Story</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-semibold">Title</label>
          <input
            type="text"
            {...register('title', { required: true })}
            className="w-full border rounded p-2 mt-1"
            placeholder="Enter a title for your story"
          />
        </div>
        <div>
          <label className="font-semibold">Story</label>
          <textarea
            {...register('text', { required: true })}
            className="w-full border rounded p-2 mt-1"
            rows="6"
            placeholder="Write your experience here..."
          ></textarea>
        </div>
        <div>
          <label className="font-semibold">Upload Images</label>
          <input
            type="file"
            multiple
            {...register('images', { required: true })}
            className="w-full mt-1"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded"
        >
          Submit Story
        </button>
      </form>
    </div>
  );
};

export default AddStory;
