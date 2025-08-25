import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Stack,
  Modal,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fade,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { alpha } from "@mui/material/styles";

import GenericDataGrid from "../components/genericdatagrid";

const Estados = () => {
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({ id_estado: null, nome: "", uf: "" });
  const [editando, setEditando] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    carregarEstados();
  }, []);

  const carregarEstados = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/estados");
      setEstados(res.data);
    } catch (err) {
      console.error("Erro ao carregar estados:", err);
      setSnackbar({
        open: true,
        message: "Erro ao carregar estados",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editando) {
        await axios.put(`http://localhost:5000/estados/${form.id_estado}`, form);
        setSnackbar({
          open: true,
          message: "Estado atualizado com sucesso!",
          severity: "success",
        });
      } else {
        await axios.post("http://localhost:5000/estados", form);
        setSnackbar({
          open: true,
          message: "Estado adicionado com sucesso!",
          severity: "success",
        });
      }
      resetForm();
      carregarEstados();
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao salvar:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: `Erro ao ${editando ? "atualizar" : "adicionar"} estado: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (estado) => {
    setForm(estado);
    setEditando(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/estados/${deleteDialog.id}`);
      setSnackbar({
        open: true,
        message: "Estado excluído com sucesso!",
        severity: "success",
      });
      carregarEstados();
    } catch (err) {
      console.error("Erro ao excluir estado:", err);
      setSnackbar({
        open: true,
        message: `Erro ao excluir estado: ${err.response?.data?.message || err.message}`,
        severity: "error",
      });
    } finally {
      setDeleteDialog({ open: false, id: null });
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const resetForm = () => {
    setForm({ id_estado: null, nome: "", uf: "" });
    setEditando(false);
  };

  const columns = [
    { field: "id_estado", headerName: "ID", width: 90 },
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "uf", headerName: "UF", width: 100 },
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
              onClick={() => handleDeleteClick(params.row.id_estado)}
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
    <Container maxWidth="md" sx={{ mt: 5, px: isMobile ? 2 : 0 }}>
      <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            p: 2, 
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white'
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Manutenção dos Estados
          </Typography>
        </Box>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Gerencie os estados cadastrados no sistema
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
              Adicionar Estado
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
              width: isMobile ? "90%" : 450,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ 
              p: 2, 
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: 'white'
            }}>
              <Typography variant="h6">
                {editando ? "Editar Estado" : "Adicionar Estado"}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 3 }}>
              <TextField
                label="Nome do Estado"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ mb: 3 }}
              />
              <TextField
                label="UF"
                name="uf"
                value={form.uf}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 2, style: { textTransform: "uppercase" } }}
                sx={{ mb: 3, width: isMobile ? "100%" : 120 }}
                variant="outlined"
                helperText="Sigla do estado com 2 letras"
              />
              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                justifyContent="flex-end"
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
          </Box>
        </Fade>
      </Modal>

      {/* Grid Genérica */}
      <Box sx={{ height: 400, width: "100%", borderRadius: 2, overflow: 'hidden' }}>
        <GenericDataGrid
          rows={estados}
          columns={columns}
          getRowId={(row) => row.id_estado} // garante IDs únicos
          highlightRow={(row) => row.uf === "SC"} // opcional
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
            Tem certeza que deseja excluir este estado? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ ...deleteDialog, open: false })} 
            color="primary"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
};

export default Estados;
