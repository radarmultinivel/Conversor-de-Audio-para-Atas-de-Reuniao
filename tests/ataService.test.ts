// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { gerarAta } from '../src/services/ataService.js'
import { TRANSCRICAO_MOCK } from './mocks/transcricaoMock.js'

vi.mock('@google/genai', () => {
  const generateContentMock = vi.fn()

  const GoogleGenAI = vi.fn(() => ({
    models: {
      generateContent: generateContentMock,
    },
  }))

  return {
    GoogleGenAI,
    __generateContentMock: generateContentMock,
  }
})

async function getGenerateContentMock() {
  const mod = await import('@google/genai')
  return (mod as unknown as { __generateContentMock: ReturnType<typeof vi.fn> }).__generateContentMock
}

describe('ataService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar a estrutura completa da ata quando a API responde corretamente', async () => {
    const mockResponse = {
      text: JSON.stringify({
        resumoExecutivo:
          'A reuniao de planejamento da Sprint 14 foi conduzida por Carlos com foco em tres entregas principais.',
        decisoesTomadas: [
          'Provedor A escolhido para integracao PIX',
          'Beatriz ficara responsavel pela refatoracao da tela de login',
          'Joao cuidara da correcao do bug de performance no relatorio mensal',
        ],
        pontosDeAcao: [
          { tarefa: 'Refatorar tela de login', responsavel: 'Beatriz', prazo: 'Quarta-feira, 20/05' },
          { tarefa: 'Corrigir bug de performance no relatorio', responsavel: 'Joao', prazo: 'Final da sprint' },
          { tarefa: 'Solicitar acesso ao banco de producao para Joao', responsavel: 'Carlos', prazo: 'Hoje' },
          { tarefa: 'Revisar PRs da sprint', responsavel: 'Carlos', prazo: 'Continuo' },
        ],
      }),
    }

    const mock = await getGenerateContentMock()
    mock.mockResolvedValue(mockResponse)

    const ata = await gerarAta(TRANSCRICAO_MOCK, 'chave_valida')

    expect(ata).toBeDefined()
    expect(ata.resumoExecutivo).toBeTypeOf('string')
    expect(ata.resumoExecutivo.length).toBeGreaterThan(0)
    expect(ata.decisoesTomadas).toBeInstanceOf(Array)
    expect(ata.decisoesTomadas.length).toBeGreaterThan(0)
    expect(ata.pontosDeAcao).toBeInstanceOf(Array)
    expect(ata.pontosDeAcao.length).toBeGreaterThan(0)

    for (const ponto of ata.pontosDeAcao) {
      expect(ponto).toHaveProperty('tarefa')
      expect(ponto).toHaveProperty('responsavel')
      expect(ponto).toHaveProperty('prazo')
    }
  })

  it('deve lancar erro quando a API retorna texto vazio', async () => {
    const mock = await getGenerateContentMock()
    mock.mockResolvedValue({ text: '' })

    await expect(gerarAta(TRANSCRICAO_MOCK, 'chave_valida')).rejects.toThrow(
      'A API Gemini retornou uma resposta vazia'
    )
  })

  it('deve lancar erro quando a API retorna texto sem JSON valido', async () => {
    const mock = await getGenerateContentMock()
    mock.mockResolvedValue({ text: 'Desculpe, nao pude processar a transcricao.' })

    await expect(gerarAta(TRANSCRICAO_MOCK, 'chave_valida')).rejects.toThrow(
      'Nao foi possivel extrair JSON da resposta do Gemini'
    )
  })

  it('deve lancar erro quando a chave de API nao esta configurada', async () => {
    await expect(gerarAta(TRANSCRICAO_MOCK, '')).rejects.toThrow(
      'GEMINI_API_KEY nao configurada'
    )
  })

  it('deve lancar erro quando a chave de API tem valor padrao', async () => {
    await expect(gerarAta(TRANSCRICAO_MOCK, 'sua_chave_aqui')).rejects.toThrow(
      'GEMINI_API_KEY nao configurada'
    )
  })
})
