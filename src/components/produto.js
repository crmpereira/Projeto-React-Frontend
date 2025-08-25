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
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as ProductIcon,
  Description as DescriptionIcon,
  AttachMoney as PriceIcon,
  Storage as StockIcon,
  CheckCircle as InStockIcon,
  Warning as LowStockIcon,
  Error as OutOfStockIcon,
} from "@mui/icons-material";
import axios from "axios";
import GenericDataGrid from "./genericdatagrid";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ 
    id_produto: null, 
    nome: "", 
    descricao: "", 
    preco: "", 
    estoque: ""
  });
  const [editando, setEditando] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar produtos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nome" || name === "descricao") {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else if (name === "preco") {
      // Remove caracteres não numéricos exceto vírgula e ponto
      const numericValue = value.replace(/[^0-9.,]/g, "");
      setForm({ ...form, [name]: numericValue });
    } else if (name === "estoque") {
      // Apenas números inteiros
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editando) {
        await axios.put(`http://localhost:5000/produtos/${form.id_produto}`, form);
        setSnackbar({
          open: true,
          message: "Produto atualizado com sucesso!",
          severity: "success",
        });
      } else {
        await axios.post("http://localhost:5000/produtos", form);
        setSnackbar({
          open: true,
          message: "Produto adicionado com sucesso!",
          severity: "success",
        });
      }
      resetForm();
      carregarProdutos();
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao salvar:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: `Erro ao ${editando ? "atualizar" : "adicionar"} produto: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (produto) => {
    setForm(produto);
    setEditando(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/produtos/${deleteDialog.id}`);
      setSnackbar({
        open: true,
        message: "Produto excluído com sucesso!",
        severity: "success",
      });
      carregarProdutos();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setSnackbar({
        open: true,
        message: "Erro ao excluir produto",
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
      id_produto: null, 
      nome: "", 
      descricao: "", 
      preco: "", 
      estoque: ""
    });
    setEditando(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(price) || 0);
  };

  const getStockStatus = (estoque) => {
    const stock = parseInt(estoque) || 0;
    if (stock === 0) {
      return { icon: <OutOfStockIcon />, label: 'Sem Estoque', color: 'error' };
    } else if (stock <= 10) {
      return { icon: <LowStockIcon />, label: 'Estoque Baixo', color: 'warning' };
    } else {
      return { icon: <InStockIcon />, label: 'Em Estoque', color: 'success' };
    }
  };

  const columns = [
    { field: "id_produto", headerName: "ID", width: 90 },
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "descricao", headerName: "Descrição", flex: 1 },
    { 
      field: "preco", 
      headerName: "Preço", 
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          {formatPrice(params.row.preco)}
        </Typography>
      )
    },
    { 
      field: "estoque", 
      headerName: "Estoque", 
      width: 120,
      renderCell: (params) => {
        const status = getStockStatus(params.row.estoque);
        return (
          <Chip 
            icon={status.icon}
            label={`${params.row.estoque} un.`}
            size="small"
            color={status.color}
            variant="outlined"
          />
        );
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
              onClick={() => handleDeleteClick(params.row.id_produto)}
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
            Manutenção dos Produtos
          </Typography>
        </Box>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Gerencie os produtos cadastrados no sistema
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
              Adicionar Produto
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
              {editando ? "Editar Produto" : "Adicionar Produto"}
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
                    <ProductIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={3}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Preço"
              name="preco"
              value={form.preco}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="0,00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PriceIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Estoque"
              name="estoque"
              value={form.estoque}
              onChange={handleChange}
              margin="normal"
              required
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
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
          rows={produtos}
          columns={columns}
          getRowId={(row) => row.id_produto}
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
            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
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

export default Produtos;