import { useNavigate } from 'react-router-dom';

import './styles.css'

export function Header() {
    const navigateTo = useNavigate();

    const loggedIn = localStorage.getItem("@token") !== null;
    const name = localStorage.getItem("@name");

    function handleLogout() {
        localStorage.removeItem("@token");
        localStorage.removeItem("@name");
        localStorage.removeItem("@email");
        localStorage.removeItem("@id");

        window.location.reload();
    }

    function handleLogin(){
        navigateTo("/login");
    }

    return (
        <header className="header">
        <svg width="100" height="50" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
            {/* Car Body */}
            <path d="M10 30 L20 20 H80 L90 30 V35 H10 Z" fill="#FFFFFF" stroke="#000" strokeWidth="2"/>
            {/* Wheels */}
            <circle cx="20" cy="35" r="5" fill="#333" stroke="#000" strokeWidth="2"/>
            <circle cx="80" cy="35" r="5" fill="#333" stroke="#000" strokeWidth="2"/>
        </svg>
        <div className="side-info">
            <span className="header-title">
                { loggedIn 
                    ? "Bem vindo ao local para saber de carros, " + name
                    :   <>
                            <span>Faça seu login para cadastrar seu carro</span>
                            &nbsp;
                            <span className='header-title-nav' onClick={handleLogin}>aqui</span>
                        </>
                }
                
            </span>
            
            <button className="logout" onClick={handleLogout}>
                <span>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {/* Door icon */}
                        <path d="M6 2H18c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v16h12V4H6zm7 7v-2h-5v2h5zm0 4v-2h-5v2h5z" fill="#000"/>
                        {/* Arrow icon */}
                        <path d="M16.59 13.59L14.17 16l-1.42-1.42L15.34 12l-2.59-2.59L14.17 8l2.42 2.42L18.83 12l-2.42 2.42z" fill="#000"/>
                    </svg>
                </span>
            </button>
        </div>
    </header>
)
}