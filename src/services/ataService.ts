// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import { GoogleGenAI } from '@google/genai'
import type { AtaReuniao } from '../types/index.js'

const PROMPT_SISTEMA = 'Atue como um Secretario Corporativo Executivo.\n\n' +
'Analise a transcricao da reuniao fornecida e gere uma Ata de Reuniao estrita contendo:\n\n' +
'1. **Resumo Executivo** (2 paragrafos curtos e objetivos)\n' +
'2. **Lista de Decisoes Tomadas** (itens numerados)\n' +
'3. **Tabela de Pontos de Acao** (com colunas: Tarefa, Responsavel, Prazo inferido)\n\n' +
'Responda **exclusivamente** no formato JSON abaixo, sem texto adicional antes ou depois:\n\n' +
'{\n' +
'  "resumoExecutivo": "texto...",\n' +
'  "decisoesTomadas": ["Decisao 1", "Decisao 2"],\n' +
'  "pontosDeAcao": [\n' +
'    { "tarefa": "descricao", "responsavel": "nome", "prazo": "data inferida ou Nao especificado" }\n' +
'  ]\n' +
'}'

export async function gerarAta(
  transcricao: string,
  apiKey: string
): Promise<AtaReuniao> {
  if (!apiKey || apiKey === 'sua_chave_aqui') {
    throw new Error('GEMINI_API_KEY nao configurada. Defina a variavel de ambiente.')
  }

  const client = new GoogleGenAI({ apiKey })

  const prompt = PROMPT_SISTEMA + '\n\n---\n\nTranscricao da Reuniao:\n' + transcricao

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })

  const texto = response.text ?? ''

  if (!texto.trim()) {
    throw new Error('A API Gemini retornou uma resposta vazia.')
  }

  const json = extrairJson(texto)

  return validarAta(json)
}

function extrairJson(texto: string): AtaReuniao {
  const match = texto.match(/\{[\s\S]*\}/)
  if (!match) {
    throw new Error('Nao foi possivel extrair JSON da resposta do Gemini.')
  }

  return JSON.parse(match[0]) as AtaReuniao
}

function validarAta(ata: AtaReuniao): AtaReuniao {
  if (!ata.resumoExecutivo || typeof ata.resumoExecutivo !== 'string') {
    throw new Error('Ata invalida: campo "resumoExecutivo" ausente ou invalido.')
  }

  if (!Array.isArray(ata.decisoesTomadas)) {
    throw new Error('Ata invalida: campo "decisoesTomadas" deve ser um array.')
  }

  if (!Array.isArray(ata.pontosDeAcao)) {
    throw new Error('Ata invalida: campo "pontosDeAcao" deve ser um array.')
  }

  for (const ponto of ata.pontosDeAcao) {
    if (!ponto.tarefa || !ponto.responsavel || !ponto.prazo) {
      throw new Error(
        'Ata invalida: cada ponto de acao deve conter "tarefa", "responsavel" e "prazo".'
      )
    }
  }

  return ata
}
