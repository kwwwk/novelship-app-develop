import { useNavigationState, useRoute } from '@react-navigation/native';

const useIsFirstRouteInParent = () => {
  const route = useRoute();
  const isFirstRouteInParent = useNavigationState((state) => state.routes[0].key === route.key);

  return isFirstRouteInParent;
};

export default useIsFirstRouteInParent;
