export interface IResponseBusinessCenterPlan {
    success: boolean
    message: string
    exceptionMessage: string
    centrosNegocios: CentrosNegocio[]
  }
  
  export interface CentrosNegocio {
    code: string
    description: string
    imputable: string
    activo: string
    descendientes: Descendientes[] | null
  }
  
  export interface Descendientes {
    code: string
    description: string
    imputable: string
    activo: string
    descendientes: Descendientes[] | null
  }
  