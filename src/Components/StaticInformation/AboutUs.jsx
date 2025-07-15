import React from 'react';
import { FaGithub, FaLinkedin, FaExternalLinkAlt } from 'react-icons/fa';
import photo from '/photo.jpg'
const AboutUs = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-center text-blue-700">About the Developer</h2>

      <div className="text-center">
        <img
          src={photo} // use your real profile photo URL here
          alt="Developer"
          className="w-32 h-32 rounded-full mx-auto border-4 border-blue-400"
        />
        <h3 className="text-xl font-semibold mt-4">Md. Royel Ali</h3>
        <p className="text-gray-600">Full Stack Web Developer</p>
      </div>

      <div>
        <p className="text-gray-700 text-justify">
          I'm a passionate full-stack developer with expertise in React, Node.js, Express, and MongoDB. I love building
          user-friendly and responsive web applications. I have completed multiple full-stack projects including
          e-commerce platforms, educational dashboards, tourism management systems, and parcel delivery apps.
        </p>
      </div>

      <div className="text-center">
        <p className="font-semibold text-lg">Total Projects Completed: <span className="text-blue-600">50+</span></p>
      </div>
        {/* Website Functionality Section */}
      <div className="bg-blue-50 p-4 rounded shadow">
        <h4 className="text-xl font-bold text-blue-800 mb-2">🌐 Website Functionality (Tourism Management System)</h4>
        <ul className="list-disc pl-6 text-gray-800 space-y-1">
          <li>Tourists can browse and book tour packages securely.</li>
          <li>Tour guides can apply to join and manage assigned tours.</li>
          <li>Admins can manage users, approve tour guides, and add new packages.</li>
          <li>Stripe payment integration for secure booking payments.</li>
          <li>Role-based dashboard for tourists, guides, and admins.</li>
          <li>Package management with multiple image uploads.</li>
          <li>Real-time booking status updates (pending, in-review, accepted, rejected).</li>
          <li>Responsive UI built with Tailwind CSS and DaisyUI.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h4 className="text-xl font-semibold text-gray-800">Featured Projects</h4>
        <ul className="list-disc pl-6 text-blue-700">
          <li>
            <a href="https://assignment-rs-10.web.app" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Assignment Management App <FaExternalLinkAlt className="inline ml-1" />
            </a>
          </li>
          <li>
            <a href="https://deluxe-melba-c4d69e.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Portfolio Website <FaExternalLinkAlt className="inline ml-1" />
            </a>
          </li>
          <li>
            <a href="https://assignment-11-c11e7.web.app" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Tourism & Travel App <FaExternalLinkAlt className="inline ml-1" />
            </a>
          </li>
        </ul>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <a href="https://github.com/Royel500" target="_blank" rel="noopener noreferrer">
          <FaGithub size={28} className="text-gray-800 hover:text-black" />
        </a>
        <a href="linkedin.com/in/md-royel-ali-b1ab45372" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={28} className="text-blue-700 hover:text-blue-800" />
        </a>
        <a
          href="https://drive.google.com/file/d/17I8aNvHcyzi4x9JUOs1e2bJt1SGisml_/view?usp=sharing" // resume link
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:bg-emerald-300 border px-2 font-medium"
        >
          Resume
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
