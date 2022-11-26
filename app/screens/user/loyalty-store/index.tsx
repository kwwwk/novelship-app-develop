import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { Box } from 'app/components/base';
import { ScrollContainer } from 'app/components/layout';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { useStoreState } from 'app/store';
import API from 'common/api';
import React, { useEffect, useState } from 'react';
import { VoucherList, VoucherType } from 'types/resources/voucher';
import RewardList from './components/RewardList';

type VouchersByCategoryType = {
  Shipping: VoucherType[];
  Sneakers: VoucherType[];
  Apparel: VoucherType[];
  Collectibles: VoucherType[];
};

const RedeemPoints = () => {
  const user = useStoreState((s) => s.user.user);
  const currency = useStoreState((s) => s.currency.current);
  const [loading, setLoading] = useState<boolean>(false);

  const voucherParams = { page: { size: 1000 } };

  const [vouchers, setVouchers] = useState<VouchersByCategoryType>({
    Shipping: [],
    Sneakers: [],
    Apparel: [],
    Collectibles: [],
  });

  useEffect(() => {
    setLoading(true);
    let voucherList: VoucherType[];

    API.fetch<{ results: VoucherType[] }>('vouchers', {
      ...voucherParams,
      filter: { currency_id: currency.id },
    })
      .then(({ results }) => {
        voucherList = results;
        return API.fetch<{ results: VoucherList[] }>('me/vouchers', voucherParams);
      })
      .then(({ results }) => {
        const myVouchers = results || [];
        const tempVouchers: VouchersByCategoryType = {
          Shipping: [],
          Sneakers: [],
          Apparel: [],
          Collectibles: [],
        };

        for (const voucher of voucherList) {
          voucher.brought = myVouchers.filter((v) => v.voucher_id === voucher.id).length;
          tempVouchers[voucher.category].push(voucher);
        }

        setVouchers(tempVouchers);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.points]);

  return (
    <Box flex={1}>
      {loading ? (
        <Box center width="100%" height="100%">
          <LoadingIndicator size="large" />
        </Box>
      ) : (
        <ScrollContainer>
          <RewardList
            title={i18n._(t`SHIPPING PROMOCODES`)}
            vouchers={vouchers.Shipping}
            user={user}
          />
          <RewardList
            title={i18n._(t`SNEAKER PROMOCODES`)}
            vouchers={vouchers.Sneakers}
            user={user}
          />
          <RewardList
            title={i18n._(t`APPAREL PROMOCODES`)}
            vouchers={vouchers.Apparel}
            user={user}
          />
          <RewardList
            title={i18n._(t`COLLECTIBLE PROMOCODES`)}
            vouchers={vouchers.Collectibles}
            user={user}
          />
          <Box mt={5} />
        </ScrollContainer>
      )}
    </Box>
  );
};

export default RedeemPoints;
