import { register } from "@/api/Auth";
import { STEP } from "@/components/Authentication/constants";
import Logo from "@/components/Logo";
import { RegistrationFormSchema } from "@/helper/validate";
import { useYupForm } from "@/hook/useYupForm";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import PropTypes from "prop-types";
import { useState } from "react";

Registration.propTypes = {
    username: PropTypes.string,
    goTo: PropTypes.func,
};

function Registration(props) {
    const { username, goTo } = props;
    const { values, onValueChange, renderValidatorChips, isValid } = useYupForm(
        {
            username,
            password: "",
            confirm: "",
        },
        RegistrationFormSchema,
    );
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        try {
            if (!isValid) {
                return;
            }
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
            <CardBody>
                <form onSubmit={onSubmit}>
                    <Input
                        disabled
                        color="default"
                        label="帳號"
                        name="username"
                        type="text"
                        onValueChange={onValueChange("username")}
                        value={values.username}
                        autoComplete="username"
                    />
                    {renderValidatorChips("username")}
                    <Input
                        color="primary"
                        label="密碼"
                        placeholder="請輸入使用者密碼"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        onValueChange={onValueChange("password")}
                    />
                    {renderValidatorChips("password")}
                    <Input
                        color="primary"
                        className="mb-2"
                        label="確認密碼"
                        placeholder="請再次輸入密碼"
                        name="confirm"
                        type="password"
                        autoComplete="new-password"
                        onValueChange={onValueChange("confirm")}
                    />
                    {renderValidatorChips("confirm")}
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
