import * as authApi from "@/api/Auth";
import { STEP } from "@/components/Authentication/constants";
import { ForgotPasswordFormSchema } from "@/helper/validate";
import useCountDownTimer from "@/hook/useCountDownTimer";
import { useYupForm } from "@/hook/useYupForm";
import { Button, Card, CardBody, Input, Progress } from "@nextui-org/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";

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
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

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
            <CardBody className="flex flex-col">
                <Input
                    disabled={remainSec}
                    color={remainSec ? "default" : "primary"}
                    label={t["email"]}
                    placeholder={t["email_placeholder"]}
                    name="username"
                    type="email"
                    onValueChange={onValueChange("username")}
                    value={values.username}
                />
                {renderValidatorChips("username")}
                <div className="relative w-full">
                    <Input
                        disabled={!remainSec}
                        color={remainSec ? "primary" : "default"}
                        maxLength={6}
                        label={t["otp"]}
                        placeholder={t["otp_placeholder"]}
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
                    label={t["new_password"]}
                    placeholder={t["new_password_placeholder"]}
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
                    label={t["password_confirm"]}
                    placeholder={t["password_confirm_placeholder"]}
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
                        {t["change_password_button"]}
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
                        {t["send_otp_button"]}
                    </Button>
                )}
            </CardBody>
        </Card>
    );
}

export default ForgotPassword;
