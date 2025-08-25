import GenericDataGrid from '../components/genericdatagrid';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Components/GenericDataGrid',
  component: GenericDataGrid,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    pageSize: {
      control: { type: 'select' },
      options: [5, 10, 20],
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
};

// Sample data for stories
const sampleColumns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'nome',
    headerName: 'Nome',
    width: 150,
    editable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
    editable: false,
  },
  {
    field: 'telefone',
    headerName: 'Telefone',
    width: 150,
    editable: false,
  },
];

const sampleRows = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-9999' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 88888-8888' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '(11) 77777-7777' },
  { id: 4, nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 66666-6666' },
  { id: 5, nome: 'Carlos Ferreira', email: 'carlos@email.com', telefone: '(11) 55555-5555' },
  { id: 6, nome: 'Lucia Almeida', email: 'lucia@email.com', telefone: '(11) 44444-4444' },
];

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    rows: sampleRows,
    columns: sampleColumns,
    pageSize: 5,
    loading: false,
  },
};

export const Loading = {
  args: {
    rows: [],
    columns: sampleColumns,
    pageSize: 5,
    loading: true,
  },
};

export const EmptyData = {
  args: {
    rows: [],
    columns: sampleColumns,
    pageSize: 5,
    loading: false,
  },
};

export const LargePageSize = {
  args: {
    rows: sampleRows,
    columns: sampleColumns,
    pageSize: 20,
    loading: false,
  },
};

export const ProductColumns = {
  args: {
    rows: [
      { id: 1, nome: 'Produto A', preco: 29.99, categoria: 'Eletrônicos' },
      { id: 2, nome: 'Produto B', preco: 49.99, categoria: 'Casa' },
      { id: 3, nome: 'Produto C', preco: 19.99, categoria: 'Livros' },
    ],
    columns: [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'nome', headerName: 'Nome do Produto', width: 200 },
      { field: 'preco', headerName: 'Preço', width: 120, type: 'number' },
      { field: 'categoria', headerName: 'Categoria', width: 150 },
    ],
    pageSize: 5,
    loading: false,
  },
};