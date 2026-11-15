import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppModule } from './modules';
import type { RootParams } from './navigation';

/** Returns a function that opens a module wherever it lives (stack screen, tab, or Kampüs section). */
export function useOpenModule() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  return (m: AppModule) => {
    const t = m.target;
    if (t.kind === 'screen') navigation.navigate(t.name);
    else if (t.kind === 'tab') navigation.navigate('Tabs', { screen: 'Harita', params: { filter: t.filter } });
    else navigation.navigate('Tabs', { screen: 'Kampus', params: { tab: t.tab } });
  };
}
