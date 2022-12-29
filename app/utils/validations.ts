import * as Yup from "yup";

/**
 * Video game form validation
 */
export const gameValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 100 characters")
    .required("Required"),
  publisher: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters")
    .required("Required"),
  developer: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters")
    .required("Required"),
});
