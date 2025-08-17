import React, { useContext, useState } from 'react';
import { ThemeContext } from '../light/ThemeContext';
import { NavLink, Link, useNavigate } from 'react-router';
import Logo from '../Logo';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosecure from '../../hooks/useAxiosecure';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosecure();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext); // use theme context
  const [menuOpen, setMenuOpen] = useState(false);

  const logOutt = async () => {
    try {
      await axiosSecure.post('/api/auth/logout', { email: user?.email });
      await logOut();
      Swal.fire({ title: "Logged out successfully!", icon: "success" });
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const navItems = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/about">About Us</NavLink></li>
      <li><NavLink to="/community">Community</NavLink></li>
      <li><NavLink to="/trips">All Trips</NavLink></li>
      {user && <li><NavLink to="/dasboard">Dashboard</NavLink></li>}
    </>
  );

  return (
    <div className="navbar bg-base-100 dark:bg-gray-900 shadow-sm text-base-content dark:text-white">
      <div className="navbar-start">
        <Logo />
        <div className="lg:hidden ml-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      <div className={`navbar-center lg:flex ${menuOpen ? 'block' : 'hidden'} lg:block`}>
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>

      <div className="navbar-end flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="btn btn-sm btn-outline">
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>

        {/* User Dropdown */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL} alt="Profile" />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 dark:bg-gray-800 rounded-box w-60">
              <li className="text-center font-semibold">{user.displayName}</li>
              <li className="text-center text-sm text-gray-500 dark:text-gray-300">{user.email}</li>
              <div className="divider my-1"></div>
              <li><Link to="/dasboard">Dashboard</Link></li>
              <li>
                <button onClick={logOutt} className="text-left w-full">Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/register" className="btn mx-2 btn-sm">Register</Link>
            <Link to="/login" className="btn btn-sm">Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
