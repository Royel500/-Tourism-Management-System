import React from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  FaHome,
  FaBoxOpen,
  FaHistory,
  FaMapMarkedAlt,
  FaUserFriends,
  FaUserClock,
  FaRegCalendarCheck
} from 'react-icons/fa';
import useRole from '../hooks/useRole';

const DasboardLayout = () => {
  const {role, roleLoading} = useRole();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="navbar bg-base-300 lg:hidden w-full">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 text-xl font-bold">Dashboard</div>
        </div>

        {/* Main Page Content Here */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-2">
          {/* Sidebar Links with React Icons */}
          <li>
            <NavLink to="/" className="flex items-center gap-2">
              <FaHome className="text-lg" /> Home
            </NavLink>
          </li>
        <NavLink to="/dasboard/packages" className="menu-item">
  📦 All Packages
</NavLink>
         
        
      { !roleLoading && role=== 'admin' &&
        <>
                <li>
          <NavLink to="/dasboard/manageProfile" className="flex items-center gap-2">
            <FaRegCalendarCheck className="text-lg" /> Manage Profile
          </NavLink>
        </li>
                {/* <li>
          <NavLink to="/dasboard/book" className="flex items-center gap-2">
            <FaRegCalendarCheck className="text-lg" /> Book Now
          </NavLink>
        </li> */}
                <li>
          <NavLink to="/dasboard/addPackage" className="flex items-center gap-2">
            <FaRegCalendarCheck className="text-lg" /> Add Package
          </NavLink>
        </li>

         
          <li>
            <NavLink to="/dasboard/makeAdmin" className="flex items-center gap-2">
           <FaUserClock className="text-lg" />   Admin Page
            </NavLink>
          </li>
          <li>

          </li>

            <li>
            <NavLink to="/dasboard/pendingGuide" className="flex items-center gap-2">
              <FaBoxOpen className="text-lg" /> Manage Candidates
            </NavLink>
          </li>
            <li>
            <NavLink to="/dasboard/manageUsers" className="flex items-center gap-2">
              <FaBoxOpen className="text-lg" /> Manage Users
            </NavLink>
          </li>

        </>
      }
      {!roleLoading && role === 'Tourist' || role === 'admin' && 
      <>
      
         <li>
            <NavLink to="/dasboard/myBookings" className="flex items-center gap-2">
              <FaBoxOpen className="text-lg" /> My Bookings
            </NavLink>
          </li>
      </>}

        </ul>
      </div>
    </div>
  );
};

export default DasboardLayout;
