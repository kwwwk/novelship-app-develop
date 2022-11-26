import React, { useState } from 'react';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { PostEditRoutes } from 'types/navigation';
import PostCreateEdit from './PostCreateEdit';
import UserPostHeader from './components/PostEditHeader';
import PostTagSelection from './PostTagSelection';
import PostEditContext from './context';

const PostEditStack = createStackNavigator<PostEditRoutes>();

const PostEdit = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  return (
    <PostEditContext.Provider value={{ selectedTags, setSelectedTags }}>
      <PostEditStack.Navigator
        screenOptions={{
          // @ts-ignore rn-navigation not supporting proper types
          header: (props) => <UserPostHeader {...props} />,
          headerMode: 'float',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <PostEditStack.Screen
          name="PostCreate"
          component={PostCreateEdit}
          options={{ headerTitle: i18n._(t`SHARE MY POST`) }}
        />
        <PostEditStack.Screen
          name="PostEdit"
          component={PostCreateEdit}
          options={{ headerTitle: i18n._(t`EDIT MY POST`) }}
        />
        <PostEditStack.Screen
          name="PostTagSelection"
          component={PostTagSelection}
          options={{ headerTitle: i18n._(t`ADD PRODUCT TAGS`) }}
        />
      </PostEditStack.Navigator>
    </PostEditContext.Provider>
  );
};

export default PostEdit;
