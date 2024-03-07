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
import { useState } from "react";
import { useYupForm } from "../../hook/useYupForm";

Login.propTypes = {};

function Login() {
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
                        label="帳號"
                        placeholder="請輸入註冊信箱"
                        name="username"
                        type="text"
                        onValueChange={onValueChange("username")}
                        autoComplete="username"
                        value={values.username}
                    />
                    {renderValidatorChips("username")}
                    <Input
                        color="primary"
                        label="密碼"
                        autoComplete="current-password"
                        placeholder="請輸入密碼"
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
                        登入
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
                    忘記密碼
                </Button>
                <Button
                    as={Link}
                    href="/auth/register"
                    color="danger"
                    variant="ghost"
                    className="w-full"
                >
                    前往註冊
                </Button>
            </CardFooter>
        </Card>
    );
}

export default Login;
