import { useNavigate } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';
import './styles.css';
import axios from 'axios';

type Country = { 
    id: string;
    name: string;
};

type CountryResponse = { 
   data: Country[];
};


export function AddCarForm() {
    const navigateTo = useNavigate();

    // State for form inputs
    const [name, setName] = useState('');
    const [value, setValue] = useState<number | string>('');
    const [color, setColor] = useState('');
    const [maxSpeed, setMaxSpeed] = useState<number | string>('');
    const [imageUrl, setImageUrl] = useState('');
    const [countryId, setCountryId] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        async function getCountries(){
            const { data } = await axios.get<unknown, CountryResponse>('http://localhost:8080/country');
            setCountries(data);
        }

        getCountries();
    }, []);

    // Navigate to dashboard
    function handleNavigateToDashboard() {
        navigateTo('/');
    }

    // Handle form submission
    async function handleAddCar(event: FormEvent) {
        event.preventDefault();

        const carData = {
            name,
            value: typeof value === 'string' ? parseFloat(value) : value,
            color,
            max_speed: typeof maxSpeed === 'string' ? parseInt(maxSpeed as string) : maxSpeed,
            image_url: imageUrl,
            country_id: countryId,
        };

        try {
            await axios.post('http://localhost:8080/add-car', carData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("@token")}` // Include Bearer token if needed
                },
            });
            navigateTo('/'); // Redirect to dashboard or another page
        } catch {
            alert("Erro ao adicionar carro")
        }
    }

    return (
        <main>
            <button className="add-car-cancel" onClick={handleNavigateToDashboard}>
                ⬅️ Voltar para a listagem
            </button>
            
            <h2 className="add-car-title"> Adicione um novo carro!</h2>
            <form className="add-car-form" onSubmit={handleAddCar}>
                <input 
                    className="add-car-component" 
                    type="text" 
                    name="name" 
                    placeholder="Insira o nome do carro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                />
                <input 
                    className="add-car-component" 
                    type="number" 
                    name="value" 
                    placeholder="Insira o valor do carro"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required 
                />
                <input 
                    className="add-car-component" 
                    type="text" 
                    name="color" 
                    placeholder="Insira a cor do carro"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required 
                />
                <input 
                    className="add-car-component" 
                    type="number" 
                    name="max_speed" 
                    placeholder="Insira a velocidade máxima do carro"
                    value={maxSpeed}
                    onChange={(e) => setMaxSpeed(e.target.value)}
                    required 
                />
                <fieldset className="add-car-form-fieldset">
                    <input 
                        className="add-car-component" 
                        type="text" 
                        name="image_url" 
                        placeholder="Insira a url da imagem do carro"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)} 
                    />
                    <span className="add-car-tip">
                        * Dica: para obter imagens bonitas, use 
                        <a href="https://stock.adobe.com/br" target="_blank" rel="noopener noreferrer">esse</a> site
                    </span>
                </fieldset>
                <select 
                    className="add-car-component" 
                    name="country_id" 
                    value={countryId} 
                    onChange={(e) => setCountryId(e.target.value)}
                    required
                >
                    <option value="" hidden>Selecione o país de origem do carro</option>
                    {countries.map((country: Country) => (
                        <option value={country.id} key={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <input className="add-car-component submit" type="submit" value="Cadastrar" />
            </form>
        </main>
    );
}
