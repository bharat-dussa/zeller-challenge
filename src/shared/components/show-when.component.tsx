import React, { ReactNode } from 'react';
import { Loader } from './loader.component';

type ShowWhenProps = {
  condition: boolean;
  children?: ReactNode | (() => ReactNode);
  fallback?: ReactNode;
  loading?: boolean;
};

export const ShowWhen = ({
  condition,
  children,
  fallback = null,
  loading = false
}: ShowWhenProps) => {
  if(loading) return <Loader />;
  if (!condition) return <>{fallback}</>;

  if (typeof children === 'function') {
    return <>{children()}</>;
  }

  return <>{children}</>;
};
