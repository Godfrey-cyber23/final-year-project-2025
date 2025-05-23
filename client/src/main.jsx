import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { DetectionProvider } from "./contexts/DetectionContext";
import { SocketProvider } from "./contexts/SocketContext";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import theme from "./styles/themes/theme";
import { store, persistor } from "./redux/store";
import GlobalStyles from "./styles/GlobalStyles";
import LoadingSpinner from './components/common/LoadingSpinner';
import { Button, Box, Typography } from "@mui/material";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught:", error, errorInfo);
    // You can log errors to an error reporting service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Application Error
          </Typography>
          <Typography variant="body1" paragraph>
            Something went wrong in the application. Our team has been notified.
          </Typography>
          <Typography variant="caption" paragraph sx={{ mb: 3 }}>
            {this.state.error?.toString()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReset}
          >
            Reload Application
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Root Component with Error Boundary
const Root = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [initError, setInitError] = React.useState(null);

  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate initialization (replace with actual async calls)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error("Initialization failed:", error);
        setInitError(error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (initError) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Failed to initialize application
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return <App />;
};

// Main App Render
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>
          <Provider store={store}>
            <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
              <ErrorBoundary>
                <SocketProvider>
                  <ErrorBoundary>
                    <AuthProvider>
                      <ErrorBoundary>
                        <DetectionProvider>
                          <ErrorBoundary>
                            <Root />
                          </ErrorBoundary>
                        </DetectionProvider>
                      </ErrorBoundary>
                    </AuthProvider>
                  </ErrorBoundary>
                </SocketProvider>
              </ErrorBoundary>
            </PersistGate>
          </Provider>
        </BrowserRouter>
      </StyledThemeProvider>
    </MuiThemeProvider>
  </React.StrictMode>
);