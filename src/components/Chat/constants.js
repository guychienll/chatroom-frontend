export const STEP = {
    IDLE: "idle",
    WAITING: "waiting",
    JOINED_ROOM: "joined_room",
};

export const CDN_URL = "https://chatroom-cdn.guychienll.dev";

export const MINE_TYPE = {
    //text
    TEXT_PLAIN: "text",
    //images
    IMAGE_PNG: "image/png",
    IMAGE_JPG: "image/jpg",
    IMAGE_JPEG: "image/jpeg",
    IMAGE_GIF: "image/gif",
    IMAGE_WEBP: "image/webp",
    IMAGE_AVIF: "image/avif",
    IMAGE_SVG: "image/svg+xml",
    // video
    VIDEO_MP4: "video/mp4",
    VIDEO_WEBM: "video/webm",
    VIDEO_OGG: "video/ogg",
};

export const IMAGE_TYPES = [
    MINE_TYPE.IMAGE_JPG,
    MINE_TYPE.IMAGE_JPEG,
    MINE_TYPE.IMAGE_PNG,
    MINE_TYPE.IMAGE_GIF,
    MINE_TYPE.IMAGE_WEBP,
    MINE_TYPE.IMAGE_AVIF,
    MINE_TYPE.IMAGE_SVG,
];

export const VIDEO_TYPES = [
    MINE_TYPE.VIDEO_MP4,
    MINE_TYPE.VIDEO_WEBM,
    MINE_TYPE.VIDEO_OGG,
];
