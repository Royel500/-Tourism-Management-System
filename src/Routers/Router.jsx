import React from 'react';

import {
  createBrowserRouter,
  
} from "react-router";
import RootLayout from '../LayOuts/RootLayout';
import Home from '../Pages/Home/Home';
import AuthLAyOut from '../LayOuts/AuthLAyOut';
import LogIn from '../Pages/Authentication/LogIn';
import Register from '../Pages/Authentication/Register';
import AddStory from '../Components/AddStory/AddStory';
import ManageStories from '../Components/AddStory/ManageStories';
import UpdateStory from '../Components/AddStory/UpdateStory';
import JoinAsTourGuide from '../Components/Be A Guide/TourGuide';
import PendingGuid from '../Components/Be A Guide/PendingGuid';
import PrivateRoute from './PrivateRoute';
import DasboardLayout from '../LayOuts/DasboardLayout';
import PendingTourGuides from '../Components/Be A Guide/PendingGuid';
import MakeAdmin from './../Components/RoleSet/MakeAdmin';
import BookNowForm from '../Components/Packages/BookNowFrom';
import AddPackage from '../Components/Packages/AddPackage';
import ManageUsers from '../Components/RoleSet/ManageUsers';
import ManageProfile from '../Components/Profile/ManageProfile';
import AllPackages from '../Components/Packages/AllPackages';
import MyBookings from '../Components/Booking/MyBookings';
import Payment from '../Payment/Payment ';
import MyAssignedTours from '../Components/MyAssignedTours/MyAssignedTours';
import PackageDetails from '../Components/Packages/PackageDetails';
import AboutUs from '../Components/StaticInformation/AboutUs';
import Community from '../Components/AddStory/Community';
import Package from '../Components/Packages/Package';
import TouristProfile from '../Components/Profile/TouristProfile';
import AllGuides from '../Components/Be A Guide/AllGuide';
import GuideDetails from '../Components/Be A Guide/GuideDetails';
import Loading from '../ShearCom/Loading';
import PaymentHistory from '../Payment/PaymentHistory';
import AdminPaymentHistory from '../Payment/AdminPaymentHistory';




 export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    hydrateFallbackElement:<Loading></Loading>,
    children:[
        {
            index:true,
            element:<Home></Home>
        },

        {
      path:'trips',
      element:<Package></Package>
        },
        {
          path:'allGuide',
          element:<AllGuides></AllGuides>
        },
        {
          path:'details/:id',
          element:<GuideDetails></GuideDetails>
        },
        {
          path:'community',
          element:<Community></Community>
        },
          {
        path: 'editstory/:id',
        element: <UpdateStory />
      },
   
      {
        path:'about',
        element:<AboutUs></AboutUs>
      }
            
    ]
  },
  {
    path:'/',
    element:<AuthLAyOut></AuthLAyOut>,
     hydrateFallbackElement:<Loading></Loading>,
    children:[
      {
        path:'/login',
        element:<LogIn></LogIn>
      },
      {
        path:'/register' ,
        element:<Register></Register>
      }
    ]
  },
{
  path:'/dasboard',
  element:<PrivateRoute>
    <DasboardLayout></DasboardLayout>
    
  </PrivateRoute>,
   hydrateFallbackElement:<Loading></Loading>,
  children:[
      {
     index:true,
      element:<AllPackages></AllPackages>
    },
    
    {
      path:'pendingGuide',
      element:<PendingTourGuides/>
    },
    {
      path:'makeAdmin',
      element:<MakeAdmin></MakeAdmin>
    },
    {
      path:'book/:id',
      element:<BookNowForm></BookNowForm>
    },
    {
      path:'addPackage',
      element:<AddPackage></AddPackage>
    },
       {
        path:'tourguide',
        element:<JoinAsTourGuide></JoinAsTourGuide>
      },
    {
      path:'manageUsers',
      element:<ManageUsers></ManageUsers>
    },
    {
      path:'manageProfile',
      element:<ManageProfile></ManageProfile>
    },
    {
     path:'touristProfile',
     element:<TouristProfile></TouristProfile>
    },
    {
      path:'packages',
      element:<AllPackages></AllPackages>
    },
    {
      path:'myBookings',
      element:<MyBookings></MyBookings>
    },
    {
      path:'payment/:bookingId',
      element:<Payment></Payment>
    },
    {
    path:'paymentHistory',
    element:<PaymentHistory></PaymentHistory>
    },
    {
    path:'adminPaymentHistory',
    element:<AdminPaymentHistory></AdminPaymentHistory>
    },
    {
      path:'myAssignedTours',
      element:<MyAssignedTours></MyAssignedTours>
    },
    {
      path:'packageDetails/:id',
      element:<PackageDetails></PackageDetails>
    },
       {
   path:'addstory',
   element:<AddStory></AddStory>
        },
        
        {
          path:'allStory',
          element:<ManageStories></ManageStories>
        },
        

  ]
}
]);