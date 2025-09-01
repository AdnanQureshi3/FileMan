import { useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import FilePage from './components/FilePage.jsx'
import UserDashBoard from './components/UserDashBoard'
import PurchasePage from './components/PurchasePage.jsx'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import VerifyPage from './components/VerifyPage.jsx'
import './App.css'
import DownloadPage from './components/DownloadPage.jsx'

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
    path:'verify',
    element:<VerifyPage/>
   }

])


function App() {


  return (
       <>
   
    <RouterProvider router= {browserRouter}/>
   
   </>
  )
}

export default App
