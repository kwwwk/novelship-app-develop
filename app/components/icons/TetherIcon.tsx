import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg viewBox="0 0 512 512" {...props}>
    <Path
      d="M296.6 195.5v-49h112.1V71.8H103.5v74.7h112.1v49C124.5 199.7 56 217.7 56 239.3s68.5 39.7 159.6 43.9v157h81.1v-157C387.6 279 456 260.9 456 239.4s-68.4-39.6-159.4-43.9m.1 74.4c-2.3.1-14.1.8-40.2.8-20.9 0-35.6-.6-40.9-.9v.1c-80.5-3.6-140.5-17.6-140.5-34.4s60.1-30.8 140.5-34.4v54.8c5.2.4 20.3 1.2 41.2 1.2 25 0 37.6-1 39.8-1.2v-54.8c80.3 3.6 140.3 17.6 140.3 34.3.1 16.8-59.9 30.8-140.2 34.5"
      fill="#231f20"
    />
  </Svg>
);

export default SvgComponent;
