import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';

function SecureIcon(props: SvgProps) {
  return (
    <Svg width={76} height={76} viewBox="0 0 76 76" fill="none" {...props}>
      <G clipPath="url(#prefix__clip0)">
        <Path
          d="M0 38C0 17.013 17.013 0 38 0s38 17.013 38 38-17.013 38-38 38S0 58.987 0 38z"
          fill="#F6F5F6"
        />
        <Path
          d="M56.71 35.128v6.353L47.833 55.58l-19.986-.522L19.32 41.51v-6.353L2.32 44.672 1.16 47.37C5.337 63.817 20.247 76 38 76c16.68 0 30.835-10.733 35.97-25.672l.29-5.366-17.55-9.834z"
          fill="#B5B4BC"
        />
        <Path
          d="M50.126 32.488l-.87 1.132H26.774l-.87-1.132-3.714-4.786V40.64l7.281 11.545 16.796.435 7.542-11.98V27.73l-3.684 4.757z"
          fill="#B5B4BC"
        />
        <Path
          d="M12.328 10.008l.145.464 15.722 20.247h19.639l15.693-20.276-.145-.696C56.652 3.684 47.746 0 38 0c-9.892 0-18.913 3.8-25.672 10.008z"
          fill="#B5B4BC"
        />
        <Path
          d="M38 2.9c9.37 0 18.188 3.656 24.83 10.27C69.474 19.811 73.1 28.602 73.1 38c0 9.398-3.656 18.188-10.27 24.83C56.188 69.474 47.4 73.1 38 73.1c-9.398 0-18.188-3.656-24.83-10.27C6.526 56.188 2.9 47.4 2.9 38c0-9.398 3.656-18.188 10.27-24.83C19.811 6.555 28.63 2.9 38 2.9zM38 0C17.027 0 0 17.027 0 38c0 20.972 17.027 38 38 38 20.972 0 38-17.028 38-38C76 17.027 58.972 0 38 0z"
          fill="#000"
        />
        <Path
          d="M49.226 46.905a11.35 11.35 0 00-5.018-9.428 11.337 11.337 0 00-6.353-1.943 11.35 11.35 0 00-9.428 5.018 11.337 11.337 0 00-1.943 6.353h4.351c0-.986.203-1.885.552-2.727.522-1.247 1.421-2.32 2.552-3.103a7.04 7.04 0 016.643-.638c1.247.522 2.32 1.42 3.104 2.552a7.007 7.007 0 011.19 3.916h4.35z"
          fill="#000"
        />
        <Path d="M30.806 54.331v-7.426h-4.35v7.426M44.875 46.905v7.426h4.351v-7.426" fill="#000" />
        <Path
          d="M23.467 52.214v20.363l14.359 2.553 14.358-2.553V52.214H23.467zM39.74 66.573a1.882 1.882 0 01-1.885 1.885 1.882 1.882 0 01-1.886-1.885V61.35c0-1.044.841-1.885 1.886-1.885 1.044 0 1.885.841 1.885 1.885v5.222zM28.051 15.432c.058.029 1.248.667 3.075 1.305 1.828.639 4.264 1.306 6.846 1.306s4.96-.668 6.73-1.306c1.77-.638 2.93-1.276 2.988-1.305a1.434 1.434 0 00.55-1.973 1.434 1.434 0 00-1.972-.55l.203.376-.203-.377.203.377-.203-.377c-.029 0-1.073.58-2.64 1.16-1.566.552-3.654 1.103-5.685 1.103-2.06 0-4.235-.551-5.889-1.131-.812-.29-1.508-.58-1.972-.784-.232-.116-.435-.203-.551-.26-.058-.03-.116-.059-.145-.059l-.03-.029-.144.261.145-.26-.145.26.145-.26c-.697-.378-1.596-.088-1.973.608-.319.668-.058 1.538.667 1.915z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path
            d="M0 38C0 17.013 17.013 0 38 0s38 17.013 38 38-17.013 38-38 38S0 58.987 0 38z"
            fill="#fff"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SecureIcon;