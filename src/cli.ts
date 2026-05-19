// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import { Command } from 'commander'
import { processarAudio } from './index.js'

const program = new Command()

program
  .name('conversor-ata')
  .description('Converte audio de reuniao em ata profissional usando IA Gemini')
  .version('1.0.0')

program
  .argument('<caminho>', 'Caminho do arquivo de audio (.mp3, .wav, .m4a) ou transcricao (.txt)')
  .action(async (caminho: string) => {
    try {
      const saida = await processarAudio(caminho)
      console.log(`Ata gerada com sucesso: ${saida}`)
      process.exit(0)
    } catch (erro) {
      if (erro instanceof Error) {
        console.error(`Erro: ${erro.message}`)
      } else {
        console.error('Erro desconhecido:', erro)
      }
      process.exit(1)
    }
  })

program.parse(process.argv)
