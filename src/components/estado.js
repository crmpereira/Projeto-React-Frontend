import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Estados = () => {
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({ id_estado: null, nome: "", uf: "" });
  const [editando, setEditando] = useState(false);

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
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
};


  const handleEdit = (estado) => {
    setForm(estado);
    setEditando(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir?")) {
      try {
        await axios.delete(`http://localhost:3000/estados/${id}`);
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
          <Button
            size="small"
            variant="contained"
            color="warning"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id_estado)}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Gestão de Estados
      </Typography>

      {/* Formulário */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          mb: 3,
          alignItems: "center",
        }}
      >
        <TextField
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 50 }}
          fullWidth
        />
        <TextField
          label="UF"
          name="uf"
          value={form.uf}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 2, style: { textTransform: "uppercase" } }}
          sx={{ width: 100 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editando ? "Atualizar" : "Adicionar"}
        </Button>
        {editando && (
          <Button variant="outlined" color="secondary" onClick={resetForm}>
            Cancelar
          </Button>
        )}
      </Box>

      {/* Grid estilizada */}
      <Paper sx={{ height: 400, width: "100%", p: 1 }}>
        <DataGrid
          rows={estados}
          columns={columns}
          getRowId={(row) => row.id_estado}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-cell": {
              fontSize: 14,
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Estados;
