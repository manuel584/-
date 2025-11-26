
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Entity } from '../types';
import { MOCK_ENTITIES } from '../constants';

interface EntityContextType {
  entities: Entity[];
  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  deleteEntity: (id: string) => void;
}

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export const EntityProvider = ({ children }: { children?: ReactNode }) => {
  const [entities, setEntities] = useState<Entity[]>(MOCK_ENTITIES);

  const addEntity = (entity: Entity) => {
    setEntities(prev => [...prev, entity]);
  };

  const updateEntity = (id: string, updates: Partial<Entity>) => {
    setEntities(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntity = (id: string) => {
    setEntities(prev => prev.filter(e => e.id !== id));
  };

  return (
    <EntityContext.Provider value={{ entities, addEntity, updateEntity, deleteEntity }}>
      {children}
    </EntityContext.Provider>
  );
};

export const useEntities = () => {
  const context = useContext(EntityContext);
  if (context === undefined) {
    throw new Error('useEntities must be used within an EntityProvider');
  }
  return context;
};
