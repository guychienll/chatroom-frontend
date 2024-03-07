import { HttpRequest } from "@/helper/request";

async function generateOtp(username, otpType) {
    return HttpRequest.post("/auth/generate-otp", {
        data: {
            username,
            otpType,
        },
    });
}

async function consumeOtp(otp, otpType) {
    return HttpRequest.post("/auth/consume-otp", {
        data: {
            otp,
            otpType,
        },
    });
}

async function register(data) {
    return HttpRequest.post("/auth/register", {
        data,
    });
}

async function login(data) {
    return HttpRequest.post("/auth/login", {
        data,
    });
}

async function logout() {
    return HttpRequest.get("/auth/logout");
}

async function updatePassword(data) {
    return HttpRequest.post("/auth/update-password", {
        data,
    });
}

export { generateOtp, consumeOtp, register, login, updatePassword, logout };
