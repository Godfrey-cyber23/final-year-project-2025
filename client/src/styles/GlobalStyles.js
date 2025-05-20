import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset and Base Styles */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
    margin-bottom: 0.5em;
  }

  /* Links */
  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  /* Material-UI Overrides */
  .MuiPaper-root {
    box-shadow: ${({ theme }) => theme.shadows[2]} !important;
    border-radius: 8px !important;
    overflow: hidden;
  }

  .MuiButton-root {
    text-transform: none !important;
    font-weight: 500 !important;
    border-radius: 6px !important;
  }

  /* Loading States */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.background.paper};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0.9;
    backdrop-filter: blur(2px);

    &.hidden {
      display: none;
    }
  }

  .loading-spinner {
    border: 4px solid ${({ theme }) => theme.palette.grey[200]};
    border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Form Elements */
  input, button, textarea, select {
    font: inherit;
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.palette.grey[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.palette.grey[400]};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.palette.grey[500]};
    }
  }

  /* Animation Helpers */
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export default GlobalStyles;