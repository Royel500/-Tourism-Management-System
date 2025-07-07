import React from 'react';
import { motion } from "framer-motion";
import { GiCommercialAirplane } from "react-icons/gi";

const Logo = () => {
    return (

            <div className="flex  items-end ">
<GiCommercialAirplane size={30} className="text-red-500  text-2xl" />
                  <motion.label
      className="text-3xl ml-2 font-extrabold"
      animate={{
        color: [ 

          "#e11d48", // rose
          "#3b82f6", // blue
          "#10b981", // green
          "#f59e0b", // amber
          "#8b5cf6", // violet
          "#ec4899", // pink
          "#14b8a6", // teal
          "#f43f5e", // red
          "#e11d48"]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      Tourism 
    </motion.label>
            </div>
   
    );
};

export default Logo;