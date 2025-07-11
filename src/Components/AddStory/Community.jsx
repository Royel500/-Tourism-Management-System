import React, { useEffect, useState } from 'react';
import { FacebookShareButton, WhatsappShareButton, LinkedinShareButton, FacebookIcon, WhatsappIcon, LinkedinIcon } from 'react-share';
import useAxiosecure from '../../hooks/useAxiosecure';
import { FaHeart } from 'react-icons/fa';

const Community = () => {
  const [stories, setStories] = useState([]);
  const axiosSecure = useAxiosecure();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axiosSecure.get('/api/stories');
        setStories(res.data || []);
      } catch (err) {
        console.error('Failed to load stories', err);
      }
    };

    fetchStories();
  }, [axiosSecure]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Community Stories</h2>

      {stories.length === 0 ? (
        <p className="text-center text-gray-500">No stories shared yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <div key={story._id} className="bg-white shadow-lg rounded-lg p-5">
              <div className=" items-center gap-4 mb-3">
                <h4 className="text-lg font-semibold"> Title : {story.title}</h4>
                <img
                  src={story.imageUrl || 'https://i.ibb.co/8MP9tC9/default-avatar.png'}
                  alt="User"
                  className=" border h-70 w-auto"
                />
                <div>
                  <h4 className="text-lg font-semibold"> Share By : {story.author}</h4>
                  <h4 className="text-lg "> <span className='font-bold'> Description : </span>{story.text}</h4>
                  <p className="text-sm text-gray-500"> Create At :{story.createdAt}</p>
                </div>
              </div>

              {story.image && (
                <img
                  src={story.image}
                  alt="Story"
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}

              <p className="text-gray-700 mb-4">{story.story}</p>

              <div className="flex justify-between items-center">
                <button className="flex items-center text-pink-600 hover:text-pink-700">
                  <FaHeart className="mr-1" /> Like
                </button>

                <div className="flex items-center gap-2">
                  <FacebookShareButton url={window.location.href} quote={story.story}>
                    <FacebookIcon size={28} round />
                  </FacebookShareButton>

                  <WhatsappShareButton url={window.location.href} title={story.story}>
                    <WhatsappIcon size={28} round />
                  </WhatsappShareButton>

                  <LinkedinShareButton url={window.location.href} title={story.story}>
                    <LinkedinIcon size={28} round />
                  </LinkedinShareButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
