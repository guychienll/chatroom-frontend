import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { useIntl } from "react-intl";

Success.propTypes = {};

function Success() {
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];
    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardBody className="flex flex-col items-center gap-y-4">
                <IoCheckmarkDoneCircle
                    size={72}
                    className="animate-appearance-in text-success"
                />
                <h2 className="w-full text-center tracking-wider text-success">
                    {t["success"]}
                </h2>
            </CardBody>
            <CardFooter>
                <Button
                    as={Link}
                    href="/auth"
                    variant="solid"
                    color="danger"
                    className="w-full"
                >
                    {t["go_to_login_button"]}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default Success;
