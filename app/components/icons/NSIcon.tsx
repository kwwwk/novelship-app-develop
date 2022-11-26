import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

function NSIcon(props: SvgProps) {
  return (
    <Svg fill="none" viewBox="0 0 150 150" {...props}>
      <G clipPath="url(#prefix__logo_/_isolated_/_novelship-logomark-dark__clip0)">
        <Path
          d="M11.3 9.48H0V149a1 1 0 001 1h17.89a2.178 2.178 0 002.11-1.48l28-83L23.66 17A14 14 0 0011.3 9.48zM149 0h-17.89a2.177 2.177 0 00-2.06 1.48l-28.05 83L126.34 133a13.997 13.997 0 0012.36 7.49H150V1a.998.998 0 00-1-1z"
          fill="#000"
        />
        <Path
          opacity={0.75}
          d="M75 34.74v29.79a1 1 0 01-1 1H49l26 49.74v-29.8a1 1 0 011-1h25L75 34.74z"
          fill="#6C6C7C"
        />
        <Path
          d="M74 65.52a1 1 0 001-1V34.74L57.14.53a1 1 0 00-.89-.53H1a1 1 0 00-1 1v8.48h11.3A14 14 0 0123.66 17L49 65.52h25zM126.34 133L101 84.48H76a1 1 0 00-1 1v29.79l17.86 34.21a.997.997 0 00.89.53H149a.997.997 0 001-1v-8.48h-11.3a14.003 14.003 0 01-12.36-7.53z"
          fill="#6C6C7C"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__logo_/_isolated_/_novelship-logomark-dark__clip0">
          <Path fill="#fff" d="M0 0h150v150H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default NSIcon;
