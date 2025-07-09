import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';
import useAuth from '../../hooks/useAuth';

const JoinAsTourGuide = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosecure();
   const {user} =useAuth();
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post('/api/tour-guides/apply', data);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: 'Application Submitted!',
        text: 'We will contact you if your profile matches.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      reset();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire({
        title: 'Submission Failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  });

const onSubmit = (data) => {
  const fullData = {
    ...data,
    email: user?.email,
    name: user?.displayName,
  };
  mutation.mutate(fullData);
};


  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Join as a Tour Guide</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-semibold">Application Title</label>
          <input
            type="text"
            {...register('title', { required: true })}
            placeholder="e.g., Professional Travel Guide"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Why do you want to be a tour guide?</label>
          <textarea
            {...register('reason', { required: true })}
            rows={5}
            placeholder="Explain your experience and passion..."
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
        <div>
          <label className="font-semibold">CV Link</label>
          <input
            type="url"
            {...register('cvLink', { required: true })}
            placeholder="https://your-cv-link.com"
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default JoinAsTourGuide;
