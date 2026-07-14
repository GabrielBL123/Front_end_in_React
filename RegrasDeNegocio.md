# 📊 Documentação Técnica: Lógica de Análise de Risco Psicológico (NR-1)

Esta documentação descreve a inteligência de negócio implementada no ecossistema da aplicação para processar os dados coletados através do questionário de saúde mental e segurança do trabalho, em total conformidade com a nova **NR-1**.

---

## 📋 1. Estrutura do Questionário

O questionário é composto por **52 perguntas fechadas**, divididas igualmente entre **13 fatores de risco** (4 perguntas por fator). 

### Escala de Resposta (Padrão para todas as questões)
* **1** – Nunca / Não existe
* **2** – Raramente
* **3** – Às vezes
* **4** – Frequentemente
* **5** – Sempre / Existe totalmente

### Distribuição dos 13 Fatores e Perguntas

Cada fator é avaliado sob duas perspectivas: **Percepção Individual** (subjetiva do colaborador) e **Condição Real** (o que a empresa de fato oferece de estrutura).

| Nº | Fator de Risco | Perguntas de Percepção (Ruim se Alto) | Perguntas de Condição Real (Bom se Alto) |
|:---:|:---|:---:|:---:|
| **1** | Sobrecarga de Trabalho | Q1, Q2 | Q3, Q4 |
| **2** | Ritmo Intenso / Pressão | Q5, Q6 | Q7, Q8 |
| **3** | Liderança | Q9, Q10 | Q11, Q12 |
| **4** | Assédio / Ambiente Tóxico | Q13, Q14 | Q15, Q16 |
| **5** | Falta de Autonomia | Q17, Q18 | Q19, Q20 |
| **6** | Falta de Reconhecimento | Q21, Q22 | Q23, Q24 |
| **7** | Comunicação Ineficaz | Q25, Q26 | Q27, Q28 |
| **8** | Injustiça Organizacional | Q29, Q30 | Q31, Q32 |
| **9** | Relações Interpessoais | Q33, Q34 | Q35, Q36 |
| **10**| Jornada de Trabalho | Q37, Q38 | Q39, Q40 |
| **11**| Conflito Trabalho × Vida | Q41, Q42 | Q43, Q44 |
| **12**| Exigência Emocional | Q45, Q46 | Q47, Q48 |
| **13**| Suporte Organizacional | Q49, Q50 | Q51, Q52 |

---

## ⚙️ 2. Lógica Matemática de Cálculo (Por Fator)

Para cada um dos 13 fatores, o sistema realiza o processamento matemático utilizando os passos abaixo:

### Passo 1: Calcular Médias das Perguntas
Aplica-se a média aritmética simples para agrupar as respostas do bloco.
* **Percepção (P):** $P = \frac{Q_{percep1} + Q_{percep2}}{2}$
* **Condição Real (C):** $C = \frac{Q_{cond1} + Q_{cond2}}{2}$

### Passo 2: Inversão da Condição Real
Na coleta, uma Condição Real alta é positiva para a empresa (ex: existir canal de denúncia seguro). Para calcular o risco, precisamos inverter essa lógica para que **quanto maior o número, pior seja o cenário**:
* **Condição Ajustada ($C_{ajustada}$):** $C_{ajustada} = 6 - C$

### Passo 3: Cálculo do Risco Bruto ($R$)
O risco final do fator é calculado através da média ponderada ou simples entre a percepção do colaborador e a condição real ajustada do ambiente:
* **Fórmula Aplicada:** $R = \frac{P + C_{ajustada}}{2}$ *(Varia de 1.0 a 5.0)*

---

## 📊 3. Classificação de Risco Padrão

O score bruto ($R$) obtido determina a classificação inicial do fator conforme a tabela abaixo:

| Intervalo de Score | Classificação | Cor Indicativa |
|:---:|:---:|:---:|
| **1.0 – 1.9** | 🟢 Baixo | Verde |
| **2.0 – 2.9** | 🟡 Médio | Amarelo |
| **3.0 – 3.9** | 🟠 Alto | Laranja |
| **4.0 – 5.0** | 🔴 Crítico | Vermelho |

---

## 🔥 4. Regras de Alerta Automático (Inteligência do Sistema)

Para evitar que médias matemáticas mascarem cenários graves, o sistema aplica **três regras de salvaguarda automáticas** que sobrepõem o cálculo do Risco Bruto:

### 🔴 REGRA 1 — Risco Oculto
* **Gatilho:** Se a Percepção for baixa, mas a Condição Ajustada for muito alta ($P \le 2.0$ e $C_{ajustada} \ge 4.0$).
* **Comportamento:** O Risco é forçado automaticamente para **ALTO**.
* **Justificativa:** O colaborador individualmente não percebe o perigo ou se acostumou com a cultura, mas o ambiente real está estruturalmente precário/tóxico.

### 🔴 REGRA 2 — Sofrimento Elevado
* **Gatilho:** Se a Percepção do colaborador for muito alta ($P \ge 4.0$).
* **Comportamento:** O Risco mínimo do fator passa a ser **ALTO**. Ele nunca poderá ser classificado como Baixo ou Médio, independente de quão boa a empresa alegue ser a sua condição real.
* **Justificativa:** A dor e o desgaste relatados pelo colaborador exigem intervenção imediata da gestão.

### 🔴 REGRA 3 — Risco Crítico Direto
* **Gatilho:** Se a Percepção for alta E a Condição Ajustada também for alta ($P \ge 4.0$ e $C_{ajustada} \ge 4.0$).
* **Comportamento:** O Risco é elevado sumariamente para **CRÍTICO**.
* **Justificativa:** Cenário de perigo extremo iminente. O funcionário está em sofrimento e a empresa não possui nenhuma barreira ou política para mitigar o problema.

---

## 🏢 5. Consolidação de Dados e Regra de Privacidade

### Cálculo por Setor
O Risco de um Setor é determinado pela média das notas das perguntas de todos os funcionários pertencentes àquele setor específico, aplicando as mesmas fórmulas e regras de alerta descritas acima sobre a média consolidada.

### 🔒 Trava de Privacidade (LGPD / Proteção de Identidade)
> **REGRA CRÍTICA:** Se um setor possuir **menos de 3 funcionários respondentes**, a visualização detalhada do setor fica **estritamente bloqueada**.

* **No Back-end:** O payload do endpoint envia o indicador `exibirResultado = false` e anula (`null`) a lista de fatores e notas.
* **No Front-end:** O sistema deve exibir uma mensagem informando que os dados estão ocultos para preservar o anonimato dos colaboradores daquele setor.

### Cálculo Geral da Empresa
O Risco Global da Empresa é a média consolidada dos 13 fatores considerando a totalidade de respostas coletadas na organização, servindo como o indicador macro do Dashboard do administrador.

---

## 🏢 6. Saída e Relatórios

*   **Risco por Setor ($R_{setor}$):** Média de risco calculada com base nos funcionários daquele setor específico.
*   **Risco Geral da Empresa ($R_{empresa}$):** Média de risco geral de todos os setores/funcionários.
*   **Exportação:** Após a finalização pelo Admin, o sistema deve gerar e disponibilizar o download de um arquivo `.csv` contendo as informações e as regras de negócio aplicadas com base nas respostas.