import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

function FacebookIcon(props: SvgProps) {
  return (
    <Svg width={16} height={16} fill="none" {...props}>
      <G clipPath="url(#prefix__Frame__clip0)">
        <Path
          d="M11.49 8.938l.417-2.715H9.302V4.46c0-.742.364-1.466 1.53-1.466h1.185V.683S10.942.5 9.915.5C7.77.5 6.368 1.8 6.368 4.154v2.069H3.983v2.715h2.385V15.5h2.934V8.937h2.189z"
          fill="#3B5998"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__Frame__clip0">
          <Path fill="#3B5998" transform="translate(.5 .5)" d="M0 0h15v15H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default FacebookIcon;
