import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AllPackages from '../../Components/Packages/AllPackages';
import AllGuides from '../../Components/Be A Guide/AllGuide';
import HomePackage from '../../Components/Packages/HomaPackage';


const TravelTabs = () => {
  return (
    <section className="px-6 py-10 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Explore More</h2>
      <Tabs>
        <TabList>
          <Tab>Our Packages</Tab>
          <Tab>Meet Our Tour Guides</Tab>
        </TabList>

        <TabPanel>
          <HomePackage></HomePackage>
        </TabPanel>
        <TabPanel>
          <AllGuides></AllGuides>
        </TabPanel>
      </Tabs>
    </section>
  );
};

export default TravelTabs ;
