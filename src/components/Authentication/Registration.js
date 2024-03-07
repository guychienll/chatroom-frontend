import { register } from "@/api/Auth";
import { STEP } from "@/components/Authentication/constants";
import Logo from "@/components/Logo";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import PropTypes from "prop-types";
import { useState } from "react";

Registration.propTypes = {
    username: PropTypes.string,
    goTo: PropTypes.func,
};

function Registration(props) {
    const { username, goTo } = props;
    const [values, setValues] = useState({
        username,
        password: "",
        confirm: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = async (e) => {
        try {
            setIsLoading(true);
            e.preventDefault();
            await register({
                username: values.username,
                password: values.password,
            });
            goTo(STEP.SUCCESS);
        } catch (e) {
            alert(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardHeader className="flex justify-center">
                <Logo className="text-2xl" />
            </CardHeader>
            <CardBody className="">
                <form onSubmit={onSubmit}>
                    <Input
                        disabled
                        color="default"
                        className="mb-2"
                        label="帳號"
                        name="username"
                        type="text"
                        onChange={handleChange}
                        value={values.username}
                        autoComplete="username"
                    />
                    <Input
                        color="primary"
                        className="mb-2"
                        label="密碼"
                        placeholder="請輸入使用者密碼"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                    />
                    <Input
                        color="primary"
                        className="mb-2"
                        label="確認密碼"
                        placeholder="請再次輸入密碼"
                        name="confirm"
                        type="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                    />
                    <Button
                        isLoading={isLoading}
                        className="w-full disabled:bg-default"
                        type="submit"
                        color="danger"
                        variant="solid"
                    >
                        註冊
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}

export default Registration;
