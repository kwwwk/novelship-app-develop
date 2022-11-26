import * as React from 'react';

import { Box, Button, Text } from 'app/components/base';
import theme from 'app/styles/theme';

const UserDashboardSectionTitle = ({
  title,
  onPress = () => {},
  buttonText,
  children,
  ...props
}: {
  title: string;
  onPress: () => void;
  buttonText?: string;
  children?: React.ReactNode;
}) => (
  <Box style={{ borderColor: theme.colors.dividerGray, borderBottomWidth: 1 }}>
    <Box
      width="100%"
      mt={5}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <Box width="70%">
        <Text mr={4} fontSize={3} fontFamily="bold">
          {title}
        </Text>
      </Box>
      <Button variant="white" text={buttonText} onPress={onPress} size="xs" width={64} />
    </Box>
    {children}
  </Box>
);

export default UserDashboardSectionTitle;
