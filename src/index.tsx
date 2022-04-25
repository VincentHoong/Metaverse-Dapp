import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: '"Press Start 2P", cursive',
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_APP_ID ?? ""}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL ?? ""}
    >
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
