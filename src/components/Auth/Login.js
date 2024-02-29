import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { STEP } from "./constants";
import * as authApi from "@/api/Auth";
import * as userApi from "@/api/User";
import useUserStore from "@/stores/user";

Login.propTypes = {
    goTo: PropTypes.func,
};

function Login(props) {
    const { goTo } = props;
    const [values, setValues] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const setProfile = useUserStore((state) => state.setProfile);

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            await authApi.login(values);
            const profile = await userApi.profile(values);

            setProfile(profile);
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardHeader>
                <div className="w-full text-center text-2xl font-extrabold italic tracking-wider text-danger">
                    ChatRoom
                </div>
            </CardHeader>
            <CardBody className="">
                <form onSubmit={onSubmit}>
                    <Input
                        color="primary"
                        className="mb-2"
                        label="帳號"
                        placeholder="請輸入註冊信箱"
                        name="username"
                        type="text"
                        onChange={onChange}
                        autoComplete="username"
                        value={values.username}
                    />
                    <Input
                        color="primary"
                        className="mb-2"
                        label="密碼"
                        autoComplete="current-password"
                        placeholder="請輸入密碼"
                        name="password"
                        type="password"
                        onChange={onChange}
                        value={values.password}
                    />
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
                    onClick={() => {
                        goTo(STEP.FORGOT_PASSWORD);
                    }}
                    color="danger"
                    variant="flat"
                    className="mb-2 w-full bg-transparent"
                >
                    忘記密碼
                </Button>
                <Button
                    onClick={() => {
                        goTo(STEP.OTP);
                    }}
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
