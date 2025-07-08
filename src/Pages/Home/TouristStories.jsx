import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosecure from '../../hooks/useAxiosecure';
import useAuth from '../../hooks/useAuth';

const TouristStorySection = () => {
  const axiosSecure = useAxiosecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['randomStories'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/stories');
      const all = res.data;
      // Return 4 random stories
      return all.sort(() => 0.5 - Math.random()).slice(0, 4);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Tourist Stories</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stories.map(story => (
          <div key={story._id} className="bg-white rounded shadow p-4 flex flex-col justify-between">
            <div>
              <img src={story.imageUrl} alt={story.title} className="w-full h-40 object-cover rounded mb-3" />
              <h3 className="text-lg font-semibold">{story.title}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-2">{story.text?.slice(0, 80)}...</p>
            </div>
            <div className="mt-auto flex items-center justify-between pt-2">
              {user ? (
                <FacebookShareButton
                  url={window.location.href}
                  quote={story.title}
                  hashtag="#TouristStory"
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-sm btn-outline btn-info"
                >
                  Login to Share
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link to="/allStory" className="btn btn-primary">
          All Stories
        </Link>
      </div>
    </div>
  );
};

export default TouristStorySection;
