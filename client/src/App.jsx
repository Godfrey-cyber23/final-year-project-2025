import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes';
import theme from './styles/themes/theme';
import { useAuth } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ToastContainer, useToast } from './hooks/useToast'; // import both

function App() {
  const { initialized } = useAuth();
  const { toasts, dismissToast } = useToast(); // call the hook

  if (!initialized) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <AppRoutes />
      <ToastContainer toasts={toasts} dismissToast={dismissToast} /> {/* pass props */}
    </ThemeProvider>
  );
}

export default App;
