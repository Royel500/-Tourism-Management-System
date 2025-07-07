import { FacebookShareButton, FacebookIcon } from 'react-share';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const TouristStories = ({ stories }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleShare = (url) => {
    if (!user) navigate('/login');
  };

  return (
    <section className="px-6 py-10 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-6">Tourist Stories</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <div key={story._id} className="p-4 shadow rounded bg-white">
            <h3 className="text-xl font-semibold">{story.title}</h3>
            <p>{story.summary}</p>
            <div className="flex justify-between mt-4">
              <FacebookShareButton url={window.location.href} quote={story.title} onClick={() => handleShare(window.location.href)}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <button onClick={() => navigate('/all-stories')} className="text-blue-600 hover:underline">
                All Stories
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TouristStories;