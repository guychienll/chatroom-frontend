import Logo from "@/components/Logo";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@nextui-org/react";
import Link from "next/link";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

Success.propTypes = {};

function Success() {
    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardHeader className="flex justify-center">
                <Logo className="text-2xl" />
            </CardHeader>

            <CardBody className="flex flex-col items-center gap-y-4">
                <IoCheckmarkDoneCircle
                    size={72}
                    className="animate-appearance-in text-success"
                />
                <h2 className="w-full text-center tracking-wider text-success">
                    成功
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
                    登入
                </Button>
            </CardFooter>
        </Card>
    );
}

export default Success;
