// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import * as fs from 'node:fs'
import * as path from 'node:path'
import type { AtaReuniao } from '../types/index.js'

const DIR_SAIDA = 'output'

export function salvarAtaMarkdown(ata: AtaReuniao, nomeArquivo?: string): string {
  if (!fs.existsSync(DIR_SAIDA)) {
    fs.mkdirSync(DIR_SAIDA, { recursive: true })
  }

  const data = new Date().toISOString().split('T')[0]
  const nome = nomeArquivo ?? 'ata_reuniao_' + data + '.md'
  const caminho = path.join(DIR_SAIDA, nome)

  const { resumoExecutivo, decisoesTomadas, pontosDeAcao } = ata

  const linhas: string[] = [
    '# Ata de Reuniao',
    '',
    '**Data de geracao:** ' + data,
    '',
    '---',
    '',
    '## Resumo Executivo',
    '',
    resumoExecutivo,
    '',
    '---',
    '',
    '## Decisoes Tomadas',
    '',
    ...decisoesTomadas.map((d, i) => (i + 1) + '. ' + d),
    '',
    '---',
    '',
    '## Pontos de Acao',
    '',
    '| # | Tarefa | Responsavel | Prazo |',
    '|---|--------|-------------|-------|',
    ...pontosDeAcao.map(
      (p, i) => '| ' + (i + 1) + ' | ' + p.tarefa + ' | ' + p.responsavel + ' | ' + p.prazo + ' |'
    ),
    '',
  ]

  fs.writeFileSync(caminho, linhas.join('\n'), 'utf-8')

  return caminho
}
