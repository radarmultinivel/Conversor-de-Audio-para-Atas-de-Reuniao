// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { salvarAtaMarkdown } from '../src/modules/exportador.js'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { AtaReuniao } from '../src/types/index.js'

const DIR_SAIDA = 'output'

describe('exportador', () => {
  const ataValida: AtaReuniao = {
    resumoExecutivo:
      'Reuniao de planejamento da Sprint 14 com foco em tres entregas principais.',
    decisoesTomadas: [
      'Provedor A escolhido para integracao PIX',
      'Beatriz fara refatoracao do login',
    ],
    pontosDeAcao: [
      { tarefa: 'Refatorar login', responsavel: 'Beatriz', prazo: '20/05' },
      { tarefa: 'Corrigir bug performance', responsavel: 'Joao', prazo: 'Final sprint' },
    ],
  }

  beforeEach(() => {
    if (fs.existsSync(DIR_SAIDA)) {
      fs.rmSync(DIR_SAIDA, { recursive: true })
    }
  })

  afterEach(() => {
    if (fs.existsSync(DIR_SAIDA)) {
      fs.rmSync(DIR_SAIDA, { recursive: true })
    }
  })

  it('deve criar diretorio output se nao existir', () => {
    const caminho = salvarAtaMarkdown(ataValida)
    expect(fs.existsSync(DIR_SAIDA)).toBe(true)
    expect(fs.existsSync(caminho)).toBe(true)
  })

  it('deve salvar arquivo com nome padrao contendo a data', () => {
    const data = new Date().toISOString().split('T')[0]
    const caminho = salvarAtaMarkdown(ataValida)
    expect(path.basename(caminho)).toBe('ata_reuniao_' + data + '.md')
  })

  it('deve salvar arquivo com nome personalizado', () => {
    const caminho = salvarAtaMarkdown(ataValida, 'minha_ata.md')
    expect(path.basename(caminho)).toBe('minha_ata.md')
  })

  it('deve conter todas as secoes obrigatorias no conteudo', () => {
    const caminho = salvarAtaMarkdown(ataValida)
    const conteudo = fs.readFileSync(caminho, 'utf-8')

    expect(conteudo).toContain('# Ata de Reuniao')
    expect(conteudo).toContain('## Resumo Executivo')
    expect(conteudo).toContain('## Decisoes Tomadas')
    expect(conteudo).toContain('## Pontos de Acao')
    expect(conteudo).toContain('| # | Tarefa | Responsavel | Prazo |')
  })

  it('deve incluir dados da ata no arquivo', () => {
    const caminho = salvarAtaMarkdown(ataValida)
    const conteudo = fs.readFileSync(caminho, 'utf-8')

    expect(conteudo).toContain('Provedor A escolhido para integracao PIX')
    expect(conteudo).toContain('Beatriz')
    expect(conteudo).toContain('20/05')
  })
})
