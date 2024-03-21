import useUserStore from "@/stores/user";
import WS, { CLIENT_ACTIONS } from "@/websocket";
import { Button, User } from "@nextui-org/react";
import PropTypes from "prop-types";
import { IoIosArrowForward } from "react-icons/io";

Room.propTypes = {
    onJoinRoom: PropTypes.func.isRequired,
    room: PropTypes.object.isRequired,
};

function Room(props) {
    const { onJoinRoom, room } = props;
    const profile = useUserStore((state) => state.profile);
    const lastMessage = room.messages[room.messages.length - 1]?.message || "";

    const joinRoom = (id) => {
        const instance = WS.getInstance();
        instance.send(CLIENT_ACTIONS.JOIN_ROOM, {
            room: { id },
            username: profile.username,
        });
    };

    return (
        <div className="my-4 flex flex-row items-center justify-between">
            <User
                name={room.display.nickname || room.display.username}
                avatarProps={{
                    className: "min-w-[56px] min-h-[56px]",
                    src: room.display.avatar,
                    isBordered: true,
                    size: "lg",
                }}
                description={
                    <div className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap md:max-w-48">
                        {lastMessage}
                    </div>
                }
            />
            <Button
                onPress={() => {
                    joinRoom(room.id);
                    onJoinRoom();
                }}
                isIconOnly
                className="text-large"
                color="danger"
                variant="ghost"
            >
                <IoIosArrowForward />
            </Button>
        </div>
    );
}

export default Room;
