import useUserStore from "@/stores/user";
import WS, { CLIENT_ACTIONS } from "@/websocket";
import {
    Avatar,
    Button,
    CardBody,
    CardFooter,
    Divider,
    Image,
    Input,
    useDisclosure,
} from "@nextui-org/react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Fragment, useRef, useState } from "react";
import { IoIosArrowBack, IoMdImages, IoMdSend } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { MESSAGE_TYPE } from "./constants";
import clsx from "clsx";
import ProfileEditor from "./ProfileEditor";

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
    const {
        isOpen: isProfileOpen,
        onOpen: onProfileOpen,
        onOpenChange: onProfileOpenChange,
    } = useDisclosure();

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

    const handleLeaveRoom = () => {
        const instance = WS.getInstance();
        instance.send(CLIENT_ACTIONS.LEAVE_ROOM, {
            username: profile.username,
        });
    };

    const handleSendImage = async (e) => {
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
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setMessage(value);
    };

    return (
        <>
            <ProfileEditor
                isReadOnly
                username={
                    room.uids.filter((uid) => uid !== profile.username)[0]
                }
                isOpen={isProfileOpen}
                onOpenChange={onProfileOpenChange}
                uploadFile={handleUploadFile}
            />
            <CardBody
                ref={scrollRef}
                className="flex h-[400px] max-h-[400px] w-full  flex-col overflow-y-auto overflow-x-hidden pb-12 scrollbar-hide"
            >
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        isSelf={msg.uid === profile.username}
                        msg={msg}
                        onProfileOpen={onProfileOpen}
                    />
                ))}
            </CardBody>
            <Divider />
            <CardFooter>
                <form
                    onSubmit={onSendMessage}
                    className="flex flex-grow flex-row items-center gap-2"
                >
                    <Button
                        onClick={handleLeaveRoom}
                        type="button"
                        isIconOnly
                        color="danger"
                    >
                        <IoIosArrowBack size={18} />
                    </Button>
                    <Input
                        ref={inputRef}
                        value={message}
                        onChange={handleChange}
                        size="sm"
                        className="w-full"
                        type="text"
                    />
                    <input
                        onInput={handleSendImage}
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

MessageBubble.propTypes = {
    isSelf: PropTypes.bool.isRequired,
    msg: PropTypes.object.isRequired,
    onProfileOpen: PropTypes.func,
};

function MessageBubble({ isSelf, msg, onProfileOpen }) {
    return (
        <div
            className={clsx("mb-2 flex w-full max-w-full justify-start", {
                "flex-row-reverse": isSelf,
                "flex-row": !isSelf,
                "self-start": !isSelf,
            })}
        >
            {!isSelf && (
                <Avatar
                    isBordered
                    onClick={() => {
                        onProfileOpen(true);
                    }}
                    src={msg.user.avatar}
                    className="mr-2 min-h-[32px] min-w-[32px] cursor-pointer"
                    size="sm"
                />
            )}
            <div
                className={clsx(
                    "min-h-8 whitespace-pre-line break-all rounded-md  px-3 py-2 text-[#ffffff]",
                    {
                        "bg-[#DF3562]": isSelf,
                        "bg-[#2F6EE7]": !isSelf,
                    },
                )}
            >
                {msg.type === MESSAGE_TYPE.TEXT && <span>{msg.message}</span>}
                {msg.type === MESSAGE_TYPE.IMAGE && (
                    <Image src={msg.message} alt="upload file" />
                )}
            </div>
            <div
                className={clsx("self-end text-[8px] text-[#2c2c2c]", {
                    "ml-1": !isSelf,
                    "mr-1": isSelf,
                })}
            >
                {dayjs(msg.date).format("HH:mm")}
            </div>
        </div>
    );
}

export default ChattingRoom;
