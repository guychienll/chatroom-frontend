const { HttpRequest } = require("@/helper/request");

async function getUserRooms(data) {
    return HttpRequest.get("/chat/get-user-rooms", {
        queryParams: {
            username: data.username,
        },
    });
}

export { getUserRooms };
