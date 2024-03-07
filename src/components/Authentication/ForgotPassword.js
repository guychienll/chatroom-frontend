import * as authApi from "@/api/Auth";
import { STEP } from "@/components/Authentication/constants";
import Logo from "@/components/Logo";
import { ForgotPasswordFormSchema } from "@/helper/validate";
import useCountDownTimer from "@/hook/useCountDownTimer";
import { useYupForm } from "@/hook/useYupForm";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Progress,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";

ForgotPassword.propTypes = {
    goTo: PropTypes.func,
};

const TOTAL_SECONDS = 60;

function ForgotPassword(props) {
    const { goTo } = props;
    const {
        values,
        isValid,
        onValueChange,
        renderValidatorChips,
        getFiledValid,
    } = useYupForm(
        {
            username: "",
            validation: "",
            password: "",
            confirm: "",
        },
        ForgotPasswordFormSchema,
    );

    const onTimeIsUp = useCallback(() => {
        onValueChange("validation")("");
    }, [onValueChange]);

    const { seconds: remainSec, reset } = useCountDownTimer({
        totalSeconds: TOTAL_SECONDS,
        onTimeIsUp,
    });

    const [isOtpGenerating, setIsOtpGenerating] = useState(false);
    const [isOtpConsuming, setIsOtpConsuming] = useState(false);

    const handleGenerateOtp = async () => {
        try {
            setIsOtpGenerating(true);
            if (!getFiledValid("username")) {
                return;
            }
            await authApi.generateOtp(values.username, "forgot-password");
            reset();
        } catch (e) {
            alert(e.message);
        } finally {
            setIsOtpGenerating(false);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            if (!isValid) {
                return;
            }
            setIsOtpConsuming(true);
            await authApi.updatePassword({
                password: values.password,
                otp: values.validation,
                otpType: "forgot-password",
            });
            goTo(STEP.SUCCESS);
        } catch (e) {
            alert(e.message);
        } finally {
            setIsOtpConsuming(false);
        }
    };

    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardHeader className="flex justify-center">
                <Logo className="text-2xl" />
            </CardHeader>
            <CardBody className="flex flex-col">
                <Input
                    disabled={remainSec}
                    color={remainSec ? "default" : "primary"}
                    label="帳號"
                    placeholder="請輸入註冊信箱"
                    name="username"
                    type="email"
                    onValueChange={onValueChange("username")}
                    value={values.username}
                />
                {renderValidatorChips("username")}

                <div className="relative mb-2 w-full">
                    <Input
                        disabled={!remainSec}
                        color={remainSec ? "primary" : "default"}
                        maxLength={6}
                        label="驗證碼"
                        placeholder="請輸入 6 位驗證碼"
                        name="validation"
                        type="text"
                        onValueChange={onValueChange("validation")}
                        value={values.validation}
                        autoComplete="new-password"
                    />
                    <Progress
                        aria-label="remaining seconds"
                        minValue={0}
                        maxValue={TOTAL_SECONDS}
                        color="danger"
                        value={remainSec}
                        size="sm"
                        className="absolute right-[12px] top-[13px] max-w-[75%]"
                        isStriped
                    />
                </div>
                {renderValidatorChips("validation")}
                <Input
                    disabled={!remainSec}
                    color={remainSec ? "primary" : "default"}
                    className="mb-2"
                    label="新密碼"
                    placeholder="請輸入欲更改密碼"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    onValueChange={onValueChange("password")}
                    value={values.password}
                />
                {renderValidatorChips("password")}
                <Input
                    disabled={!remainSec}
                    color={remainSec ? "primary" : "default"}
                    className="mb-2"
                    label="確認密碼"
                    placeholder="請再次輸入欲更改密碼"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    onValueChange={onValueChange("confirm")}
                    value={values.confirm}
                />
                {renderValidatorChips("confirm")}
                {remainSec ? (
                    <Button
                        isLoading={isOtpConsuming}
                        className="w-full disabled:bg-default"
                        disabled={values.validation.length !== 6}
                        type="button"
                        color="danger"
                        variant="solid"
                        onClick={handleUpdatePassword}
                    >
                        更改密碼
                    </Button>
                ) : (
                    <Button
                        isLoading={isOtpGenerating}
                        className="w-full disabled:bg-default"
                        disabled={false}
                        type="button"
                        color="danger"
                        variant="solid"
                        onClick={handleGenerateOtp}
                    >
                        寄送驗證信
                    </Button>
                )}
            </CardBody>
        </Card>
    );
}

export default ForgotPassword;
