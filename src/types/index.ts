// Desenvolvido por L. A. Leandro São José dos Campos- SP - Data: 19/05/2026

export interface AtaReuniao {
  resumoExecutivo: string
  decisoesTomadas: string[]
  pontosDeAcao: PontoDeAcao[]
}

export interface PontoDeAcao {
  tarefa: string
  responsavel: string
  prazo: string
}
