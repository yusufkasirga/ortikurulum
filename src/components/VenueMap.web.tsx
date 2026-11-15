import React from 'react';
import { StyleSheet, View } from 'react-native';
import { C } from '../core/theme';
import Icon from './Icon';
import { T, Tap } from './ui';
import { CAT_META, PILOT_REGION } from '../modules/mekan/venues';
import type { VenueMapProps } from './VenueMap';

/** Web preview only: plots venues on a plain grid so layouts can be checked in a browser. */
export default function VenueMap({ venues, selectedId, onSelect }: VenueMapProps) {
  const [box, setBox] = React.useState({ w: 390, h: 700 });
  const minLat = PILOT_REGION.latitude - PILOT_REGION.latitudeDelta / 2;
  const minLng = PILOT_REGION.longitude - PILOT_REGION.longitudeDelta / 2;
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#E8ECEF' }]} onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {venues.map((v) => {
        const x = ((v.lng - minLng) / PILOT_REGION.longitudeDelta) * box.w;
        const y = box.h - ((v.lat - minLat) / PILOT_REGION.latitudeDelta) * box.h;
        const meta = CAT_META[v.cat];
        const open = v.tables.reduce((n, t) => n + t.need, 0);
        const sel = v.id === selectedId;
        const size = sel ? 46 : 36;
        return (
          <Tap key={v.id} onPress={() => onSelect(v.id)} style={{ position: 'absolute', left: x - size / 2, top: y - size / 2 }}>
            <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: meta.color, borderWidth: sel || v.featured ? 3 : 2, borderColor: v.featured ? '#FFC83D' : '#FFF', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={meta.icon} color={meta.on} size={sel ? 24 : 19} strokeWidth={2} />
            </View>
            {open ? <View style={{ position: 'absolute', top: -6, right: -6, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' }}><T w="b" size={11} color="#FFF">{open}</T></View> : null}
          </Tap>
        );
      })}
    </View>
  );
}
