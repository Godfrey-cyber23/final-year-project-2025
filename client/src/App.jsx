import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes';
import theme from './styles/themes/theme';
import { useAuth } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import LoadingSpinner from './components/common/LoadingSpinner';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  const { initialized } = useAuth();

  if (!initialized) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppRoutes />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
