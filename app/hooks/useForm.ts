import { useFormik } from 'formik';
import { useRef } from 'react';
import { AnyObjectSchema } from 'yup';

const useForm = <T>({
  initialValues,
  submit,
  validationSchema,
}: {
  initialValues: T;
  submit: (arg: T) => void;
  validationSchema?: AnyObjectSchema;
}) => {
  const {
    values,
    errors,
    touched,
    submitForm,
    handleChange,
    handleBlur,
    setErrors,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: submit,
    validationSchema,
  });
  const isSubmitRequested = useRef(false);

  const getInputFields = (field: keyof T, type?: 'text' | 'password' | 'select') => {
    const fields = {
      name: field,
      value: values[field],
      error: errors[field],
      touched: touched[field],
      onChangeText: handleChange(field),
      onChecked: () => setFieldValue(String(field), !values[field]),
      onBlur: handleBlur(field),
      checked: !!values[field],
      hasError: !!(errors[field] && touched[field]),
    };

    if (type === 'password') {
      // @ts-ignore extend
      fields.textContentType = 'password';
    }

    return fields;
  };

  // show this error only on submit press
  const formValidationError =
    isSubmitRequested.current && Object.keys(errors).length !== 0
      ? 'Please correct the information above'
      : false;

  return {
    submitForm: () => {
      isSubmitRequested.current = true;
      return submitForm();
    },
    getInputFields,
    setFieldValue,
    setErrors,
    formValidationError,
  };
};

export default useForm;
