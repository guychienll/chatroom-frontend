import useUserStore from "@/stores/user";
import WS, { CLIENT_ACTIONS, CLIENT_HANDLE_ACTIONS } from "@/websocket";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Image,
    Input,
    User,
    useDisclosure,
    Spinner,
} from "@nextui-org/react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { IoMdImages, IoMdSend } from "react-icons/io";
import { v4 as uuid } from "uuid";
import ProfileEditor from "./ProfileEditor";
import * as chatApi from "@/api/Chat";
import * as userApi from "@/api/User";
import { IoIosArrowForward, IoIosArrowBack, IoIosCog } from "react-icons/io";

export const STEP = {
    IDLE: "idle",
    WAITING: "waiting",
    JOINED_ROOM: "joined_room",
};

const MESSAGE_TYPE = {
    TEXT: "text",
    IMAGE: "image",
};

ChattingRoom.propTypes = {
    room: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    scrollRef: PropTypes.object.isRequired,
    handleUploadFile: PropTypes.func.isRequired,
};

function ChattingRoom({ room, messages, scrollRef, handleUploadFile }) {
    const { profile } = useUserStore((state) => state);
    const inputRef = useRef(null);
    const [message, setMessage] = useState("");
    const onSendMessage = (e) => {
        e.preventDefault();
        const instance = WS.getInstance();
        instance.send(CLIENT_ACTIONS.SEND_MESSAGE, {
            id: uuid(),
            type: MESSAGE_TYPE.TEXT,
            uid: profile.username,
            date: new Date().toISOString(),
            user: profile,
            room: room,
            message,
        });
        setMessage("");
        inputRef.current.focus();
    };
    return (
        <>
            <CardBody
                ref={scrollRef}
                className="flex h-[400px] max-h-[400px] w-full  flex-col overflow-y-auto overflow-x-hidden pb-12 scrollbar-hide"
            >
                {messages.map((msg) => {
                    const isSelf = msg.uid === profile.username;
                    return isSelf ? (
                        <div
                            key={msg.id}
                            className="mb-2 flex w-full max-w-full flex-row-reverse justify-start"
                        >
                            <div className="min-h-8 whitespace-pre-line break-all rounded-md bg-[#DF3562] px-3 py-2 text-[#ffffff]">
                                {msg.type === MESSAGE_TYPE.TEXT && (
                                    <span>{msg.message}</span>
                                )}
                                {msg.type === MESSAGE_TYPE.IMAGE && (
                                    <Image
                                        src={msg.message}
                                        alt="self upload file"
                                    />
                                )}
                            </div>
                            <div className="mr-1 self-end text-[8px] text-[#2c2c2c]">
                                {dayjs(msg.date).format("HH:mm")}
                            </div>
                        </div>
                    ) : (
                        <div
                            key={msg.id}
                            className="mb-2 flex w-full max-w-full flex-row justify-start self-start"
                        >
                            <Avatar
                                isBordered
                                src={msg.user.avatar}
                                className="mr-2 min-h-[32px] min-w-[32px]"
                                size="sm"
                            />
                            <div className="min-h-8 whitespace-pre-line break-all rounded-md bg-[#2F6EE7] px-3 py-2 text-[#ffffff]">
                                {msg.type === MESSAGE_TYPE.TEXT && (
                                    <span>{msg.message}</span>
                                )}
                                {msg.type === MESSAGE_TYPE.IMAGE && (
                                    <Image
                                        src={msg.message}
                                        alt="other upload file"
                                    />
                                )}
                            </div>
                            <div className="ml-1 self-end text-[8px] text-[#2c2c2c]">
                                {dayjs(msg.date).format("HH:mm")}
                            </div>
                        </div>
                    );
                })}
            </CardBody>
            <Divider />
            <CardFooter>
                <form
                    onSubmit={onSendMessage}
                    className="flex flex-grow flex-row items-center gap-2"
                >
                    <Button
                        onClick={() => {
                            const instance = WS.getInstance();
                            instance.send(CLIENT_ACTIONS.LEAVE_ROOM, {
                                username: profile.username,
                            });
                        }}
                        type="button"
                        isIconOnly
                        color="danger"
                    >
                        <IoIosArrowBack size={18} />
                    </Button>
                    <Input
                        ref={inputRef}
                        value={message}
                        onChange={(e) => {
                            const value = e.target.value;
                            setMessage(value);
                        }}
                        size="sm"
                        className="w-full"
                        type="text"
                    />
                    <input
                        onInput={async (e) => {
                            const url = await handleUploadFile(e);
                            const instance = WS.getInstance();
                            instance.send(CLIENT_ACTIONS.SEND_MESSAGE, {
                                id: uuid(),
                                type: MESSAGE_TYPE.IMAGE,
                                uid: profile.username,
                                message: url,
                                room: room,
                                date: new Date().toISOString(),
                                user: profile,
                            });
                        }}
                        type="file"
                        hidden
                        id="upload-file"
                    />
                    <Button
                        as="label"
                        htmlFor="upload-file"
                        type="button"
                        isIconOnly
                        color="primary"
                    >
                        <IoMdImages size={18} />
                    </Button>
                    <Button type="submit" isIconOnly color="primary">
                        <IoMdSend size={18} />
                    </Button>
                </form>
            </CardFooter>
        </>
    );
}

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
                const _rooms = await chatApi.getUserRooms({
                    username: profile.username,
                });

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

