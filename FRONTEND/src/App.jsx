import React from 'react'
import axios from "axios"
import {Route , Routes} from "react-router"
import Home from './Components/Home'


function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
  
  )
}

export default App