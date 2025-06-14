import { ReactNode } from 'react';
import { ClientProvider } from './ClientContext';
import { EstimateProvider } from './EstimateContext';
import { ServiceProvider } from './ServiceContext';

interface Props {
  children: ReactNode;
}

export default function AppProvider({ children }: Props) {
  return (
    <ClientProvider>
      <EstimateProvider>
        <ServiceProvider>{children}</ServiceProvider>
      </EstimateProvider>
    </ClientProvider>
  );
}
