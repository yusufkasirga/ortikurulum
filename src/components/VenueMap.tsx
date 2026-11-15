import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import VenueMapOsm from './VenueMapOsm';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { C } from '../core/theme';
import Icon from './Icon';
import { T } from './ui';
import { CAT_META, PILOT_REGION, Venue } from '../modules/mekan/venues';

export type VenueMapProps = {
  venues: Venue[];
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
  bottomInset: number;
};

/** Native map: Apple Maps on iOS, Google Maps on Android (needs GOOGLE_MAPS_API_KEY at build time). */
const useOsm = Platform.OS === 'android' && !Constants.expoConfig?.extra?.hasMapsKey;

/** Apple Maps on iOS; Google Maps on Android when a key was built in, otherwise OpenStreetMap. */
export default function VenueMap(props: VenueMapProps) {
  return useOsm ? <VenueMapOsm {...props} /> : <NativeVenueMap {...props} />;
}

function NativeVenueMap({ venues, selectedId, onSelect, bottomInset }: VenueMapProps) {
  const ref = React.useRef<MapView>(null);

  React.useEffect(() => {
    const v = venues.find((x) => x.id === selectedId);
    if (v) ref.current?.animateToRegion({ latitude: v.lat - 0.004, longitude: v.lng, latitudeDelta: 0.018, longitudeDelta: 0.018 }, 350);
  }, [selectedId, venues]);

  return (
    <MapView
      ref={ref}
      provider={PROVIDER_DEFAULT}
      style={StyleSheet.absoluteFill}
      initialRegion={PILOT_REGION}
      showsPointsOfInterests={false}
      showsBuildings={false}
      showsCompass={false}
      toolbarEnabled={false}
      mapPadding={{ top: 0, left: 0, right: 0, bottom: bottomInset }}
      onPress={(e) => { if (e.nativeEvent.action !== 'marker-press') onSelect(undefined); }}
    >
      {venues.map((v) => (
        <VenuePin key={`${v.id}-${v.id === selectedId ? 's' : 'n'}`} v={v} selected={v.id === selectedId} onPress={() => onSelect(v.id)} />
      ))}
    </MapView>
  );
}

function VenuePin({ v, selected, onPress }: { v: Venue; selected: boolean; onPress: () => void }) {
  // Custom marker views must re-render once after mount (SVG), then stop tracking for performance.
  const [track, setTrack] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setTrack(false), 600); return () => clearTimeout(t); }, []);
  const meta = CAT_META[v.cat];
  const open = v.tables.reduce((n, t) => n + t.need, 0);
  const size = selected ? 46 : 36;
  return (
    <Marker
      coordinate={{ latitude: v.lat, longitude: v.lng }}
      onPress={(e) => { e.stopPropagation(); onPress(); }}
      tracksViewChanges={track}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={selected ? 10 : v.tables.length ? 5 : 1}
      accessibilityLabel={`${v.name}, ${meta.label}${open ? `, ${open} kişi aranıyor` : ''}`}
    >
      <View style={{ padding: 6, alignItems: 'center', justifyContent: 'center' }}>
        {v.tables.length ? <View style={[styles.halo, { width: size + 12, height: size + 12, borderRadius: (size + 12) / 2 }]} /> : null}
        <View style={[styles.pin, { width: size, height: size, borderRadius: size / 2, backgroundColor: meta.color, borderWidth: selected || v.featured ? 3 : 2, borderColor: v.featured ? '#FFC83D' : '#FFFFFF' }]}>
          <Icon name={meta.icon} color={meta.on} size={selected ? 24 : 19} strokeWidth={2} />
        </View>
        {open ? (
          <View style={styles.badge}><T w="b" size={11} color="#FFFFFF">{open}</T></View>
        ) : null}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    alignItems: 'center', justifyContent: 'center', borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  halo: { position: 'absolute', backgroundColor: 'rgba(52,199,89,0.28)', borderWidth: 2, borderColor: C.greenDot },
  badge: {
    position: 'absolute', top: 0, right: 0, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5,
    backgroundColor: C.green, borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
  },
});
