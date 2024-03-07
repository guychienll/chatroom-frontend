import { STEP } from "@/components/Authentication/constants";
import Redirect from "@/components/Redirect";
import { withAuthGuard } from "@/pages/hocs/AuthGuard";
import { Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";

const Otp = dynamic(() => import("@/components/Authentication/Otp"), {
    loading: () => <Spinner />,
});
const Registration = dynamic(
    () => import("@/components/Authentication/Registration"),
    {
        loading: () => <Spinner />,
    },
);
const Success = dynamic(() => import("@/components/Authentication/Success"), {
    loading: () => <Spinner />,
});

function RegisterPage() {
    const router = useRouter();
    const { query } = router;
    const { email = "" } = query;
    const [username, setUsername] = useState(email || "");
    const [step, setStep] = useState(STEP.OTP);

    const goTo = (step) => {
        setStep(step);
    };

    return (
        <div className="flex h-[calc(100dvh-4rem)] w-full items-center justify-center">
            {step === STEP.OTP && (
                <Otp
                    username={username}
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
        </div>
    );
}

export default withAuthGuard(
    () => {
        return <Redirect path="/chat" />;
    },
    () => {
        return <RegisterPage />;
    },
);
