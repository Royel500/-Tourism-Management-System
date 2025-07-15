import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import banner1 from '/Ass_1jpg.jpg'
import banner2 from '/ass_2.jpg'
import banner3 from '/ass_3.jpg'
import banner4 from '/ass_4.jpg'
import banner5 from '/ass_5.jpg'


  const Banar = () => {
    return (
  <Carousel
  autoPlay={true}
  infiniteLoop={true}
  interval={2000} // 2 seconds between slides
  showThumbs={false}
  showStatus={false}
>
               
            <div className=''>
                    <img className='h-90 w-full' src={banner1} />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img className='h-90 w-full' src={banner2} />
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img className='h-90 w-full' src={banner3} />
                    <p className="legend">Legend 3</p>
                </div>
                <div>
                    <img className='h-90 w-full' src={banner4} />
                    <p className="legend">Legend 4</p>
                </div>
                <div>
                    <img className='h-90 w-full' src={banner5} />
                    <p className="legend">Legend 5</p>
                </div>

            </Carousel>
    );
};

export default Banar;