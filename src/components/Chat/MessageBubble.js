import {
    CDN_URL,
    IMAGE_TYPES,
    MINE_TYPE,
    VIDEO_TYPES,
} from "@/components/Chat/constants";
import useUserStore from "@/stores/user";
import { Avatar, Image } from "@nextui-org/react";
import clsx from "clsx";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

MessageBubble.propTypes = {
    msg: PropTypes.object.isRequired,
};

function MessageBubble(props) {
    const { msg } = props;
    const { profile } = useUserStore((state) => state);
    const isSelf = msg.uid === profile.username;
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
                    src={`${CDN_URL}/avatars/${msg.uid.split("@")[0]}`}
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
                {msg.type === MINE_TYPE.TEXT_PLAIN && (
                    <span>{msg.message}</span>
                )}
                {IMAGE_TYPES.includes(msg.type) && (
                    <Image
                        src={msg.message}
                        alt="upload file"
                        className="h-[200px] max-h-[200px] w-[200px] max-w-[200px] object-cover"
                    />
                )}
                {VIDEO_TYPES.includes(msg.type) && (
                    <div className="video-bubble h-[200px] max-h-[200px] w-[200px] max-w-[200px] overflow-hidden rounded-lg">
                        <ReactPlayer
                            autoPlay
                            muted
                            controls
                            width="100%"
                            height="100%"
                            url={msg.message}
                        />
                    </div>
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

export default MessageBubble;
