import { Trans } from '@lingui/macro';
import { Box, Text } from 'app/components/base';
import React from 'react';
import { UserType } from 'types/resources/user';
import { VoucherType } from 'types/resources/voucher';
import RewardCard from './RewardCard';

const RewardList = ({
  title,
  vouchers,
  user,
}: {
  user: UserType;
  title: string;
  vouchers: VoucherType[];
}) => (
  <Box backgroundColor="gray7">
    <Text fontFamily="bold" px={6} py={4} fontSize={2}>
      {title}
    </Text>
    {vouchers.length ? (
      <Box>
        {vouchers.map((voucher, i) => (
          <RewardCard key={i} voucher={voucher} user={user} />
        ))}
      </Box>
    ) : (
      <Box backgroundColor="white" px={6} py={4}>
        <Text>
          <Trans>No voucher found.</Trans>
        </Text>
      </Box>
    )}
  </Box>
);

export default React.memo(RewardList);
