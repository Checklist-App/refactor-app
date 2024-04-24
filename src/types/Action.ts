export interface Action {
  id: number
  title: string
  responsible: string
  description: string
  checklistPeriodId: number
  checklistId: number
  startDate: Date
  dueDate: Date
  endDate: Date | null
  img: {
    name: string
    path: string
    url: string
  }[]
  syncStatus: 'inserted' | 'updated' | 'synced'
}

export interface ReceivedAction {
  id: number
  id_grupo: number
  id_item: number
  id_checklist: number
  descricao: string
  responsavel: string
  data_inicio: string
  data_fim: string
  data_fechamento: string
  descricao_acao: string
  log_date: string
  productionRegister: {
    id_equipamento: number
  }
  img: {
    name: string
    url: string
    path: string
  }[]
}
