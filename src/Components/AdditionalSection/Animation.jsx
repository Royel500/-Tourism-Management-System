import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      text: "The mountain adventure tour was absolutely incredible! Our guide Michael was knowledgeable and ensured our safety while making the experience fun.",
      author: "James Anderson",
      tour: "Mountain Adventure Tour",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      text: "Sarah's knowledge of Japanese culture transformed our trip. We didn't just see the sights - we understood their significance. Highly recommend!",
      author: "Emma Thompson",
      tour: "Cultural Journey Tour",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      text: "The beach paradise tour exceeded all expectations. David's expertise in water sports made us feel safe while trying new activities. Perfect vacation!",
      author: "Robert Garcia",
      tour: "Beach Paradise Tour",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
          What Our Travelers Say
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-500 ease-in-out transform ${
                  index === activeIndex 
                    ? 'scale-105 shadow-xl border-2 border-blue-500' 
                    : 'scale-95 opacity-80'
                }`}
                style={{
                  transition: 'transform 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease'
                }}
              >
                <div className="flex items-start mb-4">
                  <div className="text-yellow-400 text-xl">
                    {"★".repeat(5)}
                  </div>
                </div>
                
                <p className="text-gray-700 italic mb-6 text-lg">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center">
                  <div 
                    className="w-14 h-14 rounded-full bg-cover bg-center mr-4 border-2 border-blue-500"
                    style={{ backgroundImage: `url(${testimonial.avatar})` }}
                  ></div>
                  <div>
                    <div className="font-semibold text-blue-800">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.tour}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Floating decoration elements */}
        <div className="hidden lg:block">
          <div className="absolute left-20 top-1/4 w-16 h-16 rounded-full bg-blue-200 opacity-30 animate-pulse"></div>
          <div className="absolute right-32 top-1/2 w-12 h-12 rounded-full bg-yellow-200 opacity-30 animate-bounce"></div>
          <div className="absolute left-1/3 bottom-1/4 w-20 h-20 rounded-full bg-green-200 opacity-20 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;