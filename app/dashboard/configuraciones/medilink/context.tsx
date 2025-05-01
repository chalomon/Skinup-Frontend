"use client";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { IresponseCredencial } from "@/app/api/oauth/medilink/interface/Icreate";

// Definir la interfaz de las propiedades que se reciben en el proveedor de contexto
interface Props {
    children: ReactNode;
    data: IresponseCredencial | undefined; // Allow undefined and ErrorResponse
}
// Definir el tipo del contexto que estará disponible en el árbol
interface IContext {
    data: IresponseCredencial | undefined;
    upContext(data: IresponseCredencial): void;
}
// Crear contexto con valor inicial como `undefined`
const MyContext = createContext<IContext | undefined>(undefined);

// Proveedor de contexto
export const ContextProvider = ({ data, children }: Props) => {
    const [contextData, setContextData] = useState<IresponseCredencial | undefined>(data);
  
    
    const upContext = (newData: IresponseCredencial): void => setContextData(newData);


    const valueMemo = useMemo(
        () => ({ data: contextData, upContext }),
        [contextData]
    );

    useEffect(() => {
        setContextData(data); // Update contextData when data changes
    }, [data]);

    return (
        <MyContext.Provider value={valueMemo}>{children}</MyContext.Provider>
    );
};

// Hook para consumir el contexto
export const UseContext = (): IContext => {
    const context = useContext(MyContext);

    if (!context) {
        throw new Error("Medilink no tiene contexto");
    }

    return context;
};