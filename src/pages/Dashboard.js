import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  useMediaQuery,
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Estados from '../components/estado';
import Clientes from '../components/cliente';

const drawerWidth = 240;

export default function Dashboard({ onLogout }) {
  const [open, setOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fecha o drawer automaticamente em telas pequenas
  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuSelect = (menuItem) => {
    setSelectedMenu(menuItem);
    if (isMobile) {
      setOpen(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'estados', text: 'Estados', icon: <PublicIcon /> },
    { id: 'clientes', text: 'Clientes', icon: <PeopleIcon /> },
    { id: 'usuarios', text: 'Usuários', icon: <PeopleIcon /> },
    { id: 'relatorios', text: 'Relatórios', icon: <BarChartIcon /> },
    { id: 'configuracoes', text: 'Configurações', icon: <SettingsIcon /> },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Dashboard
              </Typography>
              <Grid container spacing={3}>
                {/* Card de Estatísticas 1 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                    <CardHeader
                      title="Estados Cadastrados"
                      titleTypographyProps={{ variant: 'h6' }}
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                        color: 'white',
                      }}
                    />
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                          27
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                {/* Card de Estatísticas 2 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                    <CardHeader
                      title="Clientes Cadastrados"
                      titleTypographyProps={{ variant: 'h6' }}
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.dark} 90%)`,
                        color: 'white',
                      }}
                    />
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                          8
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                {/* Card de Estatísticas 3 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                    <CardHeader
                      title="Usuários Ativos"
                      titleTypographyProps={{ variant: 'h6' }}
                      sx={{
                        background: 'linear-gradient(45deg, #4CAF50 30%, #45A049 90%)',
                        color: 'white',
                      }}
                    />
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                          15
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                {/* Card de Estatísticas 4 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                    <CardHeader
                      title="Acessos Hoje"
                      titleTypographyProps={{ variant: 'h6' }}
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white',
                      }}
                    />
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                          42
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                {/* Área de Atividades Recentes */}
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Atividades Recentes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ p: 1 }}>
                      {[1, 2, 3, 4].map((item) => (
                        <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                            {item}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {item === 1 ? 'Novo cliente João Silva cadastrado' : 
                               item === 2 ? 'Cliente Maria Santos atualizado' :
                               item === 3 ? 'Estado de São Paulo atualizado' : 
                               'Novo usuário cadastrado'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item === 1 ? 'Há 30 minutos' : 
                               item === 2 ? 'Há 1 hora' :
                               item === 3 ? 'Há 2 horas' : 
                               'Há 4 horas'}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 'estados':
        return <Estados />;
      case 'clientes':
        return <Clientes />;
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              {selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1)}
            </Typography>
            <Typography variant="body1">
              Esta funcionalidade está em desenvolvimento.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          boxShadow: 3,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestão
          </Typography>
          <IconButton color="inherit" onClick={onLogout} title="Sair">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            boxShadow: 1,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
              <IconButton onClick={handleDrawerToggle}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          )}
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton 
                  selected={selectedMenu === item.id}
                  onClick={() => handleMenuSelect(item.id)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: `${theme.palette.primary.light}20`,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.light}30`,
                      }
                    },
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.light}10`,
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: selectedMenu === item.id ? theme.palette.primary.main : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: selectedMenu === item.id ? 'bold' : 'regular'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={onLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 0, mt: 8 }}>
        <Container maxWidth="xl">
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}