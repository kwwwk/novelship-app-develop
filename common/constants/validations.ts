import { t } from '@lingui/macro';
import { i18n } from '@lingui/core';
import * as Yup from 'yup';

const validName = new RegExp(/^[a-zA-Z]*((\s)*[a-zA-Z])*\s*$/);

const passwordYupValidation = Yup.string()
  .required(i18n._(t`Password is required`))
  .min(8, i18n._(t`Password must have at least 8 characters`))
  .max(256, i18n._(t`Password must be less than 256 characters`))
  .matches(/\w*[a-z]\w*/, i18n._(t`Password must have a lowercase letter`))
  .matches(/\w*[A-Z]\w*/, i18n._(t`Password must have a capital letter`))
  .matches(/\d/, i18n._(t`Password must have a number`));

const checkPassword = (password: string, errors: Record<string, string>) => {
  if (!password) {
    errors.password = i18n._(t`Password is required`);
  } else if (password.length < 8) {
    errors.password = i18n._(t`Password must have at least 8 characters`);
  } else if (password.length > 256) {
    errors.password = i18n._(t`Password must be less than 256 characters`);
  } else if (!/\w*[a-z]\w*/.test(password)) {
    errors.password = i18n._(t`Password must have a lowercase letter`);
  } else if (!/\w*[A-Z]\w*/.test(password)) {
    errors.password = i18n._(t`Password must have a capital letter`);
  } else if (!/\d/.test(password)) {
    errors.password = i18n._(t`Password must have a number`);
  }
  return errors;
};

export { validName, passwordYupValidation, checkPassword };
