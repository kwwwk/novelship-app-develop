import { TransactionType } from 'types/resources/transaction';

import React, { useState } from 'react';
import { Trans, t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import * as Yup from 'yup';

import { Button, Text, Box } from 'app/components/base';
import { Field } from 'app/components/form';
import { LB } from 'common/constants';
import useCurrencyUtils from 'app/hooks/useCurrencyUtils';
import ErrorMessage from 'app/components/form/ErrorMessage';
import useForm from 'app/hooks/useForm';
import API from 'common/api';
import { Alert } from 'react-native';

const APPEAL_STATUSES = {
  appeal_pending: t`I ACCEPT THE PENALTY`,
  penalty_accepted: t`PENALTY ACCEPTED`,
  'penalty_accepted-auto': t`PENALTY ACCEPTED`,
  appealed: t`APPEAL REASON SENT`,
  appeal_accepted: t`APPEAL ACCEPTED`,
  appeal_declined: t`APPEAL DECLINED`,
  'appeal_declined-auto': t`APPEAL DECLINED`,
};

const APPEAL_STATUS_DESCRIPTIONS = {
  penalty_accepted: t`You have confirmed and accepted the penalty.`,
  'penalty_accepted-auto': t`Since you haven't replied for 48 hours, the penalty has been accepted.`,
  appealed: t`We will review your appeal and reply to you via email.`,
  appeal_accepted: t`Your appeal has been accepted and the penalty has been waived.`,
  appeal_declined: t`Your appeal has been declined.`,
  'appeal_declined-auto': t`Your appeal has been declined.`,
};

const PenaltyAppealVerificationSchema = Yup.object().shape({
  penalty_appeal_reason: Yup.string().required(' '),
});

const initialValues: Partial<TransactionType> = {
  penalty_appeal_status: 'appealed',
  penalty_appeal_reason: '',
};

const PenaltyAppealForm = ({
  transaction,
  refetch,
}: {
  transaction: TransactionType;
  refetch: () => void;
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const { $$ } = useCurrencyUtils();

  const submit = (values: Partial<TransactionType>) => {
    API.put<TransactionType>(`me/sales/${transaction.ref}/penalty-appeal`, values)
      .then(refetch)
      .catch(setErrorMessage);
  };

  const acceptPenalty = () =>
    API.put<TransactionType>(`me/sales/${transaction.ref}/penalty-appeal`, {
      penalty_appeal_status: 'penalty_accepted',
    })
      .then(refetch)
      .catch(setErrorMessage);

  const acceptPenaltyAlert = () =>
    Alert.alert(
      i18n._(t`Accept Penalty`),
      i18n._(
        t`You are acknowledging and accepting the penalty of ${$$(transaction.penalty_amount)}.`
      ),
      [
        {
          text: i18n._(t`Accept`),
          onPress: acceptPenalty,
        },
        { text: i18n._(t`Cancel`), style: 'cancel' },
      ]
    );

  const submitAppealAlert = () =>
    Alert.alert(
      i18n._(t`Submit Appeal`),
      i18n._(
        t`Upon submission, we will review and respond to your appeal.${LB}Please ensure a valid email address is entered in your user account, as we will not be able to respond to private emails.`
      ),
      [
        {
          text: i18n._(t`Submit`),
          onPress: form.submitForm,
          style: 'default',
        },
        { text: i18n._(t`Cancel`), style: 'cancel' },
      ]
    );

  const form = useForm<Partial<TransactionType>>({
    initialValues,
    submit,
    validationSchema: PenaltyAppealVerificationSchema,
  });

  const showForm =
    transaction.status === 'sell_failed' &&
    transaction.penalty_reason === 'Seller Flake' &&
    transaction.penalty_appeal_status &&
    transaction.payment_penalty_ref;

  if (!showForm) return null;

  return (
    <Box maxWidth={320}>
      <Text my={4} color="red" fontSize={2} textAlign="center">
        <Trans>
          You have{' '}
          <Text color="red" fontSize={2} fontFamily="bold">
            exceeded your shipping deadlines
          </Text>{' '}
          and will be subjected to a penalty fee.
        </Trans>
      </Text>

      <Button
        mt={4}
        variant="black"
        onPress={() => acceptPenaltyAlert()}
        disabled={transaction.penalty_appeal_status !== 'appeal_pending'}
        text={i18n._(APPEAL_STATUSES[transaction.penalty_appeal_status])}
      />

      {transaction.penalty_appeal_status === 'appeal_pending' ? (
        <>
          <Text my={6} fontSize={2} textAlign="center">
            <Trans>Or you can submit an appeal</Trans>
          </Text>

          <Box mt={3}>
            <Box>
              <Box>
                <Field
                  multiline
                  maxLength={140}
                  label="Appeal reason"
                  style={{ height: 140, maxWidth: '100%', textAlignVertical: 'top' }}
                  {...form.getInputFields('penalty_appeal_reason')}
                />
                <ErrorMessage mt={1}>{errorMessage}</ErrorMessage>
              </Box>

              <Box pb={2}>
                <Button
                  variant="white"
                  onPress={() => submitAppealAlert()}
                  text={i18n._(t`SUBMIT APPEAL`)}
                />
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Text mt={6} fontSize={2} textAlign="center">
          {i18n._(APPEAL_STATUS_DESCRIPTIONS[transaction.penalty_appeal_status])}
        </Text>
      )}

      {[
        'penalty_accepted',
        'penalty_accepted-auto',
        'appeal_declined',
        'appeal_declined-auto',
      ].includes(transaction.penalty_appeal_status) && (
        <Text fontSize={2} textAlign="center">
          <Trans>
            The penalty is{' '}
            <Text fontSize={2} fontFamily="bold">
              {$$(transaction.penalty_amount)}
            </Text>
          </Trans>
        </Text>
      )}
    </Box>
  );
};

export default PenaltyAppealForm;
