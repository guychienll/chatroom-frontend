import { STEP } from "@/components/Authentication/constants";
import Redirect from "@/components/Redirect";
import { Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { withAuthGuard } from "../../hocs/AuthGuard";

const Login = dynamic(() => import("@/components/Authentication/Login"), {
    loading: () => <Spinner />,
});

const Otp = dynamic(() => import("@/components/Authentication/Otp"), {
    loading: () => <Spinner />,
});

const Success = dynamic(() => import("@/components/Authentication/Success"), {
    loading: () => <Spinner />,
});

function AuthPage() {
    const [step, setStep] = useState(STEP.LOGIN);

    const goTo = (step) => {
        setStep(step);
    };

    return (
        <div className="flex  h-[calc(100dvh-4rem)] items-center justify-center">
            {step === STEP.LOGIN && <Login goTo={goTo} />}
            {step === STEP.OTP && <Otp goTo={goTo} />}
            {step === STEP.SUCCESS && <Success goTo={goTo} />}
        </div>
    );
}

export default withAuthGuard(
    () => {
        return <Redirect path="/chat" />;
    },
    () => {
        return <AuthPage />;
    },
);
