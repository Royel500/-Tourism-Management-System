import React from 'react';
import Marquee from 'react-fast-marquee';
import RMarquee from './RMarquee';
import Overview from './Overview';
import ExtraSections from './ExtraSections';
import Banar from './Banar';
// import TravelTabs from './TravelTabs';
import TravelTabs from './TravelTabs';
import TouristStories from './TouristStories';
import Animation from '../../Components/AdditionalSection/Animation';

const Home = () => {
    return (
        <div>
             <RMarquee></RMarquee>
             <Banar></Banar>
        <Overview></Overview>
          <TravelTabs></TravelTabs>
          <TouristStories></TouristStories>
          <Animation></Animation>
        <ExtraSections></ExtraSections>
            </div>
    );
};

export default Home;