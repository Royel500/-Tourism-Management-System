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
// import PrivateRoute from './PrivateRoute';
// import DasboardLayout from '../LayOuts/DasboardLayout';




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
          path:'/allStory',
          element:<ManageStories></ManageStories>
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
//   {
//     path:'/dasboard',
//     element:<PrivateRoute>
//       <DasboardLayout></DasboardLayout>
//     </PrivateRoute>,
//  children:[
  
 
//  ]
//   }
]);