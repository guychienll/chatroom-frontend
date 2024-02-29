import * as authApi from "@/api/Auth";
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
import { STEP } from "./constants";

ForgotPassword.propTypes = {
    goTo: PropTypes.func,
};

const TOTAL_SECONDS = 60;

function ForgotPassword(props) {
    const { goTo } = props;
    const [values, setValues] = useState({
        username: "",
        validation: "",
        password: "",
        confirm: "",
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

    const handleGenerateOtp = async () => {
        try {
            setIsOtpGenerating(true);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardHeader>
                <div className="w-full text-center text-2xl font-extrabold italic tracking-wider text-danger">
                    ChatRoom
                </div>
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
                <Input
                    disabled={!remainSec}
                    color={remainSec ? "primary" : "default"}
                    className="mb-2"
                    label="新密碼"
                    placeholder="請輸入欲更改密碼"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    value={values.password}
                />
                <Input
                    disabled={!remainSec}
                    color={remainSec ? "primary" : "default"}
                    className="mb-2"
                    label="確認密碼"
                    placeholder="請再次輸入欲更改密碼"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    value={values.confirm}
                />
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
