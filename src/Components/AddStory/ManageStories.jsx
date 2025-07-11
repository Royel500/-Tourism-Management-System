import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';

const ManageStories = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosecure();

  const { data: stories = [], isLoading } = useQuery({
    
  queryKey: ['myStories'],
  queryFn: async () => {
    const res = await axiosSecure.get(`/api/stories`);
    return res.data;
    
  },
});

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/api/stories/${id}`);
    },
    onSuccess: () => {
      Swal.fire('Deleted!', 'Story deleted successfully', 'success');
      queryClient.invalidateQueries(['myStories']);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the story permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">All Stories</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map(story => (
          <div key={story._id} className="bg-white space-y-4 rounded shadow p-4">
            <div className="flex gap-2 overflow-x-auto">
              <img 
              className='h-50 w-auto'
              src={story?.imageUrl} alt="Pending" />
            
            </div>
                        <h3 className="text-xl font-semibold mb-2">{story.title}</h3>

                        <p className="text-gray-600 mb-2">{story.text?.slice(0, 100)}...</p>

            <div className=" flex justify-between mt-5">
              <Link to={`/editstory/${story._id}`} className="btn btn-sm px-5 btn-primary">
                Edit
              </Link>
              <button onClick={() => handleDelete(story._id)} className="btn btn-sm btn-error">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageStories;
