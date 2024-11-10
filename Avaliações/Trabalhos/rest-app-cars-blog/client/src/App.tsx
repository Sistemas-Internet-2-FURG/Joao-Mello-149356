import { Header } from './components/header';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

import './App.css';

function App() {
  const { pathname } = useLocation();
  
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
