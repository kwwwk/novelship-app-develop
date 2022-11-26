import React, { useContext } from 'react';

import { Box, ButtonBase, ImgixImage, Text } from 'app/components/base';
import { ScrollContainer } from 'app/components/layout';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductRoutes, RootRoutes } from 'types/navigation';
import { Trans } from '@lingui/macro';
import { getImgixUrl } from 'common/constants';
import ProductCheckoutContext from '../../context';

type ProductNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ProductRoutes, 'Product'>,
  StackNavigationProp<RootRoutes, 'UserStack'>
>;

const LookbookSection = ({ openLookbookPostCreate }: { openLookbookPostCreate: () => void }) => {
  const navigation = useNavigation<ProductNavigationProp>();
  const { lookbookFeeds } = useContext(ProductCheckoutContext);

  const lookBookSectionImages: string[] = [];
  const VISIBLE_LOOKBOOK_IMAGES_COUNT = 5;
  let lookbookImagesCount = 0;
  let lookbookItems: string[] = [];

  if (lookbookFeeds?.length) {
    lookbookFeeds.forEach(({ user_post }) => {
      user_post.gallery.forEach((image) => {
        lookBookSectionImages.push(image);
      });
    });
    lookbookImagesCount = lookBookSectionImages.length;
    lookbookItems = lookBookSectionImages.slice(0, VISIBLE_LOOKBOOK_IMAGES_COUNT);
  }

  return (
    <Box mt={3} minHeight={100}>
      {lookbookFeeds?.length ? (
        <ScrollContainer horizontal>
          {lookbookItems.map((image: string, i: number) => (
            <Box key={i} mr={i === lookbookItems.length - 1 ? 2 : 3} ml={i === 0 ? 5 : 0}>
              <Box center width="100%">
                <ButtonBase onPress={() => navigation.push('LookbookFeed')}>
                  <ImgixImage src={image} height={124} width={124} resizeMode="cover" />
                </ButtonBase>
              </Box>
            </Box>
          ))}
          {(lookbookImagesCount > VISIBLE_LOOKBOOK_IMAGES_COUNT ||
            lookbookFeeds.length > VISIBLE_LOOKBOOK_IMAGES_COUNT) && (
            <Box backgroundColor="gray7" center height={124} width={124} ml={2} mr={2}>
              <ButtonBase onPress={() => navigation.push('LookbookFeed')} style={{ padding: 4 }}>
                <Text
                  p={4}
                  fontSize={2}
                  fontFamily="medium"
                  textDecorationLine="underline"
                  textAlign="center"
                >
                  <Trans>View More</Trans>
                </Text>
              </ButtonBase>
            </Box>
          )}
        </ScrollContainer>
      ) : (
        <ButtonBase onPress={openLookbookPostCreate}>
          <Box
            center
            mx={5}
            backgroundColor="gray7"
            borderWidth={1}
            borderStyle="dashed"
            borderColor="gray3"
            borderRadius={4}
          >
            <Box center height={130} width={150}>
              <Box center>
                <ImgixImage
                  src={getImgixUrl('icons/novelship-logomark.png')}
                  height={30}
                  width={30}
                />
              </Box>
              <Text mt={3} px={3} fontSize={2} textAlign="center" color="gray3" lineHeight={18}>
                <Trans>Share your photos on Novelship</Trans>
              </Text>
            </Box>
          </Box>
        </ButtonBase>
      )}
    </Box>
  );
};

export default LookbookSection;
