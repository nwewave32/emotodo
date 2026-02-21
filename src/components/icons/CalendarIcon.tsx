import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface CalendarIconProps {
  color: string;
  size?: number;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({
  color,
  size = 24,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={4}
        width={18}
        height={18}
        rx={2}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 2v4M8 2v4M3 10h18"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
};
