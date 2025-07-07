import React from 'react';

const ExtraSections = () => {
  return (
    <div>

      {/* 🌍 Top Destinations Section */}
      <section className="px-6 py-10 bg-gradient-to-r from-sky-100 to-emerald-100">
        <h2 className="text-3xl font-bold text-center mb-6">Top Destinations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sample Cards */}
          <div className="bg-white rounded shadow p-4 text-center">
            <img src="https://source.unsplash.com/400x250/?paris,travel" alt="Paris" className="w-full h-48 object-cover rounded mb-3" />
            <h3 className="text-xl font-semibold">Paris, France</h3>
            <p className="text-gray-600">Experience the City of Light with guided tours, cuisine, and romance.</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <img src="https://source.unsplash.com/400x250/?bali,beach" alt="Bali" className="w-full h-48 object-cover rounded mb-3" />
            <h3 className="text-xl font-semibold">Bali, Indonesia</h3>
            <p className="text-gray-600">Tropical paradise with culture, nature, and serene beaches.</p>
          </div>
          <div className="bg-white rounded shadow p-4 text-center">
            <img src="https://source.unsplash.com/400x250/?newyork,city" alt="New York" className="w-full h-48 object-cover rounded mb-3" />
            <h3 className="text-xl font-semibold">New York, USA</h3>
            <p className="text-gray-600">Explore the iconic skyline, Broadway shows, and vibrant streets.</p>
          </div>
        </div>
      </section>

      {/* ⭐ Why Choose Us Section */}
      <section className="px-6 py-12 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Our Services?</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
            <p>Our local guides are experienced, certified, and passionate about making your journey unforgettable.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Custom Packages</h3>
            <p>Whether solo or in a group, we tailor every trip to fit your preferences and travel goals.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p>We’re here for you—before, during, and after your journey—to make travel stress-free.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ExtraSections;
