import React from 'react'
import Navbar from './Navbar'


const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="md:max-w-4xl px-4 pb-6 md:mx-auto">
        {children}
      </div>
    </div>
  )
}

export default Layout