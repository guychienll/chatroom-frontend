const { HttpRequest } = require("@/helper/request");

async function profile() {
    return HttpRequest.get("/user/profile");
}

async function update(data) {
    return HttpRequest.post("/user/update", {
        data,
    });
}

async function getUsers(data) {
    return HttpRequest.post("/user/get-users", {
        data,
    });
}

export { profile, update, getUsers };
