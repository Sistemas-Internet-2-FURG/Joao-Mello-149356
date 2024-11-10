import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './styles.css';

interface Login {
    id: string;
    name: string;
    email: string;
    token: string;
}

interface LoginResponse {
    data: Login   
}

export function Login() {
    const navigateTo = useNavigate();
    
    // State for controlled inputs
    const [fname, setName] = useState('');
    const [femail, setEmail] = useState('');

    async function handleLogin(event: FormEvent) {
        event.preventDefault();
        // Implement your login logic here, using the `name` and `email` state variables
        
        const payload = {
            name: fname,
            email: femail,
        }

        const { data: { id, name, email, token }} = await axios.post<unknown, LoginResponse>('http://localhost:8080/login', payload);
        localStorage.setItem("@token", token);
        localStorage.setItem("@name", name);
        localStorage.setItem("@email", email);
        localStorage.setItem("@id", id);
        
        navigateTo("/");
    }

    return (
        <main className='login'>
            <h2 className="login-title">Faça seu login</h2>
            <form className="login-form" onSubmit={handleLogin} method="POST">
                <input
                    className="login-component"
                    type="text"
                    name="name"
                    required
                    placeholder="Insira seu nome"
                    value={fname}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="login-component"
                    type="text"
                    name="email"
                    required
                    placeholder="Insira seu e-mail"
                    value={femail}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="login-component submit" type="submit">
                    Entrar
                </button>
            </form>
        </main>
    );
}
