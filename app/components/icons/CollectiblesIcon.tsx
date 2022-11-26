import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const CollectiblesIcon = (props: SvgProps) => (
  <Svg width={61} height={79} fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m29.88 0 24.472 3.885v31.863l-8.143 1.293 13.215 14.493-.057 2.484-5.434 5.435-2.441.096-6.857-5.852V72H33.593l-3.714-11.937L26.166 72H15.124V53.687l-6.896 5.864-2.438-.098-5.434-5.435L.3 51.532 13.545 37.04l-8.138-1.292V3.885L29.879 0Zm1.799 39.347 9.357-1.485v14.344H18.723V37.862l9.357 1.485v9.26h3.599v-9.26ZM9.006 6.957v25.718l20.873 3.314 20.874-3.313V6.956L29.879 3.644 9.006 6.957Zm35.629 42.008 7.928 6.767 3.044-3.043-10.972-12.034v8.31ZM4.117 52.69l11.007-12.043v8.316L7.16 55.734 4.117 52.69Zm36.919 3.115h-8.712l3.918 12.596h4.794V55.805ZM18.723 68.401V55.805h8.712l-3.919 12.596h-4.793Zm3.959-51.824h-6.479v10.797h6.479V16.577Zm14.395 0h6.478v10.797h-6.478V16.577Z"
      fill="#0A0A0A"
    />
  </Svg>
);

export default CollectiblesIcon;