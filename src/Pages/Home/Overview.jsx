import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';

const Overview = () => {
    return (
    <section className="px-6 py-10 bg-gray-100 text-center">
<motion.div
  initial={{ opacity: 1, y: 60 }}
  animate={{ opacity: 1, y: 10 }}
  transition={{ duration: 2, ease: 'easeOut' }}
  className="text-center px-4"
>
  <h2 className="text-3xl font-bold mb-4">
    <Typewriter
      words={[' About Our Tourism Platform']}
      loop={0}
      cursor
      cursorStyle="_"
      typeSpeed={90}
      deleteSpeed={50}
      delaySpeed={2000}
    />
  </h2>
  <p className="mb-6 max-w-2xl mx-auto">
    Discover the world with our expertly crafted travel experiences. We offer customized tours, expert guides, and unforgettable memories.
  </p>
</motion.div>

      {/* <div className="flex justify-center">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Scxs7L0vhZ4"
          title="Travel Overview Video"
          frameBorder="0"
          allowFullScreen
          className="rounded shadow-lg"
        ></iframe>
      </div> */}
    </section>
  );
};

export default Overview;