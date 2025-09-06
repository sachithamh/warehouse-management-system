import * as yup from 'yup';

export const emailSchema = yup.string().email().required();
export const passwordSchema = yup.string().min(6).required();
