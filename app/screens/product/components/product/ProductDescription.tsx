import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { Box, Text } from 'app/components/base';

const ProductDescription = ({ description }: { description: string }) => {
  const [isShowMore, setIsShowMore] = useState(false);

  return (
    <Box>
      <Text
        numberOfLines={isShowMore ? undefined : 2}
        fontSize={2}
        color="gray1"
        lineHeight={22}
        mt={3}
        textAlign="justify"
      >
        {description}
      </Text>

      <Text
        p={3}
        pl={0}
        fontSize={2}
        fontFamily="medium"
        textDecorationLine="underline"
        onPress={() => setIsShowMore((_isShowMore) => !_isShowMore)}
      >
        {isShowMore ? <Trans>Read Less</Trans> : <Trans>Read More</Trans>}
      </Text>
    </Box>
  );
};
export default ProductDescription;
