// app/context/RelationshipContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Relationship = {
  id: string
  clientId: string
  branchIds: string[]
  accountId?: string
}

type RelationshipContextType = {
  relationships: Relationship[]
  addRelationship: (relationship: Omit<Relationship, 'id'>) => void
  updateRelationship: (id: string, relationship: Omit<Relationship, 'id'>) => void
  deleteRelationship: (id: string) => void
}

const RelationshipContext = createContext<RelationshipContextType | undefined>(undefined)

export const useRelationships = () => {
  const context = useContext(RelationshipContext)
  if (!context) {
    throw new Error('useRelationships must be used within a RelationshipProvider')
  }
  return context
}

export const RelationshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [relationships, setRelationships] = useState<Relationship[]>([])

  useEffect(() => {
    // Aquí cargaríamos las relaciones desde el backend
    // Por ahora, usaremos datos de ejemplo
    setRelationships([
      { id: '1', clientId: '1', branchIds: ['1', '2'], accountId: '101' },
      { id: '2', clientId: '2', branchIds: ['3'], accountId: '102' },
    ])
  }, [])

  const addRelationship = (relationship: Omit<Relationship, 'id'>) => {
    const newRelationship = { ...relationship, id: Date.now().toString() }
    setRelationships([...relationships, newRelationship])
    // Aquí enviaríamos la nueva relación al backend
  }

  const updateRelationship = (id: string, updatedRelationship: Omit<Relationship, 'id'>) => {
    setRelationships(relationships.map(rel => 
      rel.id === id ? { ...updatedRelationship, id } : rel
    ))
    // Aquí actualizaríamos la relación en el backend
  }

  const deleteRelationship = (id: string) => {
    setRelationships(relationships.filter(rel => rel.id !== id))
    // Aquí eliminaríamos la relación en el backend
  }

  return (
    <RelationshipContext.Provider value={{ relationships, addRelationship, updateRelationship, deleteRelationship }}>
      {children}
    </RelationshipContext.Provider>
  )
}