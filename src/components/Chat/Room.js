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
                name={room.display.username}
                avatarProps={{
                    src: room.display.avatar,
                    isBordered: true,
                    size: "lg",
                }}
                description={lastMessage}
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
