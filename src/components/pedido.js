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

  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tabs,
  Tab,
  Paper,

} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as PedidoIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Notes as NotesIcon,
  CalendarToday as DateIcon,
  AttachMoney as MoneyIcon,
  Inventory as ProductIcon,
  Numbers as QuantityIcon,
  Discount as DiscountIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Done as CompletedIcon,
} from "@mui/icons-material";
import axios from "axios";
import GenericDataGrid from "./genericdatagrid";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Pedidos = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [itensPedido, setItensPedido] = useState([]);
  const [todosItens, setTodosItens] = useState([]); // Todos os itens para cálculo do valor total
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [formPedido, setFormPedido] = useState({
    id_pedido: null,
    id_cliente: "",
    status: "Pendente",
    forma_pagamento: "",
    observacoes: "",
    data_pedido: new Date().toISOString().split('T')[0],
    valor_total: 0
  });

  const [formItem, setFormItem] = useState({
    id_item: null,
    id_pedido: "",
    id_produto: "",
    quantidade: "",
    preco_unitario: "",
    desconto: 0
  });
  const [openModalPedido, setOpenModalPedido] = useState(false);
  const [openModalItem, setOpenModalItem] = useState(false);
  const [editingPedido, setEditingPedido] = useState(false);
  const [editingItem, setEditingItem] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'pedido' ou 'item'
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Carregar dados iniciais
  useEffect(() => {
    loadPedidos();
    loadClientes();
    loadProdutos();
    loadTodosItens();
  }, []);

  // Carregar itens quando um pedido for selecionado
  useEffect(() => {
    if (tabValue === 1 && selectedPedidoId) {
      loadItensPedido(selectedPedidoId);
    } else if (tabValue === 1 && !selectedPedidoId) {
      setItensPedido([]);
    }
  }, [tabValue, selectedPedidoId]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setSnackbar({ open: true, message: "Erro ao carregar pedidos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadTodosItens = async () => {
    try {
      const response = await axios.get('http://localhost:5000/itens-pedido');
      setTodosItens(response.data);
    } catch (error) {
      console.error('Erro ao carregar todos os itens:', error);
    }
  };

  const loadItensPedido = async (pedidoId = null) => {
    try {
      if (!pedidoId) {
        setItensPedido([]);
        return;
      }
      const response = await axios.get(`http://localhost:5000/itens-pedido?id_pedido=${pedidoId}`);
      setItensPedido(response.data);
    } catch (error) {
      console.error('Erro ao carregar itens do pedido:', error);
      setSnackbar({ open: true, message: "Erro ao carregar itens do pedido", severity: "error" });
    }
  };

  const loadClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const loadProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePedido = (e) => {
    const { name, value } = e.target;
    setFormPedido(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangeItem = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Formatação específica para campos numéricos
    if (name === 'quantidade' || name === 'desconto') {
      processedValue = value.replace(/[^0-9]/g, '');
    }
    if (name === 'preco_unitario') {
      processedValue = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    }

    setFormItem(prev => {
      const newForm = {
        ...prev,
        [name]: processedValue
      };

      // Atualizar preço unitário automaticamente quando produto for selecionado
      if (name === 'id_produto' && value) {
        const produto = produtos.find(p => p.id_produto === parseInt(value));
        if (produto) {
          newForm.preco_unitario = produto.preco;
        }
      }

      return newForm;
    });
  };

  const handleSubmitPedido = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const pedidoData = {
        ...formPedido,
        id_cliente: parseInt(formPedido.id_cliente),
        valor_total: parseFloat(formPedido.valor_total) || 0,
        itens: [] // Backend exige itens, enviando array vazio
      };

      if (editingPedido) {
        await axios.put(`http://localhost:5000/pedidos/${formPedido.id_pedido}`, pedidoData);
        setSnackbar({ open: true, message: "Pedido atualizado com sucesso!", severity: "success" });
      } else {
        const response = await axios.post('http://localhost:5000/pedidos', pedidoData);
        setSnackbar({ open: true, message: "Pedido criado com sucesso!", severity: "success" });
        console.log('Pedido criado:', response.data);
      }
      
      loadPedidos();
      if (selectedPedidoId) {
        loadItensPedido(selectedPedidoId);
      }
      resetFormPedido();
      setOpenModalPedido(false);
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      console.error('Detalhes do erro:', error.response?.data);
      const errorMessage = error.response?.data?.erro || error.response?.data?.message || "Erro ao salvar pedido";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const itemData = {
        ...formItem,
        id_pedido: parseInt(formItem.id_pedido),
        id_produto: parseInt(formItem.id_produto),
        quantidade: parseInt(formItem.quantidade),
        preco_unitario: parseFloat(formItem.preco_unitario),
        desconto: parseFloat(formItem.desconto) || 0
      };

      if (editingItem) {
        await axios.put(`http://localhost:5000/itens-pedido/${formItem.id_item}`, itemData);
        setSnackbar({ open: true, message: "Item atualizado com sucesso!", severity: "success" });
      } else {
        await axios.post('http://localhost:5000/itens-pedido', itemData);
        setSnackbar({ open: true, message: "Item adicionado com sucesso!", severity: "success" });
      }
      
      if (selectedPedidoId) {
        loadItensPedido(selectedPedidoId);
      }
      loadPedidos(); // Recarregar para atualizar valor total
        loadTodosItens(); // Recarregar todos os itens
      resetFormItem();
      setOpenModalItem(false);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      setSnackbar({ open: true, message: "Erro ao salvar item", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPedido = (pedido) => {
    setFormPedido({
      id_pedido: pedido.id_pedido,
      id_cliente: pedido.id_cliente,
      status: pedido.status,
      forma_pagamento: pedido.forma_pagamento,
      observacoes: pedido.observacoes || "",
      data_pedido: pedido.data_pedido ? pedido.data_pedido.split('T')[0] : new Date().toISOString().split('T')[0],
      valor_total: pedido.valor_total
    });
    setEditingPedido(true);
    setOpenModalPedido(true);
  };

  const handleEditItem = (item) => {
    setFormItem({
      id_item: item.id_item,
      id_pedido: item.id_pedido,
      id_produto: item.id_produto,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      desconto: item.desconto || 0
    });
    setEditingItem(true);
    setOpenModalItem(true);
  };

  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      if (deleteType === 'pedido') {
        await axios.delete(`http://localhost:5000/pedidos/${itemToDelete.id_pedido}`);
        setSnackbar({ open: true, message: "Pedido excluído com sucesso!", severity: "success" });
        loadPedidos();
      } else {
        await axios.delete(`http://localhost:5000/itens-pedido/${itemToDelete.id_item}`);
        setSnackbar({ open: true, message: "Item excluído com sucesso!", severity: "success" });
        if (selectedPedidoId) {
          loadItensPedido(selectedPedidoId);
        }
        loadPedidos(); // Recarregar para atualizar valor total
        loadTodosItens(); // Recarregar todos os itens
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      setSnackbar({ open: true, message: "Erro ao excluir", severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const resetFormPedido = () => {
    setFormPedido({
      id_pedido: null,
      id_cliente: "",
      status: "Pendente",
      forma_pagamento: "",
      observacoes: "",
      data_pedido: new Date().toISOString().split('T')[0],
      valor_total: 0
    });
    setEditingPedido(false);
  };



  const resetFormItem = () => {
    setFormItem({
      id_item: null,
      id_pedido: "",
      id_produto: "",
      quantidade: "",
      preco_unitario: "",
      desconto: 0
    });
    setEditingItem(false);
  };

  const openItemModalWithPedido = (pedidoId = '') => {
    resetFormItem();
    if (pedidoId) {
      setFormItem(prev => ({ ...prev, id_pedido: pedidoId }));
    }
    setOpenModalItem(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price || 0);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'Pendente': { color: 'warning', icon: <PendingIcon /> },
      'Aprovado': { color: 'info', icon: <ApprovedIcon /> },
      'Concluido': { color: 'success', icon: <CompletedIcon /> }
    };
    
    const config = statusConfig[status] || { color: 'default', icon: null };
    
    return (
      <Chip
        label={status}
        color={config.color}
        size="small"
        icon={config.icon}
        variant="outlined"
      />
    );
  };

  const getClienteName = (id_cliente) => {
    const cliente = clientes.find(c => c.id_cliente === id_cliente);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getProdutoNome = (id_produto) => {
    const produto = produtos.find(p => p.id_produto === id_produto);
    return produto ? produto.nome : 'Produto não encontrado';
  };

  // Função para selecionar pedido
  const handleSelectPedido = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    if (pedidoId && tabValue === 1) {
      loadItensPedido(pedidoId);
    } else if (!pedidoId) {
      setItensPedido([]);
    }
  };

  // Colunas para DataGrid de Pedidos
  const columnsPedidos = [
    {
      field: 'select',
      headerName: 'Selecionar',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <input
          type="radio"
          name="selectedPedido"
          checked={selectedPedidoId === params.row.id_pedido}
          onChange={() => handleSelectPedido(params.row.id_pedido)}
          style={{ transform: 'scale(1.2)' }}
        />
      )
    },
    { field: 'id_pedido', headerName: 'ID', width: 80 },
    {
      field: 'cliente',
      headerName: 'Cliente',
      width: 200,
      renderCell: (params) => getClienteName(params.row.id_cliente)
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => getStatusChip(params.value)
    },
    { field: 'forma_pagamento', headerName: 'Forma Pagamento', width: 150 },
    {
      field: 'data_pedido',
      headerName: 'Data Pedido',
      width: 120,
      renderCell: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString('pt-BR');
        }
        return '';
      }
    },
    {
      field: 'valor_total',
      headerName: 'Valor Total',
      width: 120,
      renderCell: (params) => {
        // Calcular valor total com desconto baseado nos itens
        const itensDosPedido = todosItens.filter(item => item.id_pedido === params.row.id_pedido);
        if (itensDosPedido.length > 0) {
          const valorComDesconto = itensDosPedido.reduce((total, item) => {
            const valorBruto = item.quantidade * item.preco_unitario;
            const percentualDesconto = (item.desconto || 0) / 100;
            const valorDesconto = valorBruto * percentualDesconto;
            const subtotal = valorBruto - valorDesconto;
            return total + subtotal;
          }, 0);
          return formatPrice(valorComDesconto);
        }
        return formatPrice(params.value);
      }
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleEditPedido(params.row)}
              sx={{ color: theme.palette.primary.main }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Adicionar Item">
            <IconButton
              size="small"
              onClick={() => openItemModalWithPedido(params.row.id_pedido)}
              sx={{ color: theme.palette.success.main }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row, 'pedido')}
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  // Colunas para DataGrid de Itens
  const columnsItens = [
    { field: 'id_item', headerName: 'ID Item', width: 80 },
    { field: 'id_pedido', headerName: 'ID Pedido', width: 100 },
    {
      field: 'produto',
      headerName: 'Produto',
      width: 200,
      renderCell: (params) => getProdutoNome(params.row.id_produto)
    },
    { field: 'quantidade', headerName: 'Quantidade', width: 100 },
    {
      field: 'preco_unitario',
      headerName: 'Preço Unit.',
      width: 120,
      renderCell: (params) => formatPrice(params.value)
    },
    {
      field: 'desconto',
      headerName: 'Desconto',
      width: 100,
      renderCell: (params) => `${params.value || 0}%`
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      width: 120,
      renderCell: (params) => {
        const valorBruto = params.row.quantidade * params.row.preco_unitario;
        const percentualDesconto = (params.row.desconto || 0) / 100;
        const valorDesconto = valorBruto * percentualDesconto;
        const subtotal = valorBruto - valorDesconto;
        return formatPrice(subtotal);
      }
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleEditItem(params.row)}
              sx={{ color: theme.palette.primary.main }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row, 'item')}
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PedidoIcon sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Gestão de Pedidos
              </Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="pedidos tabs">
              <Tab label="Pedidos" />
              <Tab label="Itens do Pedido" />
            </Tabs>
          </Box>

          {/* Tab Panel - Pedidos */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Lista de Pedidos</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  resetFormPedido();
                  setOpenModalPedido(true);
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Novo Pedido
              </Button>
            </Box>
            
            <GenericDataGrid
              rows={pedidos}
              columns={columnsPedidos}
              getRowId={(row) => row.id_pedido}
              loading={loading}
            />
          </TabPanel>

          {/* Tab Panel - Itens */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6">
                {selectedPedidoId ? `Itens do Pedido #${selectedPedidoId}` : 'Itens dos Pedidos'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openItemModalWithPedido(selectedPedidoId)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
                disabled={!selectedPedidoId}
              >
                Novo Item
              </Button>
            </Box>
            
            {selectedPedidoId ? (
              <GenericDataGrid
                rows={itensPedido}
                columns={columnsItens}
                getRowId={(row) => row.id_item}
                loading={loading}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Selecione um pedido na aba "Pedidos" para visualizar seus itens
                </Typography>
              </Box>
            )}
          </TabPanel>
        </CardContent>
      </Card>

      {/* Modal Pedido */}
      <Modal
        open={openModalPedido}
        onClose={() => setOpenModalPedido(false)}
        closeAfterTransition
      >
        <Fade in={openModalPedido}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '95%' : 600,
              maxHeight: '90vh',
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: 0
            }}
          >
            <Paper elevation={0} sx={{ borderRadius: 3 }}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  p: 3,
                  borderRadius: '12px 12px 0 0'
                }}
              >
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  {editingPedido ? 'Editar Pedido' : 'Novo Pedido'}
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmitPedido} sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      name="id_cliente"
                      value={formPedido.id_cliente}
                      onChange={handleChangePedido}
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      }
                    >
                      {clientes.map((cliente) => (
                        <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                          {cliente.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formPedido.status}
                      onChange={handleChangePedido}
                      required
                    >
                      <MenuItem value="Pendente">Pendente</MenuItem>
                      <MenuItem value="Aprovado">Aprovado</MenuItem>
                      <MenuItem value="Concluido">Concluído</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Forma de Pagamento</InputLabel>
                    <Select
                      name="forma_pagamento"
                      value={formPedido.forma_pagamento}
                      onChange={handleChangePedido}
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <PaymentIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Pix">Pix</MenuItem>
                      <MenuItem value="Cartao">Cartão</MenuItem>
                      <MenuItem value="Boleto">Boleto</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Data do Pedido"
                    name="data_pedido"
                    type="date"
                    value={formPedido.data_pedido}
                    onChange={handleChangePedido}
                    required
                    disabled
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateIcon />
                        </InputAdornment>
                      )
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Observações"
                    name="observacoes"
                    value={formPedido.observacoes}
                    onChange={handleChangePedido}
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NotesIcon />
                        </InputAdornment>
                      )
                    }}
                  />



                  <TextField
                    fullWidth
                    label="Valor Total"
                    name="valor_total"
                    type="number"
                    value={formPedido.valor_total}
                    onChange={handleChangePedido}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon />
                        </InputAdornment>
                      )
                    }}
                    helperText="Valor será atualizado conforme itens forem adicionados"
                  />
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenModalPedido(false)}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                  >
                    {editingPedido ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Modal>

      {/* Modal Item */}
      <Modal
        open={openModalItem}
        onClose={() => setOpenModalItem(false)}
        closeAfterTransition
      >
        <Fade in={openModalItem}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '95%' : 600,
              maxHeight: '90vh',
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: 0
            }}
          >
            <Paper elevation={0} sx={{ borderRadius: 3 }}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  color: 'white',
                  p: 3,
                  borderRadius: '12px 12px 0 0'
                }}
              >
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  {editingItem ? 'Editar Item' : 'Novo Item'}
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmitItem} sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Pedido</InputLabel>
                    <Select
                      name="id_pedido"
                      value={formItem.id_pedido}
                      onChange={handleChangeItem}
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <PedidoIcon />
                        </InputAdornment>
                      }
                    >
                      {pedidos.map((pedido) => (
                        <MenuItem key={pedido.id_pedido} value={pedido.id_pedido}>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              Pedido #{pedido.id_pedido}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Cliente: {getClienteName(pedido.id_cliente)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Status: {pedido.status} | Total: {formatPrice(pedido.valor_total)}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Produto</InputLabel>
                    <Select
                      name="id_produto"
                      value={formItem.id_produto}
                      onChange={handleChangeItem}
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <ProductIcon />
                        </InputAdornment>
                      }
                    >
                      {produtos.map((produto) => (
                        <MenuItem key={produto.id_produto} value={produto.id_produto}>
                          {produto.nome} - {formatPrice(produto.preco)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Quantidade"
                    name="quantidade"
                    type="number"
                    value={formItem.quantidade}
                    onChange={handleChangeItem}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <QuantityIcon />
                        </InputAdornment>
                      )
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Preço Unitário"
                    name="preco_unitario"
                    type="number"
                    step="0.01"
                    value={formItem.preco_unitario}
                    onChange={handleChangeItem}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon />
                        </InputAdornment>
                      )
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Desconto (%)"
                    name="desconto"
                    type="number"
                    step="0.01"
                    value={formItem.desconto}
                    onChange={handleChangeItem}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DiscountIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          %
                        </InputAdornment>
                      )
                    }}
                  />
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenModalItem(false)}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                  >
                    {editingItem ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Modal>

      {/* Dialog de Confirmação */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este {deleteType === 'pedido' ? 'pedido' : 'item'}? 
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Pedidos;