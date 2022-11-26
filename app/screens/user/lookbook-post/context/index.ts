import { createContext } from 'react';

export type PostEditContextType = {
  selectedTags: number[];
  setSelectedTags: (tags: number[]) => void;
};

const PostEditContext = createContext<PostEditContextType>({
  selectedTags: [],
  setSelectedTags: () => {},
});

export default PostEditContext;
