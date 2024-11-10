import App from './App';
import { AddCarForm }  from './components/add-car-form';
import { EditCarForm }  from './components/edit-car-form';
import { createBrowserRouter } from 'react-router-dom';
import { Login } from './components/login';
import { Dashboard } from './components/dashboard';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
          index: true,
          element: <Dashboard />
      },
      {
        path: "add-car",
        element: <AddCarForm />,
      },
      {
        path: "edit-car/:id",
        element: <EditCarForm />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
