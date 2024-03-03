import useUserStore from "@/stores/user";
import WS, { CLIENT_HANDLE_ACTIONS } from "@/websocket";
import {
    Button,
    Card,
    CardHeader,
    User,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import * as authApi from "@/api/Auth";
import * as fileApi from "@/api/File";

import ProfileEditor from "./ProfileEditor";
import { STEP } from "./constants";
import WaitingRoom from "./WaitingRoom";
import ChattingRoom from "./ChattingRoom";

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
                            onClick: onProfileEditorOpen,
                            className: "cursor-pointer",
                        }}
                    />
                    <Button
                        onClick={async () => {
                            await authApi.logout();
                            window.location.reload();
                        }}
                        color="danger"
                        variant="flat"
                        isIconOnly
                    >
                        <IoIosLogOut size={20} />
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
