import React, { useEffect } from 'react';
import { Trans } from '@lingui/macro';

import { Text, Box } from 'app/components/base';
import { FlatListContainer, SafeAreaScreenContainer } from 'app/components/layout';
import useAPIListFetch from 'app/hooks/useAPIListFetch';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { PostTopTabRoutes } from 'types/navigation';
import { RouteProp } from '@react-navigation/native';
import { UserPostType } from 'types/resources/userPost';
import { PostCardListItem } from './components/PostCard';

const RouteToPostStatusMap = {
  PublishedPosts: 'confirmed',
  ReviewingPosts: 'pending',
  RejectedPosts: 'rejected',
};

const UserPosts = ({ route }: { route: RouteProp<PostTopTabRoutes> }) => {
  const isPublishedPosts = route.name === 'PublishedPosts';
  const isReviewingPosts = route.name === 'ReviewingPosts';

  const postStatus = RouteToPostStatusMap[route.name];
  const currentPostedParams = {
    page: { size: 5, number: 0 },
    filter: { status: postStatus },
  };

  const {
    refetch,
    fetchMore,
    isLoading,
    results: currentPost,
    total: currentPostCount,
  } = useAPIListFetch<UserPostType>('me/posts', currentPostedParams, {
    refetchOnScreenFocus: true,
  });
  const hasPublishedPost = currentPostCount !== 0;

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaScreenContainer>
      {hasPublishedPost ? (
        <>
          <FlatListContainer<UserPostType>
            data={currentPost}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostCardListItem item={item} refetch={refetch} />}
            onEndReached={() => fetchMore()}
            ListFooterComponent={
              <Box center my={3} p={5}>
                {isLoading && currentPost.length < currentPostCount && <LoadingIndicator />}
              </Box>
            }
          />
        </>
      ) : isLoading ? (
        <Box center p={5}>
          <LoadingIndicator />
        </Box>
      ) : (
        <Text p={5} fontSize={1} textAlign="center">
          {isPublishedPosts ? (
            <Trans>No published posts found.</Trans>
          ) : isReviewingPosts ? (
            <Trans>No pending review posts found.</Trans>
          ) : (
            <Trans>No rejected posts found.</Trans>
          )}
        </Text>
      )}
    </SafeAreaScreenContainer>
  );
};

export default UserPosts;
