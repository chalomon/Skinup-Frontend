export interface ICrateCredentialResponse {
    _id?: string;
    __v?: any;
    urlApi: string;
    client: string;
    company:string;
    configIsValid:boolean;
    user:string;
    password:string;
    createdAt: string;
    updatedAt: string;
  }
  

  export interface ICreateCredencialDto {
    urlApi: string;
    client: string;
    company:string;
    user:string;
    password:string;
  }