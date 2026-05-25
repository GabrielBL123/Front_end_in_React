# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Documento de Histórias de Usuário e Validação de Requisitos
## Sistema de Avaliação de Desempenho (RH)

Este documento apresenta o mapeamento completo das Histórias de Usuário e a Validação de Requisitos para o Sistema de Avaliação de Desempenho, estruturado com base nas especificações das interfaces e fluxos do Administrador (Tati), do Setor de Recursos Humanos (RH) e dos Funcionários.

---

## 1. Histórias de Usuário (User Stories)

### 1.1. Perfil: Administrador (Tati)
* **US01 - Autenticação do Administrador**
  * **Como** Administradora (Tati),
  * **Quero** realizar o login na página inicial do sistema,
  * **Para** acessar de forma segura o painel administrativo (Tela Admin).
  * **Critérios de Aceitação:**
    * O acesso exige credenciais válidas de e-mail e senha.

* **US02 - Criação de Questionários**
  * **Como** Administradora (Tati),
  * **Quero** criar um novo questionário informando a data, a competência e o CNPJ da empresa,
  * **Para** lançar uma nova avaliação vinculada a uma organização específica.
  * **Critérios de Aceitação:**
    * O questionário é gerado exclusivamente para a empresa informada.
    * Uma vez criado, o questionário **não pode ser editado**.

* **US03 - Exclusão de Questionários**
  * **Como** Administradora (Tati),
  * **Quero** ter a opção de excluir um questionário,
  * **Para** remover avaliações incorretas ou obsoletas do sistema.

* **US04 - Visualização e Acompanhamento de Questionários**
  * **Como** Administradora (Tati),
  * **Quero** visualizar os questionários de cada empresa e acompanhar quais funcionários já responderam,
  * **Para** monitorar o engajamento e a adesão da avaliação em tempo real.
  * **Critérios de Aceitação:**
    * Ao selecionar a opção de ver os questionarios, o sistema deve encaminhar para uma página com a lista de usuários que responderam.
    * Na lateral dessa listagem, deve constar uma barra informativa contendo os dados da empresa e o histórico completo de ações (data e hora de criação ou exclusão do questionário).

* **US05 - Finalização de Avaliação**
  * **Como** Administradora (Tati),
  * **Quero** ter um botão para finalizar a avaliação na tela de listagem de respostas,
  * **Para** encerrar o ciclo de preenchimento dos funcionários.
  * **Critérios de Aceitação:**
    * Esta permissão é **exclusiva** da Tati (Admin).
    * Ao clicar em finalizar, o sistema processa o encerramento e redireciona o usuário de volta para a página principal de lista de questionários.

* **US06 - Exportação de Dados (CSV)**
  * **Como** Administradora (Tati),
  * **Quero** gerar e baixar um arquivo CSV a partir da lista de questionários finalizados,
  * **Para** analisar os resultados e consolidar os relatórios em ferramentas externas.

* **US07 - Geração de Links para Funcionários**
  * **Como** Administradora (Tati),
  * **Quero** gerar um link de acesso direto ao questionário na página de listagem,
  * **Para** disponibilizar e compartilhar o acesso com os colaboradores da empresa.

* **US08 - Cadastro de Usuários de RH**
  * **Como** Administradora (Tati),
  * **Quero** cadastrar profissionais de Recursos Humanos fornecendo nome, e-mail, nome da empresa, CNPJ, e-mail comercial e senha,
  * **Para** descentralizar o acompanhamento interno das avaliações em cada cliente.
  * **Critérios de Aceitação:**
    * Após a validação das informações e a conclusão do cadastro, o sistema deve disparar automaticamente um e-mail contendo um link para que o usuário realize o primeiro login.

* **US09 - Consulta de Empresas Parceiras**
  * **Como** Administradora (Tati),
  * **Quero** visualizar uma lista de todas as empresas cadastradas no sistema, exibindo CNPJ, nome e telefone,
  * **Para** manter o controle de contato e dados cadastrais atualizados.

---

### 1.2. Perfil: Recursos Humanos (RH)
* **US10 - Visualização e Controle da Empresa (RH)**
  * **Como** usuário de RH,
  * **Quero** visualizar os questionários disponíveis para a minha empresa e consultar a lista de funcionários que já responderam,
  * **Para** gerenciar a participação da equipe sem possuir direitos de alteração estrutural.
  * **Critérios de Aceitação:**
    * O RH visualiza os mesmos dados de listagem de funcionários e informações da empresa (como CNPJ), mas **não possui permissão** para criar ou excluir questionários, nem para gerar relatórios em formato CSV.

* **US11 - Compartilhamento de Questionário (RH)**
  * **Como** usuário de RH,
  * **Quero** gerar o link de acesso ao questionário correspondente à minha empresa,
  * **Para** enviar diretamente aos funcionários e cobrar o preenchimento.

