import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={60} height={60} viewBox="0 0 110 110" preserveAspectRatio="xMidYMid" {...props}>
    <Path
      d="M30.6 57.1 19.8 67.6 9 57.1l10.8-10.6 10.8 10.6zm26.5-25.8 18.5 18.2 10.8-10.6-18.5-18.2-10.8-10.6-10.9 10.6-18.7 18.2 10.8 10.6 18.8-18.2zm37.2 15.2L83.4 57.1l10.8 10.6L105 57.1 94.3 46.5zM57.1 82.7 38.4 64.6 27.5 75.2 46 93.3l10.8 10.6 10.8-10.6 18.7-18.1-10.7-10.6-18.5 18.1zm0-15.1L67.9 57 57.1 46.5 46.2 57.1l10.9 10.5z"
      fill="#f0b90b"
    />
  </Svg>
);

export default SvgComponent;
