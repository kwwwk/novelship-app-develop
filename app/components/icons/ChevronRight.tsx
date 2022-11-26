import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ChevronRight = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.851 4.152a.88.88 0 0 1 1.182.18l5.146 6.731c.428.56.428 1.315 0 1.874l-5.146 6.731a.88.88 0 0 1-1.182.18.772.772 0 0 1-.19-1.116L13.805 12 8.66 5.268a.772.772 0 0 1 .191-1.116Z"
      fill="#0A0A0A"
    />
  </Svg>
);

export default ChevronRight;
