import { useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import FilePage from './components/FilePage.jsx'
import UserDashBoard from './components/UserDashBoard'
import PurchasePage from './components/PurchasePage.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import { ThemeProvider } from './Hooks/ThemeContext.jsx'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import './App.css'
import DownloadPage from './components/DownloadPage.jsx'
import FeedbackBox from './components/FeedbackBox.jsx'

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<UserDashBoard />,
    children:[
      {
        path:'/home',
        element:<Home />
      }
      ,{
        path:'/filepage',
        element:<FilePage />
      },
      {
        path:'/plans',
        element:<PurchasePage />
      }
      ,{
    path:'/send-feedback',
    element:<FeedbackBox/>
   }
    ]
  }
  ,{
    path:'login',
    element:<Login />
  },
  {
    path:'signup',
    element:<Signup />
  },
   {
     path:'/f/:shortCode',
     element:<DownloadPage />
   },
   {
    path:'/resetpassword',
    element:<ResetPassword/>
   }
 

])


function App() {


  return (
       <ThemeProvider>
   
    <RouterProvider router= {browserRouter}/>
   
   </ThemeProvider>
  )
}

export default App
