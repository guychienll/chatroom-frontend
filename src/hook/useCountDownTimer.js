import { useEffect, useCallback, useState } from "react";

const useCountDownTimer = ({ onTimeIsUp = () => {}, totalSeconds = 60 }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (seconds <= 0) {
            onTimeIsUp();
            return;
        }
        const timer = setTimeout(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [seconds, onTimeIsUp]);

    const reset = useCallback(() => {
        setSeconds(totalSeconds);
    }, [totalSeconds]);

    return {
        seconds,
        reset,
    };
};

export default useCountDownTimer;
