import { FilterRootRoutes, BrowseRoutes } from 'types/navigation';
import { CategoryType, FilterType } from 'types/views/browse';
import { ProductType } from 'types/resources/product';

import React, { useState, useEffect, useContext } from 'react';
import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { useStoreState } from 'app/store';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { ButtonBase, Button, Box } from 'app/components/base';
import { Footer } from 'app/components/layout';
import ScrollContainer from 'app/components/layout/ScrollContainer';
import SwitchButton from 'app/components/base/SwitchButton';
import FlatSelect from 'app/components/misc/FlatSelect';

import useOnUpdatedOnly from 'app/hooks/useOnUpdatedOnly';
import { findNodeRecursively, getFilterOptions, isNodeSelected } from './utils';
import FilterListItem, { FilterListItemTitle } from './components/FilterListItem';
import BrowseContext, { defaultFilters } from './context';

const defaultSizeParams = {
  size: defaultFilters.size,
  us_size: defaultFilters.us_size,
  uk_size: defaultFilters.uk_size,
  eu_size: defaultFilters.eu_size,
  jp_size: defaultFilters.jp_size,
};

// TODO: Remove once Array.prototype.findLastIndex becomes available
const findLastIndex = (array: any[], func: (a: any) => boolean) => {
  const index = array.reverse().findIndex(func);
  array.reverse();
  if (index >= 0) {
    return array.length - 1 - index;
  }
  return -1;
};

