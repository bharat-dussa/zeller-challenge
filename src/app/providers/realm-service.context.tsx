import React, { createContext, useContext, useMemo } from 'react';
import { createRealmContext } from '@realm/react';
import { SCHEMA } from '../../shared/db/schemas';
import { RealmService } from '../../shared/services/realm/realm-service';

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({ schema: SCHEMA });

const RealmServiceContext = createContext<RealmService | null>(null);

export const useRealmService = () => {
  const s = useContext(RealmServiceContext);
  if (!s)
    // this text for dev no need to use constants labels
    throw new Error('useRealmService must be used within RealmServiceProvider');
  return s;
};

export const RealmServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const realm = useRealm();
  const service = useMemo(
    () => (realm ? RealmService.fromRealm(realm) : null),
    [realm],
  );

  if (!service) return null;

  return (
    <RealmServiceContext.Provider value={service}>
      {children}
    </RealmServiceContext.Provider>
  );
};
