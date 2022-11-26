import React, { useState } from 'react';
import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { Alert } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { StackHeaderProps } from '@react-navigation/stack/lib/typescript/src/types';
import Toast from 'react-native-toast-message';

import API from 'common/api';
import theme from 'app/styles/theme';
import { useStoreState } from 'app/store';
import Header from 'app/components/layout/Header';
import { Text, Box, ButtonBase } from 'app/components/base';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';

const PostEditHeader = ({ options, route, navigation }: StackHeaderProps) => {
  const { headerTitle } = options;

  const [isDeleting, setIsDeleting] = useState(false);
  const userId = useStoreState((s) => s.user.user.id);

  const goBack = () => {
    if (userId) {
      Alert.alert(
        i18n._(t`NOT SAVED`),
        i18n._(t`Your post will not be saved if you leave right now.`),
        [
          {
            text: i18n._(t`Back`),
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
          { text: i18n._(t`Keep Editing`), style: 'cancel' },
        ],
        { cancelable: true }
      );
    } else {
      navigation.goBack();
    }
  };

  const remove = () => {
    setIsDeleting(true);
    // @ts-ignore ignore
    API.remove(`me/posts/${route.params?.user_post_id}/remove`).then(() => {
      goBack();
      Toast.show({
        type: 'default',
        text1: `${i18n._(t`Your post has been deleted.`)}`,
        position: 'bottom',
        bottomOffset: 120,
      });
    });
  };

  const showPostDeleteDialog = () =>
    Alert.alert(
      i18n._(t`Delete Post`),
      i18n._(t`Do you want to delete this post?`),
      [
        { text: i18n._(t`Cancel`), style: 'cancel' },
        {
          text: i18n._(t`Delete`),
          onPress: () => remove(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );

  return (
    <Header>
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        <Box width={theme.constants.HEADER_ICON_SIZE}>
          <ButtonBase
            onPress={goBack}
            android_ripple={{ color: theme.colors.white, borderless: true }}
          >
            <Ionicon
              name="ios-arrow-back"
              size={theme.constants.HEADER_ICON_SIZE}
              color={theme.colors.white}
            />
          </ButtonBase>
        </Box>

        <Box center>
          <Text
            color="white"
            fontFamily="bold"
            textTransform="uppercase"
            letterSpacing={theme.constants.LETTER_SPACINGS_TEXT_TITLE}
            fontSize={3}
          >
            {headerTitle}
          </Text>
        </Box>

        <Box width={theme.constants.HEADER_ICON_SIZE}>
          {route.name === 'PostEdit' && (
            <ButtonBase
              onPress={showPostDeleteDialog}
              android_ripple={{ color: theme.colors.white, borderless: true }}
            >
              {isDeleting ? (
                <LoadingIndicator />
              ) : (
                <Ionicon
                  name="trash-outline"
                  size={theme.constants.HEADER_ICON_SIZE}
                  color={theme.colors.white}
                />
              )}
            </ButtonBase>
          )}
        </Box>
      </Box>
    </Header>
  );
};

export default PostEditHeader;
