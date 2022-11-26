import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function InterestOther(props: SvgProps) {
  return (
    <Svg width={50} height={60} viewBox="0 0 50 60" fill="none" {...props}>
      <Path
        d="M12.3 31.2L0 44.7l4.8 4.8 7.5-6.3v-12zM14.4 31.2v13.5h20.7V31.2l-9.3 1.2v8.7h-2.1v-8.7l-9.3-1.2zM24.9 30.3L44.7 27V3L24.9 0 4.8 3.3v24l20.1 3zm6.3-17.4h5.7v9.6h-5.7v-9.6zm-18.3 0h5.7v9.6h-5.7v-9.6zM14.4 46.8V60h6l3.9-13.2h-9.9zM35.1 46.8h-9.9L29.1 60h6V46.8zM37.2 31.2v12l7.5 6.3 4.8-4.8-12.3-13.5z"
        // eslint-disable-next-line react/destructuring-assignment
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

export default InterestOther;
