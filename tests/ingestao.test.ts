// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { validarExtensao, validarEntrada, lerTranscricaoSimulada } from '../src/modules/ingestao.js'
import * as path from 'node:path'
import * as fs from 'node:fs'

const TEST_DIR = 'C:\\Users\\ultim\\Documents\\GitHub\\Conversor-de-Audio-para-Atas-de-Reuniao'

describe('ingestao - validacao de extensao', () => {
  it('deve aceitar extensao .mp3', () => {
    expect(validarExtensao('audio.mp3')).toBe('.mp3')
  })

  it('deve aceitar extensao .wav', () => {
    expect(validarExtensao('audio.wav')).toBe('.wav')
  })

  it('deve aceitar extensao .m4a', () => {
    expect(validarExtensao('audio.m4a')).toBe('.m4a')
  })

  it('deve aceitar extensao .txt', () => {
    expect(validarExtensao('transcricao.txt')).toBe('.txt')
  })

  it('deve rejeitar extensao nao suportada', () => {
    expect(() => validarExtensao('arquivo.pdf')).toThrow(
      'Extensao ".pdf" nao suportada'
    )
  })
})

describe('ingestao - validacao de arquivo existente', () => {
  const testFile = path.join(TEST_DIR, 'sample', '_ingestao_test_temp_.txt')

  beforeEach(() => {
    fs.writeFileSync(testFile, 'teste', 'utf-8')
  })

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile)
    }
  })

  it('deve aceitar arquivo que existe', () => {
    expect(validarEntrada(testFile)).toBe('.txt')
  })

  it('deve rejeitar arquivo inexistente', () => {
    expect(() => validarEntrada('nao_existe.mp3')).toThrow(
      'Arquivo nao encontrado'
    )
  })
})

describe('ingestao - leitura de transcricao simulada', () => {
  const testFile = path.join(TEST_DIR, 'sample', '_leitura_test_temp_.txt')

  beforeEach(() => {
    fs.writeFileSync(testFile, 'Conteudo de teste', 'utf-8')
  })

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile)
    }
  })

  it('deve ler conteudo de arquivo .txt', () => {
    const conteudo = lerTranscricaoSimulada(testFile)
    expect(conteudo).toBe('Conteudo de teste')
  })
})
