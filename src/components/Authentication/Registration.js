import { register } from "@/api/Auth";
import { STEP } from "@/components/Authentication/constants";
import { RegistrationFormSchema } from "@/helper/validate";
import { useYupForm } from "@/hook/useYupForm";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useState } from "react";
import { useIntl } from "react-intl";

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
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];
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
            <CardBody>
                <form onSubmit={onSubmit}>
                    <Input
                        disabled
                        color="default"
                        label={t["email"]}
                        placeholder={t["email_placeholder"]}
                        name="username"
                        type="text"
                        onValueChange={onValueChange("username")}
                        value={values.username}
                        autoComplete="username"
                    />
                    {renderValidatorChips("username")}
                    <Input
                        color="primary"
                        label={t["password"]}
                        placeholder={t["password_placeholder"]}
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        onValueChange={onValueChange("password")}
                    />
                    {renderValidatorChips("password")}
                    <Input
                        color="primary"
                        className="mb-2"
                        label={t["password_confirm"]}
                        placeholder={t["password_confirm_placeholder"]}
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
                        {t["register_button"]}
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}

export default Registration;
