import * as chatApi from "@/api/Chat";
import * as userApi from "@/api/User";
import useUserStore from "@/stores/user";
import WS, { CLIENT_ACTIONS } from "@/websocket";
import {
    Button,
    CardBody,
    CardFooter,
    Divider,
    Spinner,
    User,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { STEP } from "./constants";

WaitingRoom.propTypes = {
    setStep: PropTypes.func.isRequired,
    step: PropTypes.string.isRequired,
};

function WaitingRoom({ step, setStep }) {
    const profile = useUserStore((state) => state.profile);
    const [isLoading, setIsLoading] = useState(false);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const _rooms = await chatApi.getUserRooms();
                const _users = await userApi.getUsers({
                    uids: _rooms.map((r) => {
                        return r.uids.find((uid) => uid !== profile.username);
                    }),
                });

                const result = _rooms.map((_room, index) => {
                    return {
                        ..._room,
                        display: _users[index],
                    };
                });

                setRooms(result);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [profile.username]);

    const handleCreateRoom = (e) => {
        try {
            setStep(STEP.WAITING);
            e.preventDefault();
            const instance = WS.getInstance();
            instance.send(CLIENT_ACTIONS.WAIT, {
                username: profile.username,
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleJoinRoom = (roomId) => {
        try {
            setStep(STEP.WAITING);
            const instance = WS.getInstance();
            instance.send(CLIENT_ACTIONS.JOIN_ROOM, {
                room: {
                    id: roomId,
                },
                username: profile.username,
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <CardBody className="flex h-[400px] max-h-[400px] w-[300px] flex-col">
                {isLoading && (
                    <div className="flex items-center justify-center">
                        <Spinner />
                    </div>
                )}
                {!isLoading &&
                    rooms.map((room) => {
                        return (
                            <div
                                className="mb-2 last-of-type:mb-0"
                                key={room.id}
                            >
                                <div className="mb-2 flex flex-row justify-between">
                                    <User
                                        name={room.display.username}
                                        avatarProps={{
                                            src: room.display.avatar,
                                            isBordered: true,
                                        }}
                                        description={
                                            <div className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
                                                {room.messages[
                                                    room.messages.length - 1
                                                ]
                                                    ? room.messages[
                                                          room.messages.length -
                                                              1
                                                      ].message
                                                    : ""}
                                            </div>
                                        }
                                    />
                                    <Button
                                        onClick={() => {
                                            handleJoinRoom(room.id);
                                        }}
                                        isIconOnly
                                        className="text-large font-bold italic"
                                        color="danger"
                                        variant="ghost"
                                    >
                                        <IoIosArrowForward />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
            </CardBody>
            <Divider />
            <CardFooter>
                <Button
                    isLoading={step === STEP.WAITING}
                    onClick={handleCreateRoom}
                    className="w-full text-large font-bold italic tracking-wider"
                    color="danger"
                    variant="ghost"
                >
                    聊天
                </Button>
            </CardFooter>
        </>
    );
}

export default WaitingRoom;
