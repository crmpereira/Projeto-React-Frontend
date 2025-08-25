import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Azul principal
      contrastText: "#fff",
    },
    secondary: {
      main: "#9c27b0", // Roxo secundário
      contrastText: "#fff",
    },
    error: {
      main: "#d32f2f", // Vermelho para ações de delete
    },
    background: {
      default: "#f5f5f5",
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // bordas arredondadas
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
        },
        columnHeaders: {
          fontWeight: "bold",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {},
      },
    },
  },
});

export default theme;
