export interface IResponseAccountPlan {
    items: AccountItem[]
    success: boolean
    message: string
    exceptionMessage: string
  }
  
  export interface AccountItem {
    code: string
    description: string
    ifrsRelatedAccountCode: string
    ifrsRelatedAccountDescription: string
    childs: AccountItem[] | null
  }
  