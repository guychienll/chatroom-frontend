import * as authApi from "@/api/Auth";
import * as userApi from "@/api/User";
import Logo from "@/components/Logo";
import { LoginFormSchema } from "@/helper/validate";
import useUserStore from "@/stores/user";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useYupForm } from "../../hook/useYupForm";

Login.propTypes = {};

function Login() {
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];
    const { values, isValid, onValueChange, renderValidatorChips } = useYupForm(
        {
            username: "",
            password: "",
        },
        LoginFormSchema,
    );

    const [loading, setLoading] = useState(false);
    const setProfile = useUserStore((state) => state.setProfile);

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            if (!isValid) {
                return;
            }

            await authApi.login(values);
            const profile = await userApi.profile(values);

            setProfile(profile);
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardHeader className="flex justify-center">
                <Logo className="text-2xl" />
            </CardHeader>
            <CardBody>
                <form onSubmit={onSubmit}>
                    <Input
                        color="primary"
                        label={t["email"]}
                        placeholder={t["email_placeholder"]}
                        name="username"
                        type="text"
                        onValueChange={onValueChange("username")}
                        autoComplete="username"
                        value={values.username}
                    />
                    {renderValidatorChips("username")}
                    <Input
                        color="primary"
                        label={t["password"]}
                        placeholder={t["password_placeholder"]}
                        autoComplete="current-password"
                        name="password"
                        type="password"
                        onValueChange={onValueChange("password")}
                        value={values.password}
                    />
                    {renderValidatorChips("password")}
                    <Button
                        isLoading={loading}
                        className="w-full"
                        type="submit"
                        color="danger"
                        variant="solid"
                    >
                        {t["login_button"]}
                    </Button>
                </form>
            </CardBody>
            <CardFooter className="flex flex-col">
                <Button
                    as={Link}
                    href="/auth/forgot-password"
                    color="danger"
                    variant="flat"
                    className="mb-2 w-full bg-transparent"
                >
                    {t["forgot_password_button"]}
                </Button>
                <Button
                    as={Link}
                    href="/auth/register"
                    color="danger"
                    variant="ghost"
                    className="w-full"
                >
                    {t["go_to_register_button"]}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default Login;
