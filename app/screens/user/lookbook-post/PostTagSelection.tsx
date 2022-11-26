import React, { useContext, useEffect, useRef, useState } from 'react';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useInfiniteQuery } from 'react-query';
import { FlatList, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Input } from 'app/components/form';
import {
  FlatListContainer,
  Footer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import { Box, Button, ButtonBase, ImgixImage, Text } from 'app/components/base';
import theme from 'app/styles/theme';
import AlgoliaClient from 'app/services/algolia';
import { ProductType } from 'types/resources/product';
import { buildAlgoliaFilterString } from 'app/screens/browse/utils';
import CheckBoxInput from 'app/components/form/CheckBox';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { PostEditRoutes } from 'types/navigation';
import PostEditContext from './context';

const PostTagSelection = ({ navigation }: StackScreenProps<PostEditRoutes, 'PostTagSelection'>) => {
  const { selectedTags } = useContext(PostEditContext);

  const [search, setSearch] = useState<string>('');
  const [productClass, setProductClass] = useState<string>('');
  const [selectedTagsResult, setSelectedTagsResult] = useState<ProductType[]>([]);
  const listRef = useRef<FlatList>(null);

  const productClasses = [
    { name: i18n._(t`ALL`), value: '' },
    { name: i18n._(t`SNEAKERS`), value: 'Sneakers' },
    { name: i18n._(t`APPAREL`), value: 'Apparel' },
    { name: i18n._(t`COLLECTIBLES`), value: 'Collectibles' },
  ];

  const fetchTagProducts = (pageNum: number | undefined, mode: 'search' | 'selectedTags') => {
    if (pageNum === undefined) return null;

    // fetching only selected tags first, for rest of the list ignore the selected tags
    const filters =
      mode === 'selectedTags'
        ? // @ts-ignore ignore
          buildAlgoliaFilterString({ class: productClass, product_id: selectedTags })
        : // @ts-ignore ignore
          `${buildAlgoliaFilterString({ class: productClass })}${
            selectedTags.length
              ? `${productClass ? ' AND ' : ''}NOT product_id:${selectedTags.join(
                  ' AND NOT product_id:'
                )}`
              : ``
          }`;

    return AlgoliaClient.mostPopular<ProductType>(search, {
      filters,
      page: pageNum,
      hitsPerPage: 20,
      facetingAfterDistinct: true,
      attributesToRetrieve: ['name', 'short_name', 'product_id', 'image'],
    }).then(({ hits, nbPages, page, nbHits }) => ({
      hits,
      nextPage: nbHits && nbPages - 1 !== page ? page + 1 : undefined,
    }));

    return null;
  };

  const { fetchNextPage, hasNextPage, data, refetch, isFetching } = useInfiniteQuery(
    'tagProducts',
    ({ pageParam = 0 }) => fetchTagProducts(pageParam, 'search'),
    {
      getNextPageParam: (lastPage) => lastPage?.nextPage,
    }
  );

  const tagProducts: ProductType[] = [];
  data?.pages.forEach((d) => tagProducts.push(...(d?.hits || [])));

  const refetchResults = () => {
    // fetching selectedTags First
    if (selectedTags.length) {
      fetchTagProducts(0, 'selectedTags')?.then(({ hits }) => setSelectedTagsResult(hits));
    }

    refetch();
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  useEffect(() => {
    refetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productClass]);

  return (
    <SafeAreaScreenContainer>
      <Box px={5} pt={6}>
        <Input
          onChangeText={setSearch}
          placeholder={i18n._(t`Search Product Name`)}
          returnKeyType="search"
          numberOfLines={1}
          onSubmitEditing={() => refetchResults()}
          style={{ height: 48 }}
          iconButton={
            <ButtonBase onPress={() => refetchResults()}>
              <Ionicon name="ios-search" size={20} color={theme.colors.textBlack} />
            </ButtonBase>
          }
        />
      </Box>
      <Box mt={5} mb={2}>
        <ScrollContainer horizontal>
          {productClasses.map(({ name, value }) => (
            <ButtonBase
              key={value}
              onPress={() => setProductClass(value)}
              style={[
                styles.productClassBtn,
                productClass === value ? { borderColor: theme.colors.textBlack } : {},
              ]}
            >
              <Text
                fontSize={2}
                fontFamily="bold"
                color={productClass === value ? 'textBlack' : 'gray4'}
              >
                {name}
              </Text>
            </ButtonBase>
          ))}
        </ScrollContainer>
      </Box>

      <FlatListContainer<ProductType>
        ref={listRef}
        data={[...selectedTagsResult, ...tagProducts]}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={({ item }) => <ProductSelectCard product={item} />}
        ListFooterComponent={
          <Box p={5} center>
            {isFetching && <LoadingIndicator />}
            {!isFetching && hasNextPage && (
              <Button
                text={i18n._(t`SHOW MORE`)}
                variant="white"
                onPress={() => fetchNextPage()}
                width="100%"
              />
            )}
            {!isFetching && !tagProducts.length && (
              <Text color="gray3">
                <Trans>No Results</Trans>
              </Text>
            )}
          </Box>
        }
      />
      <Footer>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Text fontSize={1}>
            <Trans>SELECTED</Trans>
          </Text>
          <Text fontSize={1}>{selectedTags.length}/5</Text>
        </Box>
        <Box>
          <Button
            variant="black"
            size="lg"
            text={i18n._(t`CONFIRM`)}
            onPress={() => navigation.goBack()}
          />
        </Box>
      </Footer>
    </SafeAreaScreenContainer>
  );
};

const ProductSelectCard = ({ product }: { product: ProductType }) => {
  const { selectedTags, setSelectedTags } = useContext(PostEditContext);

  const { product_id } = product;
  const isSelected = selectedTags.includes(product_id);

  return (
    <Box py={4} px={6} borderBottomColor="dividerGray" borderBottomWidth={1}>
      {!!product.product_id && (
        <CheckBoxInput
          checked={isSelected}
          onChecked={() =>
            isSelected
              ? setSelectedTags(selectedTags.filter((tag) => tag !== product_id))
              : setSelectedTags([...selectedTags, product_id])
          }
          disabled={selectedTags[0] === product_id || (!isSelected && selectedTags.length >= 5)}
        >
          <Box center flexDirection="row" pl={3}>
            <ImgixImage src={product.image} width={64} height={64} />
            <Box width="80%" pl={5}>
              <Text fontSize={2} lineHeight={15}>
                {product.short_name || product.name}
              </Text>
            </Box>
          </Box>
        </CheckBoxInput>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  productClassBtn: {
    minWidth: 90,
    paddingHorizontal: 4,
    paddingVertical: 5,
    borderColor: theme.colors.transparent,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostTagSelection;
