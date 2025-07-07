import React from 'react';

const Overview = () => {
    return (
    <section className="px-6 py-10 bg-gray-100 text-center">
      <h2 className="text-3xl font-bold mb-4">About Our Tourism Platform</h2>
      <p className="mb-6 max-w-2xl mx-auto">
        Discover the world with our expertly crafted travel experiences. We offer customized tours, expert guides, and unforgettable memories.
      </p>
      <div className="flex justify-center">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Scxs7L0vhZ4"
          title="Travel Overview Video"
          frameBorder="0"
          allowFullScreen
          className="rounded shadow-lg"
        ></iframe>
      </div>
    </section>
  );
};

export default Overview;