import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { Alert, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import API from 'common/api';
import theme from 'app/styles/theme';
import { Box, ButtonBase, ImgixImage } from 'app/components/base';
import { UserPostType } from 'types/resources/userPost';
import { PostTopTabRoutes, RootRoutes } from 'types/navigation';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';

const PostCardListItem = ({ item: post, refetch }: { item: UserPostType; refetch: () => void }) => (
  <PostCard key={post.id} item={post} refetch={refetch} />
);

const PostCard = ({ item: post, refetch }: { item: UserPostType; refetch: () => void }) => {
  const navigation = useNavigation<StackNavigationProp<RootRoutes>>();
  const route = useRoute<RouteProp<PostTopTabRoutes>>();
  const [isDeleting, setIsDeleting] = useState(false);

  const isPublishedPosts = route.name === 'PublishedPosts';
  const isReviewingPosts = route.name === 'ReviewingPosts';
  const { gallery } = post;

  const VISIBLE_GALLERY_IMAGES_COUNT = 3;
  const galleryItems = gallery.slice(0, VISIBLE_GALLERY_IMAGES_COUNT);

  const remove = () => {
    setIsDeleting(true);
    API.remove(`me/posts/${post.id}/remove`).then(() => {
      refetch();
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
    <Box my={4} mx={5} height={230} key={post.id}>
      <ButtonBase
        onPress={() =>
          navigation.push('UserStack', {
            screen: 'PostDetails',
            params: {
              user_post_id: post.id,
              status: isPublishedPosts ? 'published' : isReviewingPosts ? 'reviewing' : 'rejected',
            },
          })
        }
      >
        <Box flexDirection="row" justifyContent="space-between">
          <Box width="65%" height="100%" pr={2}>
            <ImgixImage src={galleryItems[0] || ''} style={styles.image1} resizeMode="cover" />
          </Box>

          <Box width="35%" flexDirection="column">
            <Box width="100%" height="50%" pb={1}>
              {galleryItems[1] ? (
                <ImgixImage src={galleryItems[1] || ''} style={styles.image2} resizeMode="cover" />
              ) : (
                <Box bg="gray6" style={styles.image2} />
              )}
            </Box>
            <Box width="100%" height="50%" pt={1}>
              {galleryItems[2] ? (
                <ImgixImage src={galleryItems[2] || ''} style={styles.image3} resizeMode="cover" />
              ) : (
                <Box bg="gray6" style={styles.image3} />
              )}
            </Box>
          </Box>
          {!isPublishedPosts && (
            <Box position="absolute" right={0}>
              <Box bg="gray2" borderRadius={4} m={2} p={2} opacity={0.8}>
                <ButtonBase
                  onPress={() =>
                    navigation.navigate('UserStack', {
                      screen: 'PostEditStack',
                      params: { screen: 'PostEdit', params: { user_post_id: post.id } },
                    })
                  }
                  android_ripple={{ color: theme.colors.white, borderless: true }}
                >
                  <MaterialIcons name="edit" size={20} color={theme.colors.white} />
                </ButtonBase>
              </Box>
              <Box bg="gray2" borderRadius={4} m={2} p={2} opacity={0.8}>
                <ButtonBase
                  onPress={showPostDeleteDialog}
                  android_ripple={{ color: theme.colors.white, borderless: true }}
                >
                  {isDeleting ? (
                    <LoadingIndicator color={theme.colors.white} />
                  ) : (
                    <Ionicon name="trash-outline" size={20} color={theme.colors.white} />
                  )}
                </ButtonBase>
              </Box>
            </Box>
          )}
        </Box>
      </ButtonBase>
    </Box>
  );
};

const styles = StyleSheet.create({
  image1: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  image2: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 4,
  },
  image3: {
    width: '100%',
    height: '100%',
    borderBottomRightRadius: 4,
  },
});

export { PostCardListItem, PostCard };
