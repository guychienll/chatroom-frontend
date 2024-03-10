import * as fileApi from "@/api/File";
import RoomList from "@/components/Chat/RoomList";
import WS, { CLIENT_HANDLE_ACTIONS } from "@/websocket";
import { useEffect, useRef, useState } from "react";
import ChattingRoom from "./ChattingRoom";
import { STEP } from "./constants";

const Chat = () => {
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState(null);

    const [step, setStep] = useState(STEP.IDLE);
    const isChatting = step !== STEP.IDLE && step !== STEP.WAITING;

    useEffect(() => {
        if (step !== STEP.IDLE) {
            const instance = WS.getInstance();
            instance.ws.onmessage = (e) => {
                const _data = JSON.parse(e.data);
                switch (_data.action) {
                    case CLIENT_HANDLE_ACTIONS.RECEIVE_MESSAGE:
                        setMessages((prev) => {
                            return [...prev, _data.payload];
                        });
                        setTimeout(() => {
                            scrollRef.current.scroll({
                                top: scrollRef.current.scrollHeight,
                                left: 0,
                                behavior: "smooth",
                            });
                        }, 100);
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

    const handleUploadFile = async (e, filename) => {
        return await fileApi.upload(e.target.files[0], { filename });
    };

    if (!isChatting) {
        return <RoomList step={step} setStep={setStep} />;
    }

    return (
        <ChattingRoom
            room={room}
            messages={messages}
            scrollRef={scrollRef}
            handleUploadFile={handleUploadFile}
        />
    );
};

export default Chat;
