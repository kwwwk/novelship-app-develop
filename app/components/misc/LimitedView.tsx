import * as React from 'react';
import { useContext, useState, createContext, useEffect } from 'react';

import useToggle from 'app/hooks/useToggle';

type LimitedViewContextType = {
  shouldShowItem: (i: number) => boolean;
  toggleAllVisible: () => void;
  allVisible: boolean;
  isCollapsibleDisabled: boolean;
  setIsCollapsibleDisabled: (_: boolean) => void;
  limit: number;
};

const LimitedViewContext = createContext<LimitedViewContextType>({
  shouldShowItem: () => false,
  toggleAllVisible: () => {},
  allVisible: false,
  isCollapsibleDisabled: false,
  setIsCollapsibleDisabled: () => {},
  limit: 0,
});

const LimitedViewContainer = ({
  limit,
  showAll = false,
  children,
}: {
  limit: number;
  showAll?: boolean;
  children: React.ReactNode;
}) => {
  const [allVisible, toggleAllVisible] = useToggle(showAll);
  const [isCollapsibleDisabled, setIsCollapsibleDisabled] = useState<boolean>(showAll);

  const shouldShowItem = (i: number) => allVisible || i < limit;

  return (
    <LimitedViewContext.Provider
      value={{
        shouldShowItem,
        toggleAllVisible,
        allVisible,
        isCollapsibleDisabled,
        setIsCollapsibleDisabled,
        limit,
      }}
    >
      {children}
    </LimitedViewContext.Provider>
  );
};

const LimitedViewContent = ({ children }: { children: React.ReactNode[] }) => {
  const { shouldShowItem, setIsCollapsibleDisabled, limit } = useContext(LimitedViewContext);

  useEffect(() => {
    if (children && children.length <= limit) {
      setIsCollapsibleDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <>
      {children.map((child, index) => (
        <React.Fragment key={index}>{shouldShowItem(index) ? child : null}</React.Fragment>
      ))}
    </>
  );
};

const LimitedViewShowMore = ({ children }: { children: React.ReactElement }) => {
  const { toggleAllVisible, isCollapsibleDisabled, allVisible } = useContext(LimitedViewContext);

  return !allVisible && !isCollapsibleDisabled
    ? React.cloneElement(children, { onPress: toggleAllVisible })
    : null;
};

const LimitedViewShowLess = ({ children }: { children: React.ReactElement }) => {
  const { toggleAllVisible, isCollapsibleDisabled, allVisible } = useContext(LimitedViewContext);

  return allVisible && !isCollapsibleDisabled
    ? React.cloneElement(children, { onPress: toggleAllVisible })
    : null;
};

export default {
  Container: LimitedViewContainer,
  Content: LimitedViewContent,
  ShowMore: LimitedViewShowMore,
  ShowLess: LimitedViewShowLess,
};
