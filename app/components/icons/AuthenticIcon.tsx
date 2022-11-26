import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function AuthenticIcon(props: SvgProps) {
  return (
    <Svg width={76} height={76} viewBox="0 0 76 76" fill="none" {...props}>
      <Path
        d="M0 38C0 17.013 17.013 0 38 0s38 17.013 38 38-17.013 38-38 38S0 58.987 0 38z"
        fill="#F6F5F6"
      />
      <Path
        d="M38.871 50.618l1.48 8.964 14.33-7.861-2.872-3.83-12.938 2.727zM56.42 54.1L22.45 72.692c2.292 1.044 4.7 1.828 7.223 2.408L59.32 57.986l-2.9-3.887zM36.027 51.198l-15.258 3.22-9.688-7.484-9.138 3.046A38.05 38.05 0 0019.32 71.068l18.333-10.036-1.625-9.834zM20.973 28.805l2.871 3.858 12.938-2.727-1.45-8.963-14.36 7.832zM19.233 26.455L57.61 5.454c-2.001-1.19-4.09-2.234-6.324-3.046l-34.925 20.16 2.872 3.887zM39.624 29.327l15.258-3.22 9.689 7.484 10.588-3.51c-1.973-9.312-7.368-17.376-14.823-22.8L38 19.493l1.624 9.834z"
        fill="#B5B4BC"
      />
      <Path
        d="M25.005 35.996l-6.146 2 15.664 23.787 33.65-43.802L64.4 13.63 34.524 44.496l-9.52-8.5z"
        fill="#000"
      />
      <Path
        d="M38 2.9c9.37 0 18.188 3.656 24.83 10.27C69.445 19.811 73.1 28.63 73.1 38c0 9.37-3.656 18.188-10.27 24.83C56.188 69.445 47.37 73.1 38 73.1c-9.37 0-18.188-3.656-24.83-10.27C6.555 56.188 2.9 47.37 2.9 38c0-9.37 3.656-18.188 10.27-24.83C19.811 6.555 28.63 2.9 38 2.9zM38 0C17.027 0 0 17.027 0 38c0 20.972 17.027 38 38 38 20.972 0 38-17.028 38-38C76 17.027 58.972 0 38 0z"
        fill="#000"
      />
    </Svg>
  );
}

export default AuthenticIcon;
