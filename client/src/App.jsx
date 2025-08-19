import { useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import FilePage from './components/FilePage.jsx'
import MainLayout from './components/MainLayout.jsx'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout />,
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
