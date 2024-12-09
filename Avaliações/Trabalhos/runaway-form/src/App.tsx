import { useState, useEffect, ChangeEvent } from 'react';
import './App.css';

const App = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isValid, setIsValid] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({});
  const [allowTransform, setAllowTransform] = useState(true);

  const validateInput = async (field: string, value: string) => {
    try {
      // Simulate a server-side validation
      const response = await fetch('http://localhost:3000/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
      });
      const result = await response.json();
      return result.isValid;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Get variables from change event and state 
    let email = formData.email;
    let password = formData.password;
    if(name === "email") email = value
    if(name === "password") password = value

    // Validate both fields to check overall form validity
    const isEmailValid = await validateInput('email', email);
    const isPasswordValid = await validateInput('password', password);
    
    setIsValid(isEmailValid && isPasswordValid);
  };

  const handleMouseEnter = () => {
    if (!isValid && allowTransform) {
      const randomX = Math.random() * 400 - 150; // Random offset between -150 and 150
      const randomY = Math.random() * 200 - 50;  // Random offset between -50 and 50
      setButtonStyle({
        transform: `translate(${randomX}px, ${randomY}px)`,
        transition: 'transform 0.2s',
      });
      setAllowTransform(false);
      setTimeout(() => { setAllowTransform(true) },200);
    }
  };

  useEffect(() => {
    if (isValid) {
      setButtonStyle({}); // Keep button in place when valid
    }
  }, [isValid]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
    <h2>Guess the credentials !</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>
      <button
        type="submit"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
      >
        Submit
      </button>
    </form>
  );
};

export default App;
