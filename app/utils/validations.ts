import * as yup from "yup";

// Video game validation schema
export const gameValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 100 characters")
    .required("Required"),
  publisher: yup
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters")
    .required("Required"),
  developer: yup
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters")
    .required("Required"),
});

// Login validation form
export const loginValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Required"),
  password: yup.string().required("Required"),
});

// Register form validation
export const registerFormValidation = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Required"),
  password: yup
    .string()
    .required("Required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/,
      "Your password must be at least 10 characters long, have a letter, a number and a special symbol."
    ),
});
