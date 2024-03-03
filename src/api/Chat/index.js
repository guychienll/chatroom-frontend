const { HttpRequest } = require("@/helper/request");

async function getUserRooms() {
    return HttpRequest.get("/chat/get-user-rooms");
}

export { getUserRooms };
