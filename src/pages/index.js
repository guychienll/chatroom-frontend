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
import { useIntl } from "react-intl";

function Home() {
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

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

    const FEATURES = [
        {
            title: t["feature_1_title"],
            description: t["feature_1_description"],
            icon: <RiChatPrivateFill className="text-danger-300" size={120} />,
        },
        {
            title: t["feature_2_title"],
            description: t["feature_2_description"],
            icon: (
                <GiPerspectiveDiceSixFacesRandom
                    className="text-danger-300"
                    size={120}
                />
            ),
        },
        {
            title: t["feature_3_title"],
            description: t["feature_3_description"],
            icon: (
                <BsFillChatSquareHeartFill
                    className="text-danger-300"
                    size={120}
                />
            ),
        },
        {
            title: t["feature_4_title"],
            description: t["feature_4_description"],
            icon: (
                <BsFillChatSquareDotsFill
                    className="text-danger-300"
                    size={120}
                />
            ),
        },
    ];

    return (
        <div className="min-h-[calc(100dvh-4rem)] bg-[#F7F6F2] px-4 py-6">
            <div className="content ml-auto mr-auto max-w-[1296px]">
                <div className="flex flex-col-reverse items-center justify-between px-8 md:flex-row md:px-20">
                    <div className="flex flex-col gap-y-8">
                        <div className="flex flex-col flex-wrap items-center gap-4 md:flex-row md:items-start">
                            <Chip>{t["hero_chip_1"]}</Chip>
                            <Chip>{t["hero_chip_2"]}</Chip>
                            <Chip>{t["hero_chip_3"]}</Chip>
                        </div>
                        <div className="flex flex-col items-center gap-y-8 text-xl md:items-start md:text-3xl">
                            <h3>{t["hero_slogan_1"]}</h3>
                            <h3>{t["hero_slogan_2"]}</h3>
                            <h3 className="text-danger">
                                {t["hero_slogan_3"]}
                            </h3>
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
                            {t["join_us"]}
                        </h2>
                        <p className="text-default-500">
                            {t["join_us_description"]}
                        </p>
                        <Input
                            name="email"
                            label={t["email"]}
                            className="max-w-96"
                            color="default"
                            placeholder={t["email_placeholder"]}
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
                            {t["join_us_button"]}
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
