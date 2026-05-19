// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import 'dotenv/config'
import { transcreverAudio } from './modules/transcricao.js'
import { gerarAta } from './services/ataService.js'
import { salvarAtaMarkdown } from './modules/exportador.js'
import type { AtaReuniao } from './types/index.js'

export async function processarAudio(caminho: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'Variavel GEMINI_API_KEY nao encontrada. Crie um arquivo .env baseado no .env.example.'
    )
  }

  console.log('Lendo entrada: ' + caminho)
  const transcricao = await transcreverAudio(caminho)

  console.log('Enviando para o Gemini...')
  const ata: AtaReuniao = await gerarAta(transcricao, apiKey)

  console.log('Salvando ata em Markdown...')
  const caminhoSaida = salvarAtaMarkdown(ata)

  return caminhoSaida
}
