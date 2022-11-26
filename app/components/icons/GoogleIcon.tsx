import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

function GoogleIcon(props: SvgProps) {
  return (
    <Svg width={16} height={16} fill="none" {...props}>
      <G clipPath="url(#prefix__Frame__clip0)">
        <Path
          d="M8 3.469c1.106 0 2.097.381 2.878 1.125l2.14-2.14C11.719 1.243 10.023.5 8 .5a7.496 7.496 0 00-6.7 4.131l2.494 1.935C4.384 4.787 6.044 3.469 8 3.469z"
          fill="#EA4335"
        />
        <Path
          d="M15.181 8.172c0-.49-.047-.966-.118-1.422H8v2.819h4.044a3.486 3.486 0 01-1.494 2.243l2.416 1.876c1.409-1.307 2.215-3.238 2.215-5.516z"
          fill="#4285F4"
        />
        <Path
          d="M3.79 9.434A4.556 4.556 0 013.554 8c0-.5.085-.981.238-1.434L1.297 4.63A7.473 7.473 0 00.5 8c0 1.212.287 2.356.8 3.369l2.49-1.935z"
          fill="#FBBC05"
        />
        <Path
          d="M8 15.5c2.025 0 3.728-.666 4.966-1.816L10.55 11.81c-.672.454-1.538.72-2.55.72-1.956 0-3.616-1.32-4.21-3.098l-2.493 1.935A7.502 7.502 0 008 15.5z"
          fill="#34A853"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__Frame__clip0">
          <Path fill="#fff" transform="translate(.5 .5)" d="M0 0h15v15H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default GoogleIcon;
