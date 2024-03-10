import useUserStore from "@/stores/user";
import WS, { CLIENT_ACTIONS } from "@/websocket";
import { Avatar, Button, Image, Input, ScrollShadow } from "@nextui-org/react";
import clsx from "clsx";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoMdImages, IoMdSend } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { MESSAGE_TYPE } from "./constants";

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

    useEffect(() => {
        setTimeout(() => {
            scrollRef.current.scroll({
                top: scrollRef.current.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }, 100);
    }, [scrollRef]);

    const sendMessage = (e) => {
        e.preventDefault();
        const instance = WS.getInstance();
        instance.send(CLIENT_ACTIONS.SEND_MESSAGE, {
            id: uuid(),
            type: MESSAGE_TYPE.TEXT,
            uid: profile.username,
            date: new Date().toISOString(),
            user: profile,
            room,
            message,
        });
        setMessage("");
        inputRef.current.focus();
    };

    const leaveRoom = () => {
        const instance = WS.getInstance();
        instance.send(CLIENT_ACTIONS.LEAVE_ROOM, {
            username: profile.username,
        });
    };

    const sendImage = async (e) => {
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

    return (
        <>
            <ScrollShadow
                hideScrollBar
                ref={scrollRef}
                className="mb-16 flex w-full flex-col overflow-y-auto p-4"
            >
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        isSelf={msg.uid === profile.username}
                        msg={msg}
                    />
                ))}
            </ScrollShadow>
            <div className="fixed bottom-0 left-0 z-50 w-full bg-white px-4 py-2">
                <form
                    onSubmit={sendMessage}
                    className="flex flex-grow flex-row items-center gap-2"
                >
                    <Button
                        onClick={leaveRoom}
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
                            setMessage(e.target.value);
                        }}
                        size="sm"
                        className="w-full"
                        type="text"
                    />
                    <input
                        onInput={sendImage}
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
                    <Button
                        type="button"
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            sendMessage(e);
                        }}
                        isIconOnly
                        color="primary"
                    >
                        <IoMdSend size={18} />
                    </Button>
                </form>
            </div>
        </>
    );
}

MessageBubble.propTypes = {
    isSelf: PropTypes.bool.isRequired,
    msg: PropTypes.object.isRequired,
};

function MessageBubble({ isSelf, msg }) {
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
                    src={msg.user.avatar}
                    className="mr-2 min-h-[32px] min-w-[32px] cursor-pointer"
                    size="sm"
                />
            )}
            <div
                className={clsx(
                    "min-h-8 whitespace-pre-line break-all rounded-md  px-3 py-2 text-[#ffffff]",
                    { "bg-danger": isSelf, "bg-primary": !isSelf },
                )}
            >
                {msg.type === MESSAGE_TYPE.TEXT && <span>{msg.message}</span>}
                {msg.type === MESSAGE_TYPE.IMAGE && (
                    <Image
                        src={msg.message}
                        alt="upload file"
                        className="h-[200px] max-h-[200px] w-[200px] max-w-[200px] object-cover"
                    />
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