* **US12 - Gestão de Setores (RH)**
  * **Como** usuário de RH,
  * **Quero** visualizar, adicionar novos setores informando apenas o nome, ou excluir setores existentes,
  * **Para** estruturar adequadamente o organograma da empresa para os funcionários selecionarem no questionário.
  * **Critérios de Aceitação:**
    * A exibição dos setores cadastrados deve ocorrer em formato de lista linear simples.

---

### 1.3. Perfil: Funcionário / Colaborador
* **US13 - Fluxo de Entrada e Apresentação**
  * **Como** funcionário da empresa avaliada,
  * **Quero** acessar a tela de apresentação inicial para assistir ao vídeo explicativo da Tati e ler as diretrizes gerais,
  * **Para** compreender o propósito da avaliação de desempenho antes de iniciar.
  * **Critérios de Aceitação:**
    * O avanço desta tela de apresentação para a próxima etapa ocorre de forma direta e sem a exigência de qualquer tipo de token ou autenticação.

* **US14 - Preenchimento de Identificação Profissional**
  * **Como** funcionário da empresa avaliada,
  * **Quero** preencher meu perfil com Nome, E-mail, Cargo, Setor, Tempo de trabalho e Jornada,
  * **Para** categorizar minhas respostas nos relatórios gerenciais da empresa.
  * **Critérios de Aceitação:**
    * O sistema deve validar todos os campos. A transição para o questionário propriamente dito **só é liberada se todos os campos estiverem preenchidos corretamente**.

* **US15 - Resposta e Submissão do Questionário**
  * **Como** funcionário da empresa avaliada,
  * **Quero** responder às perguntas propostas e salvar minhas respostas de forma definitiva,
  * **Para** concluir meu processo de avaliação.
  * **Critérios de Aceitação:**
    * O botão de finalização só fica ativo ou processa com sucesso **se 100% das perguntas estiverem respondidas**.
    * Após finalizar a submissão, o funcionário fica estritamente **bloqueado de acessar ou responder novamente** ao mesmo questionário.

---

## 2. Validação de Requisitos (Regras de Negócio Seguras)

Para garantir que o desenvolvimento siga exatamente as regras estabelecidas e evite comportamentos indesejados, os seguintes critérios técnicos e lógicos devem ser validados:

### 2.1. Matriz de Permissões por Perfil

| Funcionalidade / Ação | Administrador (Tati) | Recursos Humanos (RH) | Funcionário |
| :--- | :---: | :---: | :---: |
| **Fazer Login no Painel** | Sim | Sim | Não |
| **Criar / Excluir Questionários** | Sim | **Não** | Não |
| **Editar Estrutura de Questionário** | **Não** (Imutável) | **Não** | Não |
| **Visualizar Lista de Respostas e Histórico** | Sim | Sim | Não |
| **Finalizar Avaliação** | Sim | **Não** | Não |
| **Gerar Arquivo CSV** | Sim | **Não** | Não |
| **Gerar Link para Funcionários** | Sim | Sim | Não |
| **Cadastrar Usuários de RH** | Sim | Não | Não |
| **Visualizar Informações e Telefone da Empresa** | Sim | Sim | Não |
| **Criar, Listar e Excluir Setores** | Não | Sim | Não |
| **Assistir Vídeo de Apresentação (Sem Token)** | Não aplicável | Não aplicável | Sim |
| **Preencher Cadastro e Responder Questionário** | Não | Não | Sim |

### 2.2. Regras Críticas de Fluxo de Dados e Validações

1. **Imutabilidade de Questionários:** Ao submeter o formulário de criação de questionário (Data + Competência + CNPJ), o sistema gera o registro e bloqueia qualquer tipo de edição posterior. Caso haja erros, o fluxo padrão obriga a exclusão e nova criação.
2. **Encadeamento Pós-Finalização da Tati:** A ação de "Finalizar Avaliação" na visualização do questionário deve disparar um gatilho no backend que altera o status da avaliação. Em seguida, a interface deve obrigatoriamente redirecionar o usuário para a página de listagem de questionários, habilitando os botões de download de CSV.
3. **Fluxo de Ativação do RH:** O cadastro de RH não gera uma conta ativa imediatamente operacional sem verificação. A rota de backend que processa o formulário de cadastro deve persistir os dados com status pendente, gerar um token de ativação seguro e enviar por e-mail no formato de link de login.
4. **Validação de Bloqueio do Funcionário (Prevenção de Duplicidade):** No momento em que o funcionário clica em "Finalizar" no passo 3 (Questionário), o sistema realiza um check síncrono para garantir que todas as respostas foram preenchidas. Havendo sucesso, salva o estado de "Respondido" atrelado à identidade/sessão do funcionário para aquela avaliação específica. Tentativas subsequentes de carregar o link do questionário por este usuário devem retornar uma tela de bloqueio informativo.

