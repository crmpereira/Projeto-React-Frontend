import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  TextField,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import theme from '../theme';

export default {
  title: 'Design System/Theme',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

const ThemeShowcase = () => (
  <ThemeProvider theme={theme}>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sistema de Gestão - Design System
      </Typography>
      
      <Stack spacing={4}>
        {/* Cores */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Paleta de Cores
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Typography variant="caption">Primary</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'secondary.main',
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Typography variant="caption">Secondary</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'error.main',
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Typography variant="caption">Error</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Botões */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Botões
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button variant="contained" startIcon={<AddIcon />}>
              Adicionar
            </Button>
            <Button variant="contained" color="secondary" startIcon={<EditIcon />}>
              Editar
            </Button>
            <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
              Excluir
            </Button>
            <Button variant="outlined" startIcon={<SaveIcon />}>
              Salvar
            </Button>
          </Stack>
        </Paper>

        {/* Tipografia */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tipografia
          </Typography>
          <Stack spacing={1}>
            <Typography variant="h4">Heading 4 - Título Principal</Typography>
            <Typography variant="h6">Heading 6 - Subtítulo</Typography>
            <Typography variant="body1">Body 1 - Texto principal do sistema</Typography>
            <Typography variant="body2" color="text.secondary">
              Body 2 - Texto secundário e descrições
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Caption - Legendas e informações auxiliares
            </Typography>
          </Stack>
        </Paper>

        {/* Componentes */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Componentes
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Cards
              </Typography>
              <Card sx={{ maxWidth: 300 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Card de Exemplo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Este é um exemplo de card usando o tema personalizado do projeto.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Campos de Formulário
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField label="Nome" variant="outlined" size="small" />
                <TextField label="Email" variant="outlined" size="small" />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Chips e Status
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Ativo" color="primary" size="small" />
                <Chip label="Inativo" color="default" size="small" />
                <Chip label="Pendente" color="secondary" size="small" />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Alertas
              </Typography>
              <Stack spacing={1}>
                <Alert severity="success">Operação realizada com sucesso!</Alert>
                <Alert severity="error">Erro ao processar a solicitação.</Alert>
                <Alert severity="warning">Atenção: Verifique os dados informados.</Alert>
                <Alert severity="info">Informação: Sistema atualizado.</Alert>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  </ThemeProvider>
);

export const Default = {
  render: () => <ThemeShowcase />,
};

export const ButtonVariants = {
  render: () => (
    <ThemeProvider theme={theme}>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h6">Variações de Botões</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" size="small">Small</Button>
          <Button variant="contained" size="medium">Medium</Button>
          <Button variant="contained" size="large">Large</Button>
        </Stack>
      </Stack>
    </ThemeProvider>
  ),
};

export const ColorPalette = {
  render: () => (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Paleta de Cores Completa
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary">Primary</Button>
            <Button variant="contained" color="secondary">Secondary</Button>
            <Button variant="contained" color="error">Error</Button>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" color="primary">Primary</Button>
            <Button variant="outlined" color="secondary">Secondary</Button>
            <Button variant="outlined" color="error">Error</Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  ),
};