import React from 'react';
import { ImgixImage, Text, Box } from 'app/components/base';
import { getImgixUrl } from 'common/constants';
import { PressableProps } from 'react-native';

const PostPurchaseButton = ({
  iconSrc,
  selected,
  children,
  disabled,
}: { iconSrc: string; selected: boolean; disabled: boolean } & PressableProps) => (
  <Box
    bg={selected ? (disabled ? 'gray3' : 'black3') : 'white'}
    borderColor={disabled ? 'gray3' : 'black3'}
    borderRadius={4}
    borderWidth={1}
    height={74}
    p={4}
    width="100%"
    center
    alignItems="center"
    flexDirection="row"
    justifyContent="space-between"
  >
    <ImgixImage
      style={{ tintColor: selected ? 'white' : disabled ? '#8f8f96' : '#000000' }}
      src={getImgixUrl(iconSrc)}
      height={50}
      width={50}
    />
    <Text
      ml={4}
      fontSize={2}
      fontFamily="medium"
      color={selected ? (disabled ? 'gray8' : 'white') : disabled ? 'gray3' : 'black2'}
      lineHeight={15}
    >
      {children}
    </Text>
  </Box>
);
export default PostPurchaseButton;
