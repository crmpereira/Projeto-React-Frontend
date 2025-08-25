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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import GenericDataGrid from "../components/genericdatagrid";

const Estados = () => {
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({ id_estado: null, nome: "", uf: "" });
  const [editando, setEditando] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    carregarEstados();
  }, []);

  const carregarEstados = async () => {
    try {
      const res = await axios.get("http://localhost:5000/estados");
      setEstados(res.data);
    } catch (err) {
      console.error("Erro ao carregar estados:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`http://localhost:5000/estados/${form.id_estado}`, form);
      } else {
        await axios.post("http://localhost:5000/estados", form);
      }
      resetForm();
      carregarEstados();
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao salvar:", error.response?.data || error.message);
    }
  };

  const handleEdit = (estado) => {
    setForm(estado);
    setEditando(true);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir?")) {
      try {
        await axios.delete(`http://localhost:5000/estados/${id}`);
        carregarEstados();
      } catch (err) {
        console.error("Erro ao excluir estado:", err);
      }
    }
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
          <Tooltip title="Editar">
            <IconButton color="warning" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton color="error" onClick={() => handleDelete(params.row.id_estado)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 5, px: isMobile ? 2 : 0 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Manutenção dos Estados
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setOpenModal(true)}
      >
        Adicionar Estado
      </Button>

      {/* Modal Form */}
      <Modal open={openModal} onClose={() => { setOpenModal(false); resetForm(); }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editando ? "Editar Estado" : "Adicionar Estado"}
          </Typography>
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="UF"
            name="uf"
            value={form.uf}
            onChange={handleChange}
            required
            inputProps={{ maxLength: 2, style: { textTransform: "uppercase" } }}
            sx={{ mb: 2, width: isMobile ? "100%" : 100 }}
          />
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="flex-end"
          >
            <Button variant="outlined" onClick={() => { setOpenModal(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editando ? "Atualizar" : "Adicionar"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Grid Genérica */}
      <GenericDataGrid
        rows={estados}
        columns={columns}
        getRowId={(row) => row.id_estado} // garante IDs únicos
        highlightRow={(row) => row.uf === "SC"} // opcional
      />
    </Container>
  );
};

export default Estados;
