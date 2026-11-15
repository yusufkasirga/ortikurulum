import React from 'react';

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
};

const SessionContext = React.createContext<Ctx>({ verification: { status: 'none' }, setVerification: () => {} });

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [verification, setVerification] = React.useState<Verification>({ status: 'none' });
  return <SessionContext.Provider value={{ verification, setVerification }}>{children}</SessionContext.Provider>;
}

export const useSession = () => React.useContext(SessionContext);
