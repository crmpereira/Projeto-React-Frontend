import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Modal,
  Box,
  Fade,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  alpha,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from "@mui/icons-material";
import axios from "axios";
import GenericDataGrid from "./genericdatagrid";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({ 
    id_cliente: null, 
    nome: "", 
    email: "", 
    telefone: "", 
    cpf: "", 
    endereco: "",
    id_estado: "",
    ativo: true
  });
  const [editando, setEditando] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    carregarClientes();
    carregarEstados();
  }, []);

  const carregarEstados = async () => {
    try {
      const response = await axios.get("http://localhost:5000/estados");
      setEstados(response.data);
    } catch (error) {
      console.error("Erro ao carregar estados:", error);
    }
  };

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar clientes",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nome" || name === "endereco") {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else if (name === "email") {
      setForm({ ...form, [name]: value.toLowerCase() });
    } else if (name === "cpf") {
      // Remove caracteres não numéricos e aplica máscara
      const numericValue = value.replace(/\D/g, "");
      const maskedValue = numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      setForm({ ...form, [name]: maskedValue });
    } else if (name === "telefone") {
      // Remove caracteres não numéricos e aplica máscara
      const numericValue = value.replace(/\D/g, "");
      const maskedValue = numericValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      setForm({ ...form, [name]: maskedValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editando) {
        await axios.put(`http://localhost:5000/clientes/${form.id_cliente}`, form);
        setSnackbar({
          open: true,
          message: "Cliente atualizado com sucesso!",
          severity: "success",
        });
      } else {
        await axios.post("http://localhost:5000/clientes", form);
        setSnackbar({
          open: true,
          message: "Cliente adicionado com sucesso!",
          severity: "success",
        });
      }
      resetForm();
      carregarClientes();
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao salvar:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: `Erro ao ${editando ? "atualizar" : "adicionar"} cliente: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setEditando(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/clientes/${deleteDialog.id}`);
      setSnackbar({
        open: true,
        message: "Cliente excluído com sucesso!",
        severity: "success",
      });
      carregarClientes();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setSnackbar({
        open: true,
        message: "Erro ao excluir cliente",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const resetForm = () => {
    setForm({ 
      id_cliente: null, 
      nome: "", 
      email: "", 
      telefone: "", 
      cpf: "", 
      endereco: "",
      id_estado: "",
      ativo: true
    });
    setEditando(false);
  };

  const columns = [
    { field: "id_cliente", headerName: "ID", width: 90 },
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "telefone", headerName: "Telefone", width: 150 },
    { field: "cpf", headerName: "CPF", width: 150 },
    { 
      field: "nome_estado", 
      headerName: "Estado", 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={`${params.row.nome_estado || 'N/A'} - ${params.row.uf || ''}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      )
    },
    { 
      field: "ativo", 
      headerName: "Status", 
      width: 100,
      renderCell: (params) => (
        <Chip 
          icon={params.row.ativo ? <ActiveIcon /> : <InactiveIcon />}
          label={params.row.ativo ? 'Ativo' : 'Inativo'}
          size="small"
          color={params.row.ativo ? 'success' : 'error'}
          variant="outlined"
        />
      )
    },
    { 
      field: "data_cadastro", 
      headerName: "Cadastro", 
      width: 120,
      renderCell: (params) => {
        if (!params.row.data_cadastro) return 'N/A';
        const date = new Date(params.row.data_cadastro);
        return date.toLocaleDateString('pt-BR');
      }
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar" arrow placement="top">
            <IconButton 
              color="primary" 
              onClick={() => handleEdit(params.row)}
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir" arrow placement="top">
            <IconButton 
              color="error" 
              onClick={() => handleDeleteClick(params.row.id_cliente)}
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5, px: isMobile ? 2 : 0 }}>
      <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            p: 2, 
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white'
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Manutenção dos Clientes
          </Typography>
        </Box>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Gerencie os clientes cadastrados no sistema
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{ 
                borderRadius: 8,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              Adicionar Cliente
            </Button>
          </Box>

      {/* Modal Form */}
      <Modal 
        open={openModal} 
        onClose={() => { setOpenModal(false); resetForm(); }}
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? '90%' : 500,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {editando ? "Editar Cliente" : "Adicionar Cliente"}
            </Typography>
            
            <TextField
              fullWidth
              label="Nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              margin="normal"
              placeholder="(11) 99999-9999"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="CPF"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              margin="normal"
              placeholder="000.000.000-00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Endereço"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select
                name="id_estado"
                value={form.id_estado}
                onChange={handleChange}
                label="Estado"
                startAdornment={
                  <InputAdornment position="start">
                    <LocationIcon color="primary" />
                  </InputAdornment>
                }
              >
                {estados.map((estado) => (
                  <MenuItem key={estado.id_estado} value={estado.id_estado}>
                    {estado.nome} - {estado.uf}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={form.ativo}
                  onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                  name="ativo"
                  color="primary"
                />
              }
              label="Cliente Ativo"
              sx={{ mt: 2, mb: 1 }}
            />
            
            <Stack 
              direction="row" 
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 3 }}
            >
              <Button 
                variant="outlined" 
                onClick={() => { setOpenModal(false); resetForm(); }}
                sx={{ borderRadius: 2 }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ borderRadius: 2 }}
                disabled={loading}
              >
                {editando ? "Atualizar" : "Adicionar"}
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* Grid Genérica */}
      <Box sx={{ height: 400, width: "100%", borderRadius: 2, overflow: 'hidden' }}>
        <GenericDataGrid
          rows={clientes}
          columns={columns}
          getRowId={(row) => row.id_cliente}
          loading={loading}
        />
      </Box>
      </CardContent>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 2 }}
            disabled={loading}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Clientes;