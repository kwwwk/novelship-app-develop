import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={60} height={60} viewBox="0 0 256 417" preserveAspectRatio="xMidYMid" {...props}>
    <Path fill="#343434" d="m127.961 0-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
    <Path fill="#8C8C8C" d="M127.962 0 0 212.32l127.962 75.639V154.158z" />
    <Path fill="#3C3C3B" d="m127.961 312.187-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
    <Path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" />
    <Path fill="#141414" d="m127.961 287.958 127.96-75.637-127.96-58.162z" />
    <Path fill="#393939" d="m0 212.32 127.96 75.638v-133.8z" />
  </Svg>
);

export default SvgComponent;
