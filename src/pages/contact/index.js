import { Button, Input, Textarea } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useIntl } from "react-intl";

function ContactPage() {
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

    const [values, setValues] = useState({
        nickname: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (name) => (value) => {
        setValues({ ...values, [name]: value });
    };

    const send = (e) => {
        e.preventDefault();
        setValues({
            nickname: "",
            email: "",
            phone: "",
            message: "",
        });
    };

    return (
        <div className="ml-auto mr-auto flex max-w-[1296px] flex-col items-center">
            <h1 className="my-4 text-4xl font-bold tracking-wider text-danger">
                {t["contact_us_title"]}
            </h1>
            <small className="mb-4 text-gray-500">
                {t["contact_us_description"]}
            </small>
            <div className="flex w-full flex-col items-center gap-4 px-4 md:flex-row">
                <iframe
                    className="flex-2 h-[400px] w-full max-w-[600px]"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28908.33780354687!2d121.56977588715978!3d25.083500278181074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ac8cce7a9b6d%3A0x377d7129bd402c63!2zMTE05Y-w5YyX5biC5YWn5rmW5Y2A!5e0!3m2!1szh-TW!2stw!4v1710131015235!5m2!1szh-TW!2stw"
                    height="400"
                    allowfullscreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                <form
                    onSubmit={send}
                    className="flex w-full min-w-[280px] flex-1 flex-col gap-y-4 p-4"
                >
                    <Input
                        value={values.nickname}
                        onValueChange={handleChange("nickname")}
                        label={t["nickname"]}
                        placeholder={t["nickname_placeholder"]}
                    />
                    <Input
                        value={values.email}
                        onValueChange={handleChange("email")}
                        label={t["email"]}
                        placeholder={t["email_placeholder"]}
                    />
                    <Input
                        value={values.phone}
                        onValueChange={handleChange("phone")}
                        label={t["phone"]}
                        placeholder={t["phone_placeholder"]}
                    />
                    <Textarea
                        value={values.message}
                        onValueChange={handleChange("message")}
                        label={t["message"]}
                        rows={15}
                        placeholder={t["message_placeholder"]}
                    />
                    <div className="flex-1" />
                    <Button type="submit">{t["send_button"]}</Button>
                </form>
            </div>
        </div>
    );
}

export default ContactPage;
