import { StyleSheet } from 'react-native';
import React, { useContext, useState, useRef } from 'react';
import { BottomSheetModalProvider, BottomSheetModal } from '@gorhom/bottom-sheet';

import { Box } from 'app/components/base';
import { UserPostType } from 'types/resources/userPost';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import { UserPostProductTagType } from 'types/resources/userPostProductTag';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { FlatListContainer, SafeAreaScreenContainer } from 'app/components/layout';

import ProductCheckoutContext from './context';
import ProductTagBottomSheet from './components/product/lookbook/ProductTagBottomSheet';
import LookbookFeedCard from './components/product/lookbook/LookbookFeedCard';

const LookbookFeedCardListItem = ({
  item: lookbookFeed,
  handlePresentModalPress,
  setProductTag,
}: {
  item: UserPostType;
  handlePresentModalPress: () => void;
  setProductTag: (p: number[]) => void;
}) => (
  <LookbookFeedCard
    key={lookbookFeed.id}
    lookbookFeed={lookbookFeed}
    handlePresentModalPress={handlePresentModalPress}
    setProductTag={setProductTag}
  />
);

const ProductLookbookFeed = () => {
  const { product } = useContext(ProductCheckoutContext);
  const [productTag, setProductTag] = useState<number[]>([]);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = () => bottomSheetModalRef.current?.present();
  const handleDismissModalPress = () => bottomSheetModalRef.current?.dismiss();
  const currentLookbookFeedParams = { page: { size: 5, number: 0 } };

  const {
    fetchMore,
    isLoading,
    results: currentLookbookFeed,
    total: currentLookbookFeedCount,
  } = useAPIListFetch<UserPostProductTagType>(
    `products/${product.id}/feed`,
    currentLookbookFeedParams,
    { refetchOnScreenFocus: true }
  );

  return (
    <SafeAreaScreenContainer>
      <BottomSheetModalProvider>
        <Box backgroundColor="gray7">
          {!!currentLookbookFeed.length && (
            <FlatListContainer<UserPostProductTagType>
              data={currentLookbookFeed}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <LookbookFeedCardListItem
                  item={{
                    ...item.user_post,
                    // Not showing current product in tags
                    tags: item.user_post.tags.filter((t) => t !== product.id),
                  }}
                  handlePresentModalPress={handlePresentModalPress}
                  setProductTag={setProductTag}
                />
              )}
              onEndReached={() => fetchMore()}
              ListFooterComponent={
                <Box center my={3} p={5}>
                  {isLoading && currentLookbookFeed.length < currentLookbookFeedCount && (
                    <LoadingIndicator />
                  )}
                </Box>
              }
            />
          )}
        </Box>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={['90%', '90%']}
          style={styles.shadow}
        >
          <ProductTagBottomSheet
            handleDismissModalPress={handleDismissModalPress}
            // Not showing current product in tags
            productTag={productTag.filter((t) => t !== product.id)}
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
export default ProductLookbookFeed;
