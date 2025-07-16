import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosecure from '../../hooks/useAxiosecure';
import Loading from '../../ShearCom/Loading';
import { FaEnvelope, FaMapMarkerAlt, FaStar, FaPhone, FaGlobe, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const GuideDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosecure();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axiosSecure.get(`/api/tour-guides/${id}`);
        setGuide(res.data);
      } catch (err) {
        console.error('Failed to fetch guide details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id, axiosSecure]);

  if (loading) return <Loading></Loading>;
  if (!guide) return <p className="text-center text-red-500 py-20">Guide not found.</p>;

  return (
    <div className="bg-gradient-to-br from-sky-50 to-teal-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-teal-500 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={guide.photo || "https://i.pravatar.cc/300"}
                  alt={guide.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-0 right-0 bg-amber-500 text-white rounded-full p-2">
                  <FaStar className="text-xl" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{guide.name}</h1>
                <p className="text-teal-600 font-medium mt-1">{guide.title || "Professional Tour Guide"}</p>
                
                <div className="flex items-center mt-3">
                  <div className="flex text-amber-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                  <span className="ml-2 text-gray-600">4.9 (128 reviews)</span>
                </div>
              </div>
              
              <button className="mt-4 md:mt-0 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1">
               <a href="https://wa.me/+8801907226353"> Contact Guide</a>
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile Navigation */}
        <div className="mt-8 bg-white rounded-xl shadow-md">
          <div className="flex border-b border-gray-200">
            <button 
              className={`py-4 px-6 font-medium ${activeTab === 'about' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button 
              className={`py-4 px-6 font-medium ${activeTab === 'experience' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('experience')}
            >
              Experience
            </button>
            <button 
              className={`py-4 px-6 font-medium ${activeTab === 'reviews' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'about' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">About {guide.name}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {guide.reason || "Experienced tour guide with a passion for sharing the beauty and history of our destinations. With years of experience, I create memorable journeys that go beyond typical tourist experiences."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">Personal Information</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <FaEnvelope className="text-teal-600 mr-3" />
                        <span className="text-gray-600">{guide.email}</span>
                      </li>
                      <li className="flex items-center">
                        <FaPhone className="text-teal-600 mr-3" />
                        <span className="text-gray-600">+1 (555) 123-4567</span>
                      </li>
                      <li className="flex items-center">
                        <FaMapMarkerAlt className="text-teal-600 mr-3" />
                        <span className="text-gray-600">New York, USA</span>
                      </li>
                      <li className="flex items-center">
                        <FaGlobe className="text-teal-600 mr-3" />
                        <span className="text-gray-600">www.{guide.name?.toLowerCase().replace(/\s+/g, '')}.com</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">English</span>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">Spanish</span>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">French</span>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">German</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-700 mt-4 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Historical Tours</span>
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Adventure Tours</span>
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Cultural Immersion</span>
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Food Tours</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-gray-800 mb-4">Connect with {guide.name.split(' ')[0]}</h3>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/profile.php?id=100085936730814" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <FaFacebook className="text-lg" />
                    </a>
                    <a href="https://www.twitter.com/profile" className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                      <FaTwitter className="text-lg" />
                    </a>
                    <a href="https://www.instagram.com/profile" className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 transition-colors">
                      <FaInstagram className="text-lg" />
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'experience' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Experience</h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-teal-500 pl-4 py-1">
                    <div className="flex justify-between flex-wrap">
                      <h3 className="font-bold text-lg text-gray-800">Senior Tour Guide</h3>
                      <span className="text-teal-600 font-medium">2018 - Present</span>
                    </div>
                    <p className="text-gray-700 font-medium mt-1">Adventure Travel Co.</p>
                    <p className="text-gray-600 mt-2">
                      Leading premium tours across Europe and Asia, specializing in cultural immersion experiences. 
                      Developed unique itineraries that increased customer satisfaction by 35%.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-amber-500 pl-4 py-1">
                    <div className="flex justify-between flex-wrap">
                      <h3 className="font-bold text-lg text-gray-800">Tour Coordinator</h3>
                      <span className="text-amber-600 font-medium">2015 - 2018</span>
                    </div>
                    <p className="text-gray-700 font-medium mt-1">City Explorers Inc.</p>
                    <p className="text-gray-600 mt-2">
                      Managed tour operations for urban exploration experiences in major cities. 
                      Trained new guides and developed safety protocols adopted company-wide.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-cyan-500 pl-4 py-1">
                    <div className="flex justify-between flex-wrap">
                      <h3 className="font-bold text-lg text-gray-800">Junior Tour Guide</h3>
                      <span className="text-cyan-600 font-medium">2012 - 2015</span>
                    </div>
                    <p className="text-gray-700 font-medium mt-1">Nature Trails Expeditions</p>
                    <p className="text-gray-600 mt-2">
                      Guided hiking and nature tours in national parks. Developed interpretive programs 
                      that received recognition from the National Park Service.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-bold text-gray-800 mb-4">Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-lg border border-cyan-100">
                      <h4 className="font-bold text-gray-800">Certified Tour Professional</h4>
                      <p className="text-cyan-600 font-medium">International Tour Management Institute</p>
                      <p className="text-gray-600 text-sm mt-1">Issued 2017</p>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
                      <h4 className="font-bold text-gray-800">Wilderness First Responder</h4>
                      <p className="text-amber-600 font-medium">National Outdoor Leadership School</p>
                      <p className="text-gray-600 text-sm mt-1">Issued 2019</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Client Reviews</h2>
                
                <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg mb-6">
                  <div className="text-center md:text-left">
                    <div className="text-4xl font-bold text-gray-800">4.9</div>
                    <div className="flex justify-center md:justify-start text-amber-400 mt-1">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <p className="text-gray-600 mt-1">128 reviews</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 w-full md:w-auto">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">5 stars</span>
                      <span className="text-sm text-gray-600">96%</span>
                    </div>
                    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: '96%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-1 mt-3">
                      <span className="text-sm text-gray-600">4 stars</span>
                      <span className="text-sm text-gray-600">4%</span>
                    </div>
                    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: '4%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-1 mt-3">
                      <span className="text-sm text-gray-600">3 stars</span>
                      <span className="text-sm text-gray-600">0%</span>
                    </div>
                    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-5">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800">Sarah Johnson</h4>
                        <div className="flex text-amber-400 mt-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">2 weeks ago</span>
                    </div>
                    <p className="text-gray-700 mt-3">
                      "Our tour with {guide.name.split(' ')[0]} was absolutely amazing! His knowledge of the local history 
                      and culture made the experience unforgettable. He went above and beyond to make sure 
                      everyone in our group had a great time."
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-5">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800">Michael Rodriguez</h4>
                        <div className="flex text-amber-400 mt-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">1 month ago</span>
                    </div>
                    <p className="text-gray-700 mt-3">
                      "I've been on many tours, but {guide.name.split(' ')[0]} stands out as one of the best guides I've ever had. 
                      His passion for the destination is contagious, and his storytelling brings history to life. 
                      Highly recommend!"
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-5">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800">Emily Chen</h4>
                        <div className="flex text-amber-400 mt-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">2 months ago</span>
                    </div>
                    <p className="text-gray-700 mt-3">
                      "What an incredible experience! {guide.name.split(' ')[0]}'s attention to detail and ability to 
                      personalize the tour made all the difference. He knew all the hidden gems and best photo spots. 
                      Will definitely book with him again!"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Featured Tours */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Tours by {guide.name.split(' ')[0]}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-r from-cyan-400 to-teal-500"> <img src='https://i.postimg.cc/GpfFWbnd/images.jpg' alt="" /> </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800">Historic City Walking Tour</h3>
                <div className="flex items-center mt-2">
                  <FaMapMarkerAlt className="text-teal-600 mr-2" />
                  <span className="text-gray-600">New York, USA</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">$89</span>
                  <span className="text-gray-500 text-sm">4 hours</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-r from-amber-400 to-orange-500"> <img src="https://i.postimg.cc/FsGLth08/03f957-4eca9afc857a4ca0a4d005b729a536b1-mv2.jpg" alt="" /> </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800">Culinary Adventure</h3>
                <div className="flex items-center mt-2">
                  <FaMapMarkerAlt className="text-amber-600 mr-2" />
                  <span className="text-gray-600">Brooklyn, USA</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">$125</span>
                  <span className="text-gray-500 text-sm">3.5 hours</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-r from-violet-500 to-purple-600">  <img src="https://i.postimg.cc/9FNQt0dm/tokyo-by-night-photo-tour-eyexplore-7.jpg" alt="" /> </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800">Night Photography Tour</h3>
                <div className="flex items-center mt-2">
                  <FaMapMarkerAlt className="text-violet-600 mr-2" />
                  <span className="text-gray-600">Manhattan, USA</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">$110</span>
                  <span className="text-gray-500 text-sm">3 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetails;