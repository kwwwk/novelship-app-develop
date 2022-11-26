import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function InterestApparel(props: SvgProps) {
  return (
    <Svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
      <Path
        d="M21.9 18.9l2.7-9L30 7.5l5.4 2.4 2.7 9 3.9-2.4-3.9-12.6L30 0l-8.1 3.9L18 16.5l3.9 2.4zM45.3 54H14.7l-.6 6h31.8l-.6-6.6v.6zM25.5 43.8l-8.1 8.1h25.2l-8.1-8.1h-9z"
        // eslint-disable-next-line react/destructuring-assignment
        fill={props.fill || '#000'}
      />
      <Path
        d="M49.8 24l-6.6-5.4L30 25.5l-13.2-6.9-6.6 5.4L0 51.9l5.7 1.8 10.5-19.5-1.5 17.1 9.9-9.6h10.8l9.9 9.6-1.2-17.1 10.5 19.5 5.4-1.8L49.8 24z"
        // eslint-disable-next-line react/destructuring-assignment
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

export default InterestApparel;
