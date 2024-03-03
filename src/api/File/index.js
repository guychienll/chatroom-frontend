import { HttpRequest } from "@/helper/request";

const upload = async (file, { filename }) => {
    const data = {
        file: new File([file], filename || file.name, {
            type: file.type,
        }),
    };

    const { file_url: url } = await HttpRequest.form("/file/upload", {
        data,
    });

    return url;
};

export { upload };
