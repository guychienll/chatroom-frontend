import * as fileApi from "@/api/File";
import MessageBubble from "@/components/Chat/MessageBubble";
import { CDN_URL, MINE_TYPE } from "@/components/Chat/constants";
import useUserStore from "@/stores/user";
import WS, { CLIENT_ACTIONS } from "@/websocket";
import { Avatar, Button, Input, ScrollShadow } from "@nextui-org/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useRef, useState, useCallback } from "react";
import { IoIosArrowBack, IoMdImages } from "react-icons/io";
import { useIntl } from "react-intl";
import BeatLoader from "react-spinners/BeatLoader";
import { v4 as uuid } from "uuid";
import useCountDownTimer from "@/hook/useCountDownTimer";

ChattingRoom.propTypes = {
    room: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    scrollRef: PropTypes.object.isRequired,
    isSomeoneTyping: PropTypes.bool.isRequired,
};

function ChattingRoom({ room, messages, scrollRef, isSomeoneTyping }) {
    const { profile } = useUserStore((state) => state);
    const inputRef = useRef(null);
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

    const onTimeIsUp = useCallback(() => {}, []);

    const { seconds, reset } = useCountDownTimer({
        onTimeIsUp,
        totalSeconds: 5,
    });

    useEffect(() => {
        setTimeout(() => {
            scrollRef.current.scroll({
                top: scrollRef.current.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }, 100);
    }, [scrollRef]);

    useEffect(() => {
        const instance = WS.getInstance();
        if (seconds <= 0 && isTyping) {
            instance.send(CLIENT_ACTIONS.STOP_TYPING, {
                username: profile.username,
                room,
            });
        } else if (isTyping) {
            instance.send(CLIENT_ACTIONS.TYPING, {
                username: profile.username,
                room,
            });
        } else {
            instance.send(CLIENT_ACTIONS.STOP_TYPING, {
                username: profile.username,
                room,
            });
        }
    }, [profile.username, room, seconds, isTyping]);

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
            filename: `${file.name}-${new Date().getTime()}`,
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
                    <MessageBubble key={msg.id} msg={msg} />
                ))}
                <div
                    className={clsx(
                        "mb-2 flex w-full max-w-full justify-start",
                        "flex-row",
                        "self-start",
                        "min-h-8",
                    )}
                >
                    {isSomeoneTyping && (
                        <>
                            <Avatar
                                isBordered
                                src={`${CDN_URL}/avatars/${room.uids.find((uid) => uid !== profile.username).split("@")[0]}`}
                                className="mr-2 min-h-[32px] min-w-[32px] cursor-pointer"
                                size="sm"
                            />
                            <div
                                className={clsx(
                                    "flex h-full items-center justify-center self-start rounded-md bg-primary px-3 py-4 text-[#ffffff] ",
                                )}
                            >
                                <BeatLoader color="#fff" size={10} />
                            </div>
                        </>
                    )}
                </div>
            </ScrollShadow>
            <div className="fixed bottom-0 left-0 z-0 w-full bg-white px-4 py-2">
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
                            reset();
                            setIsTyping(true);
                            setMessage(e.target.value);
                        }}
                        onBlur={() => setIsTyping(false)}
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
                        {t["send_button"]}
                    </button>
                </form>
            </div>
        </>
    );
}

export default ChattingRoom;
