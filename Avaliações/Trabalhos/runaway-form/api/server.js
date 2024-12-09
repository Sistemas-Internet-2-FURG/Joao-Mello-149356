import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

// Fake user credentials
const fakeUser = {
  email: 'email@test.com',
  password: 'pass',
};

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow all origins for testing purposes

app.get('/', (req, res) => {
  res.json({ ok: 'ok' });
})

// Endpoint to validate form input
app.post('/api/validate', (req, res) => {
  const { field, value } = req.body;

  if (!field || !value) {
    return res.status(400).json({ isValid: false, message: 'Missing field or value' });
  }

  let isValid = false;

  if (field === 'email') {
    isValid = value === fakeUser.email;
  } else if (field === 'password') {
    isValid = value === fakeUser.password;
  }

  res.json({ isValid });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
