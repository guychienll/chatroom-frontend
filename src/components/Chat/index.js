import * as fileApi from "@/api/File";
import useUserStore from "@/stores/user";
import WS, { CLIENT_HANDLE_ACTIONS } from "@/websocket";
import { Card, CardHeader, User, useDisclosure } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import ChattingRoom from "./ChattingRoom";
import ProfileEditor from "./ProfileEditor";
import WaitingRoom from "./WaitingRoom";
import { STEP } from "./constants";

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
                        }, 0);
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

    return (
        <>
            <ProfileEditor
                username={profile.username}
                isOpen={isProfileEditorOpen}
                onOpenChange={onProfileEditorOpenChange}
                uploadFile={handleUploadFile}
            />
            <Card className="h-[calc(100%-64px)] max-h-[calc(100%-64px)]">
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
                            onClick: onProfileEditorOpen,
                            className: "cursor-pointer",
                        }}
                    />
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
