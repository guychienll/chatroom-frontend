import Chip from "@/components/Home/Chip";
import FeatureCard from "@/components/Home/FeatureCard";
import { QuickRegisterFormSchema } from "@/helper/validate";
import { Button, Image, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import {
    BsFillChatSquareDotsFill,
    BsFillChatSquareHeartFill,
} from "react-icons/bs";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { RiChatPrivateFill } from "react-icons/ri";

const FEATURES = [
    {
        title: "可選匿名",
        description: "可自由選擇是否匿名\n保護你的隱私",
        icon: <RiChatPrivateFill className="text-danger-300" size={120} />,
    },
    {
        title: "隨機配對",
        description: "主打隨機配對\n讓你有機會認識不同的人",
        icon: (
            <GiPerspectiveDiceSixFacesRandom
                className="text-danger-300"
                size={120}
            />
        ),
    },
    {
        title: "聊天記錄",
        description: "保留聊天記錄\n找回心儀的對象",
        icon: (
            <BsFillChatSquareHeartFill className="text-danger-300" size={120} />
        ),
    },
    {
        title: "已讀回報",
        description: "已讀回報\n讓你不會痴心空等",
        icon: (
            <BsFillChatSquareDotsFill className="text-danger-300" size={120} />
        ),
    },
];

function Home() {
    const router = useRouter();
    const [values, setValues] = useState({
        email: "",
    });
    const [errors, setErrors] = useState({
        email: "",
    });

    const handleSubmit = async () => {
        try {
            await QuickRegisterFormSchema.validate(values);
            await router.push(`/auth/register?email=${values.email}`);
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                email: err.message,
            }));
        }
    };

    return (
        <div className="min-h-[calc(100dvh-4rem)] bg-[#F7F6F2] px-4 py-6">
            <div className="content ml-auto mr-auto max-w-[1296px]">
                <div className="flex flex-col-reverse items-center justify-between px-8 md:flex-row md:px-20">
                    <div className="flex flex-col gap-y-8">
                        <div className="flex flex-col flex-wrap items-center gap-4 md:flex-row md:items-start">
                            <Chip>相遇</Chip>
                            <Chip>相知</Chip>
                            <Chip>相連</Chip>
                        </div>
                        <div className="flex flex-col items-center gap-y-8 text-xl md:items-start md:text-3xl">
                            <h3>在這裡</h3>
                            <h3>每個笑容都有其故事</h3>
                            <h3 className="text-danger">開始你的愛情冒險</h3>
                        </div>
                    </div>
                    <Image
                        src="/logo.png"
                        alt="banner"
                        className="max-w-[300px] md:max-w-[450px]"
                        width={1024}
                        height={1024}
                    />
                </div>

                <div className="join-us">
                    <div className="flex flex-col items-center gap-y-4 p-4 text-center md:p-12">
                        <h2 className="text-4xl font-bold text-danger">
                            加入我們
                        </h2>
                        <p className="text-default-500">填入信箱即可註冊</p>
                        <Input
                            name="email"
                            label="信箱"
                            className="max-w-96"
                            color="default"
                            placeholder="請填入註冊信箱"
                            value={values.email}
                            isInvalid={!!errors.email}
                            onChange={(e) =>
                                setValues((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                        />
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            color="danger"
                            variant="solid"
                            size="lg"
                        >
                            開始配對
                        </Button>
                    </div>
                </div>

                <div className="features flex flex-wrap items-center justify-evenly gap-4 p-4 text-center md:p-12">
                    {FEATURES.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
