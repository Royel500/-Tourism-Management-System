import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';

const UpdateStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosecure();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  axiosSecure.get(`/api/stories/${id}`)
    .then(res => {
      reset({
        title: res.data.title,
        text: res.data.text,
      });
      setLoading(false);
    })
    .catch(err => {
      Swal.fire('Error', 'Failed to load story', 'error');
      setLoading(false);
    });
}, [id]);

  const onSubmit = (data) => {
    axiosSecure.put(`/api/stories/${id}`, data).then(() => {
      Swal.fire('Success', 'Story updated!', 'success');
      navigate('/manage-story');
    });
  };

  if (loading) return <div>Loading...</div>;

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
        <button type="submit" className="btn btn-primary w-full">
          Update Story
        </button>
      </form>
    </div>
  );
};

export default UpdateStory;
