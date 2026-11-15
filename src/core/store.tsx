import React from 'react';
import { DEFAULT_ENABLED, ModuleId } from './modules';

/**
 * App-wide session state (prototype: in memory).
 * Privacy by design: after ID verification we keep ONLY the outcome
 * (verified + gender + over 18) — never the ID image or the selfie.
 */
export type Gender = 'kadin' | 'erkek';
export type Verification = { status: 'none' | 'pending' | 'verified'; gender?: Gender; verifiedAt?: string };

type Ctx = {
  verification: Verification;
  setVerification: (v: Verification) => void;
  modules: Record<ModuleId, boolean>;
  toggleModule: (id: ModuleId) => void;
};

const SessionContext = React.createContext<Ctx>({
  verification: { status: 'none' }, setVerification: () => {}, modules: DEFAULT_ENABLED, toggleModule: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [verification, setVerification] = React.useState<Verification>({ status: 'none' });
  const [modules, setModules] = React.useState<Record<ModuleId, boolean>>(DEFAULT_ENABLED);
  const toggleModule = React.useCallback((id: ModuleId) => setModules((m) => ({ ...m, [id]: !m[id] })), []);
  return (
    <SessionContext.Provider value={{ verification, setVerification, modules, toggleModule }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => React.useContext(SessionContext);
