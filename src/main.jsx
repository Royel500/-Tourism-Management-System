import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import { router } from './Routers/Router.jsx'
import 'aos/dist/aos.css';
import Aos from 'aos'
import AuthProvider from './Contexts/AuthProvider.jsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


Aos.init();
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="roboto">
    <QueryClientProvider client={queryClient}>
       <AuthProvider> 
    <RouterProvider
      router={router}></RouterProvider>  
    </AuthProvider>
 
    </QueryClientProvider>

           
    </div>
  </StrictMode>,
)
