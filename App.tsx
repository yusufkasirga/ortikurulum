import React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import RootNavigation from './src/core/navigation';
import { SessionProvider, useSession } from './src/core/store';
import ErrorBoundary from './src/components/ErrorBoundary';
import { setupAndroidChannel } from './src/core/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
  const { hydrated } = useSession();
  React.useEffect(() => { setupAndroidChannel(); }, []);
  React.useEffect(() => { if (hydrated) SplashScreen.hideAsync().catch(() => {}); }, [hydrated]);
  return hydrated ? <RootNavigation /> : null;
}

export default function App() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold });

  React.useEffect(() => {
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <SessionProvider>
          <StatusBar style="dark" />
          <Root />
        </SessionProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
