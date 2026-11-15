import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'pin' | 'chevDown' | 'chevRight' | 'back' | 'search' | 'bell' | 'bolt' | 'compass' | 'table'
  | 'plus' | 'chat' | 'person' | 'clock' | 'bars' | 'shield' | 'star' | 'heart' | 'lock' | 'check'
  | 'checkCircle' | 'info' | 'share' | 'bookmark' | 'flag' | 'image' | 'send';

type Props = { name: IconName; size?: number; color?: string; fill?: string; strokeWidth?: number };

export default function Icon({ name, size = 22, color = '#1C1C1E', fill = 'none', strokeWidth = 2.2 }: Props) {
  const p = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  let body: React.ReactNode = null;
  switch (name) {
    case 'pin':
      body = (<><Path {...p} d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><Circle {...p} cx={12} cy={9.5} r={2.5} /></>);
      break;
    case 'chevDown': body = <Path {...p} d="M6 9l6 6 6-6" />; break;
    case 'chevRight': body = <Path {...p} d="M9 5l7 7-7 7" />; break;
    case 'back': body = <Path {...p} d="M15 5l-7 7 7 7" />; break;
    case 'search': body = (<><Circle {...p} cx={11} cy={11} r={7} /><Path {...p} d="M20 20l-3.5-3.5" /></>); break;
    case 'bell': body = (<><Path {...p} d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><Path {...p} d="M10 20.5a2 2 0 0 0 4 0" /></>); break;
    case 'bolt': body = <Path {...p} d="M13 2L4 14h7l-1 8 9-12h-7z" />; break;
    case 'compass': body = (<><Circle {...p} cx={12} cy={12} r={9} /><Path {...p} fill={color} d="M15.5 8.5l-2 5-5 2 2-5z" /></>); break;
    case 'table': body = (<><Circle {...p} cx={12} cy={12} r={5} /><Circle {...p} cx={12} cy={3.5} r={1.5} /><Circle {...p} cx={20.5} cy={12} r={1.5} /><Circle {...p} cx={12} cy={20.5} r={1.5} /><Circle {...p} cx={3.5} cy={12} r={1.5} /></>); break;
    case 'plus': body = <Path {...p} d="M12 5v14M5 12h14" />; break;
    case 'chat': body = <Path {...p} d="M4 5h16v11H9l-5 4z" />; break;
    case 'person': body = (<><Circle {...p} cx={12} cy={8} r={4} /><Path {...p} d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" /></>); break;
    case 'clock': body = (<><Circle {...p} cx={12} cy={12} r={9} /><Path {...p} d="M12 7v5l3 2" /></>); break;
    case 'bars': body = <Path {...p} d="M4 20V14M10 20V9M16 20V12M22 20V5" />; break;
    case 'shield': body = (<><Path {...p} d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" /><Path {...p} d="M9 12l2 2 4-4" /></>); break;
    case 'star': body = <Path {...p} fill={fill} strokeWidth={strokeWidth} d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z" />; break;
    case 'heart': body = <Path {...p} fill={fill} d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />; break;
    case 'lock': body = (<><Rect {...p} x={5} y={11} width={14} height={10} rx={2} /><Path {...p} d="M8 11V8a4 4 0 0 1 8 0v3" /></>); break;
    case 'check': body = <Path {...p} d="M5 12.5l4.5 4.5L19 7.5" />; break;
    case 'checkCircle': body = (<><Circle {...p} cx={12} cy={12} r={9} /><Path {...p} d="M8 12.5l2.6 2.5L16 9.5" /></>); break;
    case 'info': body = (<><Circle {...p} cx={12} cy={12} r={9} /><Path {...p} d="M12 11v6M12 7.5v.5" /></>); break;
    case 'share': body = (<><Path {...p} d="M12 3v12M7.5 7.5L12 3l4.5 4.5" /><Path {...p} d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /></>); break;
    case 'bookmark': body = <Path {...p} d="M6 3h12v18l-6-4-6 4z" />; break;
    case 'flag': body = <Path {...p} d="M5 21V4M5 4h11l-2 4 2 4H5" />; break;
    case 'image': body = (<><Rect {...p} x={3} y={5} width={18} height={14} rx={3} /><Circle {...p} cx={9} cy={11} r={2} /><Path {...p} d="M21 16l-5-5-8 8" /></>); break;
    case 'send': body = <Path {...p} d="M12 19V5M6 11l6-6 6 6" />; break;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {body}
    </Svg>
  );
}
