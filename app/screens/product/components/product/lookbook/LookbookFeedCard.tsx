import React from 'react';
import { Box, ImgixImage, Text } from 'app/components/base';
import { UserPostType } from 'types/resources/userPost';
import { WINDOW_WIDTH } from 'common/constants';
import Ionicon from 'react-native-vector-icons/Ionicons';
import theme from 'app/styles/theme';
import LookbookImageCarousel from './LookbookImageCarousel';

const LookbookFeedCard = ({
  lookbookFeed,
  handlePresentModalPress,
  setProductTag,
}: {
  lookbookFeed: UserPostType;
  handlePresentModalPress: () => void;
  setProductTag: (p: number[]) => void;
}) => (
  <Box bg="white" py={5} px={5} mb={3}>
    <Box width="100%" flexDirection="row" justifyContent="flex-start" alignItems="center" mb={3}>
      {lookbookFeed.user_avatar ? (
        <ImgixImage
          width={52}
          height={52}
          borderRadius={52 / 2}
          src={lookbookFeed.user_avatar}
          resizeMode="cover"
        />
      ) : (
        <Ionicon name="ios-person-circle-sharp" color={theme.colors.gray4} size={52} />
      )}
      <Box ml={4} maxWidth={WINDOW_WIDTH - 100}>
        <Text mt={1} fontSize={3} lineHeight={18} fontFamily="bold">
          {lookbookFeed.user_name}
        </Text>
        <Text fontSize={2} lineHeight={18} mt={1} fontFamily="medium" numberOfLines={2}>
          {lookbookFeed.title}
        </Text>
      </Box>
    </Box>
    <Box center width="100%" mt={4}>
      <LookbookImageCarousel
        lookbookFeed={lookbookFeed}
        handlePresentModalPress={handlePresentModalPress}
        setProductTag={setProductTag}
      />
    </Box>
  </Box>
);

export default LookbookFeedCard;
