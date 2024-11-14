import { Header } from './components/header';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

import './App.css';
import { useEffect } from 'react';

function App() {
  const { pathname } = useLocation();

  useEffect(() =>{
    // Assuming JWT token is stored in localStorage under the key "token"
    const token = localStorage.getItem('@token');
    
    // Set the token as a cookie
    document.cookie = `jwt=${token}; path=/; Secure; SameSite=Strict`;
  }, [pathname])

  if(localStorage.getItem("@token") === null && pathname !== "/"){
    return (
      <Navigate to="/login" replace />
    )
  }

  return (
    <div className='viewport'>
        {/* Shared Header */}
        <Header />

        {/* Render component */}
        <Outlet/>
    </div>
  )
}

export default App
