import React from 'react'
import { Route, Routes } from "react-router-dom";
import AdminHome from './pages/AdminHome';

const App = () => {
  return (
    <div>
       <Routes>
        <Route path="/" element={<AdminHome/>}/>
       </Routes>
    </div>
  )
}

export default App
