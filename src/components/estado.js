import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



const Estados = () => {
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({ id_estado: null, nome: '', uf: '' });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/estados')
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(console.error);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editando) {
      fetch(`http://localhost:3000/estados/${form.id_estado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, uf: form.uf }),
      }).then(() => {
        setEstados(estados.map(e => (e.id_estado === form.id_estado ? form : e)));
        resetForm();
      });
    } else {
      fetch('http://localhost:3000/estados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, uf: form.uf }),
      })
        .then(res => res.json())
        .then(novoEstado => {
          setEstados([...estados, novoEstado]);
          resetForm();
        });
    }
  };

  const handleEdit = estado => {
    setForm(estado);
    setEditando(true);
  };

  const handleDelete = id => {
    if (window.confirm('Deseja realmente excluir?')) {
      fetch(`http://localhost:3000/estados/${id}`, { method: 'DELETE' }).then(() =>
        setEstados(estados.filter(e => e.id_estado !== id))
      );
    }
  };

  const resetForm = () => {
    setForm({ id_estado: null, nome: '', uf: '' });
    setEditando(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Gestão de Estados
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}
      >
        <TextField
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 50 }}
        />
        <TextField
          label="UF"
          name="uf"
          value={form.uf}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 2, style: { textTransform: 'uppercase' } }}
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {editando ? 'Atualizar' : 'Adicionar'}
          </Button>
          {editando && (
            <Button variant="outlined" color="secondary" onClick={resetForm} fullWidth>
              Cancelar
            </Button>
          )}
        </Stack>
      </Box>

      <Paper>
        <List>
          {estados.map(estado => (
            <ListItem
              key={estado.id_estado}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="editar" onClick={() => handleEdit(estado)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="deletar" onClick={() => handleDelete(estado.id_estado)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={`${estado.nome} (${estado.uf})`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Estados;
