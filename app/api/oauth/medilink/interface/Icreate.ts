//Esquema para crear

export interface ICreateCredencial {
    urlApi: string;
    appName: string;
    idClient: string;
    token: string;
  }
  //Esquema para actualizar
  export interface IsetCredencial {
    urlApi?: string;
    appName?: string;
    idClient?: string;
    token?: string;
  }
  
  export interface IresponseCredencial {
    _id:string;
    urlApi: string;
    appName: string;
    idClient: string;
    token: string;
    createdAt: string;
    updatedAt: string;
  }