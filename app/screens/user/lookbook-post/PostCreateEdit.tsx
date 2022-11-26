import React, { useContext, useEffect, useState } from 'react';
import { Alert, ImageBackground, Keyboard, StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { t, Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Asset } from 'react-native-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useQuery } from 'react-query';

import API from 'common/api';
import { Box, Button, ButtonBase, Text } from 'app/components/base';
import {
  Footer,
  KeyboardAwareContainer,
  SafeAreaScreenContainer,
  ScrollContainer,
} from 'app/components/layout';
import { useStoreState } from 'app/store';
import { Field } from 'app/components/form';
import useForm from 'app/hooks/useForm';
import theme from 'app/styles/theme';
import ChevronRight from 'app/components/icons/ChevronRight';
import CheckBoxInput from 'app/components/form/CheckBox';
import { PostEditRoutes, RootRoutes } from 'types/navigation';
import { ProductType } from 'types/resources/product';
import chooseImagesFromLibrary from 'app/services/image-picker';
import { getImgixUrl, IS_OS_IOS } from 'common/constants';
import { defaultUserPost, UserPostType } from 'types/resources/userPost';
import { sentryCapture } from 'app/services/sentry';
import Analytics from 'app/services/analytics';

import Avatar from '../profile/components/Avatar';
import PostEditContext from './context';

type PostEditNavigationProp = CompositeNavigationProp<
  StackNavigationProp<PostEditRoutes, 'PostCreate' | 'PostEdit'>,
  StackNavigationProp<RootRoutes, 'UserStack' | 'AuthStack'>
>;

const PostCreateEditSchema = Yup.object().shape({
  title: Yup.string()
    .required(i18n._(t`Title is required`))
    .max(50, i18n._(t`Maximum 50 characters allowed`)),
});

const maxSelectableImages = 5;

const initialValues = {
  title: '',
};

const PostCreateEdit = ({
  navigation,
  route,
}: {
  navigation: PostEditNavigationProp;
  route: RouteProp<PostEditRoutes, 'PostCreate' | 'PostEdit'>;
}) => {
  const { selectedTags, setSelectedTags } = useContext(PostEditContext);
  // @ts-ignore ignore
  const { product_id, user_post_id } = route.params;

  const [saving, setSaving] = useState<boolean>(false);
  const [gallery, setGallery] = useState<Array<string | Asset>>([]);
  const [termsCheck, setTermsCheck] = useState<boolean>(false);
  const [taggedProductName, setTaggedProductName] = useState<string>('');

  const { username, id: userId } = useStoreState((s) => s.user.user);
  const isEdit = !!user_post_id;

  const { data: existingPost = defaultUserPost } = useQuery<UserPostType>(
    [
      `me/posts/${user_post_id}`,
      {
        include: ['product'],
        includeFields: { product: ['short_name', 'name'] },
      },
    ],
    {
      initialData: defaultUserPost,
      enabled: isEdit,
      onSuccess: (data: UserPostType) => {
        setGallery(data.gallery);
        setSelectedTags(data.tags);
        setTaggedProductName(data.product?.shorter_name || '');
        form.setFieldValue('title', existingPost.title);
      },
    }
  );

  useEffect(() => {
    if (!userId) {
      navigation.navigate('AuthStack', { screen: 'SignUp' });
    }
    if (!isEdit && product_id) {
      setSelectedTags([product_id]);
      API.fetch<ProductType>(`products/${product_id}`)
        .then((product) => setTaggedProductName(product.shorter_name))
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickImages = () => {
    const selectionLimit = maxSelectableImages - gallery.length;
    chooseImagesFromLibrary(selectionLimit).then((assets) => {
      if (assets) {
        if ([...gallery, ...assets].length > 5) {
          Alert.alert(i18n._(t`Ｍax 5 images can be added.`));
        } else {
          setGallery([...gallery, ...assets]);
        }
      }
    });
  };

  const submit = (values: typeof initialValues) => {
    setSaving(true);
    Keyboard.dismiss();
    const files = gallery.map((img) => (typeof img === 'string' ? img : img.fileName));

    const newPost = {
      gallery: files,
      title: values.title,
      product_id: existingPost.product_id || product_id,
      tags: selectedTags,
    };

    // @ts-ignore filtered for Asset Type only
    const imagesToUpload: Asset[] = gallery.filter((img) => typeof img !== 'string');

    API[isEdit ? 'put' : 'post']<{ presignedPosts: Record<string, any>[]; id: number }>(
      isEdit ? `me/posts/${user_post_id}/edit` : 'me/posts/create',
      newPost
    )
      .then(({ presignedPosts, id: userPostId }) =>
        // upload files
        Promise.all(
          imagesToUpload.length
            ? imagesToUpload.map((img, x) => {
                const s3PresignedPost = presignedPosts[x];
                const { type, uri = '', fileName } = img;

                const formData = new FormData();
                Object.keys(s3PresignedPost.fields).forEach((key) =>
                  formData.append(key, s3PresignedPost.fields[key])
                );
                formData.append('Content-Type', type || '');
                formData.append('file', {
                  // @ts-ignore ignore
                  name: fileName || '',
                  type: type || '',
                  uri: IS_OS_IOS ? uri.replace('file://', '') : uri,
                });

                // axios doesn't work properly with multipart/form-data in RN. issue: https://github.com/axios/axios/issues/318#issuecomment-590221180
                return fetch(s3PresignedPost.url, { method: 'POST', body: formData });
              })
            : []
        ).then(() => API.put<{ id: number }>(`me/posts/${userPostId}/confirm`))
      )
      .then((post) => {
        if (isEdit) {
          Analytics.lookbookPostCreated({ postId: post.id });
        } else {
          Analytics.lookbookPostEdited({ postId: post.id });
        }
        Toast.show({
          type: 'default',
          text1: i18n._(
            t`Your post has been submitted for review. You can check its status in Account > Posts. Thanks for sharing!`
          ),
          position: 'bottom',
          bottomOffset: 120,
        });
        return navigation.goBack();
      })
      .catch((err) => {
        sentryCapture(err);
        Toast.show({
          type: 'default',
          text1: err,
          position: 'bottom',
          bottomOffset: 120,
        });
      })
      .finally(() => setSaving(false));
  };

  const form = useForm<typeof initialValues>({
    initialValues,
    submit,
    validationSchema: PostCreateEditSchema,
  });

  const canProceed = !!gallery.length && termsCheck && !!username;

  if (!userId) return null;

  return (
    <SafeAreaScreenContainer>
      <KeyboardAwareContainer>
        <ScrollContainer>
          <Box pt={6}>
            <Box px={5}>
              <Box flexDirection="row" alignItems="center">
                <Avatar />
                <ButtonBase
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => navigation.navigate('UserStack', { screen: 'ProfileForm' })}
                >
                  <Text mx={4} fontFamily="bold" color={username ? 'textBlack' : 'red'}>
                    {username || <Trans>Add Your Display Username</Trans>}
                  </Text>
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={16}
                    color={username ? theme.colors.textBlack : theme.colors.red}
                  />
                </ButtonBase>
              </Box>
              <Box mt={6}>
                <Box mb={5} width="100%">
                  <Field
                    {...form.getInputFields('title')}
                    label={i18n._(t`Title`)}
                    style={{ height: theme.constants.BUTTON_HEIGHT + 8 }}
                    maxLength={50}
                  />
                </Box>

                <ButtonBase onPress={() => navigation.navigate('PostTagSelection')}>
                  <Box style={styles.productTagBtn}>
                    {taggedProductName ? (
                      <Box py={4}>
                        <Text fontFamily="bold" fontSize={2}>
                          {taggedProductName}
                        </Text>
                        {selectedTags.length > 1 && (
                          <Text>
                            <Trans>and {selectedTags.length - 1} other product tags.</Trans>
                          </Text>
                        )}
                      </Box>
                    ) : (
                      <Text color="gray3">
                        <Trans>Add Product Tags</Trans>
                      </Text>
                    )}
                    <ChevronRight />
                  </Box>
                </ButtonBase>
              </Box>
            </Box>

            <Box mt={5}>
              {gallery.length > 0 ? (
                <>
                  <Box mx={5}>
                    <ButtonBase
                      onPress={pickImages}
                      style={{
                        ...styles.addIcon,
                        opacity: gallery.length < maxSelectableImages ? 1 : 0.4,
                      }}
                      disabled={gallery.length === maxSelectableImages}
                    >
                      <Text color="blue" fontSize={24} lineHeight={28}>
                        +
                      </Text>
                    </ButtonBase>
                  </Box>
                  <Box mt={4}>
                    <ScrollContainer horizontal>
                      {gallery.map((image, x) => (
                        <Box key={x} mr={3} ml={x === 0 ? 5 : 0}>
                          <ImageBackground
                            source={{
                              uri:
                                typeof image === 'string'
                                  ? getImgixUrl(image, { width: 124, height: 124 })
                                  : image.uri,
                            }}
                            style={styles.galleryImg}
                          >
                            <ButtonBase
                              onPress={() => setGallery(gallery.filter((i) => i !== image))}
                            >
                              <Box
                                bg="gray2"
                                width={24}
                                height={24}
                                borderRadius={4}
                                center
                                opacity={0.86}
                              >
                                <Ionicon name="ios-close" size={20} color={theme.colors.white} />
                              </Box>
                            </ButtonBase>
                          </ImageBackground>
                        </Box>
                      ))}
                    </ScrollContainer>
                  </Box>
                </>
              ) : (
                <ButtonBase onPress={pickImages}>
                  <Box
                    mx={5}
                    center
                    backgroundColor="gray7"
                    borderWidth={1}
                    borderStyle="dashed"
                    borderColor="gray3"
                    borderRadius={4}
                  >
                    <Box center height={130}>
                      <Ionicon name="add-outline" size={32} color={theme.colors.gray3} />
                      <Text mt={3} fontSize={2} textAlign="center" color="gray3">
                        <Trans>Add Photos</Trans>
                      </Text>
                    </Box>
                  </Box>
                </ButtonBase>
              )}
            </Box>
          </Box>
        </ScrollContainer>

        <Footer>
          <CheckBoxInput checked={termsCheck} onChecked={setTermsCheck}>
            <Text color="gray1" fontSize={13} lineHeight={15}>
              <Trans>I agree to share this information with Novelship and for it to use.</Trans>
            </Text>
          </CheckBoxInput>
          <Box>
            <Button
              disabled={!canProceed}
              variant="black"
              size="lg"
              text={i18n._(t`SUBMIT`)}
              loading={saving}
              onPress={() => form.submitForm()}
            />
          </Box>
        </Footer>
      </KeyboardAwareContainer>
    </SafeAreaScreenContainer>
  );
};

const styles = StyleSheet.create({
  productTagBtn: {
    borderColor: theme.colors.borderLightGray,
    borderRadius: 4,
    borderWidth: 1,
    minHeight: theme.constants.BUTTON_HEIGHT + 8,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addIcon: {
    borderWidth: 1,
    borderColor: theme.colors.blue,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  galleryImg: {
    flex: 1,
    alignItems: 'flex-end',
    width: 124,
    height: 124,
    padding: 4,
  },
});

export default PostCreateEdit;
