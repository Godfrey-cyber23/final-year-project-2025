import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes';
import theme from './styles/themes/theme';
import { useAuth } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { initialized } = useAuth();

  if (!initialized) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
        <AppRoutes />
    </ThemeProvider>
  );
}

export default App;