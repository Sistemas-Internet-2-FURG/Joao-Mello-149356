import axios from 'axios';

import { useNavigate } from 'react-router-dom'
import { FormEvent, useEffect, useState } from 'react';

import './styles.css'

type Car = {
    id: string;                    // UUID
    name: string;                  // VARCHAR(255), required
    value?: number;                // FLOAT, optional
    color?: string;                // VARCHAR(50), optional
    max_speed?: number;             // INT, optional
    image_url?: string;             // VARCHAR(255), optional
    country_id?: string;     // UUID, references country, can be null
    flag_url?: string;              // VARCHAR(255), optional
    added_by_user_id: string; // UUID, references app_user, can be null
    added_by_user_name: string; // UUID, references app_user, can be null
};

type CarResponse = { 
  data: Car[]; 
}


export function Dashboard() {
    const navigateTo = useNavigate();

    const loggedIn = localStorage.getItem("@token");
    const user_id = localStorage.getItem("@id");

    const [filter, setFilter] = useState<string>("");
    const [filterType, setFilterType] = useState<string>("");
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        async function getCars(){
            const { data } = await axios.get<unknown, CarResponse>('http://localhost:8080/car', { withCredentials: true });
            setCars(data);
        }

        getCars();
    }, [])


    function handleAddCar() {
        navigateTo("/add-car");
    }

    function handleEditCar(id: string) {
        navigateTo("/edit-car/" + id);
    }

    async function handleDeleteCar(id: string, added_by_user_id: string) {
        await axios.delete<unknown, unknown>('http://localhost:8080/delete-car', {
            params: {
                id,
                added_by_user_id
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("@token")}`, // Add Bearer token if required
            },
            withCredentials: true,
        });

        window.location.reload();
    }

    async function handleFilterCars(event: FormEvent) {
        event.preventDefault();

        const { data } = await axios.get<unknown, CarResponse>('http://localhost:8080/car',{
            params: {
                filter,
                filter_type: filterType
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("@token")}`, // Add Bearer token if required
            },
            withCredentials: true,
        });
        setCars(data);
    }

    return (
        <main>
            { loggedIn && (
                <button className="add-car" onClick={handleAddCar}>
                    Adicionar carro
                </button>
            )}
            
            <h2 className="title">Busque por carros aqui 👇🏾</h2>
            <form onSubmit={handleFilterCars} method="POST">
                <input className="filter-component" type="text" name="filter" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Insira o filtro" />
                <select className="filter-component" name="filter_type" onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                    <option value="name">Nome</option>
                    <option value="country">País</option>
                </select>
                <button className="filter-component submit" type="submit">Filtrar</button>
            </form>
            
            <div className="cars-grid">
                { cars.map((car: Car) => (
                    <div className="car-card" key={car.id}>
                        <img className="country-image" src={car.flag_url} alt={`Flag from country origin of ${car.name} car`} />
                        <img className="car-image" src={car.image_url} alt={`Image of a ${car.name} car`} />
    
                        <section className="car-info-container">
                            <div className="car-info">
                                <span className="car-name">{car.name}</span>
                                <div>
                                    <span>{car.value}</span>
                                    <span> | </span>
                                    <span>{car.color}</span>
                                </div>
                                <span>{car.max_speed} km/h</span>
                                <span className="car-added-user-container">Adicionado por <span className="car-added-user">{car.added_by_user_name}</span></span>
                            </div>
                            <div className="car-actions">
                                { loggedIn && car.added_by_user_id === user_id && (
                                    <>
                                        <button className='car-button' onClick={() => handleEditCar(car.id)}>Editar</button>
                                        <button className='car-button edit' onClick={() => handleDeleteCar(car.id, car.added_by_user_id)}>Excluir</button>
                                    </>
                                )}
                            </div>
                        </section>
                    </div>
                ))}
            </div>
        </main>
    )
}