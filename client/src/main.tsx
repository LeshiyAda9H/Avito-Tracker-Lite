import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const avitoTheme = createTheme({
  palette: {
    primary: { main: '#00A550' }, // Зеленый Avito
    background: { default: '#F7F7F7' }, // Светлый фон
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={avitoTheme}>
    <App />
  </ThemeProvider>
);