# Front Agenda

Aplicação React para gerenciamento de atividades com autenticação e interface organizada.

## Como rodar o projeto

### 1. Instale as dependências

```bash
npm install
```

### 2. Inicie o projeto em modo de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

### 3. Execute a build para produção

```bash
npm run build
```

### 4. Pré-visualize a build

```bash
npm run preview
```

## Requisitos

- Node.js instalado
- Backend rodando na porta 8080, pois a aplicação consome a API em:

```text
http://localhost:8080
```

## Tecnologias usadas

- React
- Vite
- React Router DOM
- JavaScript ES6+
- CSS moderno para estilização
- Fetch API para consumo de backend

## Estrutura do projeto

```text
src/
  components/         # componentes da interface
  services/           # comunicação com a API
  entities/           # modelos e regras de negócio básicas
  assets/             # arquivos estáticos
```

## Funcionalidades

- Tela de login
- Tela de cadastro
- Listagem de atividades
- Cadastro, edição e exclusão de atividades
- Layout com sidebar para navegação
- Exibição de atividades em um calendário
