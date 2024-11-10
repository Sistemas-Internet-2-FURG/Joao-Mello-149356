import { useNavigate, useParams } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

type Country = { 
    id: string;
    name: string;
};
type CountryResponse = { 
    data: Country[];
};

type Car = {
    id: string;                     // UUID
    name: string;                   // VARCHAR(255), required
    value?: number;                 // FLOAT, optional
    color?: string;                 // VARCHAR(50), optional
    max_speed?: number;             // INT, optional
    image_url?: string;             // VARCHAR(255), optional
    country_id?: string | null;     // UUID, references country, can be null
    flag_url?: string;              // VARCHAR(255), optional
    added_by_user_id?: string | null; // UUID, references app_user, can be null
};

export function EditCarForm() {
    const navigateTo = useNavigate();
    const { id: urlId } = useParams();

    // Initial state for form fields
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [value, setValue] = useState<number | string>('');
    const [color, setColor] = useState('');
    const [maxSpeed, setMaxSpeed] = useState<number | string>('');
    const [imageUrl, setImageUrl] = useState('');
    const [countryId, setCountryId] = useState('');
    const [addedByUserId, setAddedByUserId] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        async function get(){
            const response = await axios.get(`http://localhost:8080/car`, {
                params: {
                    id: urlId
                },
            });

            const { data } = response;
            setId(data.id);
            setName(data.name);
            setValue(data.value ? convertBRLToNumber(data.value) : "");
            setColor(data.color);
            setMaxSpeed(data.max_speed);
            setImageUrl(data.image_url);
            setCountryId(data.country_id);
            setAddedByUserId(data.added_by_user_id);
        }
        
        if(urlId) get();
    }, [urlId])

    useEffect(() => {
        async function getCountries(){
            const { data } = await axios.get<unknown, CountryResponse>('http://localhost:8080/country');
            setCountries(data);
        }

        getCountries();
    }, []);

    function convertBRLToNumber(brlString: string) {
        // Remove 'R$' symbol and whitespace, replace '.' with '', and ',' with '.'
        const numberString = brlString.replace("R$", "").trim().replace(/\./g, "").replace(",", ".");
        
        // Convert to a number
        const number = parseFloat(numberString);
        
        return number;
      }

    // Navigate to dashboard (home page)
    function handleNavigateToDashboard() {
        navigateTo('/');
    }

    // Handle form submission
    async function handleEditCar(event: FormEvent) {
        event.preventDefault();

        const carData: Car = {
            id,  // You may set this to the actual car id if editing an existing car
            name,
            value: typeof value === 'string' ? parseFloat(value) : value,
            color,
            max_speed: typeof maxSpeed === 'string' ? parseInt(maxSpeed as string) : maxSpeed,
            image_url: imageUrl,
            country_id: countryId,
            added_by_user_id: addedByUserId,
        };

        try {
            await axios.put('http://localhost:8080/put-car', carData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("@token")}` // Include Bearer token if needed
                },
            });
            navigateTo('/'); // Redirect to dashboard or another page
        } catch {
            alert("Erro ao editar carro")
        }
    }

    return (
        <main>
            <button className="put-car-cancel" onClick={handleNavigateToDashboard}>
                ⬅️ Voltar para a listagem
            </button>
            
            <h2 className="put-car-title"> Edite seu carro!</h2>
            <form className="put-car-form" onSubmit={handleEditCar} method="POST">
                <input 
                    className="put-car-component" 
                    type="text" 
                    name="name" 
                    placeholder="Nome do Carro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    className="put-car-component" 
                    type="number" 
                    name="value" 
                    placeholder="Valor"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <input 
                    className="put-car-component" 
                    type="text" 
                    name="color" 
                    placeholder="Cor"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <input 
                    className="put-car-component" 
                    type="number" 
                    name="max_speed" 
                    placeholder="Máxima Velocidade"
                    value={maxSpeed}
                    onChange={(e) => setMaxSpeed(e.target.value)}
                />
                <input 
                    className="put-car-component" 
                    type="text" 
                    name="image_url" 
                    placeholder="URL da Imagem"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <select 
                    className="put-car-component" 
                    name="country_id" 
                    value={countryId} 
                    onChange={(e) => setCountryId(e.target.value)}
                >
                    <option value="" hidden>Selecione o país de origem do carro</option>
                    {countries.map((country) => (
                        <option value={country.id} key={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <button className="put-car-component submit" type="submit">Salvar</button>
            </form>
        </main>
    );
}
