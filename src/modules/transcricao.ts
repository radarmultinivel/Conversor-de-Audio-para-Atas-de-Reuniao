// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import { validarEntrada, lerTranscricaoSimulada } from './ingestao.js'

export async function transcreverAudio(caminho: string): Promise<string> {
  const ext = validarEntrada(caminho)

  if (ext === '.txt') {
    return lerTranscricaoSimulada(caminho)
  }

  throw new Error(
    'Transcricao de audio real via API ainda nao implementada. ' +
    'Forneca um arquivo .txt com a transcricao simulada para teste.'
  )
}
