import React from "react";
import Marquee from "react-fast-marquee";


const RMarquee = () => {
  return (
    <div >
   
      <Marquee speed={60} pauseOnHover={true} gradient={false}
       className=" bg-green-500 py-3 my-1"> 
       <p>  🌍 Welcome to our Tourism Management System — Your gateway to seamless trip planning, 
        destination discovery, and unforgettable travel experiences! ✈️🗺️</p>
      </Marquee>
    </div>
  );
};

export default RMarquee;
