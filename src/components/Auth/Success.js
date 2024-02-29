import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@nextui-org/react";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import PropTypes from "prop-types";
import { STEP } from "./constants";

Success.propTypes = {
    goTo: PropTypes.func,
};

function Success({ goTo }) {
    return (
        <Card radius="lg" className="w-[300px] transition-height">
            <CardHeader>
                <div className="w-full text-center text-2xl font-extrabold italic tracking-wider text-danger">
                    ChatRoom
                </div>
            </CardHeader>
            <CardBody className="flex flex-col items-center">
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
                    onClick={() => {
                        goTo(STEP.LOGIN);
                    }}
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
