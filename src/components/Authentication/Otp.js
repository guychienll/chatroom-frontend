import * as authApi from "@/api/Auth";
import { STEP } from "@/components/Authentication/constants";
import Logo from "@/components/Logo";
import useCountDownTimer from "@/hook/useCountDownTimer";
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

Otp.propTypes = {
    goTo: PropTypes.func,
    onConsumed: PropTypes.func,
    username: PropTypes.string,
};

const TOTAL_SECONDS = 60;
function Otp(props) {
    const { goTo, onConsumed, username } = props;
    const [values, setValues] = useState({
        username: username || "",
        validation: "",
    });

    const onTimeIsUp = useCallback(() => {
        setValues((prev) => ({
            ...prev,
            validation: "",
        }));
    }, []);

    const { seconds: remainSec, reset } = useCountDownTimer({
        totalSeconds: TOTAL_SECONDS,
        onTimeIsUp,
    });
    const [isOtpGenerating, setIsOtpGenerating] = useState(false);
    const [isOtpConsuming, setIsOtpConsuming] = useState(false);

    const handleSendValidationMail = async () => {
        try {
            setIsOtpGenerating(true);
            await authApi.generateOtp(values.username, "register");
            reset();
        } catch (e) {
            alert(e.message);
        } finally {
            setIsOtpGenerating(false);
        }
    };

    const handleValidate = async () => {
        try {
            setIsOtpConsuming(true);
            await authApi.consumeOtp(values.validation, "register");
            onConsumed(values.username);
            goTo(STEP.REGISTRATION);
        } catch (e) {
            alert(e.message);
        } finally {
            setIsOtpConsuming(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardHeader className="flex justify-center">
                <Logo className="text-2xl" />
            </CardHeader>
            <CardBody className="flex flex-col items-center">
                <Input
                    disabled={remainSec}
                    color={remainSec ? "default" : "primary"}
                    className="mb-2"
                    label="帳號"
                    placeholder="請輸入註冊信箱"
                    name="username"
                    type="email"
                    onChange={handleChange}
                    value={values.username}
                />
                <div className="relative mb-2 w-full">
                    <Input
                        disabled={!remainSec}
                        color={remainSec ? "primary" : "default"}
                        maxLength={6}
                        label="驗證碼"
                        placeholder="請輸入 6 位驗證碼"
                        name="validation"
                        type="text"
                        onChange={handleChange}
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
                {remainSec ? (
                    <Button
                        isLoading={isOtpConsuming}
                        className="w-full disabled:bg-default"
                        disabled={values.validation.length !== 6}
                        type="button"
                        color="danger"
                        variant="solid"
                        onClick={handleValidate}
                    >
                        前往註冊
                    </Button>
                ) : (
                    <Button
                        isLoading={isOtpGenerating}
                        className="w-full disabled:bg-default"
                        disabled={false}
                        type="button"
                        color="danger"
                        variant="solid"
                        onClick={handleSendValidationMail}
                    >
                        寄送驗證信
                    </Button>
                )}
            </CardBody>
        </Card>
    );
}

export default Otp;
