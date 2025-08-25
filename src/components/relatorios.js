import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Assessment as ReportIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
// DatePicker imports removidos para evitar dependências extras
import axios from 'axios';

const Relatorios = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  
  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    tipoRelatorio: '',
    dataInicio: null,
    dataFim: null,
    cliente: '',
    produto: '',
    status: '',
    formatoExportacao: 'pdf'
  });

  // Tipos de relatórios disponíveis
  const tiposRelatorio = [
    { value: 'pedidos', label: 'Relatório de Pedidos', description: 'Lista completa de pedidos com detalhes' },
    { value: 'clientes', label: 'Relatório de Clientes', description: 'Informações dos clientes cadastrados' },
    { value: 'produtos', label: 'Relatório de Produtos', description: 'Catálogo de produtos e preços' },
    { value: 'itens', label: 'Relatório de Itens', description: 'Detalhes dos itens vendidos' },
    { value: 'vendas', label: 'Relatório de Vendas', description: 'Análise de vendas por período' }
  ];

  // Status disponíveis
  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Aprovado', label: 'Aprovado' },
    { value: 'Concluido', label: 'Concluído' }
  ];

  // Carregar dados iniciais
  useEffect(() => {
    loadClientes();
    loadProdutos();
  }, []);

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

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      tipoRelatorio: '',
      dataInicio: null,
      dataFim: null,
      cliente: '',
      produto: '',
      status: '',
      formatoExportacao: 'pdf'
    });
  };

  const gerarRelatorio = async () => {
    if (!filtros.tipoRelatorio) {
      alert('Selecione um tipo de relatório');
      return;
    }

    setLoading(true);
    try {
      // Buscar dados do relatório
      const dados = await buscarDadosRelatorio();
      
      if (filtros.formatoExportacao === 'pdf') {
        gerarPDF(dados);
      } else {
        gerarExcel(dados);
      }
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const buscarDadosRelatorio = async () => {
    let url = '';
    let params = new URLSearchParams();

    // Adicionar filtros de data se existirem
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.cliente) params.append('cliente', filtros.cliente);
    if (filtros.produto) params.append('produto', filtros.produto);
    if (filtros.status) params.append('status', filtros.status);

    switch (filtros.tipoRelatorio) {
      case 'pedidos':
        url = 'http://localhost:5000/pedidos';
        break;
      case 'clientes':
        url = 'http://localhost:5000/clientes';
        break;
      case 'produtos':
        url = 'http://localhost:5000/produtos';
        break;
      case 'itens':
        url = 'http://localhost:5000/itens-pedido';
        break;
      default:
        throw new Error('Tipo de relatório não suportado');
    }

    const response = await axios.get(`${url}?${params.toString()}`);
    return response.data;
  };

  const gerarPDF = (dados) => {
    // Criar conteúdo HTML para impressão
    const htmlContent = criarHTMLRelatorio(dados);
    
    // Abrir nova janela para impressão
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Aguardar carregamento e imprimir
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const gerarExcel = (dados) => {
    // Converter dados para CSV
    const csv = converterParaCSV(dados);
    
    // Criar e baixar arquivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${filtros.tipoRelatorio}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const criarHTMLRelatorio = (dados) => {
    const tipoLabel = tiposRelatorio.find(t => t.value === filtros.tipoRelatorio)?.label || filtros.tipoRelatorio;
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    let cabecalhos = [];
    let linhas = [];

    switch (filtros.tipoRelatorio) {
      case 'pedidos':
        cabecalhos = ['ID', 'Cliente', 'Data', 'Status', 'Total'];
        linhas = dados.map(item => [
          item.id_pedido,
          item.nome_cliente || 'N/A',
          new Date(item.data_pedido).toLocaleDateString('pt-BR'),
          item.status,
          `R$ ${parseFloat(item.total || 0).toFixed(2)}`
        ]);
        break;
      case 'clientes':
        cabecalhos = ['ID', 'Nome', 'Email', 'Telefone', 'Estado'];
        linhas = dados.map(item => [
          item.id_cliente,
          item.nome,
          item.email || 'N/A',
          item.telefone || 'N/A',
          item.nome_estado || 'N/A'
        ]);
        break;
      case 'produtos':
        cabecalhos = ['ID', 'Nome', 'Descrição', 'Preço'];
        linhas = dados.map(item => [
          item.id_produto,
          item.nome,
          item.descricao || 'N/A',
          `R$ ${parseFloat(item.preco || 0).toFixed(2)}`
        ]);
        break;
      case 'itens':
        cabecalhos = ['ID Item', 'Pedido', 'Produto', 'Quantidade', 'Preço Unit.', 'Desconto'];
        linhas = dados.map(item => [
          item.id_item,
          item.id_pedido,
          item.nome_produto || 'N/A',
          item.quantidade,
          `R$ ${parseFloat(item.preco_unitario || 0).toFixed(2)}`,
          `R$ ${parseFloat(item.desconto || 0).toFixed(2)}`
        ]);
        break;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${tipoLabel}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #1976d2; margin-bottom: 5px; }
          .header p { color: #666; margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #1976d2; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${tipoLabel}</h1>
          <p>Data de geração: ${dataAtual}</p>
          <p>Total de registros: ${dados.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${cabecalhos.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${linhas.map(linha => `
              <tr>
                ${linha.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Relatório gerado automaticamente pelo sistema</p>
        </div>
      </body>
      </html>
    `;
  };

  const converterParaCSV = (dados) => {
    if (!dados || dados.length === 0) return '';
    
    let cabecalhos = [];
    let linhas = [];

    switch (filtros.tipoRelatorio) {
      case 'pedidos':
        cabecalhos = ['ID', 'Cliente', 'Data', 'Status', 'Total'];
        linhas = dados.map(item => [
          item.id_pedido,
          item.nome_cliente || 'N/A',
          new Date(item.data_pedido).toLocaleDateString('pt-BR'),
          item.status,
          parseFloat(item.total || 0).toFixed(2)
        ]);
        break;
      case 'clientes':
        cabecalhos = ['ID', 'Nome', 'Email', 'Telefone', 'Estado'];
        linhas = dados.map(item => [
          item.id_cliente,
          item.nome,
          item.email || 'N/A',
          item.telefone || 'N/A',
          item.nome_estado || 'N/A'
        ]);
        break;
      case 'produtos':
        cabecalhos = ['ID', 'Nome', 'Descrição', 'Preço'];
        linhas = dados.map(item => [
          item.id_produto,
          item.nome,
          item.descricao || 'N/A',
          parseFloat(item.preco || 0).toFixed(2)
        ]);
        break;
      case 'itens':
        cabecalhos = ['ID Item', 'Pedido', 'Produto', 'Quantidade', 'Preço Unitário', 'Desconto'];
        linhas = dados.map(item => [
          item.id_item,
          item.id_pedido,
          item.nome_produto || 'N/A',
          item.quantidade,
          parseFloat(item.preco_unitario || 0).toFixed(2),
          parseFloat(item.desconto || 0).toFixed(2)
        ]);
        break;
    }

    // Escapar aspas e adicionar aspas quando necessário
    const escaparCSV = (campo) => {
      if (campo === null || campo === undefined) return '';
      const str = String(campo);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      cabecalhos.map(escaparCSV).join(','),
      ...linhas.map(linha => linha.map(escaparCSV).join(','))
    ].join('\n');

    return csvContent;
  };

  const renderFiltrosEspecificos = () => {
    switch (filtros.tipoRelatorio) {
      case 'pedidos':
      case 'vendas':
        return (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={filtros.cliente}
                  onChange={(e) => handleFiltroChange('cliente', e.target.value)}
                  label="Cliente"
                >
                  <MenuItem value="">Todos os clientes</MenuItem>
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtros.status}
                  onChange={(e) => handleFiltroChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">Todos os status</MenuItem>
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        );
      case 'produtos':
        return (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Produto</InputLabel>
              <Select
                value={filtros.produto}
                onChange={(e) => handleFiltroChange('produto', e.target.value)}
                label="Produto"
              >
                <MenuItem value="">Todos os produtos</MenuItem>
                {produtos.map((produto) => (
                  <MenuItem key={produto.id_produto} value={produto.id_produto}>
                    {produto.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      case 'itens':
        return (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Produto</InputLabel>
                <Select
                  value={filtros.produto}
                  onChange={(e) => handleFiltroChange('produto', e.target.value)}
                  label="Produto"
                >
                  <MenuItem value="">Todos os produtos</MenuItem>
                  {produtos.map((produto) => (
                    <MenuItem key={produto.id_produto} value={produto.id_produto}>
                      {produto.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={filtros.cliente}
                  onChange={(e) => handleFiltroChange('cliente', e.target.value)}
                  label="Cliente"
                >
                  <MenuItem value="">Todos os clientes</MenuItem>
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

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
                gap: 2
              }}
            >
              <ReportIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Relatórios
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Gere relatórios personalizados em PDF ou Excel
                </Typography>
              </Box>
            </Box>

            {/* Conteúdo */}
            <Box sx={{ p: 3 }}>
              {/* Seleção do Tipo de Relatório */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterIcon /> Tipo de Relatório
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Selecione o tipo de relatório</InputLabel>
                      <Select
                        value={filtros.tipoRelatorio}
                        onChange={(e) => handleFiltroChange('tipoRelatorio', e.target.value)}
                        label="Selecione o tipo de relatório"
                      >
                        {tiposRelatorio.map((tipo) => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {tipo.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {tipo.description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>

              {/* Filtros */}
              {filtros.tipoRelatorio && (
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateIcon /> Filtros
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Filtros de Data */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Data Início"
                        type="date"
                        value={filtros.dataInicio || ''}
                        onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Data Fim"
                        type="date"
                        value={filtros.dataFim || ''}
                        onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    {/* Filtros Específicos */}
                    {renderFiltrosEspecificos()}
                  </Grid>
                </Paper>
              )}

              {/* Formato de Exportação */}
              {filtros.tipoRelatorio && (
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DownloadIcon /> Formato de Exportação
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Formato</InputLabel>
                        <Select
                          value={filtros.formatoExportacao}
                          onChange={(e) => handleFiltroChange('formatoExportacao', e.target.value)}
                          label="Formato"
                        >
                          <MenuItem value="pdf">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PdfIcon color="error" />
                              PDF
                            </Box>
                          </MenuItem>
                          <MenuItem value="excel">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ExcelIcon color="success" />
                              Excel
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Resumo dos Filtros */}
              {filtros.tipoRelatorio && (
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Resumo dos Filtros
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip 
                      label={`Tipo: ${tiposRelatorio.find(t => t.value === filtros.tipoRelatorio)?.label}`}
                      color="primary"
                    />
                    {filtros.dataInicio && (
                      <Chip 
                        label={`De: ${new Date(filtros.dataInicio).toLocaleDateString('pt-BR')}`}
                        variant="outlined"
                      />
                    )}
                    {filtros.dataFim && (
                      <Chip 
                        label={`Até: ${new Date(filtros.dataFim).toLocaleDateString('pt-BR')}`}
                        variant="outlined"
                      />
                    )}
                    {filtros.cliente && (
                      <Chip 
                        label={`Cliente: ${clientes.find(c => c.id_cliente === filtros.cliente)?.nome}`}
                        variant="outlined"
                      />
                    )}
                    {filtros.produto && (
                      <Chip 
                        label={`Produto: ${produtos.find(p => p.id_produto === filtros.produto)?.nome}`}
                        variant="outlined"
                      />
                    )}
                    {filtros.status && (
                      <Chip 
                        label={`Status: ${filtros.status}`}
                        variant="outlined"
                      />
                    )}
                    <Chip 
                      label={`Formato: ${filtros.formatoExportacao.toUpperCase()}`}
                      color="secondary"
                    />
                  </Stack>
                </Paper>
              )}

              {/* Ações */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={limparFiltros}
                  disabled={loading}
                >
                  Limpar Filtros
                </Button>
                <Button
                  variant="contained"
                  onClick={gerarRelatorio}
                  disabled={!filtros.tipoRelatorio || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 3
                  }}
                >
                  {loading ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </Box>

              {/* Informações */}
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Dica:</strong> Selecione o tipo de relatório e configure os filtros desejados. 
                  O relatório será gerado no formato escolhido e estará disponível para download.
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Container>
  );
};

export default Relatorios;