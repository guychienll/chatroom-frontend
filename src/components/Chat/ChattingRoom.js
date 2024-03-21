import * as fileApi from "@/api/File";
import MessageBubble from "@/components/Chat/MessageBubble";
import { MINE_TYPE } from "@/components/Chat/constants";
import useUserStore from "@/stores/user";
import WS, { CLIENT_ACTIONS } from "@/websocket";
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoMdImages } from "react-icons/io";
import { v4 as uuid } from "uuid";

ChattingRoom.propTypes = {
    room: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    scrollRef: PropTypes.object.isRequired,
};

function ChattingRoom({ room, messages, scrollRef }) {
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
            type: MINE_TYPE.TEXT_PLAIN,
            uid: profile.username,
            date: new Date().toISOString(),
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
        const file = e.target.files[0];
        const url = await fileApi.upload(e.target.files[0], {
            filename: `${file.name}`,
            pathname: `room-images/${room.id}/`,
        });
        const instance = WS.getInstance();
        instance.send(CLIENT_ACTIONS.SEND_MESSAGE, {
            id: uuid(),
            type: file.type,
            uid: profile.username,
            message: url,
            room,
            date: new Date().toISOString(),
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
                        inputMode="text"
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
                    <button
                        type="button"
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            sendMessage(e);
                        }}
                        className="min-h-[40px] min-w-[60px] rounded-large bg-primary text-white transition-background active:bg-primary-200 active:text-white"
                    >
                        送出
                    </button>
                </form>
            </div>
        </>
    );
}

export default ChattingRoom;
