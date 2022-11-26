import React, { useState } from 'react';
import { Box, Button, Text } from 'app/components/base';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { TransactionType } from 'types/resources/transaction';
import ConfirmDialog from 'app/components/dialog/ConfirmDialog';
import { expireIn, toTime } from 'common/utils/time';
import API from 'common/api';
import LoadingIndicator from 'app/components/misc/LoadingIndicator';
import { LB } from 'common/constants';

interface ShipmentDecisionProps {
  transaction: TransactionType;
  refetch: () => void;
}

const ShipmentDecisionForm: React.FC<ShipmentDecisionProps> = ({ transaction, refetch }) => {
  const [operation, setOperation] = useState<null | 'same_deadline' | 'one_day' | 'cancel'>(null);
  const [loading, setLoading] = useState(false);

  const { reminded_to_ship, shipping_deadline_extended, shipping_deadline, cancel_reason } =
    transaction;
  const shippingDeadline = shipping_deadline_extended || shipping_deadline;

  const _hoursLeftToShip = expireIn(shippingDeadline, 'hour').split(' ')[0];
  const hoursLeftToShip = parseInt(_hoursLeftToShip);

  if (!hoursLeftToShip) {
    if (cancel_reason) {
      return (
        <Text textAlign="center" fontSize={2} color="red" my={4}>
          <Trans>
            You have{' '}
            <Text fontSize={2} color="red" fontFamily="bold">
              exceeded your shipping deadline
            </Text>{' '}
            and will be subjected to a penalty fee. Please allow up to 1 hour for the status to be
            reflected.
          </Trans>
        </Text>
      );
    }
    return null;
  }

  if (!shipping_deadline_extended && hoursLeftToShip > 24) {
    return null;
  }

  const oneDayExtensionTaken =
    shipping_deadline_extended && shipping_deadline_extended !== shipping_deadline;

  const actions: {
    text: string;
    action: 'same_deadline' | 'one_day' | 'cancel';
    isShown: boolean;
  }[] =
    cancel_reason || (reminded_to_ship === 'last' && shipping_deadline_extended)
      ? []
      : [
          {
            text: i18n._(
              t`I WILL SEND OUT BY ${toTime(shippingDeadline, 'D/M')} ${toTime(shippingDeadline)}`
            ),
            action: 'same_deadline',
            isShown: oneDayExtensionTaken ? hoursLeftToShip <= 12 : true,
          },
          {
            text: i18n._(t`I WILL NEED 24 HOUR EXTENSION`),
            action: 'one_day',
            isShown: !shipping_deadline_extended,
          },
          {
            text: i18n._(t`I WANT TO CANCEL THIS SALE`),
            action: 'cancel',
            isShown: oneDayExtensionTaken ? hoursLeftToShip <= 12 : true,
          },
        ];

  const onSubmit = () => {
    setLoading(true);
    API.put(`me/sales/${transaction.ref}/extension`, { operation })
      .then(() => {
        setLoading(false);
        refetch();
      })
      .catch(() => setLoading(false));
  };

  return (
    <>
      {!shipping_deadline_extended && !cancel_reason && (
        <>
          <Text textAlign="center" fontSize={2} color="red" mt={3}>
            <Trans>
              You have{' '}
              <Text fontSize={2} color="red" fontFamily="bold">
                less than 24 hours
              </Text>{' '}
              to ship your item.
            </Trans>
          </Text>
          <Text color="red" fontSize={2}>
            <Trans>Please ship your product ASAP.</Trans>
          </Text>
        </>
      )}

      {cancel_reason ? (
        <Text textAlign="center" fontSize={2} color="red" my={4}>
          <Trans>
            You have chosen to cancel this transaction and be subjected to{' '}
            <Text fontSize={2} color="red" fontFamily="bold">
              a penalty fee.
            </Text>{' '}
            Please allow up to 1 hour for the status to be reflected.
          </Trans>
        </Text>
      ) : (
        shipping_deadline_extended &&
        (shipping_deadline_extended === shipping_deadline ? (
          <Box center my={4}>
            <Text textAlign="center" fontSize={2} color="red">
              <Trans>
                You have confirmed to send out by{' '}
                <Text fontSize={2} color="red" fontFamily="bold">
                  {toTime(shipping_deadline_extended, 'D/M')} {toTime(shipping_deadline_extended)}.
                </Text>
              </Trans>
              {LB}
              <Trans>Please send out the product ASAP to avoid penalty fee.</Trans>
            </Text>
          </Box>
        ) : (
          <Box center my={4}>
            <Text textAlign="center" fontSize={2} color="red">
              <Trans>
                Final Deadline{' '}
                <Text fontSize={2} color="red" fontFamily="bold">
                  {toTime(shipping_deadline_extended, 'D/M')} {toTime(shipping_deadline_extended)}.
                </Text>
              </Trans>
              {LB}
              <Trans>
                Please send out the product before deadline to{' '}
                <Text fontSize={2} color="red" fontFamily="bold">
                  avoid penalty fee.
                </Text>
              </Trans>
            </Text>
          </Box>
        ))
      )}

      {loading ? (
        <Box center>
          <LoadingIndicator size="small" />
        </Box>
      ) : (
        actions.map(
          ({ text, action, isShown }, x) =>
            isShown && (
              <Box width="100%" mt={3} key={x}>
                <Button
                  variant="red-inverted"
                  size="xs"
                  onPress={() => setOperation(action)}
                  text={text}
                  style={{ height: 35 }}
                />
              </Box>
            )
        )
      )}

      <ConfirmDialog
        isOpen={!!operation}
        onClose={() => setOperation(null)}
        onConfirm={() => onSubmit()}
        title={i18n._(t`CONFIRM`)}
        confirmText={i18n._(t`CONFIRM`)}
      >
        <Box my={6}>
          {operation === 'same_deadline' ? (
            <Text fontSize={2} textAlign="center">
              <Trans>
                I will send out the item by{' '}
                <Text fontSize={2} fontFamily="bold">
                  {toTime(shippingDeadline, 'D/M')} {toTime(shippingDeadline)}.
                </Text>
              </Trans>
            </Text>
          ) : operation === 'one_day' ? (
            <Text fontSize={2} textAlign="center">
              <Trans>
                I will need{' '}
                <Text fontSize={2} fontFamily="bold">
                  24 hours extension.
                </Text>
              </Trans>
            </Text>
          ) : (
            <Text fontSize={2} textAlign="center">
              <Trans>
                You are choosing to{' '}
                <Text fontSize={2} fontFamily="bold">
                  cancel your transaction.
                </Text>{' '}
                Please be informed that you will be subjected to a{' '}
                <Text fontSize={2} color="red" fontFamily="bold">
                  penalty fee.
                </Text>
              </Trans>
            </Text>
          )}
          <Text fontSize={2} mt={2} textAlign="center">
            <Trans>Notice! The selection is final and cannot be changed.</Trans>
          </Text>
        </Box>
      </ConfirmDialog>
    </>
  );
};

export default ShipmentDecisionForm;
