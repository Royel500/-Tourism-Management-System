import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

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
import { ThemeProvider } from './Components/light/ThemeContext.jsx';


Aos.init();
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="roboto">
    <QueryClientProvider client={queryClient}>
       <AuthProvider> 
  <ThemeProvider>

    <RouterProvider
      router={router}>
        </RouterProvider>  

    </ThemeProvider>  
    </AuthProvider>
 
    </QueryClientProvider>

           
    </div>
  </StrictMode>,
)
