# Conversor de Audio para Atas de Reuniao

**Desenvolvido por L. A. Leandro - Sao Jose dos Campos- SP - 2026**

---

## 1. Objetivo do Programa

O Conversor de Audio para Atas de Reuniao e uma aplicacao CLI (Command Line Interface) que automatiza o processo de criacao de atas de reuniao a partir de arquivos de audio ou transcricoes em texto. O sistema utiliza inteligencia artificial (Google Gemini) para analisar o conteudo da reuniao e gerar um documento estruturado contendo resumo executivo, decisoes tomadas e pontos de acao com responsaveis e prazos.

O objetivo principal e eliminar o trabalho manual de redacao de atas, reduzindo o tempo gasto em tarefas administrativas pos-reuniao e garantindo padronizacao na documentacao.

---

## 2. Requisitos

### Funcionais

| ID | Requisito | Descricao |
|----|-----------|-----------|
| RF01 | Ingestao de midia | Aceitar arquivos nos formatos .mp3, .wav, .m4a e .txt |
| RF02 | Validacao de entrada | Verificar extensao do arquivo e existencia fisica do mesmo |
| RF03 | Transcricao | Converter audio em texto (atualmente via simulacao com arquivo .txt) |
| RF04 | Analise por IA | Enviar transcricao para o Google Gemini e processar o retorno |
| RF05 | Geracao de ata | Estruturar o resultado em resumo executivo, decisoes e pontos de acao |
| RF06 | Exportacao | Salvar ata em formato Markdown (.md) no diretorio output/ |
| RF07 | CLI | Interface de linha de comando com passagem de argumento |

### Nao Funcionais

| ID | Requisito | Descricao |
|----|-----------|-----------|
| RNF01 | Performance | Processamento completo em ate 30 segundos para reunioes de ate 1 hora |
| RNF02 | Portabilidade | Executavel em Windows, Linux e macOS (Node.js cross-platform) |
| RNF03 | Manutencao | Codigo modular com separacao clara de responsabilidades |
| RNF04 | Testabilidade | Cobertura de testes unitarios para todos os modulos |

---

## 3. Especificacoes Tecnicas

### 3.1 Fluxograma da Arquitetura

```
+------------------+
|   Entrada        |  .mp3, .wav, .m4a, .txt
+--------+---------+
         |
         v
+------------------+
|   ingextao.ts    |  Validacao de extensao e existencia
+--------+---------+
         |
         v
+------------------+
|  transcricao.ts  |  Leitura do arquivo .txt (simulacao)
+--------+---------+  Futuro: integracao com API Speech-to-Text
         |
         v
+------------------+
|  ataService.ts   |  Envio para Google Gemini
|  (Gemini API)    |  Prompt engineering + parse JSON
+--------+---------+
         |
         v
+------------------+
|  exportador.ts   |  Geracao do arquivo Markdown
+--------+---------+
         |
         v
+------------------+
| output/ata_*.md  |  Documento final
+------------------+
```

### 3.2 Fluxo de Dados

```
Arquivo de entrada
    -> string (transcricao)
        -> JSON (ata estruturada)
            -> arquivo .md (documento formatado)
```

### 3.3 Estrutura de Diretorios

```
conversor-audio-ata/
+-- src/
|   +-- cli.ts                 # Ponto de entrada da CLI
|   +-- index.ts               # Orquestrador principal
|   +-- types/
|   |   +-- index.ts           # Interfaces AtaReuniao e PontoDeAcao
|   +-- modules/
|   |   +-- ingestao.ts        # Validacao de extensao e leitura de arquivos
|   |   +-- transcricao.ts     # Camada de transcricao (simulada)
|   |   +-- exportador.ts      # Exportacao para Markdown
|   +-- services/
|       +-- ataService.ts      # Integracao com API Gemini
+-- tests/
|   +-- ataService.test.ts     # Testes do motor de IA
|   +-- exportador.test.ts     # Testes do exportador
|   +-- ingestao.test.ts       # Testes de validacao de entrada
|   +-- mocks/
|       +-- transcricaoMock.ts # Dados mockados para testes
+-- sample/
|   +-- input.txt              # Arquivo de exemplo para teste
+-- output/                    # Diretorio de saida (gerado)
+-- .env.example               # Template de variaveis de ambiente
+-- vitest.config.ts           # Configuracao do Vitest
+-- tsconfig.json              # Configuracao do TypeScript
+-- package.json               # Dependencias e scripts
+-- README.md                  # Documentacao
```

---

## 4. Stacks, Tecnologias e Dependencias

### Stack Principal

| Tecnologia | Versao | Finalidade |
|------------|--------|------------|
| Node.js | 18+ | Runtime JavaScript |
| TypeScript | 5.7+ | Linguagem de programacao |
| Google Gen AI SDK | 0.2+ | Integracao com modelo Gemini |
| Commander | 12+ | Interface de linha de comando |
| dotenv | 16+ | Gerenciamento de variaveis de ambiente |

### Stack de Desenvolvimento

| Tecnologia | Versao | Finalidade |
|------------|--------|------------|
| Vitest | 2+ | Framework de testes unitarios |
| tsx | 4+ | Execucao de TypeScript sem compilacao |
| @types/node | 22+ | Tipagens do Node.js |

### Dependencias (package.json)

