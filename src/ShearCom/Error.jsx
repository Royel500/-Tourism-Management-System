import React from 'react';
import { Link, NavLink } from 'react-router';

const Error = () => {
    return (
        <div className='flex flex-col items-center py-20 bg-blue-50 space-y-5'>
       
        <img src="https://i.ibb.co.com/Q7Zp8jw2/Error-1.jpg" alt="" />
        <h1 className='text-4xl font-bold text-fuchsia-600'> Page Not Found</h1>
        <h1 className='text-2xl font-bold '> This is Custom Error page </h1>
        <p>Opps!!! The Page You're Looking for doesn't exist! </p>

<NavLink to='/'>
    <button className='btn bg-cyan-600'>Back to Home</button>
</NavLink>        {/* <NavLink to='/'><button className='btn bg-cyan-600'>Back to Home</button></NavLink> */}
     </div>
    );
};

export default Error;