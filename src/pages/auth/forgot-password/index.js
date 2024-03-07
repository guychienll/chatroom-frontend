import ForgotPassword from "@/components/Authentication/ForgotPassword";
import Success from "@/components/Authentication/Success";
import { STEP } from "@/components/Authentication/constants";
import Redirect from "@/components/Redirect";
import { withAuthGuard } from "@/pages/hocs/AuthGuard";
import { useState } from "react";

function ForgotPasswordPage() {
    const [step, setStep] = useState(STEP.FORGOT_PASSWORD);

    const goTo = (step) => {
        setStep(step);
    };

    return (
        <div className="flex h-[calc(100dvh-4rem)] w-full items-center justify-center">
            {step === STEP.FORGOT_PASSWORD && <ForgotPassword goTo={goTo} />}
            {step === STEP.SUCCESS && <Success goTo={goTo} />}
        </div>
    );
}

export default withAuthGuard(
    () => {
        return <Redirect path="/chat" />;
    },
    () => {
        return <ForgotPasswordPage />;
    },
);