const Chat = () => {
    const { profile } = useUserStore((state) => state);
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState(null);
    const {
        isOpen: isProfileEditorOpen,
        onOpen: onProfileEditorOpen,
        onOpenChange: onProfileEditorOpenChange,
    } = useDisclosure();

    const [step, setStep] = useState(STEP.IDLE);
    const isShowWaitingRoom = step === STEP.IDLE || step === STEP.WAITING;

    useEffect(() => {
        if (step !== STEP.IDLE) {
            const instance = WS.getInstance();
            instance.ws.onmessage = (e) => {
                const _data = JSON.parse(e.data);
                console.info("receive event:", _data.action, _data.payload);
                switch (_data.action) {
                    case CLIENT_HANDLE_ACTIONS.RECEIVE_MESSAGE:
                        setMessages((prev) => {
                            scrollRef.current.scroll({
                                top: scrollRef.current.scrollHeight,
                                left: 0,
                                behavior: "smooth",
                            });
                            return [...prev, _data.payload];
                        });
                        break;
                    case CLIENT_HANDLE_ACTIONS.JOINED_ROOM:
                        setStep(STEP.JOINED_ROOM);
                        setRoom(_data.payload);
                        setMessages(_data.payload.messages);
                        break;

                    case CLIENT_HANDLE_ACTIONS.LEAVED_ROOM:
                        setStep(STEP.IDLE);
                        setRoom(null);
                        setMessages([]);
                        break;
                    default:
                        console.log(
                            `${_data.type}, Not match any type of action`,
                        );
                        break;
                }
            };
        }
    }, [step]);

    const handleUploadFile = async (e) => {
        const [file] = e.target.files;
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
        });
        const { file_url } = await response.json();
        return file_url;
    };

    return (
        <>
            <ProfileEditor
                isOpen={isProfileEditorOpen}
                onOpenChange={onProfileEditorOpenChange}
                uploadFile={handleUploadFile}
            />
            <Card className="max-w-[300px]">
                <CardHeader className="flex justify-between">
                    <User
                        name={profile.nickname || profile.username}
                        description={
                            <div className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
                                {profile.bio}
                            </div>
                        }
                        avatarProps={{
                            src: profile.avatar,
                            isBordered: true,
                        }}
                    />
                    <Button
                        onClick={onProfileEditorOpen}
                        color="danger"
                        variant="flat"
                        isIconOnly
                    >
                        <IoIosCog />
                    </Button>
                </CardHeader>
                {isShowWaitingRoom && (
                    <WaitingRoom step={step} setStep={setStep} />
                )}
                {!isShowWaitingRoom && (
                    <ChattingRoom
                        room={room}
                        messages={messages}
                        scrollRef={scrollRef}
                        handleUploadFile={handleUploadFile}
                    />
                )}
            </Card>
        </>
    );
};

export default Chat;
