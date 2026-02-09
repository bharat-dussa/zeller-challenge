import React, { createContext, useContext, useEffect, useState } from 'react';
import { createRealmContext } from '@realm/react';
import { SCHEMA } from '../db/schemas';
import { RealmService } from '../services/realm/realm-service';

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({ schema: SCHEMA });

const RealmServiceContext = createContext<RealmService | null>(null);

export const useRealmService = () => {
  const s = useContext(RealmServiceContext);
  if (!s)
    throw new Error('useRealmService must be used within RealmServiceProvider');
  return s;
};

export const RealmServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const realm = useRealm();
  const [service, setService] = useState<RealmService | null>(null);

  useEffect(() => {
    if (!realm) return;
    setService(RealmService.fromRealm(realm as any));
  }, [realm]);

  if (!service) return null;

  return (
    <RealmServiceContext.Provider value={service}>
      {children}
    </RealmServiceContext.Provider>
  );
};
