import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function InterestSneaker(props: SvgProps) {
  return (
    <Svg viewBox="0 0 47 60" fill="none" {...props}>
      <Path
        d="M5 16.667l8.056 8.055 3.61-6.944-2.5-8.056L5 16.667z"
        // eslint-disable-next-line react/destructuring-assignment
        fill={props.fill || '#000'}
      />
      <Path
        d="M42.778 38.889l-3.61-13.056L41.388 20 16.667 7.778l-.833.555 3.055 9.722-4.166 8.056L30.833 42.5l11.945-3.611zM32.5 44.167l10.833 10.555 2.778-3.61-2.778-10.279L32.5 44.167zM3.333 18.055L0 20.555 39.167 60l2.777-3.611-38.61-38.334zM42.222 18.056l3.334-9.445L26.666 0l-8.055 6.389 23.611 11.667z"
        // eslint-disable-next-line react/destructuring-assignment
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

export default InterestSneaker;
