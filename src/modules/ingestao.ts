// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import * as path from 'node:path'
import * as fs from 'node:fs'

const EXTENSOES_VALIDAS = ['.mp3', '.wav', '.m4a', '.txt']

export function validarExtensao(caminho: string): string {
  const ext = path.extname(caminho).toLowerCase()

  if (!EXTENSOES_VALIDAS.includes(ext)) {
    throw new Error(
      'Extensao "' + ext + '" nao suportada. Use: ' + EXTENSOES_VALIDAS.join(', ')
    )
  }

  return ext
}

export function validarEntrada(caminho: string): string {
  const ext = validarExtensao(caminho)

  if (!fs.existsSync(caminho)) {
    throw new Error('Arquivo nao encontrado: ' + caminho)
  }

  return ext
}

export function lerTranscricaoSimulada(caminho: string): string {
  return fs.readFileSync(caminho, 'utf-8')
}
