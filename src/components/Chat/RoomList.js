import * as chatApi from "@/api/Chat";
import * as userApi from "@/api/User";
import Room from "@/components/Chat/Room";
import useUserStore from "@/stores/user";
import WS, { CLIENT_ACTIONS } from "@/websocket";
import { Button, ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { STEP } from "./constants";

RoomList.propTypes = {
    setStep: PropTypes.func.isRequired,
    step: PropTypes.string.isRequired,
};

function RoomList({ step, setStep }) {
    const profile = useUserStore((state) => state.profile);
    const [rooms, setRooms] = useState([]);
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

    useEffect(() => {
        (async () => {
            const _rooms = await chatApi.getUserRooms();
            const _users = await userApi.getUsers({
                uids: _rooms.map((r) =>
                    r.uids.find((uid) => uid !== profile.username),
                ),
            });
            const result = _rooms.map((_room, index) => ({
                ..._room,
                display: _users[index],
            }));
            setRooms(result);
        })();
    }, [profile.username]);

    const createRoom = () => {
        try {
            setStep(STEP.WAITING);
            const instance = WS.getInstance();
            instance.send(CLIENT_ACTIONS.WAIT, {
                username: profile.username,
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex h-full w-full flex-col px-4 py-4">
            <ScrollShadow
                hideScrollBar
                className="mb-4 flex-1 overflow-auto px-4"
            >
                {rooms.map((room) => (
                    <Room
                        key={room.id}
                        onJoinRoom={() => {
                            setStep(STEP.WAITING);
                        }}
                        room={room}
                    />
                ))}
            </ScrollShadow>
            <Button
                isLoading={step === STEP.WAITING}
                onClick={createRoom}
                className="w-full text-large font-bold italic tracking-wider"
                color="danger"
                variant="ghost"
            >
                {t["match_button"]}
            </Button>
        </div>
    );
}

export default RoomList;
