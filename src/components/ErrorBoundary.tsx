import React from 'react';
import { View } from 'react-native';
import { C } from '../core/theme';
import { captureError } from '../core/analytics';
import Icon from './Icon';
import { PrimaryButton, T } from './ui';

/** Catches render crashes, logs them (app_errors) and offers a recovery instead of a white screen. */
export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    captureError(error, 'render');
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.warnBg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="info" size={36} color={C.warnText} />
        </View>
        <T w="x" size={22}>Bir şeyler ters gitti</T>
        <T size={15} color={C.text2} style={{ textAlign: 'center', lineHeight: 21 }}>Hata kaydedildi ve ekibimize iletildi. Kaldığın yerden devam edebilirsin.</T>
        <PrimaryButton title="Tekrar dene" style={{ alignSelf: 'stretch' }} onPress={() => this.setState({ failed: false })} />
      </View>
    );
  }
}