```json
{
  "dependencies": {
    "@google/genai": "^0.2.0",
    "dotenv": "^16.4.7",
    "commander": "^12.1.0"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "vitest": "^2.1.8",
    "tsx": "^4.19.2",
    "@types/node": "^22.10.5"
  }
}
```

---

## 5. Instalacao

### Pre-requisitos

- Node.js versao 18 ou superior
- npm versao 9 ou superior
- Chave de API do Google Gemini (gratuita em https://aistudio.google.com/apikey)

### Passos

```bash
# 1. Clone o repositorio
git clone https://github.com/seu-usuario/conversor-audio-ata.git
cd conversor-audio-ata

# 2. Instale as dependencias
npm install

# 3. Configure a chave de API
cp .env.example .env

# 4. Edite o arquivo .env com sua chave do Gemini
# GEMINI_API_KEY=AIzaSy...

# 5. Compile o codigo TypeScript
npm run build

# 6. Execute com o arquivo de exemplo
npm start sample/input.txt
```

### Configuracao do Ambiente

Crie o arquivo `.env` na raiz do projeto com o seguinte conteudo:

```env
GEMINI_API_KEY=sua_chave_api_aqui
```

Substitua `sua_chave_api_aqui` pela chave obtida no Google AI Studio.

---

## 6. Manual do Usuario

### Sintaxe

```bash
conversor-ata <caminho_do_arquivo>
```

### Modos de Execucao

```bash
# Modo producao (apos build)
npm start sample/input.txt

# Modo desenvolvimento (com reload automatico)
npm run dev -- sample/input.txt

# Execucao direta com tsx
npx tsx src/cli.ts sample/input.txt
```

### Formatos de Entrada Suportados

| Extensao | Tipo | Status |
|----------|------|--------|
| .txt | Transcricao em texto | Suportado |
| .mp3 | Audio | Validado (transcricao nao implementada) |
| .wav | Audio | Validado (transcricao nao implementada) |
| .m4a | Audio | Validado (transcricao nao implementada) |

### Exemplo de Uso

Entrada (`sample/input.txt`):
```
Reuniao de Planejamento Sprint 14
Data: 15 de maio de 2026
Participantes: Carlos (Tech Lead), Ana (PO), Beatriz (Dev), Joao (QA)

Carlos: Vamos comecar a planning da sprint 14...
```

Comando:
```bash
npm run dev -- sample/input.txt
```

Saida no console:
```
Lendo entrada: sample/input.txt
Enviando para o Gemini...
Salvando ata em Markdown...
Ata gerada com sucesso: output/ata_reuniao_2026-05-19.md
```

Arquivo gerado (`output/ata_reuniao_2026-05-19.md`):
```markdown
# Ata de Reuniao

**Data de geracao:** 2026-05-19

---

## Resumo Executivo

A reuniao de planejamento da Sprint 14 foi conduzida por Carlos com foco em tres entregas principais...

---

## Decisoes Tomadas

1. Provedor A escolhido para integracao PIX
2. Beatriz ficara responsavel pela refatoracao da tela de login
3. Joao cuidara da correcao do bug de performance

---

## Pontos de Acao

| # | Tarefa | Responsavel | Prazo |
|---|--------|-------------|-------|
| 1 | Refatorar tela de login | Beatriz | Quarta-feira, 20/05 |
| 2 | Corrigir bug de performance | Joao | Final da sprint |
| 3 | Solicitar acesso ao banco | Carlos | Hoje |
```

---

## 7. Testes

### Execucao

```bash
# Executar todos os testes
npm test

# Modo watch (monitora alteracoes)
npm run test:watch
```

### Estrutura de Testes

| Arquivo | Modulo | Casos Testados |
|---------|--------|----------------|
| tests/ingestao.test.ts | ingestao | Validacao de extensoes (.mp3, .wav, .m4a, .txt), rejeicao de extensao invalida (.pdf), rejeicao de arquivo inexistente, leitura de arquivo .txt |
| tests/ataService.test.ts | ataService | Estrutura completa da ata, resposta vazia da API, JSON invalido, chave de API ausente, chave de API com valor padrao |
| tests/exportador.test.ts | exportador | Criacao do diretorio de saida, nome padrao do arquivo, nome personalizado, secoes obrigatorias no conteudo, dados corretos no arquivo |

### Exemplo de Saida dos Testes

```
 ✓ tests/ingestao.test.ts (8 tests)
 ✓ tests/exportador.test.ts (5 tests)
 ✓ tests/ataService.test.ts (5 tests)

 Test Files  3 passed (3)
      Tests  18 passed (18)
```

---

## 8. Variaveis de Ambiente

| Variavel | Obrigatoria | Descricao |
|----------|-------------|-----------|
| GEMINI_API_KEY | Sim | Chave de autenticacao para a API do Google Gemini |

---

## 9. Scripts Disponiveis

| Comando | Descricao |
|---------|-----------|
| npm run build | Compila TypeScript para JavaScript (diretorio dist/) |
| npm start | Executa o programa compilado |
| npm run dev | Executa em modo desenvolvimento com tsx |
| npm test | Executa todos os testes unitarios |
| npm run test:watch | Executa testes em modo watch |
| npm run lint | Verifica tipos do TypeScript sem emitir codigo |

---

## 10. Licenca

MIT License. Copyright (c) 2026 L. A. Leandro.

---

## 11. Contato

L. A. Leandro
Sao Jose dos Campos - SP
