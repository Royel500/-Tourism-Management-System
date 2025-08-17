import React from 'react';
import { NavLink, Link, useNavigate, } from 'react-router';
import Logo from '../Logo';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import './navbar.css'
import useAxiosecure from '../../hooks/useAxiosecure';


const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
   const axiosSecure = useAxiosecure();
   
const logOutt = async () => {
  try {
    // 1️⃣ Update backend to mark user as offline
    await axiosSecure.post('/api/auth/logout', {
      email: user?.email, // get from your auth context or user state
    });

    // 2️⃣ Call your existing logOut function (Firebase, etc.)
    await logOut();

    // 3️⃣ Show success message
    Swal.fire({
      title: "Logged out successfully!",
      icon: "success",
    });

    // 4️⃣ Redirect to home
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
       <li><NavLink to="/trips">All Trips Page </NavLink></li>

      
          <li><NavLink to="/dasboard">Dasboard</NavLink></li>
          
  
    </>
  );

  return (
    <div className="navbar bg-gray-300 shadow-sm ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {navItems}
          </ul>
        </div>
        <Logo />
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>

      <div className="navbar-end">
       {user ? (
  <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <img src={user.photoURL} alt="Profile" />
      </div>
    </div>
    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60">
      <li className="text-center font-semibold">{user.displayName}</li>
      <li className="text-center text-sm text-gray-500">{user.email}</li>
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
