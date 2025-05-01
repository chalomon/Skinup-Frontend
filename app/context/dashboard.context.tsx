import React, { createContext, useState, useContext } from 'react'
export interface Module {
    label: string;
    href: string;
    onlyAdmin: boolean; //definir que ruta son para admmin 
}
export interface Option {
    name: string
    leftColor: string
    rightColor: string
    modules: Module[]
}
interface DashboardContextType {
    options: Option[]
    selectedOption: Option
    setSelectedOption: (option: Option) => void
}
const DashboardContext = createContext<DashboardContextType | undefined>(undefined)
export const useDashboard = () => {
    const context = useContext(DashboardContext)
    if (!context) throw new Error('useDashboard must be used within a DashboardProvider')
    return context
}

export const DashboardProvider: React.FC<{ children: React.ReactNode, initialOptions: Option[] }> = ({ children, initialOptions }) => {
    const [options] = useState(initialOptions)
    const [selectedOption, setSelectedOption] = useState(options[0])
    return (
        <DashboardContext.Provider value={{ options, selectedOption, setSelectedOption }}>
            {children}
        </DashboardContext.Provider>
    )
}