import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../ShearCom/Navbar/Navbar';
import Footer from '../ShearCom/Footer';

const RootLayout = () => {
    return (
        <div>
            <div className='sticky top-0 z-999'>
            <Navbar></Navbar>
            </div>
            
          <main className=""> {/* if navbar is fixed */}
    <Outlet />
  </main>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;