import React from 'react';
import Marquee from 'react-fast-marquee';
import RMarquee from './RMarquee';
import Overview from './Overview';
import ExtraSections from './ExtraSections';
import Banar from './Banar';
// import TravelTabs from './TravelTabs';

const Home = () => {
    return (
        <div>
             <RMarquee></RMarquee>
             <Banar></Banar>
        <Overview></Overview>
        {/* <TravelTabs></TravelTabs> */}
        <ExtraSections></ExtraSections>
            </div>
    );
};

export default Home;