const Filter = ({ route, navigation }: StackScreenProps<FilterRootRoutes, 'Filter'>) => {
  const { title, level = 0, filterKey } = route.params || {};
  const {
    tempFilter,
    currentFilterValue,
    setTempFilter,
    setCurrentFilterKey,
    setCurrentFilterValue,
  } = useContext(BrowseContext);
  const sizePreferences = useStoreState((s) => s.user.user.size_preferences);
  const [filterOptionsTree, setFilterOptionsTree] = useState<CategoryType[]>([]);
  const getCollectionsByClass = useStoreState((s) => s.base.getCollectionsByClass);
  const isRoot = !filterKey;
  const isCategory = filterKey && filterKey.startsWith('category');
  const filterOptions = getFilterOptions(tempFilter, sizePreferences);

  const hasChildren = (filterOption: CategoryType) => !!filterOption.children?.length;

  const getSubTitle = (node: CategoryType): string => {
    if (!hasChildren(node)) return '';

    if (node.filterKey === 'category_level_1') {
      const categories = [1, 2, 3, 4]
        .map((n) => tempFilter[`category_level_${n}`])
        .filter((f) => f);

      return categories.length ? categories.join(', ') : i18n._(t`All`);
    }

    const selectedChildren = node.children?.filter(
      (n) =>
        node.filterKey &&
        isNodeSelected(tempFilter[node.filterKey], n) &&
        ((isCategory && isNodeSelected(tempFilter[`category_level_${level}`], node)) || !isCategory)
    );
    if (selectedChildren?.length)
      return Array.isArray(tempFilter[node.filterKey])
        ? selectedChildren.map((s) => s.name).join(', ')
        : selectedChildren[0].name;
    if (node.name === tempFilter[filterKey]) return i18n._(t`All ${node.name}`);
    return isRoot ? i18n._(t`All`) : '';
  };

  const selectOrShowChildren = (item: CategoryType) => {
    if (hasChildren(item) && item.filterKey) {
      navigation.push('Filter', {
        title: item.name,
        level: level + 1,
        filterKey: item.filterKey,
      });
    } else {
      const isMultiSelect = Array.isArray(currentFilterValue);
      const itemValue = item.value || item.name;
      setCurrentFilterKey(filterKey);
      setCurrentFilterValue(
        isNodeSelected(currentFilterValue, item)
          ? isMultiSelect
            ? currentFilterValue.filter((v) => v !== itemValue)
            : ''
          : isMultiSelect
          ? [...currentFilterValue, itemValue]
          : itemValue
      );
    }
  };

  const shouldShowBrands = (item: CategoryType) =>
    !item.filterKey ||
    (item.filterKey && !item.filterKey.startsWith('category') && item.filterKey !== 'collection') ||
    (item.filterKey &&
      (item.filterKey.startsWith('category') || item.filterKey === 'collection') &&
      !!tempFilter.class);

  const updateCollectionFilters = (productCategory?: ProductType['class']) => {
    const func = (f: CategoryType) => f.filterKey.startsWith('collection');
    const firstIndex = filterOptions.findIndex(func);
    const lastIndex = findLastIndex(filterOptions, func);

    if (firstIndex >= 0) {
      filterOptions.splice(firstIndex, lastIndex - firstIndex + 1);
    }

    const productCollections = getCollectionsByClass(productCategory);
    const collections: CategoryType[] = productCollections.map((collection) => ({
      name: i18n._(collection.name || ''),
      filterKey: `collections`,
      value: collection.slug,
      type: 'switch',
    }));
    filterOptions.splice(filterOptions.length - 1, 0, ...collections);
  };

  const onClassChange = (productCategory?: ProductType['class']) => {
    setTempFilter({
      ...tempFilter,
      class: productCategory,
      category_level_1: defaultFilters.category_level_1,
      category_level_2: defaultFilters.category_level_2,
      category_level_3: defaultFilters.category_level_3,
      category_level_4: defaultFilters.category_level_4,
      gender: defaultFilters.gender,
      main_brand: defaultFilters.main_brand,
      ...defaultSizeParams,
    });
    updateCollectionFilters(productCategory);
  };

  useEffect(() => {
    setCurrentFilterKey(filterKey);
    if (filterKey) {
      setCurrentFilterValue(tempFilter[filterKey]);
    }

    updateCollectionFilters(tempFilter.class);
    if (isRoot) {
      setFilterOptionsTree(filterOptions);
    } else {
      const tree = findNodeRecursively(filterOptions, (node: CategoryType) =>
        node.name
          ? node.name === title && (filterKey ? node.filterKey === filterKey : true)
          : node.filterKey === filterKey
      );
      setFilterOptionsTree((tree && tree.children) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, tempFilter.class]);

  // resetting size filters on gender change
  useOnUpdatedOnly(() => {
    setTempFilter({
      ...tempFilter,
      ...defaultSizeParams,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempFilter.gender]);

  return (
    <Box justifyContent="space-between" height="100%">
      <ScrollContainer>
        <Box width="100%" mt={2}>
          {!!filterKey && isCategory && filterKey !== 'category_level_1' && (
            <FilterListItem
              title={i18n._(t`All ${title}`)}
              selected={
                (currentFilterValue && title === currentFilterValue) ||
                (!currentFilterValue && tempFilter[`category_level_${level - 1}`] === title)
              }
              onPress={() => {
                const key: 'category_level_1' = `category_level_${level - 1}` as 'category_level_1';
                setCurrentFilterKey(key);
                setCurrentFilterValue(title);
              }}
            />
          )}

          {filterOptionsTree.map(
            (item, index) =>
              shouldShowBrands(item) && (
                <React.Fragment key={`${item.name}x${index}`}>
                  {item.type === 'select' ? (
                    <FilterListItemTitle
                      selected
                      title={item.name}
                      borderBottomWidth={1}
                      borderBottomColor="dividerGray"
                      pl={5}
                    >
                      <FlatSelect
                        mt={3}
                        items={item.children}
                        selected={tempFilter[String(item.filterKey)]}
                        onSelect={(v) => {
                          if (item.filterKey === 'class') {
                            onClassChange(v);
                          } else {
                            setTempFilter({
                              ...tempFilter,
                              [String(item.filterKey)]: v,
                            });
                          }
                        }}
                      />
                    </FilterListItemTitle>
                  ) : item.type === 'switch' ? (
                    <ButtonBase
                      onPress={() =>
                        setTempFilter({
                          ...tempFilter,
                          [String(item.filterKey)]: item.value
                            ? tempFilter[String(item.filterKey)] === item.value
                              ? null
                              : item.value
                            : !tempFilter[String(item.filterKey)],
                        })
                      }
                    >
                      <FilterListItemTitle
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="space-between"
                        borderBottomWidth={1}
                        borderBottomColor="dividerGray"
                        px={5}
                        title={item.name}
                        selected
                      >
                        <SwitchButton
                          onChecked={(v) =>
                            setTempFilter({
                              ...tempFilter,
                              [String(item.filterKey)]: item.value ? (v ? item.value : null) : v,
                            })
                          }
                          checked={
                            item.value
                              ? tempFilter[String(item.filterKey)] === item.value
                              : !!tempFilter[String(item.filterKey)]
                          }
                        />
                      </FilterListItemTitle>
                    </ButtonBase>
                  ) : (
                    <FilterListItem
                      title={item.name}
                      subTitle={getSubTitle(item)}
                      selected={isNodeSelected(currentFilterValue, item)}
                      color={item.color}
                      hasChildren={hasChildren(item)}
                      onPress={() => selectOrShowChildren(item)}
                    />
                  )}
                </React.Fragment>
              )
          )}
        </Box>
      </ScrollContainer>

      <FilterFooterActions route={route} />
    </Box>
  );
};

const FilterFooterActions = ({ route }: { route: RouteProp<FilterRootRoutes, 'Filter'> }) => {
  const {
    setFilter,
    tempFilter,
    setTempFilter,
    currentFilterKey,
    currentFilterValue,
    setCurrentFilterValue,
  } = useContext(BrowseContext);
  const navigation = useNavigation<StackNavigationProp<BrowseRoutes>>();

  const level = route.params?.level || 0;

  const selectedFilterCount = Object.values(tempFilter).filter((v) =>
    Array.isArray(v) ? v.length > 0 : !!v
  ).length;

  const apply = () => {
    if (level > 0) {
      let newFilters = {} as Partial<FilterType & Record<string, string>>;
      const isCategory = currentFilterKey.startsWith('category_level');

      if (isCategory) {
        newFilters = {
          category_level_1: '',
          category_level_2: '',
          category_level_3: '',
          category_level_4: '',
        };
      }

      if (isCategory) {
        const currentLevel = Number(currentFilterKey.replace('category_level_', ''));
        const titles = navigation.getState().routes.map((r: any) => r.params?.title);
        if (currentFilterValue === titles[titles.length - 1]) titles.pop();
        for (let i = currentLevel - 1; i > 0; i -= 1) {
          newFilters[`category_level_${i}` as 'category_level_1'] = titles.pop();
        }
      }

      newFilters[currentFilterKey] = currentFilterValue;
      setTempFilter({ ...tempFilter, ...newFilters });
      setCurrentFilterValue('');
      navigation.popToTop();
    } else {
      setFilter(tempFilter);
      navigation.goBack();
    }
  };

  const clear = () => {
    if (level > 0) {
      // @ts-ignore fallback added
      setCurrentFilterValue(defaultFilters[currentFilterKey] || '');
    } else {
      setTempFilter(defaultFilters);
    }
  };

  const isCurrentFilterValueSet = Array.isArray(currentFilterValue)
    ? currentFilterValue.length > 0
    : !!currentFilterValue;

  return (
    <Footer>
      <Box flexDirection="row" justifyContent="space-between">
        <Button
          width="48%"
          variant="white"
          disabled={level > 0 ? !isCurrentFilterValueSet : !selectedFilterCount}
          text={`${i18n._(t`CLEAR`)} ${
            !level && selectedFilterCount ? `(${selectedFilterCount})` : ''
          }`}
          onPress={clear}
        />
        <Button width="48%" variant="black" text={i18n._(t`APPLY`)} onPress={apply} />
      </Box>
    </Footer>
  );
};

export default Filter;
