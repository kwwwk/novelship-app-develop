import { StyleSheet } from 'react-native';
import React, { useState, useRef } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomSheetModalProvider, BottomSheetModal, SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

import { Box } from 'app/components/base';
import { UserRoutes } from 'types/navigation';
import { SafeAreaScreenContainer } from 'app/components/layout';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { defaultUserPost, UserPostType } from 'types/resources/userPost';
import LookbookFeedCard from 'app/screens/product/components/product/lookbook/LookbookFeedCard';
import ProductTagBottomSheet from 'app/screens/product/components/product/lookbook/ProductTagBottomSheet';
import { useQuery } from 'react-query';

const PostDetails = ({ route }: StackScreenProps<UserRoutes, 'PostDetails'>) => {
  const { user_post_id } = route.params;
  const [productTag, setProductTag] = useState<number[]>([]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();
  const handleDismissModalPress = () => bottomSheetModalRef.current?.dismiss();

  const { data: existingPost = defaultUserPost } = useQuery<UserPostType>(
    [`me/posts/${user_post_id}`],
    { initialData: defaultUserPost }
  );

  if (!existingPost.id) {
    return (
      <Box center my={3} p={5}>
        <LoadingIndicator />
      </Box>
    );
  }

  return (
    <SafeAreaScreenContainer>
      <BottomSheetModalProvider>
        <Box height={SCREEN_HEIGHT} backgroundColor="gray7">
          <LookbookFeedCard
            lookbookFeed={existingPost}
            handlePresentModalPress={handlePresentModalPress}
            setProductTag={setProductTag}
          />
        </Box>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={['90%', '90%']}
          style={styles.shadow}
        >
          <ProductTagBottomSheet
            handleDismissModalPress={handleDismissModalPress}
            productTag={productTag}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaScreenContainer>
  );
};

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 14,
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 24,
  },
});
export default PostDetails;
