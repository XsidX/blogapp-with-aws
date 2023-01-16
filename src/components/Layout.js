import React from 'react'
import Navbar from './Navbar'


const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="md:max-w-4xl px-4 md:mx-auto border border-gray-100">
        {children}
      </div>
    </div>
  )
}

export default Layout