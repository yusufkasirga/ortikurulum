import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'pin' | 'chevDown' | 'chevRight' | 'back' | 'search' | 'bell' | 'bolt' | 'compass' | 'table'
  | 'plus' | 'chat' | 'person' | 'clock' | 'bars' | 'shield' | 'star' | 'heart' | 'lock' | 'check'
  | 'checkCircle' | 'info' | 'share' | 'bookmark' | 'flag' | 'image' | 'send'
  | 'map' | 'tiles' | 'gamepad' | 'cue' | 'ball' | 'cup' | 'bowling' | 'smoke' | 'noSmoke' | 'hookah'
  | 'directions' | 'phone' | 'close' | 'list' | 'female' | 'tag' | 'menu' | 'edit'
  | 'cap' | 'book' | 'calendar' | 'upload' | 'save' | 'moon';

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
    case 'map': body = (<><Path {...p} d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" /><Path {...p} d="M9 4v14M15 6v14" /></>); break;
    case 'tiles': body = (<><Rect {...p} x={3} y={5} width={7} height={14} rx={1.5} /><Rect {...p} x={14} y={5} width={7} height={14} rx={1.5} /><Circle cx={6.5} cy={10} r={1.2} fill={color} /><Circle cx={17.5} cy={10} r={1.2} fill={color} /></>); break;
    case 'gamepad': body = (<><Path {...p} d="M7 8h10a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L14 15h-4l-.7.6A3.5 3.5 0 0 1 3 13.5V12a4 4 0 0 1 4-4z" /><Path {...p} d="M8 11v3M6.5 12.5h3" /><Circle cx={15.5} cy={11.5} r={1} fill={color} /><Circle cx={17.5} cy={13} r={1} fill={color} /></>); break;
    case 'cue': body = (<><Circle {...p} cx={12} cy={12} r={8} /><Circle {...p} cx={12} cy={11} r={3.2} /><Path {...p} d="M11.2 10h1.4v3" /></>); break;
    case 'ball': body = (<><Circle {...p} cx={12} cy={12} r={8.5} /><Path {...p} d="M12 7.5l4 3-1.5 4.5h-5L8 10.5z" /></>); break;
    case 'cup': body = (<><Path {...p} d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><Path {...p} d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2M11 3v2.5M14 3.5v2" /></>); break;
    case 'bowling': body = (<><Circle {...p} cx={10} cy={14} r={6} /><Circle cx={8.5} cy={12} r={0.9} fill={color} /><Circle cx={11} cy={11.5} r={0.9} fill={color} /><Path {...p} d="M17 3c1.6 0 2.2 1.4 1.8 3l-.6 2.2c.9 1.4 1.3 3 .8 5L18 20h-2l-1-6.8" /></>); break;
    case 'smoke': body = (<><Rect {...p} x={2.5} y={14} width={15} height={4} rx={1} /><Path {...p} d="M20.5 14v4M17 4c0 2 2.5 2 2.5 4s-2 2-2 4" /></>); break;
    case 'noSmoke': body = (<><Rect {...p} x={2.5} y={14} width={15} height={4} rx={1} /><Path {...p} d="M20.5 14v4M3 3l18 18" /></>); break;
    case 'hookah': body = (<><Path {...p} d="M12 3v6M9 9h6l-1 4h-4zM8 21a4 4 0 0 1 8 0z" /><Path {...p} d="M14 13c2 1 4 0 5 2s0 4 2 5" /></>); break;
    case 'directions': body = (<><Path {...p} d="M12 2l10 10-10 10L2 12z" /><Path {...p} d="M9 14v-2a2 2 0 0 1 2-2h4M13 8l2 2-2 2" /></>); break;
    case 'phone': body = <Path {...p} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />; break;
    case 'close': body = <Path {...p} d="M6 6l12 12M18 6L6 18" />; break;
    case 'list': body = <Path {...p} d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />; break;
    case 'female': body = (<><Circle {...p} cx={12} cy={9} r={5} /><Path {...p} d="M12 14v7M9 18h6" /></>); break;
    case 'tag': body = (<><Path {...p} d="M3 12V4h8l10 10-8 8z" /><Circle cx={7.5} cy={8.5} r={1.3} fill={color} /></>); break;
    case 'menu': body = (<><Rect {...p} x={5} y={3} width={14} height={18} rx={2} /><Path {...p} d="M9 8h6M9 12h6M9 16h4" /></>); break;
    case 'cap': body = (<><Path {...p} d="M2 9l10-5 10 5-10 5z" /><Path {...p} d="M6 11v5c2 2 10 2 12 0v-5M22 9v6" /></>); break;
    case 'book': body = (<><Path {...p} d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><Path {...p} d="M4 19V5M9 7h6" /></>); break;
    case 'calendar': body = (<><Rect {...p} x={3} y={5} width={18} height={16} rx={3} /><Path {...p} d="M3 10h18M8 3v4M16 3v4" /></>); break;
    case 'upload': body = (<><Path {...p} d="M12 16V4M7 9l5-5 5 5" /><Path {...p} d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>); break;
    case 'save': body = <Path {...p} fill={fill} d="M6 3h12v18l-6-4-6 4z" />; break;
    case 'moon': body = <Path {...p} d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />; break;
    case 'edit': body = <Path {...p} d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />; break;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {body}
    </Svg>
  );
}
