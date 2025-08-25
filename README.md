# Projeto React Frontend

## Descrição
Este projeto é uma aplicação frontend desenvolvida em React que implementa um sistema de login e um dashboard administrativo. A aplicação se conecta a um backend para autenticação e gerenciamento de dados.

## Funcionalidades
- Sistema de login com autenticação
- Dashboard administrativo com estatísticas
- Visualização de usuários ativos e acessos
- Gerenciamento de estados
- Interface responsiva com Material-UI

## Tecnologias Utilizadas
- React.js
- Material-UI
- React Router
- Axios para requisições HTTP

## Pré-requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Backend rodando na porta 5000 (para autenticação)

## Instalação

1. Clone o repositório:
```
git clone https://github.com/crmpereira/Projeto-React-Frontend.git
```

2. Acesse o diretório do projeto:
```
cd Projeto-React-Frontend
```

3. Instale as dependências:
```
npm install
```
ou
```
yarn install
```

## Configuração

Certifique-se de que o backend esteja rodando na porta 5000 para que a autenticação funcione corretamente. A aplicação está configurada para se conectar a `http://localhost:5000/api/login` para autenticação.

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:
```
npm start
```
ou
```
yarn start
```

A aplicação estará disponível em `http://localhost:3000`.

## Uso

1. Acesse a página de login em `http://localhost:3000`
2. Insira suas credenciais de acesso
3. Após o login bem-sucedido, você será redirecionado para o dashboard
4. No dashboard, você pode navegar entre diferentes seções usando o menu lateral

## Estrutura do Projeto

- `src/App.js` - Componente principal que gerencia o estado de login
- `src/login.js` - Componente de login com validação
- `src/pages/Dashboard.js` - Dashboard administrativo com menu e estatísticas
- `src/components/` - Componentes reutilizáveis

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.