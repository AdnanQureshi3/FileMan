import { useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import FilePage from './components/FilePage.jsx'
import UserDashBoard from './components/UserDashBoard'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'

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
  }
])

import './App.css'

function App() {


  return (
       <>
   
    <RouterProvider router= {browserRouter}/>
   
   </>
  )
}

export default App
