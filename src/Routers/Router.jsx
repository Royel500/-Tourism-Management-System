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
import ManageProfile from '../Components/RoleSet/ManageProfile';
import AllPackages from '../Components/Packages/AllPackages';
import MyBookings from '../Components/Booking/MyBookings';




 export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children:[
        {
            index:true,
            element:<Home></Home>
        },
        {
          path:'addstory',
          element:<AddStory></AddStory>
        },
        {
          path:'allStory',
          element:<ManageStories></ManageStories>
        },
     {
  path: 'editstory/:id',
  element: <UpdateStory />
},
{
  path:'tourguide',
  element:<JoinAsTourGuide></JoinAsTourGuide>
}
      
    ]
  },
  {
    path:'/',
    element:<AuthLAyOut></AuthLAyOut>,
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
  children:[
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
      path:'manageUsers',
      element:<ManageUsers></ManageUsers>
    },
    {
      path:'manageProfile',
      element:<ManageProfile></ManageProfile>
    },
    {
      path:'packages',
      element:<AllPackages></AllPackages>
    },
    {
      path:'myBookings',
      element:<MyBookings></MyBookings>
    }

  ]
}
]);