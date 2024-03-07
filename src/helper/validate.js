import { object, string } from "yup";

const Email = string().required("請填入信箱").email("請填入合法信箱");
const Password = string().required("請填入密碼").min(8, "密碼至少 8 位");
const PasswordConfirm = string().test(
    "password confirm",
    "密碼不一致",
    function (value) {
        return this.parent.password === value;
    },
);
const Otp = string().required("請填入驗證碼").length(6, "驗證碼為 6 位數");

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
