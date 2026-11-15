import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { CAT_META, PILOT_REGION } from '../modules/mekan/venues';
import type { VenueMapProps } from './VenueMap';

/**
 * Key-free map for Android builds without GOOGLE_MAPS_API_KEY: Leaflet + OpenStreetMap tiles in a WebView.
 * Same props/behaviour as the native map (category pins, open-table badges, gold ring for featured).
 */
// react-native-webview's class typings don't match React 19 types yet; props are validated at runtime.
const WV = WebView as unknown as React.ComponentType<Record<string, unknown> & { ref?: React.Ref<unknown> }>;
type WVHandle = { injectJavaScript: (js: string) => void };

export default function VenueMapOsm({ venues, selectedId, onSelect }: VenueMapProps) {
  const ref = React.useRef<WVHandle>(null);
  const data = venues.map((v) => ({
    id: v.id, lat: v.lat, lng: v.lng, color: CAT_META[v.cat].color, on: CAT_META[v.cat].on,
    open: v.tables.reduce((n, t) => n + t.need, 0), featured: !!v.featured,
  }));

  React.useEffect(() => {
    ref.current?.injectJavaScript(`window.setData && window.setData(${JSON.stringify(data)}, ${JSON.stringify(selectedId ?? null)}); true;`);
  }, [data, selectedId]);

  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#m{margin:0;height:100%;background:#E8ECEF}
.pin{border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font:700 12px -apple-system,Roboto,sans-serif}
.pin.f{border-color:#FFC83D;border-width:3px}.pin.s{transform:scale(1.25)}
.b{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;border-radius:9px;background:#115B2C;color:#fff;border:2px solid #fff;font:700 11px sans-serif;display:flex;align-items:center;justify-content:center}
.leaflet-control-attribution{font-size:9px}</style></head><body><div id="m"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>
var map=L.map('m',{zoomControl:false,attributionControl:true}).setView([${PILOT_REGION.latitude},${PILOT_REGION.longitude}],15);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
var layer=L.layerGroup().addTo(map);
map.on('click',function(){window.ReactNativeWebView.postMessage('')});
window.setData=function(items,sel){layer.clearLayers();items.forEach(function(v){var s=v.id===sel?44:34;
var h='<div class="pin'+(v.featured?' f':'')+(v.id===sel?' s':'')+'" style="width:'+s+'px;height:'+s+'px;background:'+v.color+';color:'+v.on+'">●</div>'+(v.open?'<div class="b">'+v.open+'</div>':'');
var m=L.marker([v.lat,v.lng],{icon:L.divIcon({html:h,className:'',iconSize:[s,s],iconAnchor:[s/2,s/2]})}).addTo(layer);
m.on('click',function(e){L.DomEvent.stopPropagation(e);window.ReactNativeWebView.postMessage(v.id)});
if(v.id===sel){map.panTo([v.lat-0.003,v.lng])}});};
window.setData(${JSON.stringify(data)},${JSON.stringify(selectedId ?? null)});
</script></body></html>`;

  return (
    <WV
      ref={ref}
      style={StyleSheet.absoluteFill}
      originWhitelist={['*']}
      source={{ html }}
      onMessage={(e: { nativeEvent: { data: string } }) => onSelect(e.nativeEvent.data || undefined)}
      setSupportMultipleWindows={false}
      javaScriptEnabled
    />
  );
}
