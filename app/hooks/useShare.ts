// Unused
import { Share, ShareContent, ShareOptions } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { useRoute } from '@react-navigation/core';
import envConstants from 'app/config';

const useShare = ({ link, text }: { link?: string; text: string }) => {
  const route = useRoute();
  const buildLink = useLinkBuilder();

  const routerLink = buildLink(route.name, route.params);
  const shareUrl = link || `${envConstants.WEB_APP_URL}${routerLink?.replace(/\//, '')}`;
  const shareContent: ShareContent = {
    message: `${text}\n${shareUrl}`,
    // ?: use on iOS
    url: shareUrl,
    title: text,
  };
  const shareOptions: ShareOptions = {
    dialogTitle: text,
    subject: text,
  };
  return () => {
    Share.share(shareContent, shareOptions);
  };
};

export default useShare;
