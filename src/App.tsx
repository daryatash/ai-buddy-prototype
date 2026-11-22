import { BrowserRouter } from 'react-router-dom';
import './normalize.css'
import AppRouter from './router/AppRouter';


export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRouter />
    </BrowserRouter>
  );
}