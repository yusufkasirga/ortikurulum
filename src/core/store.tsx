import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_ENABLED, ModuleId } from './modules';
import type { NotifKey } from './notifications';

/**
 * App-wide session state, persisted on the device (AsyncStorage).
 * Privacy by design: after ID verification we keep ONLY the outcome
 * (verified + gender + over 18) — never the ID image or the selfie.
 */
export type Gender = 'kadin' | 'erkek';
export type Verification = { status: 'none' | 'pending' | 'verified'; gender?: Gender; verifiedAt?: string };
export type Visibility = 'herkes' | 'kampus' | 'ekip';
export type LocationPrecision = 'tam' | 'yaklasik' | 'kapali';

export type Persisted = {
  onboarded: boolean;
  campusId: string;
  phone?: string;
  studentEmail?: string;
  verification: Verification;
  modules: Record<ModuleId, boolean>;
  notif: Record<NotifKey, boolean>;
  visibility: Visibility;
  location: LocationPrecision;
  blocked: string[];
  moderatorDemo: boolean;
  /** Linked Discord account (username only; we never read servers or messages). */
  discord?: { username: string; showOnTables: boolean };
};

const DEFAULTS: Persisted = {
  onboarded: false,
  campusId: 'eru',
  verification: { status: 'none' },
  modules: DEFAULT_ENABLED,
  notif: { masa: true, bosSaat: true, ekip: true, etkinlik: true, kampanya: false },
  visibility: 'kampus',
  location: 'yaklasik',
  blocked: ['Serkan Y.'],
  moderatorDemo: false,
};

const KEY = 'orti.session.v1';

type Ctx = Persisted & {
  hydrated: boolean;
  set: (patch: Partial<Persisted>) => void;
  setVerification: (v: Verification) => void;
  toggleModule: (id: ModuleId) => void;
  reset: () => void;
};

const SessionContext = React.createContext<Ctx>({
  ...DEFAULTS, hydrated: false, set: () => {}, setVerification: () => {}, toggleModule: () => {}, reset: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<Persisted>(DEFAULTS);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setState({ ...DEFAULTS, ...JSON.parse(raw), modules: { ...DEFAULTS.modules, ...JSON.parse(raw).modules } }); })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  React.useEffect(() => {
    if (hydrated) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const set = React.useCallback((patch: Partial<Persisted>) => setState((s) => ({ ...s, ...patch })), []);
  const setVerification = React.useCallback((verification: Verification) => setState((s) => ({ ...s, verification })), []);
  const toggleModule = React.useCallback((id: ModuleId) => setState((s) => ({ ...s, modules: { ...s.modules, [id]: !s.modules[id] } })), []);
  const reset = React.useCallback(() => { setState(DEFAULTS); AsyncStorage.removeItem(KEY).catch(() => {}); }, []);

  return (
    <SessionContext.Provider value={{ ...state, hydrated, set, setVerification, toggleModule, reset }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => React.useContext(SessionContext);
