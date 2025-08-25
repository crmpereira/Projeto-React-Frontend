import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";


export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      // Simulando um atraso para demonstrar o loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        setErro("Usuário ou senha inválidos.");
        setLoading(false);
        return;
      }

      await response.json(); // Recebe os dados do servidor
      setSnackbar({
        open: true,
        message: "Login realizado com sucesso!",
        severity: "success",
      });
      
      // Se a prop onLoginSuccess existir, chame-a
      if (typeof onLoginSuccess === 'function') {
        // Espera um pouco para mostrar a mensagem de sucesso antes de redirecionar
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card elevation={3} sx={{ width: '100%', maxWidth: 450, borderRadius: 2, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            p: 2, 
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white'
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Login do Sistema
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="senha"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            {erro && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {erro}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{ 
                mt: 2, 
                mb: 2, 
                py: 1.2,
                borderRadius: 8,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              {loading ? 'Processando...' : 'Entrar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* Snackbar para feedback */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}