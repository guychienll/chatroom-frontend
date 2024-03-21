import CONFIG from "./config";

class WSocket {
    ws = null;

    constructor() {
        throw new Error("[Singleton] only get instance by getInstance func");
    }

    static getInstance() {
        if (!this.ws) {
            this.ws = new WebSocket(`${CONFIG.WEBSOCKET_HOST}/ws`);
            this.#onopen();
            this.#onclose();
        }
        return {
            ws: this.ws,
            send: this.send,
        };
    }

    static #onopen() {
        this.ws.onopen = () => {
            console.log("open connection");
        };
    }

    static #onclose() {
        this.ws.onclose = () => {
            this.ws = null;
        };
    }

    static send(action, payload) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
                JSON.stringify({
                    action,
                    payload: {
                        ...payload,
                    },
                }),
            );
        } else {
            // Retry per second
            setTimeout(() => {
                this.send(action, payload);
            }, 1000);
        }
    }
}

export const CLIENT_ACTIONS = {
    WAIT: "wait",
    JOIN_ROOM: "join_room",
    SEND_MESSAGE: "send_message",
    LEAVE_ROOM: "leave_room",
    TYPING: "typing",
    STOP_TYPING: "stop_typing",
};

export const CLIENT_HANDLE_ACTIONS = {
    RECEIVE_MESSAGE: "receive_message",
    JOINED_ROOM: "joined_room",
    LEAVED_ROOM: "leaved_room",
    RECEIVE_TYPING: "receive_typing",
    RECEIVE_STOP_TYPING: "receive_stop_typing",
};

export default WSocket;
