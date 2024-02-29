import dynamic from "next/dynamic";
import { useState } from "react";
import { STEP } from "./constants";
import { Spinner } from "@nextui-org/react";

const Login = dynamic(() => import("./Login"), {
    loading: () => <Spinner />,
});
const Otp = dynamic(() => import("./Otp"), {
    loading: () => <Spinner />,
});
const Registration = dynamic(() => import("./Registration"), {
    loading: () => <Spinner />,
});
const Success = dynamic(() => import("./Success"), {
    loading: () => <Spinner />,
});

const ForgotPassword = dynamic(() => import("./ForgotPassword"), {
    loading: () => <Spinner />,
});

function Auth() {
    const [username, setUsername] = useState("");
    const [step, setStep] = useState(STEP.LOGIN);

    const goTo = (step) => {
        setStep(step);
    };

    return (
        <div>
            {step === STEP.LOGIN && <Login goTo={goTo} />}
            {step === STEP.OTP && (
                <Otp
                    onConsumed={(uname) => {
                        setUsername(uname);
                    }}
                    goTo={goTo}
                />
            )}
            {step === STEP.REGISTRATION && (
                <Registration username={username} goTo={goTo} />
            )}
            {step === STEP.SUCCESS && <Success goTo={goTo} />}
            {step === STEP.FORGOT_PASSWORD && <ForgotPassword goTo={goTo} />}
        </div>
    );
}
export default Auth;
