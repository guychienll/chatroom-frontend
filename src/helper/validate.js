import { object, string } from "yup";

const Email = string()
    .required("validation_required")
    .email("validation_email");

const Password = string()
    .required("validation_required")
    .min(8, "validation_more_than_8");

const PasswordConfirm = string().test(
    "password-match",
    "validation_password_match",
    function (value) {
        return this.parent.password === value;
    },
);
const Otp = string()
    .required("validation_required")
    .length(6, "validation_6_digits");

const QuickRegisterFormSchema = object({
    email: Email,
});

const LoginFormSchema = object({
    username: Email,
    password: Password,
});

const ForgotPasswordFormSchema = object({
    username: Email,
    validation: Otp,
    password: Password,
    confirm: PasswordConfirm,
});

const OtpFormSchema = object({
    username: Email,
    validation: Otp,
});

const RegistrationFormSchema = object({
    username: Email,
    password: Password,
    confirm: PasswordConfirm,
});

export {
    ForgotPasswordFormSchema,
    LoginFormSchema,
    OtpFormSchema,
    QuickRegisterFormSchema,
    RegistrationFormSchema,
};
